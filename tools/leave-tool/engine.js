/* Leave balance: calculation, payslip field extraction and browser storage.
   Everything runs in the visitor's browser. Nothing here makes a network request. */
(function (root) {
'use strict';

const KINDS = ['annual', 'sick'];
const KIND_NAME = { annual: 'Annual leave', sick: 'Sick leave' };
const FREQUENCIES = ['weekly', 'fortnightly', 'monthly'];
const REGIONS = { VIC: 'Victoria', NSW: 'New South Wales', QLD: 'Queensland', SA: 'South Australia',
  WA: 'Western Australia', TAS: 'Tasmania', ACT: 'Australian Capital Territory', NT: 'Northern Territory' };
const MON_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 86400000;
const STORE_KEY = 'leave-tool-v1';

class UserError extends Error {}

/* ---------------------------------------------------------------- dates */

function mk(y, m, d) { // month is 1 to 12; returns ms or null when the date does not exist
  const t = Date.UTC(y, m - 1, d), dt = new Date(t);
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d ? t : null;
}
const iso = t => new Date(t).toISOString().slice(0, 10);
function parseIso(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s));
  const t = m ? mk(+m[1], +m[2], +m[3]) : null;
  if (t === null) throw new UserError('Dates must look like 2026-12-18.');
  return t;
}
function fmtDate(s) {
  const t = new Date(parseIso(s));
  return t.getUTCDate() + ' ' + MON_ABBR[t.getUTCMonth()] + ' ' + t.getUTCFullYear();
}
function todayIso() {
  const n = new Date();
  return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
}
function addDays(s, n) { return iso(parseIso(s) + n * DAY); }

/** The pay period end k periods after `anchor` (an ISO date). */
function periodEndK(anchor, k, freq) {
  const t = parseIso(anchor);
  if (freq === 'weekly') return iso(t + 7 * k * DAY);
  if (freq === 'fortnightly') return iso(t + 14 * k * DAY);
  const a = new Date(t), total = a.getUTCFullYear() * 12 + a.getUTCMonth() + k;
  const y = Math.floor(total / 12), m = total % 12;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const isMonthEnd = a.getUTCDate() === new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + 1, 0)).getUTCDate();
  return iso(Date.UTC(y, m, isMonthEnd ? last : Math.min(a.getUTCDate(), last)));
}
function periodsAfter(anchor, asAt, freq) {
  let n = 0;
  while (periodEndK(anchor, n + 1, freq) <= asAt) n++;
  return n;
}

const MONTHS = {}; MON_ABBR.forEach((m, i) => { MONTHS[m.toLowerCase()] = i + 1; });

/** All dates in `text` in reading order. order is 'dmy' or 'mdy' for 04/05/2026 style dates. */
function parseDates(text, order) {
  const found = [];
  let m;
  const r1 = /(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/g;
  while ((m = r1.exec(text))) { const t = mk(+m[1], +m[2], +m[3]); if (t !== null) found.push([m.index, t]); }
  const r2 = /(?<![\d/.\-])(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4}|\d{2})(?![\d/])/g;
  while ((m = r2.exec(text))) {
    const a = +m[1], b = +m[2]; let y = +m[3]; if (y < 100) y += 2000;
    let day = order === 'dmy' ? a : b, month = order === 'dmy' ? b : a;
    if (month > 12 && day <= 12) { const x = day; day = month; month = x; }
    const t = mk(y, month, day); if (t !== null) found.push([m.index, t]);
  }
  const r3 = /(?<!\d)(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})/g;
  while ((m = r3.exec(text))) {
    const mon = MONTHS[m[2].slice(0, 3).toLowerCase()];
    if (mon) { const t = mk(+m[3], mon, +m[1]); if (t !== null) found.push([m.index, t]); }
  }
  return found.sort((a, b) => a[0] - b[0]).map(x => x[1]);
}

/** {end, start, how} from lines of text, or nulls. */
function findPeriod(lines, order) {
  const strong = [], weak = [];
  lines.forEach((ln, i) => {
    if (/period/i.test(ln)) strong.push(i);
    else if (/pay\s*date|payment\s*date|date\s*paid|ending/i.test(ln)) weak.push(i);
  });
  for (const [group, how] of [[strong, 'period'], [weak, 'pay date']]) {
    for (const i of group) {
      let ds = parseDates(lines[i], order);
      if (!ds.length && i + 1 < lines.length) ds = parseDates(lines[i + 1], order);
      if (ds.length) return { end: iso(Math.max(...ds)), start: ds.length > 1 ? iso(Math.min(...ds)) : null, how };
    }
  }
  return { end: null, start: null, how: null };
}

/* ---------------------------------------------------------------- reading payslip text */

const compact = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function lev(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]; prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return prev[b.length];
}

/** Does `text` contain the leave line name? Ignores case, spacing and punctuation and tolerates a misread letter or two. */
function labelHit(text, label) {
  const a = compact(text), b = compact(label);
  if (!b) return false;
  if (a.includes(b)) return true;
  if (a.length < b.length * 0.7) return false;
  const n = b.length;
  for (let i = 0; i <= Math.max(0, a.length - n); i++) {
    const w = a.slice(i, i + n);
    if (1 - lev(w, b) / Math.max(w.length, n) >= 0.86) return true;
  }
  return false;
}

const NUM_FULL = /^-?\$?\d[\d,]*(?:\.\d+)?$/;
function toNum(text) {
  const t = String(text).trim().replace(/[.,]+$/, '');
  return NUM_FULL.test(t) ? parseFloat(t.replace(/[$,]/g, '')) : null;
}

const HEADER_WORDS = {
  accrued: ['accrued', 'accrual', 'earned'], hours: ['hours', 'hrs'], used: ['used', 'taken', 'usage'],
  balance: ['balance', 'closing', 'available'], ytd: ['ytd', 'yeartodate'], total: ['total'],
};

/** items: [{cx, cy, h, text}] grouped into rows of the same line. */
function buildRows(items) {
  const rows = [];
  for (const it of [...items].sort((a, b) => a.cy - b.cy)) {
    const last = rows[rows.length - 1];
    if (last && Math.abs(it.cy - last.cy) <= 0.6 * Math.max(it.h, last.h)) {
      last.items.push(it);
      const n = last.items.length;
      last.cy = (last.cy * (n - 1) + it.cy) / n;
      last.h = Math.max(last.h, it.h);
    } else rows.push({ cy: it.cy, h: it.h, items: [it] });
  }
  for (const r of rows) { r.items.sort((a, b) => a.cx - b.cx); r.text = r.items.map(t => t.text).join(' '); }
  return rows;
}

/** Column positions for accrued, used and total when this row looks like a table heading. */
function headerColumns(row) {
  const found = {}, its = row.items;
  let i = 0;
  while (i < its.length) {
    let matched = false;
    for (const n of [3, 2, 1]) {
      if (i + n > its.length) continue;
      const c = compact(its.slice(i, i + n).map(t => t.text).join(''));
      const role = Object.keys(HEADER_WORDS).find(r => HEADER_WORDS[r].includes(c));
      if (role) {
        if (!(role in found)) found[role] = its.slice(i, i + n).reduce((s, t) => s + t.cx, 0) / n;
        i += n; matched = true; break;
      }
    }
    if (!matched) i++;
  }
  const accrued = found.accrued !== undefined ? found.accrued : found.hours;
  const totalRole = ['balance', 'ytd', 'total'].find(r => r in found);
  if (accrued === undefined || !totalRole) return null;
  return { accrued, used: found.used !== undefined ? found.used : null, total: found[totalRole],
    totalKind: { balance: 'balance', ytd: 'ytd', total: 'other' }[totalRole] };
}

function readLeaveRow(rows, idx) {
  const row = rows[idx];
  const numsOf = r => r.items.filter(t => toNum(t.text) !== null).map(t => [t.cx, toNum(t.text)]);
  let nums = numsOf(row);
  if (!nums.length && idx + 1 < rows.length) { // a wrapped line name can leave the numbers on the next row
    const nxt = rows[idx + 1];
    if (nxt.items.filter(t => toNum(t.text) === null).length <= 2) nums = numsOf(nxt);
  }
  const out = { accrued: null, used: null, total: null, totalKind: null, score: 0, note: null };
  if (!nums.length) { out.note = 'no numbers were found next to it'; return out; }
  let head = null;
  for (let j = idx - 1; j > Math.max(-1, idx - 16); j--) { head = headerColumns(rows[j]); if (head) break; }
  if (head) {
    const cols = {};
    for (const r of ['accrued', 'used', 'total']) if (head[r] !== null) cols[r] = head[r];
    const xs = Object.values(cols).sort((a, b) => a - b);
    let gap = 100;
    if (xs.length > 1) gap = Math.min(...xs.slice(1).map((x, i) => x - xs[i]));
    const tol = Math.max(20, 0.3 * gap);
    const taken = {};
    for (const [cx, v] of nums) {
      let role = null, dist = Infinity;
      for (const r of Object.keys(cols)) { const d = Math.abs(cx - cols[r]); if (d < dist) { dist = d; role = r; } }
      if (dist <= tol && (!(role in taken) || dist < taken[role][1])) taken[role] = [v, dist];
    }
    out.accrued = taken.accrued ? taken.accrued[0] : null;
    out.used = taken.used ? taken.used[0] : null;
    out.total = taken.total ? taken.total[0] : null;
    out.totalKind = head.totalKind;
  } else {
    const vals = nums.map(n => n[1]);
    if (vals.length === 1) out.note = 'only one number was found next to it and there are no column headings to say which it is';
    else {
      out.accrued = vals[0]; out.total = vals[vals.length - 1]; out.used = vals.length === 3 ? vals[1] : null;
      out.note = 'no column headings were found, so the first number was taken as hours earned this period and the last as the total';
    }
  }
  out.score = out.accrued !== null && out.total !== null ? 2 : 1;
  return out;
}

/** Figures and period from positioned text items. */
function extractFields(items, settings, kinds) {
  const rows = buildRows(items), notes = [];
  const result = { period_end: null, period_start: null, balance: false };
  const balances = [];
  for (const kind of kinds) {
    const label = settings[kind + '_label'], name = KIND_NAME[kind].toLowerCase();
    let best = null;
    rows.forEach((row, idx) => {
      if (labelHit(row.text, label)) {
        const cand = readLeaveRow(rows, idx);
        if (best === null || cand.score > best.score) best = cand;
      }
    });
    if (best === null) {
      notes.push('No line containing "' + label + '" was found, so ' + name + ' needs to be filled in. ' +
        'If the line is named differently on your payslip, change it under "About your payslip".');
      result[kind] = { accrued: null, used: null, total: null };
      continue;
    }
    if (best.note) notes.push(best.score ? 'For ' + name + ', ' + best.note + '. Please check the figures.'
      : 'For ' + name + ', the line "' + label + '" was found but ' + best.note + '.');
    if (best.score) {
      if (best.accrued === null) notes.push('The hours earned this period for ' + name + ' could not be read. Please enter them.');
      if (best.total === null) notes.push('The total for ' + name + ' could not be read. Please enter it.');
    }
    if (best.accrued !== null && best.accrued > 40) notes.push('The hours earned this period for ' + name + ' (' + best.accrued + ') look too high for one pay period. Check for a missing decimal point.');
    if (best.accrued !== null && best.total !== null && best.total < best.accrued - 0.05) notes.push('The total for ' + name + ' is lower than the hours earned this period, which is unusual. Check both numbers.');
    result[kind] = { accrued: best.accrued, used: best.used, total: best.total };
    balances.push(best.totalKind === 'balance');
  }
  result.balance = balances.length > 0 && balances.every(Boolean);
  const p = findPeriod(rows.map(r => r.text), settings.date_order);
  result.period_end = p.end; result.period_start = p.start;
  if (p.end === null) notes.push('No pay period dates were found. Enter the pay period end date.');
  else if (p.how === 'pay date') notes.push('Only a pay date was found, and it has been used as the period end. Check that it is the last day of the pay period.');
  result.notes = notes;
  return result;
}

/* ---------------------------------------------------------------- settings and payslips */

function defaultSettings() {
  return { annual_label: 'Annual leave', sick_label: 'Sick leave', hours_per_day: 8, frequency: 'fortnightly',
    date_order: 'dmy', unit: 'hours', dates: [], auto_today: true, region: 'VIC', bookings: [] };
}
const enabledKinds = s => KINDS.filter(k => String(s[k + '_label']).trim());

function numIn(v, low, high, what) {
  const x = typeof v === 'string' && v.trim() === '' ? NaN : Number(v);
  if (!Number.isFinite(x)) throw new UserError('Enter ' + what + ' as a number.');
  if (x < low || x > high) throw new UserError(what.charAt(0).toUpperCase() + what.slice(1) + ' looks wrong: ' + x + '.');
  return x;
}

function cleanSettings(d, today) {
  const base = defaultSettings();
  try {
    const annual = String(d.annual_label === undefined ? base.annual_label : d.annual_label).trim().slice(0, 80);
    const sick = String(d.sick_label === undefined ? base.sick_label : d.sick_label).trim().slice(0, 80);
    if (!annual && !sick) throw new UserError('Enter the name of at least one leave line.');
    const hpd = Number(d.hours_per_day === undefined ? 8 : d.hours_per_day);
    if (!(hpd > 0 && hpd <= 24)) throw new UserError('Hours in a working day must be between 0 and 24.');
    const freq = d.frequency === undefined ? base.frequency : d.frequency;
    if (!FREQUENCIES.includes(freq)) throw new UserError('Choose weekly, fortnightly or monthly.');
    const order = d.date_order === undefined ? 'dmy' : d.date_order;
    if (order !== 'dmy' && order !== 'mdy') throw new UserError('Choose how dates are written on your payslip.');
    const unit = d.unit === undefined ? 'hours' : d.unit;
    if (unit !== 'hours' && unit !== 'days') throw new UserError('Show balances in hours or days.');
    const region = d.region === undefined ? 'VIC' : d.region;
    if (region !== 'none' && !(region in REGIONS)) throw new UserError('Choose a state or territory, or no public holidays.');
    const autoToday = d.auto_today === undefined ? true : !!d.auto_today;
    const dates = new Set((d.dates || []).map(x => iso(parseIso(x))));
    if (autoToday) dates.delete(today || todayIso());
    const bookings = (d.bookings || []).slice(0, 200).map((b, i) => {
      if (!KINDS.includes(b.type)) throw new UserError('Leave type must be annual or sick.');
      const first = parseIso(b.from), last = parseIso(b.to || b.from);
      if (last < first) throw new UserError('The last day of leave is before the first day.');
      const per = Number(b.hours_per_day);
      if (!(per > 0 && per <= 24)) throw new UserError('Hours per day must be between 0 and 24.');
      return { id: String(b.id || i), type: b.type, from: iso(first), to: iso(last), hours_per_day: per };
    });
    return { annual_label: annual, sick_label: sick, hours_per_day: hpd, frequency: freq, date_order: order, unit,
      dates: [...dates].sort().slice(0, 50), auto_today: autoToday, region, bookings };
  } catch (e) {
    if (e instanceof UserError) throw e;
    throw new UserError('Those settings could not be read.');
  }
}

function cleanPayslip(d, kinds) {
  try {
    const rec = { id: String(d.id || Math.random().toString(36).slice(2, 10)), period_end: iso(parseIso(d.period_end)),
      source: String(d.source || '').slice(0, 120), balance: !!d.balance };
    for (const k of KINDS) {
      if (!kinds.includes(k)) {
        const v = d[k];
        rec[k] = v && typeof v === 'object' && Number.isFinite(+v.accrued) && Number.isFinite(+v.total)
          ? { accrued: +v.accrued, used: v.used === null || v.used === undefined ? null : +v.used, total: +v.total } : null;
        continue;
      }
      const v = d[k], name = KIND_NAME[k].toLowerCase();
      if (!v || typeof v !== 'object') throw new TypeError('missing');
      const used = v.used;
      rec[k] = {
        accrued: numIn(v.accrued, 0, 1000, 'the hours earned this period for ' + name),
        used: used === null || used === undefined || used === '' ? null : numIn(used, 0, 10000, 'the hours used for ' + name),
        total: numIn(v.total, -1000, 100000, 'the total for ' + name),
      };
    }
    return rec;
  } catch (e) {
    if (e instanceof UserError) throw e;
    throw new UserError('That payslip is missing some figures.');
  }
}

function loadRecords(raw) {
  const out = [];
  for (const r of Array.isArray(raw) ? raw : []) {
    try {
      const kinds = KINDS.filter(k => r && r[k] && typeof r[k] === 'object');
      if (kinds.length) out.push(cleanPayslip(r, kinds));
    } catch (e) { /* skip damaged records */ }
  }
  return out;
}

/* ---------------------------------------------------------------- public holidays */

function publicHolidays(region) {
  const h = root.AU_HOLIDAYS;
  return h && h.data && h.data[region] ? h.data[region] : {};
}

function expandBookings(bookings, region) {
  const off = publicHolidays(region), out = [];
  for (const b of bookings) {
    for (let t = parseIso(b.from), last = parseIso(b.to); t <= last; t += DAY) {
      const dow = new Date(t).getUTCDay(), day = iso(t);
      if (dow !== 0 && dow !== 6 && !off[day]) out.push({ kind: b.type, day, hours: b.hours_per_day });
    }
  }
  return out;
}

/* ---------------------------------------------------------------- projection */

function project(slips, asAt, booked, freq, kinds) {
  const usable = slips.filter(s => s.date <= asAt);
  if (!usable.length) throw new UserError('The earliest payslip ends ' + fmtDate(slips[0].date) + ', after ' + fmtDate(asAt) + '.');
  const anchor = usable[usable.length - 1];
  const periods = periodsAfter(anchor.date, asAt, freq), results = {};
  for (const k of kinds) {
    const a = anchor[k];
    let used = 0, later = 0;
    for (const b of booked) {
      if (b.kind !== k) continue;
      if (b.day > anchor.date && b.day <= asAt) used += b.hours;
      else if (b.day > asAt) later += b.hours;
    }
    const accrual = periods * a.accrued;
    results[k] = { start: a.total, periods, accrual, used, later, final: a.total + accrual - used };
  }
  return { anchor, results };
}

function checkPayslips(slips, kinds, freq) {
  let deducted = null; const warnings = [];
  for (let i = 1; i < slips.length; i++) {
    const prev = slips[i - 1], cur = slips[i];
    if (periodEndK(prev.date, 1, freq) !== cur.date) {
      warnings.push('The payslips ending ' + fmtDate(prev.date) + ' and ' + fmtDate(cur.date) + ' are not one pay period apart. ' +
        'A payslip may be missing; the latest one is still used.');
      continue;
    }
    for (const k of kinds) {
      const moved = cur[k].total - prev[k].total, expected = cur[k].accrued - (cur[k].used || 0), name = KIND_NAME[k];
      if (cur.balance) {
        if (Math.abs(moved - expected) > 0.05) warnings.push(name + ' balance changed by ' + moved.toFixed(2) + ' h in the period ending ' +
          fmtDate(cur.date) + ', but accrued minus used was ' + expected.toFixed(2) + ' h. Check for an adjustment or a misread figure.');
      } else if (expected - moved > 0.05 && deducted === null) {
        deducted = name + ' total fell ' + (expected - moved).toFixed(2) + ' h short of the period accrual in the period ending ' +
          fmtDate(cur.date) + ', so leave taken appears to be deducted from it.';
      } else if (moved - expected > 0.05) {
        warnings.push(name + ' total rose by ' + moved.toFixed(2) + ' h in the period ending ' + fmtDate(cur.date) +
          ', more than the ' + expected.toFixed(2) + ' h accrued. Check for a misread figure.');
      }
    }
  }
  return { deducted, warnings };
}

const round4 = v => Math.round(v * 10000) / 10000;

function buildState(settings0, records, flags) {
  const today = todayIso();
  let settings = settings0;
  if (settings.auto_today) settings = Object.assign({}, settings, { dates: [...new Set([...settings.dates, today])].sort() });
  const kinds = enabledKinds(settings), freq = settings.frequency;
  const state = { today, holidays: {}, holidays_range: null, holidays_available: true, settings, kinds, payslips: [], results: [],
    series: null, deducted: null, warnings: [], ignored: {}, latest_end: null, latest_is_balance: false,
    ocr: true, pdf: true, persist: flags.persist };
  const hol = root.AU_HOLIDAYS;
  if (hol) { state.holidays = publicHolidays(settings.region); state.holidays_range = [hol.from, hol.to]; }
  else state.holidays_available = false;
  kinds.forEach(k => { state.ignored[k] = 0; });

  const slips = [];
  for (const r of [...records].sort((a, b) => a.period_end < b.period_end ? -1 : 1)) {
    if (kinds.every(k => r[k])) slips.push(Object.assign({}, r, { date: r.period_end }));
    else {
      const missing = kinds.filter(k => !r[k]).map(k => KIND_NAME[k].toLowerCase()).join(' and ');
      state.warnings.push('The payslip ending ' + fmtDate(r.period_end) + ' has no figures for ' + missing +
        '. Edit it to add them; until then it is not used.');
    }
  }
  state.payslips = [...records].sort((a, b) => a.period_end < b.period_end ? 1 : -1);
  if (!slips.length) return state;

  const booked = expandBookings(settings.bookings, settings.region);
  const latest = slips[slips.length - 1].date;
  state.latest_end = latest; state.latest_is_balance = !!slips[slips.length - 1].balance;
  for (const b of booked) if (b.day <= latest && b.kind in state.ignored) state.ignored[b.kind] += b.hours;
  for (const d of settings.dates) {
    try {
      const { anchor, results } = project(slips, d, booked, freq, kinds);
      const row = { date: d, anchor_end: anchor.date };
      kinds.forEach(k => { row[k] = {}; for (const [a, v] of Object.entries(results[k])) row[k][a] = round4(v); });
      state.results.push(row);
    } catch (e) {
      if (!(e instanceof UserError)) throw e;
      state.results.push({ date: d, error: e.message });
    }
  }
  const start = slips[0].date;
  const wanted = [...settings.dates, addDays(latest, 120), ...settings.bookings.map(b => addDays(b.to, 30))];
  const cap = addDays(latest, 730);
  let end = wanted.reduce((m, x) => x > m ? x : m);
  if (end > cap) end = cap;
  if (end <= start) end = addDays(start, 1);
  const series = { dates: [] }; kinds.forEach(k => { series[k] = []; });
  for (let t = parseIso(start), e = parseIso(end); t <= e; t += DAY) {
    const day = iso(t), { results } = project(slips, day, booked, freq, kinds);
    series.dates.push(day);
    kinds.forEach(k => series[k].push(round4(results[k].final)));
  }
  state.series = series;
  const c = checkPayslips(slips, kinds, freq);
  state.deducted = c.deducted; state.warnings.push(...c.warnings);
  return state;
}

/* ---------------------------------------------------------------- storage (this browser only) */

let memory = null, persist = true;

function loadAll() {
  let raw = null;
  try {
    const s = root.localStorage.getItem(STORE_KEY);
    raw = s ? JSON.parse(s) : null;
    persist = true;
  } catch (e) { persist = false; raw = memory; }
  if (raw === null && memory) raw = memory;
  raw = raw && typeof raw === 'object' ? raw : {};
  let settings;
  try { settings = cleanSettings(raw, todayIso()); } catch (e) { settings = defaultSettings(); }
  return { settings, records: loadRecords(raw.payslips) };
}

function saveAll(settings, records) {
  const obj = Object.assign({}, settings, { payslips: records });
  memory = obj;
  try { root.localStorage.setItem(STORE_KEY, JSON.stringify(obj)); persist = true; } catch (e) { persist = false; }
}

/* ---------------------------------------------------------------- backend used by the page */

const Engine = {
  KINDS, KIND_NAME, REGIONS, UserError, extractFields, enabledKinds, defaultSettings, cleanSettings, cleanPayslip,
  buildState, expandBookings, project, checkPayslips, periodEndK, periodsAfter, parseDates, findPeriod, labelHit,
  toNum, buildRows, loadAll, saveAll, fmtDate, todayIso, parseIso, iso,
  state() { const { settings, records } = loadAll(); return buildState(settings, records, { persist }); },
  /** Mirrors the page's old server API. `body` is parsed JSON or a File for /api/read. */
  async call(path, params, method, body, reader) {
    const { settings, records } = loadAll();
    if (path === '/api/state') return buildState(settings, records, { persist });
    if (path === '/api/read') {
      if (!reader) throw new UserError('Reading files is not available.');
      return { draft: await reader.readPayslip(body, settings, params.get('name')) };
    }
    const data = typeof body === 'string' ? JSON.parse(body || '{}') : body;
    if (path === '/api/settings') saveAll(cleanSettings(data, todayIso()), records);
    else if (path === '/api/payslip') {
      const rec = cleanPayslip(data, enabledKinds(settings));
      if (records.some(r => r.period_end === rec.period_end && r.id !== rec.id))
        throw new UserError('A payslip for the period ending ' + fmtDate(rec.period_end) + ' is already saved. Edit that one instead.');
      saveAll(settings, records.filter(r => r.id !== rec.id).concat([rec]));
    } else if (path === '/api/payslip/delete') {
      const id = params.get('id') || '';
      if (!records.some(r => r.id === id)) throw new UserError('That payslip is no longer saved.');
      saveAll(settings, records.filter(r => r.id !== id));
    } else if (path === '/api/reset') saveAll(defaultSettings(), []);
    else throw new UserError('Not found.');
    const next = loadAll();
    return buildState(next.settings, next.records, { persist });
  },
};

if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
root.LeaveEngine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
