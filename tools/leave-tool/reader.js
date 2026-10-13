/* Reads a payslip PDF or screenshot in the browser. Libraries are loaded from the vendor/ folder next to this
   page, so no file or figure ever leaves the visitor's computer. */
(function (root) {
'use strict';
const E = root.LeaveEngine;
const MAX_BYTES = 20 * 1024 * 1024;
const base = new URL('vendor/', document.baseURI);
const status = msg => { if (typeof root.onLeaveStatus === 'function') root.onLeaveStatus(msg); };

const scripts = {};
function loadScript(src) {
  if (!scripts[src]) scripts[src] = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load text recognition files.'));
    document.head.appendChild(s);
  });
  return scripts[src];
}

/* ---- text recognition (Tesseract) ---- */

let workers = null;
async function getWorkers() {
  if (workers) return workers;
  workers = (async () => {
    status('Loading text recognition (about 7 MB, first time only)...');
    await loadScript(new URL('tesseract.min.js', base).href);
    const opts = { workerPath: new URL('worker.min.js', base).href, corePath: new URL('core', base).href,
      langPath: new URL('lang', base).href, gzip: true, workerBlobURL: false };
    const text = await root.Tesseract.createWorker('eng', 1, opts);

    const digits = await root.Tesseract.createWorker('eng', 1, opts);
    await digits.setParameters({ tessedit_pageseg_mode: '7', tessedit_char_whitelist: '0123456789.,$-', user_defined_dpi: '300' });
    return { text, digits };
  })();
  workers.catch(() => { workers = null; });
  return workers;
}

/** Enlarge small images and add a margin (thin crops are misread without one). */
function prepare(source, w, h) {
  const maxDim = Math.max(w, h);
  const scale = Math.max(1, Math.min(3, 2200 / maxDim));
  const pad = Math.round(40 * Math.max(1, scale));
  const W = Math.round(w * scale), H = Math.round(h * scale);
  const c = document.createElement('canvas');
  c.width = W + 2 * pad; c.height = H + 2 * pad;
  const g = c.getContext('2d', { willReadFrequently: true });
  const t = document.createElement('canvas'); t.width = t.height = 1;
  const tg = t.getContext('2d'); tg.drawImage(source, 0, 0, 1, 1, 0, 0, 1, 1);
  const p = tg.getImageData(0, 0, 1, 1).data;
  g.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')'; g.fillRect(0, 0, c.width, c.height);
  g.imageSmoothingQuality = 'high'; g.drawImage(source, pad, pad, W, H);
  return { canvas: c, scale, pad };
}

const NUMERIC_WORD = /^[\d.,$\-|]*\d[\d.,$\-|]*$/;

async function ocrItems(source, w, h, yOffset) {
  const { text, digits } = await getWorkers();
  status('Reading the payslip...');
  const { canvas, scale, pad } = prepare(source, w, h);
  const res = await text.recognize(canvas, {}, { blocks: true });
  const words = [];
  for (const b of res.data.blocks || []) for (const p of b.paragraphs) for (const l of p.lines) for (const wd of l.words) {
    if (wd.text && wd.text.trim() && wd.confidence >= 25) words.push(wd);
  }
  const items = [];
  for (const wd of words) {
    let txt = wd.text.trim();
    const { x0, y0, x1, y1 } = wd.bbox;
    if (NUMERIC_WORD.test(txt) && !txt.includes('.')) {
      /* A figure with no decimal point is the usual misreading (2.48 read as 248), so read just that figure
         again with digits only. A reading that already has a decimal point is kept as it is. */
      try {
        const m = 12, cx0 = Math.max(0, x0 - m), cy0 = Math.max(0, y0 - m), cw = x1 - x0 + 2 * m, ch = y1 - y0 + 2 * m;
        const cc = document.createElement('canvas'); cc.width = cw; cc.height = ch;
        const g = cc.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cc.width, cc.height);
        g.drawImage(canvas, cx0, cy0, cw, ch, 0, 0, cw, ch);
        const again = (await digits.recognize(cc)).data.text.trim().replace(/\s+/g, '');
        if (E.toNum(again) !== null && again.includes('.')) {
          const d1 = txt.replace(/\D/g, ''), d2 = again.replace(/\D/g, ''), at = again.indexOf('.');
          // Same number of digits: trust the first reading's digits and take only the decimal point from the second.
          txt = /^\d+\.\d+$/.test(again) && d1.length === d2.length ? d1.slice(0, at) + '.' + d1.slice(at) : again;
        }
      } catch (e) { /* keep the first reading */ }
    }
    items.push({ cx: ((x0 + x1) / 2 - pad) / scale, cy: ((y0 + y1) / 2 - pad) / scale + yOffset, h: (y1 - y0) / scale, text: txt });
  }
  return items;
}

/* ---- PDF ---- */

async function pdfItems(buf, notes) {
  status('Reading the PDF...');
  const pdfjs = await import(new URL('pdf.min.js', base).href);
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.min.js', base).href;
  const task = pdfjs.getDocument({ data: new Uint8Array(buf), isEvalSupported: false });
  const doc = await task.promise;
  const items = [];
  const pages = Math.min(doc.numPages, 5);
  for (let p = 1; p <= pages; p++) {
    const page = await doc.getPage(p), content = await page.getTextContent();
    for (const it of content.items) {
      const str = it.str || '';
      if (!str.trim()) continue;
      const x = it.transform[4], y = it.transform[5], h = it.height || Math.abs(it.transform[3]) || 10, w = it.width || 0;
      const re = /\S+/g; let m;
      while ((m = re.exec(str))) { // split into words, spreading them along the item's width
        const mid = (m.index + m[0].length / 2) / str.length;
        items.push({ cx: x + w * mid, cy: -(y + h / 2) + (p - 1) * 10000, h, text: m[0] });
      }
    }
  }
  let method = 'PDF text';
  if (!items.length) { // a scanned PDF has no text layer, so read the picture of the page instead
    method = 'text recognition on the scanned PDF';
    for (let p = 1; p <= Math.min(doc.numPages, 3); p++) {
      const page = await doc.getPage(p), vp = page.getViewport({ scale: 2 });
      const c = document.createElement('canvas'); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
      items.push(...await ocrItems(c, c.width, c.height, (p - 1) * 100000));
    }
  }
  try { await task.destroy(); } catch (e) { /* not important */ }
  return { items, method };
}

/* ---- public ---- */

async function readPayslip(file, settings, nameHint) {
  const name = (nameHint || file.name || 'pasted image').replace(/[\\/]/g, '').slice(0, 120);
  if (file.size > MAX_BYTES) throw new E.UserError('That file is too large.');
  const kinds = E.enabledKinds(settings);
  const draft = { name, method: 'none', notes: [], period_end: null, period_start: null, balance: false, preview: null };
  kinds.forEach(k => { draft[k] = { accrued: null, used: null, total: null }; });
  let items = [];
  try {
    const buf = await file.arrayBuffer();
    const head = new Uint8Array(buf.slice(0, 5));
    if (String.fromCharCode(...head) === '%PDF-') {
      const r = await pdfItems(buf, draft.notes);
      items = r.items; draft.method = r.method;
    } else {
      let bmp;
      try { bmp = await createImageBitmap(new Blob([buf], { type: file.type || 'image/png' })); }
      catch (e) { throw new E.UserError('This file could not be read as an image. PNG, JPG and PDF files work.'); }
      draft.preview = URL.createObjectURL(new Blob([buf], { type: file.type || 'image/png' }));
      items = await ocrItems(bmp, bmp.width, bmp.height, 0);
      draft.method = 'text recognition on the image';
    }
  } catch (e) {
    if (e instanceof E.UserError) throw e;
    draft.notes.push(location.protocol === 'file:'
      ? 'This page was opened as a file, which stops browsers running the file reader. See the note at the top of the page, or type the figures in below.'
      : 'This file could not be read (' + (e && e.message ? e.message : 'unknown error') + '). You can type the figures in below.');
    return draft;
  }
  if (!items.length) { draft.notes.push('No text was found in this file. Enter the figures by hand.'); return draft; }
  const f = E.extractFields(items, settings, kinds);
  for (const k of kinds) draft[k] = f[k];
  draft.period_end = f.period_end; draft.period_start = f.period_start; draft.balance = f.balance;
  draft.notes = draft.notes.concat(f.notes);
  return draft;
}

root.LeaveReader = { readPayslip };
})(window);
