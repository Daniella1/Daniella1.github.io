try { if (window.self !== window.top) document.documentElement.classList.add('embedded'); } catch (e) { document.documentElement.classList.add('embedded'); }

(function () {
'use strict';
const $ = id => document.getElementById(id);
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAY = 86400000;
const KIND_NAME = { annual: 'Annual leave', sick: 'Sick leave' };
const SHORT = { annual: 'Annual', sick: 'Sick' };
let slipCount = -1;
function foldSlips() {
  const n = state.payslips.length, box = $('slipBox');
  if (n === 0) box.open = true;
  else if (slipCount !== n) box.open = false; /* first load, or a payslip was just added or removed */
  slipCount = n;
  $('slipSum').textContent = n ? n + (n === 1 ? ' payslip saved' : ' payslips saved') + ', latest period ends ' + fmt(state.payslips[0].period_end) : '';
}
let state = null, drafts = [], seq = 0, firstRender = true, lastHpd = null, editingId = null;

function el(tag, props, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, '');
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return n;
}
function svg(tag, attrs) {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  return n;
}
const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const fmt = (s, dow) => { const t = new Date(parseISO(s)); return (dow ? DOW[t.getUTCDay()] + ' ' : '') + t.getUTCDate() + ' ' + MONTHS[t.getUTCMonth()] + ' ' + t.getUTCFullYear(); };
const fmtShort = s => { const t = new Date(parseISO(s)); return t.getUTCDate() + ' ' + MONTHS[t.getUTCMonth()]; };
const n2 = v => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2);
/* Working days in a range: weekdays that are not public holidays. Also lists the holidays skipped. */
const workdays = (a, b) => {
  let n = 0; const skipped = [];
  for (let t = parseISO(a); t <= parseISO(b); t += DAY) {
    const d = new Date(t).getUTCDay(); if (d === 0 || d === 6) continue;
    const iso = new Date(t).toISOString().slice(0, 10), name = state.holidays[iso];
    if (name) skipped.push(name); else n++;
  }
  return { n, skipped };
};
const kinds = () => (state && state.kinds) || [];
const hpd = () => (state && state.settings.hours_per_day) || 8;
const inDays = () => !!state && state.settings.unit === 'days';
const k = () => (inDays() ? 1 / hpd() : 1);
const labelOf = kd => state.settings[kd + '_label'];

async function api(path, opts) {
  opts = opts || {};
  const url = new URL(path, document.baseURI);
  try { return await LeaveEngine.call(url.pathname.replace(/^.*(\/api\/.*)$/, '$1'), url.searchParams, opts.method || 'GET', opts.body, LeaveReader); }
  catch (e) { throw new Error(e && e.message ? e.message : 'Something went wrong.'); }
}
window.onLeaveStatus = msg => { const t = $('dropText'); if (t && t.textContent) t.textContent = msg; };
function say(node, msg) { node.textContent = msg || ''; node.hidden = !msg; }
const post = (path, obj) => api(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });

async function change(mutator, errNode) {
  const next = JSON.parse(JSON.stringify(state.settings));
  mutator(next);
  try { state = await post('/api/settings', next); say($('toast'), ''); if (errNode) say(errNode, ''); render(); }
  catch (e) { say(errNode || $('toast'), e.message); }
}

/* ---------- your payslip settings ---------- */
const FREQ_TEXT = { weekly: 'paid weekly', fortnightly: 'paid fortnightly', monthly: 'paid monthly' };
function renderSetup() {
  const q = state.settings;
  $('setupSum').textContent = [q.annual_label && 'Annual: ' + q.annual_label, q.sick_label && 'Sick: ' + q.sick_label,
    q.hours_per_day + ' h day', FREQ_TEXT[q.frequency]].filter(Boolean).join(' \u00b7 ');
  if (!firstRender) return; /* the fields are the source of truth after load; refilling could overwrite typing */
  const s = state.settings;
  $('sAnnual').value = s.annual_label; $('sSick').value = s.sick_label; $('sHours').value = s.hours_per_day;
  $('sFreq').value = s.frequency; $('sOrder').value = s.date_order;
  $('setup').open = state.payslips.length === 0;
}
function saveSetup() {
  const h = parseFloat($('sHours').value);
  if (!(h > 0 && h <= 24)) { say($('setupError'), 'Enter hours in a working day between 0 and 24.'); return; }
  change(s => {
    s.annual_label = $('sAnnual').value.trim(); s.sick_label = $('sSick').value.trim(); s.hours_per_day = h;
    s.frequency = $('sFreq').value; s.date_order = $('sOrder').value;
  }, $('setupError'));
}

/* ---------- payslips ---------- */
function renderSlips() {
  const ul = $('slips'); ul.textContent = '';
  for (const p of state.payslips) {
    const figs = kinds().filter(kd => p[kd]).map(kd => SHORT[kd] + ' ' + n2(p[kd].total) + ' h').join(', ');
    const missing = kinds().filter(kd => !p[kd]).map(kd => KIND_NAME[kd].toLowerCase());
    ul.append(el('li', {},
      el('div', {}, el('b', {}, 'Period ending ' + fmt(p.period_end)),
        el('span', { class: 'small' }, figs || 'No figures for the leave lines you track'),
        missing.length ? el('div', { class: 'small', style: 'color:var(--warn)' }, 'Missing ' + missing.join(' and ')) : null,
        p.source ? el('div', { class: 'small' }, p.source) : null),
      el('div', { class: 'btns' },
        el('button', { class: 'link', type: 'button', 'aria-label': 'Edit payslip ending ' + fmt(p.period_end), onclick: () => editSlip(p) }, 'Edit'),
        el('button', { class: 'link', type: 'button', 'aria-label': 'Remove payslip ending ' + fmt(p.period_end), onclick: () => removeSlip(p) }, 'Remove'))));
  }
  const notes = $('notes'); notes.textContent = '';
  for (const n of state.warnings) notes.append(el('li', {}, n));
  const hint = $('ocrHint');
  const parts = [];
  if (!state.ocr) parts.push('Text recognition did not load, so screenshots cannot be read. Reload the page, or type the figures in.');
  if (!state.pdf) parts.push('The PDF reader did not load. Reload the page, or type the figures in.');
  hint.textContent = parts.join(' '); hint.hidden = !parts.length;
}

/* ---------- review form ---------- */
function blankKind(src) { src = src || {}; const s = v => (v == null ? '' : String(v)); return { accrued: s(src.accrued), used: s(src.used), total: s(src.total) }; }
function toDraft(d) {
  const o = { key: ++seq, id: null, name: d.name, method: d.method, notes: d.notes || [], period_end: d.period_end || '', balance: !!d.balance, preview: d.preview || null };
  for (const kd of kinds()) o[kd] = blankKind(d[kd]);
  return o;
}
function manualDraft() { return toDraft({ name: 'Entered by hand', method: 'manual', notes: [] }); }
function editSlip(p) {
  const d = toDraft({ name: p.source || 'Saved payslip', method: 'edit', period_end: p.period_end, balance: p.balance, annual: p.annual, sick: p.sick });
  d.id = p.id; drafts = drafts.filter(x => x.id !== p.id); drafts.push(d); renderDrafts(); scrollToDrafts();
}
function inp(type, id, value, attrs, onInput, required) {
  const i = el('input', Object.assign({ type, id, value: value == null ? '' : value }, attrs || {}));
  if (required && (value == null || value === '')) i.classList.add('missing');
  i.addEventListener('input', () => { i.classList.toggle('missing', !!required && i.value === ''); onInput(i.value); });
  return i;
}
function field(label, input, hint) {
  return el('div', { class: 'field' }, el('label', { for: input.id }, label), input, hint ? el('div', { class: 'small', style: 'margin-top:4px' }, hint) : null);
}
function renderDrafts() {
  const box = $('drafts'); box.textContent = '';
  $('empty').hidden = false; $('more').hidden = state.payslips.length === 0; $('uploadArea').hidden = drafts.length > 0; foldSlips(); $('slipBox').classList.toggle('busy', drafts.length > 0); document.querySelector('.controls').hidden = state.payslips.length === 0;
  if (drafts.length > 1) box.append(el('p', { class: 'hint' }, drafts.length + ' payslips are waiting to be saved. Save or discard each one. ',
    el('button', { type: 'button', class: 'link', onclick: () => { drafts = []; renderDrafts(); } }, 'Discard all')));
  for (const d of drafts) {
    const err = el('p', { class: 'error', role: 'alert', hidden: true });
    const groups = kinds().map(kd => el('fieldset', {},
      el('legend', {}, KIND_NAME[kd] + ' (line: ' + labelOf(kd) + ')'),
      el('div', { class: 'fields' },
        field('Hours earned this pay period', inp('number', 'd' + d.key + kd + 'a', d[kd].accrued, { step: 'any', min: '0' }, v => { d[kd].accrued = v; }, true), 'Under "Hours" or "Accrued".'),
        field('Hours used this pay period', inp('number', 'd' + d.key + kd + 'u', d[kd].used, { step: 'any', min: '0' }, v => { d[kd].used = v; }, false), 'Optional. Under "Used". Leave empty if there is no such column.'),
        field('Total so far', inp('number', 'd' + d.key + kd + 't', d[kd].total, { step: 'any' }, v => { d[kd].total = v; }, true), 'The last number on the line, under "Balance" or "YTD".'))));
    const radio = (val, text) => {
      const r = el('input', { type: 'radio', name: 'd' + d.key + 'k', value: val });
      r.checked = d.balance === (val === 'balance'); r.addEventListener('change', () => { d.balance = val === 'balance'; });
      return el('label', {}, r, text);
    };
    const check = el('fieldset', { class: 'radios', style: 'border:0;padding:0;margin:16px 0 0' },
      el('legend', { style: 'font-weight:650;padding:0;margin-bottom:8px' }, 'What does the "Total so far" number show?'),
      radio('ytd', 'Not sure, or a year-to-date (YTD) total (recommended)'),
      radio('balance', 'My leave balance, the leave I have available now'),
      el('div', { class: 'small' }, 'Not sure? Choose the first. With two payslips in a row, the tool compares their totals to work out whether leave you took is already taken off. If you choose the balance, it checks that the balance moved by the hours earned minus the hours used, and warns you when it did not.'));
    const form = el('form', { class: 'draft', 'aria-label': 'Check payslip ' + d.name },
      el('h2', {}, d.id ? 'Edit this payslip' : 'Check the figures, then save'),
      el('p', { class: 'small' }, d.method === 'manual' ? 'Type the figures from the leave lines on your payslip.' :
        d.method === 'edit' ? 'Change anything that is wrong, then save.' :
        d.name + '. Read using ' + (d.method === 'none' ? 'nothing' : d.method) + '. Check every number against your payslip.'),
      d.notes.length ? el('ul', { class: 'notes' }, d.notes.map(n => el('li', {}, n))) : null,
      d.preview ? el('img', { class: 'preview', src: d.preview, alt: 'The screenshot you added' }) : null,
      d.preview ? el('p', { class: 'previewcap' }, 'Compare each number below with your screenshot. Text recognition can misread digits.') : null,
      el('div', { class: 'fields', style: 'margin-top:14px' },
        field('Pay period end date', inp('date', 'd' + d.key + 'e', d.period_end, { required: true }, v => { d.period_end = v; }, true), 'The last day of the pay period, usually printed near the top of the payslip.')),
      groups,
      check,
      err,
      el('div', { class: 'actions' },
        el('button', { type: 'submit' }, 'Save payslip'),
        el('button', { type: 'button', class: 'secondary', onclick: () => { if (d.preview) URL.revokeObjectURL(d.preview); drafts = drafts.filter(x => x !== d); renderDrafts(); } }, 'Discard')));
    form.addEventListener('submit', e => { e.preventDefault(); saveDraft(d, err); });
    box.append(form);
  }
}
const scrollToDrafts = () => { const b = $('drafts'); if (b.firstChild) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
async function saveDraft(d, errNode) {
  if (!d.period_end) { say(errNode, 'Enter the pay period end date.'); return; }
  const body = { id: d.id, source: d.name, period_end: d.period_end, balance: d.balance };
  const clash = state.payslips.find(p => p.period_end === d.period_end && p.id !== d.id);
  if (clash) {
    if (!window.confirm('A payslip for the period ending ' + fmt(d.period_end) + ' is already saved. Replace it with these figures?')) return;
    body.id = clash.id;
  }
  for (const kd of kinds()) {
    const a = parseFloat(d[kd].accrued), t = parseFloat(d[kd].total);
    if (Number.isNaN(a) || Number.isNaN(t)) { say(errNode, 'Enter the hours accrued and the total for ' + KIND_NAME[kd].toLowerCase() + '.'); return; }
    body[kd] = { accrued: a, used: d[kd].used === '' ? null : parseFloat(d[kd].used), total: t };
  }
  try { state = await post('/api/payslip', body); drafts = drafts.filter(x => x !== d); say($('toast'), ''); render(); }
  catch (e) { say(errNode, e.message); }
}
async function removeSlip(p) {
  if (!window.confirm('Remove the payslip ending ' + fmt(p.period_end) + '?')) return;
  try { state = await api('/api/payslip/delete?id=' + encodeURIComponent(p.id), { method: 'POST' }); say($('toast'), ''); render(); }
  catch (e) { say($('toast'), e.message); }
}
async function readFiles(files) {
  const ok = f => /^image\//.test(f.type) || f.type === 'application/pdf' || /\.(pdf|png|jpe?g|webp|bmp|gif|tiff?)$/i.test(f.name);
  const list = [...files].filter(ok);
  if (!list.length) { say($('uploadError'), 'Choose a PDF or an image file.'); return; }
  const errs = [];
  $('dropText').textContent = 'Reading...';
  for (const f of list) {
    try {
      const res = await api('/api/read?name=' + encodeURIComponent(f.name || 'pasted-image.png'), { method: 'POST', headers: { 'Content-Type': f.type || 'application/octet-stream' }, body: f });
      const nd = toDraft(res.draft);
      if (f.name) drafts = drafts.filter(x => x.id || x.method === 'manual' || x.name !== nd.name); /* the same file again replaces its open form */
      drafts.push(nd);
    } catch (e) { errs.push((f.name || 'Pasted image') + ': ' + e.message); }
  }
  setIdle();
  say($('uploadError'), errs.join('\n')); renderDrafts(); scrollToDrafts();
}

/* ---------- dates and booked leave ---------- */
function renderDates() {
  const ul = $('dates'); ul.textContent = '';
  for (const d of state.settings.dates) {
    ul.append(el('li', {}, fmt(d, true) + (d === state.today ? ' (today)' : ''),
      el('button', { type: 'button', 'aria-label': 'Remove ' + fmt(d), onclick: () => change(s => {
        s.dates = s.dates.filter(x => x !== d);
        if (d === state.today) s.auto_today = false;
      }) }, '×')));
  }
}
function renderBookings() {
  const sel = $('lType'), keep = sel.value; sel.textContent = '';
  for (const kd of kinds()) sel.append(el('option', { value: kd }, KIND_NAME[kd]));
  if (kinds().includes(keep)) sel.value = keep;
  if (lastHpd !== hpd()) { $('lHours').value = hpd(); lastHpd = hpd(); previewLeave(); }
  $('sRegion').value = state.settings.region;
  $('regionHint').textContent = !state.holidays_available
    ? 'The public holiday data did not load. Reload the page.'
    : state.settings.region === 'none' ? 'Only weekends are skipped.'
    : 'Statewide public holidays only, for ' + state.holidays_range[0] + ' to ' + state.holidays_range[1] + '. Local holidays can differ, for example Melbourne Cup Day applies in metropolitan Melbourne.';
  const nb = state.settings.bookings.length;
  $('leaveSum').textContent = nb ? nb + (nb === 1 ? ' booking' : ' bookings') : 'Optional, none added';
  if (firstRender && nb) $('leaveBox').open = true;
  const ul = $('bookings'); ul.textContent = '';
  for (const b of state.settings.bookings) {
    const wd = workdays(b.from, b.to), days = wd.n;
    const span = b.from === b.to ? fmt(b.from, true) : fmt(b.from) + ' to ' + fmt(b.to);
    ul.append(el('li', {},
      el('div', {}, el('b', {}, KIND_NAME[b.type] + ', ' + span),
        el('span', { class: 'small' }, days + (days === 1 ? ' working day' : ' working days') + ', ' + n2(days * b.hours_per_day) + ' h' + (kinds().includes(b.type) ? '' : ' (not tracked)')),
        wd.skipped.length ? el('span', { class: 'small' }, 'Skips ' + wd.skipped.join(', ')) : null),
      el('div', { class: 'btns' },
        el('button', { class: 'link', type: 'button', 'aria-label': 'Edit booked leave ' + span, onclick: () => startEdit(b) }, 'Edit'),
        el('button', { class: 'link', type: 'button', 'aria-label': 'Remove booked leave ' + span, onclick: () => { if (editingId === b.id) stopEdit(); change(s => { s.bookings = s.bookings.filter(x => x.id !== b.id); }); } }, 'Remove'))));
  }
}

/* ---------- results ---------- */
function figure(kind, r) {
  const per = hpd(), d = inDays(), days = r.final / per;
  const conv = v => (d ? v / per : v);
  const dayWord = Math.abs(days - 1) < 0.05 ? 'day' : 'days';
  return el('div', { class: 'fig ' + kind },
    el('div', { class: 'name' }, KIND_NAME[kind]),
    el('div', { class: 'big' + (r.final < 0 ? ' neg' : '') }, d ? days.toFixed(1) : n2(r.final), el('small', {}, d ? dayWord : 'h')),
    el('div', { class: 'days' }, d ? n2(r.final) + ' h' : days.toFixed(1) + ' ' + dayWord),
    el('div', { class: 'calc' }, n2(conv(r.start)) + ' on payslip + ' + n2(conv(r.accrual)) + ' accrued - ' + n2(conv(r.used)) + ' booked'),
    r.later > 0 ? el('div', { class: 'calc' }, 'Another ' + n2(conv(r.later)) + (d ? (Math.abs(conv(r.later) - 1) < 0.005 ? ' day' : ' days') : ' h') + ' is booked after this date.') : null,
    r.final < 0 ? el('div', { class: 'calc', style: 'color:var(--bad)' }, 'Below zero on this date.') : null);
}
function renderResults() {
  const box = $('results'); box.textContent = '';
  const has = state.latest_end !== null;
  $('empty').hidden = false; $('more').hidden = state.payslips.length === 0; $('uploadArea').hidden = drafts.length > 0; foldSlips(); $('slipBox').classList.toggle('busy', drafts.length > 0); document.querySelector('.controls').hidden = state.payslips.length === 0;
  if (!has) {
    $('basis').textContent = state.payslips.length ? 'None of your saved payslips has figures for the leave lines you track yet.' : '';
    return;
  }
  const names = kinds().map(kd => KIND_NAME[kd].toLowerCase() + ' is the line "' + labelOf(kd) + '"').join(' and ');
  $('basis').textContent = 'Based on your latest payslip, period ending ' + fmt(state.latest_end) + '. Your ' + names + '.';
  if (!state.results.length) { box.append(el('div', { class: 'empty' }, el('p', {}, 'Add a date on the left to see your balance on that day.'))); return; }
  for (const r of state.results) {
    if (r.error) {
      box.append(el('article', { class: 'res' }, el('div', { class: 'when' }, el('h3', {}, fmt(r.date, true))), el('p', { class: 'err' }, r.error)));
      continue;
    }
    const n = r[kinds()[0]].periods;
    const basis = (n === 0 ? 'No pay periods after' : n + (n === 1 ? ' pay period after' : ' pay periods after')) + ' the payslip ending ' + fmt(r.anchor_end);
    box.append(el('article', { class: 'res', style: '--n:' + kinds().length },
      el('div', { class: 'when' }, el('h3', {}, fmt(r.date, true)), el('p', { class: 'small' }, basis)),
      kinds().map(kd => figure(kd, r[kd]))));
  }
}
function renderFoot() {
  const f = $('foot'); f.textContent = '';
  if (state.latest_end === null) return;
  const ig = state.settings.bookings.length && kinds().some(kd => state.ignored[kd] > 0);
  f.append(el('p', { class: 'ok' }, state.latest_is_balance
    ? 'Your payslip shows a leave balance, so the figures are used as they are.'
    : state.deducted
      ? 'Confirmed from your payslips: ' + state.deducted
      : 'Not confirmed: whether the payslip total already has leave you took deducted. If your payslip has a column called Balance, edit the payslip and choose "My leave balance". Until then the total is treated as your balance.'));
  if (ig) f.append(el('p', {}, 'Leave booked on or before ' + fmt(state.latest_end) + ' is not deducted again, because your latest payslip already reflects it.'));
  const stale = state.results.find(r => !r.error && r[kinds()[0]].periods >= 6);
  if (stale) f.append(el('p', {}, 'Your latest payslip is ' + fmt(state.latest_end) + ', so balances after it are projected from its accrual rate. Add a newer payslip for a more reliable figure.'));
  if (inDays()) f.append(el('p', {}, 'Days are hours divided by a working day of ' + hpd() + ' hours. Change it under Your payslip.'));
  f.append(el('p', {}, 'Assumes your ordinary hours stay the same and that no unpaid leave reduces accrual.'));
  if (!state.persist) f.append(el('p', { style: 'color:var(--warn)' }, 'Your browser is blocking storage for this page, so nothing will be remembered after you close it.'));
}

/* ---------- chart ---------- */
function renderChart() {
  const root = $('chart'); root.textContent = '';
  const s = state.series;
  if (!s || s.dates.length < 2) { $('chartWrap').hidden = true; return; }
  $('chartWrap').hidden = false;
  const W = 920, H = 320, M = { l: 54, r: 74, t: 30, b: 34 };
  root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  root.setAttribute('aria-label', 'Projected leave balance in ' + (inDays() ? 'days' : 'hours') + ', ' + fmt(s.dates[0]) + ' to ' + fmt(s.dates[s.dates.length - 1]));
  const t = s.dates.map(parseISO), t0 = t[0], t1 = t[t.length - 1];
  const kk = k(), suf = inDays() ? ' d' : ' h', ks = kinds();
  const V = {}; for (const kd of ks) V[kd] = s[kd].map(v => v * kk);
  const all = ks.flatMap(kd => V[kd]);
  const X = ms => M.l + (ms - t0) / (t1 - t0) * (W - M.l - M.r);
  const hi = Math.max(1, ...all), lo = Math.min(0, ...all);
  const step = [0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find(v => (hi - lo) / v <= 6) || 1000;
  const top = Math.ceil(hi / step) * step, bottom = Math.floor(lo / step) * step;
  const Y = v => H - M.b - (v - bottom) / (top - bottom) * (H - M.t - M.b);

  const grid = svg('g', { class: 'grid axis' });
  for (let v = bottom; v <= top + 1e-9; v += step) {
    grid.append(svg('line', { x1: M.l, x2: W - M.r, y1: Y(v), y2: Y(v), class: v === 0 ? 'zero' : '' }));
    const tx = svg('text', { x: M.l - 8, y: Y(v) + 4, 'text-anchor': 'end' }); tx.textContent = Number(v.toFixed(1)) + suf; grid.append(tx);
  }
  const months = [];
  for (let d = new Date(t0), y = d.getUTCFullYear(), m = d.getUTCMonth() + (d.getUTCDate() > 1 ? 1 : 0); ; m++) {
    const ms = Date.UTC(y, m, 1); if (ms > t1) break; months.push(ms);
  }
  const stride = Math.max(1, Math.ceil(months.length / 10));
  months.forEach((ms, i) => {
    if (i % stride) return;
    const x = X(ms); if (x < M.l + 10 || x > W - M.r - 10) return;
    const d = new Date(ms);
    const tx = svg('text', { x, y: H - M.b + 20, 'text-anchor': 'middle' });
    tx.textContent = MONTHS[d.getUTCMonth()] + (d.getUTCMonth() === 0 || i === 0 ? ' ' + d.getUTCFullYear() : '');
    grid.append(tx);
  });
  root.append(grid);

  for (const b of state.settings.bookings) {
    if (!ks.includes(b.type)) continue;
    const x1 = Math.max(M.l, X(parseISO(b.from))), x2 = Math.min(W - M.r, X(parseISO(b.to) + DAY));
    if (x2 <= M.l || x1 >= W - M.r) continue;
    const r = svg('rect', { x: x1, y: M.t, width: Math.max(2, x2 - x1), height: H - M.t - M.b, class: 'band' });
    const ti = svg('title'); ti.textContent = KIND_NAME[b.type] + ' ' + fmtShort(b.from) + (b.from === b.to ? '' : ' to ' + fmtShort(b.to));
    r.append(ti); root.append(r);
  }
  const path = vals => 'M' + vals.map((v, i) => X(t[i]).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' L');
  for (const kd of [...ks].reverse()) root.append(svg('path', { d: path(V[kd]), class: 'line l-' + kd }));

  let lastLabel = -1e9;
  for (const r of state.results) {
    if (r.error) continue;
    const ms = parseISO(r.date); if (ms < t0 || ms > t1) continue;
    const x = X(ms);
    root.append(svg('line', { x1: x, x2: x, y1: M.t, y2: H - M.b, class: 'chk' }));
    for (const kd of [...ks].reverse()) root.append(svg('circle', { cx: x, cy: Y(r[kd].final * kk), r: 5, class: 'dot ' + kd }));
    if (x - lastLabel > 52) {
      const tx = svg('text', { x, y: M.t - 10, 'text-anchor': 'middle' }); tx.style.cssText = 'font-size:12px;fill:var(--ink)';
      tx.textContent = fmtShort(r.date); root.append(tx); lastLabel = x;
    }
  }
  const ends = ks.map(kd => ({ kd, y: Y(V[kd][V[kd].length - 1]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 15) ends[i].y = ends[i - 1].y + 15;
  for (const e of ends) { const tx = svg('text', { x: W - M.r + 8, y: e.y + 4, class: 'endlabel ' + e.kd }); tx.textContent = SHORT[e.kd]; root.append(tx); }

  const hv = svg('line', { y1: M.t, y2: H - M.b, class: 'hover', visibility: 'hidden' });
  const plot = svg('rect', { x: M.l, y: M.t, width: W - M.l - M.r, height: H - M.t - M.b, fill: 'transparent' });
  const tip = $('tip');
  plot.addEventListener('pointermove', ev => {
    const box = root.getBoundingClientRect();
    const sx = (ev.clientX - box.left) / box.width * W;
    let i = Math.round(((sx - M.l) / (W - M.l - M.r) * (t1 - t0)) / DAY);
    i = Math.max(0, Math.min(t.length - 1, i));
    const x = X(t[i]);
    hv.setAttribute('x1', x); hv.setAttribute('x2', x); hv.setAttribute('visibility', 'visible');
    tip.textContent = '';
    const here = state.settings.bookings.filter(b => ks.includes(b.type) && s.dates[i] >= b.from && s.dates[i] <= b.to);
    tip.append(el('div', {}, fmt(s.dates[i], true)), ...ks.map(kd => el('div', {}, SHORT[kd] + ' ' + n2(V[kd][i]) + (inDays() ? ' days' : ' h'))),
      ...here.map(b => el('div', { style: 'color:#E3C2DC' }, KIND_NAME[b.type] + ' booked')));
    const px = x / W * box.width;
    tip.style.left = px + 'px';
    tip.style.transform = px > box.width - 190 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)';
    tip.hidden = false;
  });
  plot.addEventListener('pointerleave', () => { hv.setAttribute('visibility', 'hidden'); tip.hidden = true; });
  root.append(hv, plot);
}

function render() {
  document.querySelector('input[name=unit][value=' + (inDays() ? 'days' : 'hours') + ']').checked = true;
  renderSetup(); renderSlips(); renderDates(); renderBookings(); renderDrafts(); renderResults(); renderChart(); renderFoot();
  firstRender = false;
}

/* ---------- wiring ---------- */
const drop = $('drop');
drop.addEventListener('click', () => $('file').click());
drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file').click(); } });
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); readFiles(e.dataTransfer.files); });
$('file').addEventListener('change', e => { readFiles(e.target.files); e.target.value = ''; });
/* Phones have no Ctrl+V, so offer a paste button (clipboard API), with a long-press paste box as a fallback. */
const coarse = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
function setIdle() {
  const t = $('dropText'); t.textContent = '';
  if (coarse) t.append(el('u', {}, 'Tap to choose a screenshot or PDF'));
  else t.append('Drop a PDF or screenshot here, paste with Ctrl+V, or ', el('u', {}, 'choose a file'));
}
setIdle();
const canReadClipboard = !!(navigator.clipboard && navigator.clipboard.read);
if (canReadClipboard) $('pasteBtn').hidden = false; else if (coarse) $('pasteBox').hidden = false;
$('pasteBtn').addEventListener('click', async () => {
  say($('uploadError'), '');
  try {
    for (const item of await navigator.clipboard.read()) {
      const type = item.types.find(x => x.indexOf('image/') === 0);
      if (type) { readFiles([new File([await item.getType(type)], 'pasted-image.png', { type })]); return; }
    }
    say($('uploadError'), 'No image was found on the clipboard. Take a screenshot, tap Copy on it, then try again. Or choose the screenshot from your photos instead.');
  } catch (e) {
    say($('uploadError'), 'Your browser did not allow pasting from the clipboard. Choose the screenshot from your photos instead' + (coarse ? ', or press and hold in the box below and tap Paste.' : '.'));
    if (coarse) $('pasteBox').hidden = false;
  }
});
$('pasteBox').addEventListener('paste', e => {
  const has = [...((e.clipboardData && e.clipboardData.files) || [])].length > 0;
  if (!has) e.preventDefault(); /* images are handled by the page-wide paste handler; plain text is ignored */
});
$('pasteBox').addEventListener('input', () => { $('pasteBox').textContent = 'Press and hold here, then tap Paste'; });
$('manual').addEventListener('click', () => { drafts.push(manualDraft()); renderDrafts(); scrollToDrafts(); });
document.addEventListener('paste', e => {
  const files = [...((e.clipboardData && e.clipboardData.files) || [])];
  if (files.length) { e.preventDefault(); readFiles(files); }
});
$('setupDone').addEventListener('click', () => { $('setup').open = false; if (!state.payslips.length) $('drop').focus(); });
$('clear').addEventListener('click', async () => {
  if (!window.confirm('Remove all saved payslips, dates, booked leave and settings from this computer? This cannot be undone.')) return;
  try {
    state = await api('/api/reset', { method: 'POST' });
    drafts = []; firstRender = true; lastHpd = null; say($('toast'), ''); say($('uploadError'), ''); render();
  } catch (e) { say($('toast'), e.message); }
});
['sAnnual', 'sSick', 'sHours', 'sFreq', 'sOrder'].forEach(id => $(id).addEventListener('change', saveSetup));

$('dateForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('newDate').value; if (!v) return;
  change(s => { if (!s.dates.includes(v)) s.dates.push(v); s.dates.sort(); });
  $('newDate').value = '';
});
function previewLeave() {
  const a = $('lFrom').value, b = $('lTo').value || a, h = parseFloat($('lHours').value);
  const p = $('leavePreview');
  if (!a || !b || b < a || !(h > 0)) { p.textContent = 'Weekends and public holidays are not counted.'; return; }
  const w = workdays(a, b);
  p.textContent = w.n + (w.n === 1 ? ' working day' : ' working days') + ', ' + n2(w.n * h) + ' h.' +
    (w.skipped.length ? ' Skipping ' + w.skipped.join(', ') + '.' : '') + ' Weekends are not counted.';
}
/* Choosing the first day fills the last day with the same date, so its calendar opens on the same month. */
$('lFrom').addEventListener('input', () => {
  const f = $('lFrom').value;
  $('lTo').min = f || '';
  if (f && (!$('lTo').value || $('lTo').value < f)) $('lTo').value = f;
});
['lFrom', 'lTo', 'lHours'].forEach(id => $(id).addEventListener('input', previewLeave));
function startEdit(b) {
  editingId = b.id;
  $('leaveBox').open = true;
  $('lType').value = b.type; $('lFrom').value = b.from; $('lTo').value = b.to; $('lTo').min = b.from; $('lHours').value = b.hours_per_day;
  $('lSubmit').textContent = 'Save changes'; $('lCancel').hidden = false; say($('leaveError'), ''); previewLeave();
  $('leaveForm').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); $('lTo').focus();
}
function stopEdit() {
  editingId = null; $('lSubmit').textContent = 'Add booked leave'; $('lCancel').hidden = true;
  $('lFrom').value = ''; $('lTo').value = ''; $('lTo').min = ''; $('lHours').value = hpd(); previewLeave();
}
$('lCancel').addEventListener('click', stopEdit);
$('sRegion').addEventListener('change', () => { const v = $('sRegion').value; change(s => { s.region = v; }); setTimeout(previewLeave, 300); });
$('leaveForm').addEventListener('submit', e => {
  e.preventDefault();
  const from = $('lFrom').value, to = $('lTo').value || from, h = parseFloat($('lHours').value);
  if (!from) return;
  if (to < from) { say($('leaveError'), 'The last day is before the first day.'); return; }
  if (!(h > 0 && h <= 24)) { say($('leaveError'), 'Enter hours per day between 0 and 24.'); return; }
  say($('leaveError'), '');
  const id = editingId || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const rec = { id, type: $('lType').value, from, to, hours_per_day: h };
  change(s => { const i = s.bookings.findIndex(x => x.id === id); if (i >= 0) s.bookings[i] = rec; else s.bookings.push(rec); });
  stopEdit();
});
document.querySelectorAll('input[name=unit]').forEach(r => r.addEventListener('change', e => {
  const v = e.target.value; if (state && v !== state.settings.unit) change(s => { s.unit = v; });
}));

if (location.protocol === 'file:') $('fileNote').hidden = false;
api('/api/state').then(s => { state = s; render(); })
  .catch(() => say($('toast'), 'The tool could not start in this browser. Try reloading the page.'));
})();
