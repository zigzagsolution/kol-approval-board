/* KOL Approval Board — server logic (Code.gs โหลดไฟล์นี้จาก GitHub → แก้ใน repo แล้วมีผลใน ~1–2 นาที ไม่ต้อง Deploy) */
const SOURCE_ID   = "1_z2pAuGktR8bAv19tNYt_LRKk9M-p7LgSHQ17k2ytfI"; // ชีต "KOL_KORAT" (มีคอลัมน์ CODE) — ต้องแชร์ให้บัญชีที่รันสคริปต์
const SOURCE_TAB  = "";   // เว้นว่าง = แท็บแรก
const REVIEW_NAME = "KOL Reviews — อวดเมืองโคราช";
/* ตัวเลือกเหตุผล "ไม่ผ่าน" — แก้ตรงนี้ได้เลย */
const REASONS = ["ไม่ตรงสาย / กลุ่มเป้าหมาย", "ภาพลักษณ์ยังไม่เหมาะ", "ยอดผู้ติดตามน้อยเกินไป", "คอนเทนต์ไม่น่าสนใจ", "เคยรับงานแล้วทิ้ง"];
/* รหัสล้างข้อมูลทดสอบ: พิมพ์คำนี้ในช่อง "ชื่อบัญชี" ของหน้าต่าง "เพิ่ม KOL ใหม่" แล้วบันทึก → ล้าง Reviews/History/Suggestions/Log ทั้งหมด */
const RESET_CODE = "ล้างข้อมูลทดสอบ 2569";
/* ตั้งค่า LINE: Apps Script → การตั้งค่าโปรเจกต์ → Script Properties → LINE_TOKEN, LINE_TO, APP_URL (ไม่ต้อง Deploy ใหม่) */
function config_() {
  const p = PropertiesService.getScriptProperties();
  const c = { LINE_TOKEN: p.getProperty("LINE_TOKEN") || "", LINE_TO: p.getProperty("LINE_TO") || "", APP_URL: p.getProperty("APP_URL") || "" };
  return c;
}

/** ข้อมูลทั้งหมดที่หน้าใช้: ตารางจากชีตต้นทาง + ผลพิจารณา */
function getData() {
  const ss = SpreadsheetApp.openById(SOURCE_ID);
  const sh = SOURCE_TAB ? ss.getSheetByName(SOURCE_TAB) : ss.getSheets()[0];
  const grid = sh.getDataRange().getDisplayValues();
  return { grid: grid, reviews: readReviews_(), suggestions: readSuggestions_(), history: readHistory_(), reasons: REASONS, at: Date.now() };
}

/** บันทึกผล {key,name,status,by} — status: "pass" | "fail" | "" (ยกเลิก) */
function setReview(r) {
  if (!r || !r.key) throw new Error("missing key");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = reviewSheet_();
    const vals = sh.getDataRange().getValues();
    const now = new Date();
    const row = [String(r.key), String(r.name||""), String(r.status||""), String(r.by||"").slice(0,60), now, String(r.reason||"").slice(0,300)];
    if (String(vals[0][5]||"") !== "เหตุผล") sh.getRange(1, 6).setValue("เหตุผล");
    let done = false;
    for (let i = 1; i < vals.length; i++) {
      if (String(vals[i][0]) === String(r.key)) { sh.getRange(i+1, 1, 1, 6).setValues([row]); done = true; break; }
    }
    if (!done) sh.appendRow(row);
    logHistory_(sh.getParent(), row);
    if (r.status === "fail") notifyLine_(r);
    return {ok:true};
  } finally { lock.releaseLock(); }
}

/** บันทึกระยะในแผน {key,name,phase:"1,3",by} — เก็บคอลัมน์ G ของแถว Reviews */
function setPhase(r) {
  if (!r || !r.key) throw new Error("missing key");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = reviewSheet_(); const vals = sh.getDataRange().getValues();
    if (String(vals[0][6]||"") !== "ระยะ") sh.getRange(1, 7).setValue("ระยะ");
    let row = -1; for (let i = 1; i < vals.length; i++) if (String(vals[i][0]) === String(r.key)) { row = i+1; break; }
    if (String(vals[0][7]||"") !== "ผู้จัดระยะ") sh.getRange(1, 8).setValue("ผู้จัดระยะ");
    if (row < 0) { sh.appendRow([String(r.key), String(r.name||""), "", "", new Date(), "", String(r.phase||""), String(r.by||"").slice(0,60)]); }
    else sh.getRange(row, 7, 1, 2).setValues([[String(r.phase||""), String(r.by||"").slice(0,60)]]);
    return {ok:true};
  } finally { lock.releaseLock(); }
}
/** บันทึกระยะหลายคนทีเดียว (ปุ่ม AI จัดให้) */
function setPhases(list) {
  if (!list || !list.length) return {ok:true, n:0};
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = reviewSheet_(); const vals = sh.getDataRange().getValues();
    if (String(vals[0][6]||"") !== "ระยะ") sh.getRange(1, 7).setValue("ระยะ");
    if (String(vals[0][7]||"") !== "ผู้จัดระยะ") sh.getRange(1, 8).setValue("ผู้จัดระยะ");
    const idx = {}; for (let i = 1; i < vals.length; i++) idx[String(vals[i][0])] = i+1;
    list.slice(0, 300).forEach(r => { if (!r || !r.key) return; const row = idx[String(r.key)];
      if (row) sh.getRange(row, 7, 1, 2).setValues([[String(r.phase||""), String(r.by||"").slice(0,60)]]);
      else sh.appendRow([String(r.key), String(r.name||""), "", "", new Date(), "", String(r.phase||""), String(r.by||"").slice(0,60)]); });
    return {ok:true, n:list.length};
  } finally { lock.releaseLock(); }
}
/** วันโพสต์ {key,name,dates:"8,21",by} — คอลัมน์ I ของ Reviews */
function setDates(r) { return setDatesMany([r]); }
function setDatesMany(list) {
  if (!list || !list.length) return {ok:true, n:0};
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = reviewSheet_(); const vals = sh.getDataRange().getValues();
    if (String(vals[0][8]||"") !== "วันโพสต์") sh.getRange(1, 9).setValue("วันโพสต์");
    if (String(vals[0][9]||"") !== "ผู้กำหนดวัน") sh.getRange(1, 10).setValue("ผู้กำหนดวัน");
    const idx = {}; for (let i = 1; i < vals.length; i++) idx[String(vals[i][0])] = i+1;
    list.slice(0, 300).forEach(r => { if (!r || !r.key) return; const row = idx[String(r.key)];
      if (row) sh.getRange(row, 9, 1, 2).setValues([[String(r.dates||""), String(r.by||"").slice(0,60)]]);
      else sh.appendRow([String(r.key), String(r.name||""), "", "", new Date(), "", "", "", String(r.dates||""), String(r.by||"").slice(0,60)]); });
    return {ok:true, n:list.length};
  } finally { lock.releaseLock(); }
}
/** คำแนะนำ KOL จากลูกค้า {name,link,f,cat,note,by,vid} */
function addSuggestion(s) {
  if (!s || !s.name) throw new Error("missing name");
  if (String(s.name).trim() === RESET_CODE) { resetAll_(); return {ok:true, reset:true}; }
  if (String(s.name).trim() === "ทดสอบไลน์") { throw new Error("LINE: " + pushLine_("✅ ทดสอบแจ้งเตือนจาก KOL Approval Board โดย " + (s.by||"-"))); }
  const sh = tab_("Suggestions", ["เวลา","ชื่อบัญชี","ลิงก์","ผู้ติดตาม","หมวด","หมายเหตุ","ผู้แนะนำ","visitor"]);
  sh.appendRow([new Date(), String(s.name).slice(0,80), String(s.link||"").slice(0,300), String(s.f||"").slice(0,20), String(s.cat||"").slice(0,80), String(s.note||"").slice(0,300), String(s.by||"").slice(0,60), String(s.vid||"")]);
  return {ok:true};
}
/** บันทึกเหตุการณ์การใช้งาน (เปิดหน้า, ติ๊ก, กรอง, กดลิงก์, ออกจากหน้า) */
function logEvents(events, meta) {
  if (!events || !events.length) return {ok:true};
  const sh = tab_("Log", ["เวลา","visitor","ชื่อที่ระบุ","เหตุการณ์","รายละเอียด","อยู่ในหน้า(วิ)","อุปกรณ์/เบราว์เซอร์","จอ","ภาษา","โซนเวลา","มาจาก"]);
  meta = meta || {};
  const rows = events.slice(0, 200).map(e => [new Date(e.t||Date.now()), String(e.vid||""), String(e.who||""), String(e.ev||""), String(e.detail||"").slice(0,200), Number(e.dur||0), String(meta.ua||"").slice(0,200), String(meta.screen||""), String(meta.lang||""), String(meta.tz||""), String(meta.ref||"").slice(0,200)]);
  sh.getRange(sh.getLastRow()+1, 1, rows.length, rows[0].length).setValues(rows);
  return {ok:true};
}

/* ---------- internal ---------- */
function resetAll_() {
  const ss = reviewSheet_().getParent();
  ["Reviews","History","Suggestions","Log"].forEach(n => { const sh = ss.getSheetByName(n); if (sh && sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); });
  CacheService.getScriptCache().removeAll(["gh:server.js"]);
}
function tab_(name, header) {
  const ss = reviewSheet_().getParent();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}
function readSuggestions_() {
  const ss = reviewSheet_().getParent(); const sh = ss.getSheetByName("Suggestions"); if (!sh) return [];
  const vals = sh.getDataRange().getValues(); const out = [];
  for (let i = 1; i < vals.length; i++) { if (!vals[i][1]) continue; out.push({ name: String(vals[i][1]), link: String(vals[i][2]), f: String(vals[i][3]), cat: String(vals[i][4]), note: String(vals[i][5]), by: String(vals[i][6]) }); }
  return out;
}
function reviewSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("REVIEW_SS_ID"), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create(REVIEW_NAME); props.setProperty("REVIEW_SS_ID", ss.getId()); }
  let sh = ss.getSheetByName("Reviews");
  if (!sh) { sh = ss.getSheets()[0]; sh.setName("Reviews"); }
  if (sh.getLastRow() === 0) { sh.appendRow(["key","ชื่อ KOL","ผล (pass/fail)","ผู้พิจารณา","เวลา"]); sh.setFrozenRows(1); }
  return sh;
}
function logHistory_(ss, row) {
  let h = ss.getSheetByName("History");
  if (!h) { h = ss.insertSheet("History"); h.appendRow(["key","ชื่อ KOL","ผล","ผู้พิจารณา","เวลา","เหตุผล"]); h.setFrozenRows(1); }
  h.appendRow(row);
}
/** ประวัติการตัดสินต่อ KOL (ล่าสุด 8 รายการต่อคน) */
function readHistory_() {
  const ss = reviewSheet_().getParent(); const h = ss.getSheetByName("History"); if (!h) return {};
  const vals = h.getDataRange().getValues(); const out = {};
  for (let i = 1; i < vals.length; i++) {
    const k = String(vals[i][0]); if (!k) continue;
    (out[k] = out[k] || []).push({ status: String(vals[i][2]), by: String(vals[i][3]), at: vals[i][4] ? new Date(vals[i][4]).getTime() : null, reason: String(vals[i][5]||"") });
  }
  Object.keys(out).forEach(k => { out[k] = out[k].slice(-8); });
  return out;
}
/** แจ้งเตือน LINE เมื่อมี "ไม่ผ่าน" (ทำงานเมื่อใส่ LINE_TOKEN + LINE_TO) */
function notifyLine_(r) {
  const C = config_(); const APP_URL = C.APP_URL || "";
  const text = "❌ KOL ไม่ผ่าน\n" + r.name + (r.code ? " [" + r.code + "]" : "") + "\nโดย: " + (r.by||"-") + "\nเหตุผล: " + (r.reason||"-") + (r.extra ? "\n" + r.extra : "") + (APP_URL ? "\n" + APP_URL : "");
  try { pushLine_(text); } catch (e) { /* ไม่ให้การแจ้งเตือนล้มทำให้บันทึกผลล้ม */ }
}
/** ส่ง LINE push แล้วคืนผลเป็นข้อความ (บันทึกลงแท็บ LineLog ด้วย) */
function pushLine_(text) {
  const C = config_(); const LINE_TOKEN = C.LINE_TOKEN, LINE_TO = C.LINE_TO;
  let result;
  if (!LINE_TOKEN || !LINE_TO) result = "ยังไม่ได้ตั้งค่า LINE_TOKEN/LINE_TO ใน Script Properties (token=" + (LINE_TOKEN?"มี":"ไม่มี") + ", to=" + (LINE_TO?"มี":"ไม่มี") + ")";
  else {
    try {
      const res = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", { method: "post", contentType: "application/json",
        headers: { Authorization: "Bearer " + LINE_TOKEN }, payload: JSON.stringify({ to: LINE_TO, messages: [{ type: "text", text: text }] }), muteHttpExceptions: true });
      result = "HTTP " + res.getResponseCode() + " " + String(res.getContentText()).slice(0, 160);
    } catch (e) { result = "ERR " + String(e && e.message || e).slice(0, 200); }
  }
  try { tab_("LineLog", ["เวลา","ข้อความ","ผล"]).appendRow([new Date(), text.slice(0,200), result]); } catch (e) {}
  return result;
}
function readReviews_() {
  const sh = reviewSheet_();
  const vals = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][0]) continue;
    out.push({ key: String(vals[i][0]), name: String(vals[i][1]), status: String(vals[i][2]), by: String(vals[i][3]), at: vals[i][4] ? new Date(vals[i][4]).getTime() : null, reason: String(vals[i][5]||""), phase: String(vals[i][6]||""), phaseBy: String(vals[i][7]||""), dates: String(vals[i][8]||""), datesBy: String(vals[i][9]||"") });
  }
  return out;
}
/** รันครั้งเดียวเพื่อสร้างชีตเก็บผล + ดูลิงก์ */
function setup_() {
  const sh = reviewSheet_();
  Logger.log("Review sheet: " + sh.getParent().getUrl());
}

return { getData, setReview, setPhase, setPhases, setDates, setDatesMany, addSuggestion, logEvents };
