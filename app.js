/* KOL Approval Board — หน้าเว็บ (GitHub Pages) · หลังบ้าน = Google Apps Script (server.js) */
(function(){
const TIERS=[
  {k:"mega", n:"Mega", d:"1M+", min:1e6, c:"var(--h5)"},
  {k:"macro",n:"Macro",d:"100K–999K", min:1e5, c:"var(--h4)"},
  {k:"mid",  n:"Mid", d:"50K–99K", min:5e4, c:"var(--h3)"},
  {k:"micro",n:"Micro",d:"10K–49K", min:1e4, c:"var(--h2)"},
  {k:"nano", n:"Nano", d:"<10K", min:0, c:"var(--h1)"},
];
const $=s=>document.querySelector(s);
/* ===== API: คุยกับ Apps Script (ตั้งค่า URL ใน config.js) ===== */
const APP_URL=(window.KOL_CONFIG&&window.KOL_CONFIG.APP_URL)||"";
function api(name,args){ if(!APP_URL) return Promise.reject(new Error("ยังไม่ได้ตั้งค่า APP_URL ใน config.js"));
  return fetch(APP_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({name,args:args||[]}),redirect:"follow"})
    .then(r=>r.json()).then(j=>{ if(j&&j.error) throw new Error(j.error); return j&&("result" in j)?j.result:j; }); }

function parseCSV(t){const rows=[];let row=[],f="",q=false;for(let i=0;i<t.length;i++){const c=t[i];
  if(q){ if(c==='"'){ if(t[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
  else if(c==='"') q=true; else if(c===','){row.push(f);f="";} else if(c==='\n'){row.push(f);rows.push(row);row=[];f="";} else if(c==='\r'){} else f+=c; }
  row.push(f); if(row.some(x=>x!=="")) rows.push(row); return rows;}
function num(s){ if(!s) return null; s=String(s).replace(/ผู้ติดตาม/g,"").trim(); const m=s.match(/([\d.,]+)\s*([KkMm]?)/); if(!m) return null;
  let v=parseFloat(m[1].replace(/,/g,"")); if(isNaN(v)) return null; if(/m/i.test(m[2])) v*=1e6; else if(/k/i.test(m[2])) v*=1e3; return Math.round(v); }
function tierOf(f){ if(f==null) return "nano"; for(const t of TIERS) if(f>=t.min) return t.k; return "nano"; }
function linkOf(s){ s=(s||"").trim(); if(/^https?:\/\//.test(s)) return s; const m=s.match(/@([\w.\-]+)/); return m?("https://www.tiktok.com/@"+m[1]):""; }
function hash(str){ let h=5381; for(let i=0;i<str.length;i++) h=((h<<5)+h+str.charCodeAt(i))|0; return (h>>>0).toString(36); }
function parseRows(csv){
  const rows=parseCSV(csv); const out=[]; let group="", col=null, codeCol=null;
  for(const r of rows){ const a=(r[0]||"").trim();
    if(codeCol==null){ r.forEach((h,i)=>{ if(/^\s*(code|รหัส)\s*$/i.test(h||"")) codeCol=i; }); }
    if(a==="ลำดับ"){ col={}; r.forEach((h,i)=>{h=(h||"").trim(); if(/ชื่อ/.test(h))col.name=i; else if(/หมวด/.test(h))col.cat=i; else if(/ติดตาม/.test(h))col.f=i; else if(/ลิงก์/.test(h))col.link=i; else if(/หมายเหตุ/.test(h))col.note=i; else if(/rate|เรท/i.test(h))col.rate=i; else if(/^code$|รหัส/i.test(h))col.code=i;}); if(col.code==null&&codeCol!=null) col.code=codeCol; continue; }
    if(!col) continue;
    if(a && !/^\d+$/.test(a) && !(r[1]||"").trim()){ group=a; continue; }
    if(!/^\d+$/.test(a)) continue;
    const g=i=>i==null?"":(r[i]||"");
    const name=g(col.name).replace(/\s+/g," ").trim(); if(!name) continue;
    const it={idx:+a, group, name, cat:g(col.cat).replace(/\s+/g," ").trim(), fRaw:g(col.f).trim(), link:g(col.link).trim(), note:g(col.note).trim(), code:g(col.code).replace(/[^A-Za-z0-9ก-๙_\-]/g,"").replace(/^[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]+/,"").trim().toUpperCase()};
    it.f=num(it.fRaw); it.tier=tierOf(it.f); it.url=linkOf(it.link); it.artist=/ศิลปิน/.test(group); it.key=it.name.toLowerCase();
    it.h=hash([it.cat,it.fRaw,it.link,it.note,it.code].join("|")); out.push(it);
  } return out;
}
const fmtN=n=>n==null?"—":n>=1e6?(n/1e6).toFixed(n%1e6?1:0)+"M":n>=1e3?(n/1e3).toFixed(n%1e3&&n<1e4?1:0)+"K":String(n);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let data=[], baseline=null, filterTier="", q="", scale="sqrt", filterRv="", filterCode="", reviews={}, canWrite=true, reviewer="";
/* รูปโปรไฟล์: avatars/map.json (ชื่อ→ไฟล์) โหลดครั้งเดียว */
let AV={}; fetch("avatars/map.json?v="+Date.now()).then(r=>r.json()).then(m=>{ AV=m||{}; render(); }).catch(()=>{});
const normName=s=>String(s||"").normalize("NFC").toLowerCase().replace(/[^a-z0-9ก-๙]/g,"");
function avatarEl(d){ const f=AV[normName(d.name)]; const ini=esc(String(d.name||"?").trim().replace(/^[^a-zA-Zก-๙0-9]+/,"").slice(0,1).toUpperCase()||"?");
  return f?`<div class="av"><img src="avatars/${f}" alt="" loading="lazy" width="40" height="40"></div>`:`<div class="av av-txt">${ini}</div>`; }
let REASONS=["ไม่ตรงสาย / กลุ่มเป้าหมาย","ภาพลักษณ์ยังไม่เหมาะ","ยอดผู้ติดตามน้อยเกินไป","คอนเทนต์ไม่น่าสนใจ","เคยรับงานแล้วทิ้ง"];
let history={};
const rid=d=>"r_"+hash(d.key);
const rvOf=d=>(reviews[rid(d)]&&reviews[rid(d)].status)||"";
try{ const s=JSON.parse(localStorage.getItem("kol_ladder_seen")||"null"); if(s&&typeof s==="object") baseline=s; }catch(e){}
try{ reviewer=localStorage.getItem("kol_reviewer")||""; }catch(e){}
const statusOf=d=>!baseline?"":!(d.key in baseline)?"new":baseline[d.key]!==d.h?"changed":"";

/* heat ramp: 6 stops on a log scale 1K → 3M */
const STOPS=["--h0","--h1","--h2","--h3","--h4","--h5"];
function heat(f){ if(!f) return `var(--h0)`; const t=Math.max(0,Math.min(1,(Math.log10(f)-3)/(Math.log10(3e6)-3))); const p=t*(STOPS.length-1); const i=Math.floor(p), k=Math.round((p-i)*100);
  if(i>=STOPS.length-1) return `var(${STOPS[STOPS.length-1]})`; return `color-mix(in oklab, var(${STOPS[i+1]}) ${k}%, var(${STOPS[i]}))`; }
function widthOf(f,max){ if(!f) return 0; if(scale==="linear") return f/max; if(scale==="log") return Math.log10(Math.max(f,1))/Math.log10(max); return Math.sqrt(f/max); }

function render(){
  const sorted=[...data].sort((a,b)=>(b.f||0)-(a.f||0)||a.idx-b.idx);
  const max=Math.max(...sorted.map(d=>d.f||0),1), reach=sorted.reduce((s,d)=>s+(d.f||0),0), upd=data.filter(statusOf);
  $("#k-n").textContent=data.length; $("#k-reach").textContent=fmtN(reach);
  const np=data.filter(d=>rvOf(d)==="pass").length, nf=data.filter(d=>rvOf(d)==="fail").length, nw=data.length-np-nf;
  $("#k-pass").textContent=np; $("#k-fail").textContent=nf;
  $("#rev-l").textContent=`รอพิจารณา ${nw} คน · reach ที่ผ่านแล้ว ${fmtN(data.filter(d=>rvOf(d)==="pass").reduce((s,d)=>s+(d.f||0),0))}`+(upd.length?` · อัปเดตใหม่ ${upd.length}`:"");
  $("#rvchips").innerHTML=[["","ทั้งหมด",data.length],["pass","ผ่าน",np],["fail","ไม่ผ่าน",nf],["wait","รอพิจารณา",nw]].map(([k,l,n])=>`<button type="button" class="chip${filterRv===k?" active":""}" data-k="${k}">${l} <b>${n}</b></button>`).join("");
  $("#rvchips").querySelectorAll(".chip").forEach(b=>b.onclick=()=>{filterRv=b.dataset.k;logEv("filter","rv:"+(b.dataset.k||"all"));render();});
  const codes=[...new Set(data.map(d=>d.code).filter(Boolean))].sort(); const cc=$("#codechips"); cc.hidden=!codes.length;
  cc.innerHTML=codes.length?[["","ทุก Code",data.length]].concat(codes.map(c=>[c,c,data.filter(d=>d.code===c).length])).map(([k,l,n])=>`<button type="button" class="chip code${filterCode===k?" active":""}" data-k="${esc(k)}">${esc(l)} <b>${n}</b></button>`).join(""):"";
  cc.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{filterCode=b.dataset.k;logEv("filter","code:"+(b.dataset.k||"all"));render();});
  // share by tier
  const sh=$("#share"); sh.innerHTML=""; const lbl=[];
  TIERS.forEach(t=>{ const g=sorted.filter(d=>d.tier===t.k), r=g.reduce((s,d)=>s+(d.f||0),0); if(!r) return;
    const sp=document.createElement("span"); sp.style.width=(r/reach*100)+"%"; sp.style.background=t.c; sp.title=`${t.n} ${fmtN(r)}`; sh.appendChild(sp); lbl.push(`${t.n} ${Math.round(r/reach*100)}%`); });
  $("#share-l").textContent="สัดส่วน reach: "+lbl.join(" · ");
  // histogram
  const hist=$("#hist"); hist.innerHTML=""; const maxC=Math.max(...TIERS.map(t=>sorted.filter(d=>d.tier===t.k).length),1);
  TIERS.forEach(t=>{ const n=sorted.filter(d=>d.tier===t.k).length; const b=document.createElement("button"); b.type="button"; b.className="hb"+(filterTier===t.k?" active":"");
    b.innerHTML=`<span class="n">${n}</span><div class="bar" style="height:${Math.max(4,n/maxC*70)}px;background:${t.c}"></div><span class="t">${t.n} <span style="opacity:.7">${t.d}</span></span>`;
    b.onclick=()=>{filterTier=filterTier===t.k?"":t.k;logEv("filter","tier:"+(filterTier||"all"));render();}; hist.appendChild(b); });
  // feed
  $("#feed").hidden=!upd.length; $("#feed-n").textContent=`${upd.length} รายการ`;
  $("#feed-list").innerHTML=upd.map(d=>`<li><span class="t">${statusOf(d)==="new"?"NEW":"EDIT"}</span>${esc(d.name)} · ${fmtN(d.f)}</li>`).join("");
  // ticks
  const tk=$("#ticks"); tk.innerHTML=""; const tv=scale==="linear"?[0,0.5e6,1e6,1.5e6,2e6]:[1e4,1e5,1e6]; tv.filter(v=>v<=max).forEach(v=>{ const s=document.createElement("span"); s.style.left=(widthOf(v,max)*88)+"%"; s.textContent=v?fmtN(v):"0"; tk.appendChild(s); });
  // rows
  const vis=sorted.filter(d=>(!filterTier||d.tier===filterTier)&&(!filterRv||(filterRv==="wait"?!rvOf(d):rvOf(d)===filterRv))&&(!filterCode||d.code===filterCode)&&(!q||(d.name+" "+d.cat+" "+d.group+" "+(d.code||"")).toLowerCase().includes(q)));
  const wrap=$("#rows"); wrap.innerHTML=""; let lastTier=null, rank=0; const rankOf=new Map(sorted.map((d,i)=>[d,i+1]));
  const pinned=vis.filter(d=>d.sug&&!rvOf(d)); const rest=vis.filter(d=>!(d.sug&&!rvOf(d)));
  if(pinned.length){ const ph=document.createElement("div"); ph.className="pinhead"; ph.innerHTML=`<b>KOL เพิ่มมาใหม่</b><span>${pinned.length} รายการ รอพิจารณา</span><span class="blink">● กดดูแล้วติ๊กผล</span>`; wrap.appendChild(ph); pinned.forEach(d=>wrap.appendChild(rowEl(d,rankOf,reach,max,true))); const sp=document.createElement("div"); sp.className="pin"; wrap.appendChild(sp); }
  rest.forEach(d=>{ if(d.tier!==lastTier){ lastTier=d.tier; const t=TIERS.find(x=>x.k===d.tier); const g=sorted.filter(x=>x.tier===d.tier), r=g.reduce((s,x)=>s+(x.f||0),0);
      const h=document.createElement("div"); h.className="tierhead"; h.innerHTML=`<i style="background:${t.c}"></i><b>${t.n}</b><span>${t.d} ผู้ติดตาม</span><span class="m">${g.length} คน · reach ${fmtN(r)} (${Math.round(r/reach*100)}%)</span>`; wrap.appendChild(h); }
    wrap.appendChild(rowEl(d,rankOf,reach,max,false)); });
  if(!vis.length) wrap.innerHTML=data.length?`<div class="empty">ไม่พบ KOL ที่ตรงกับตัวกรอง</div>`:`<div class="skel" id="skel"></div>`;
}
function histLine(d){ const hs=history[rid(d)]||[]; const fails=[...new Set(hs.filter(x=>x.status==="fail").map(x=>x.by).filter(Boolean))], passes=[...new Set(hs.filter(x=>x.status==="pass").map(x=>x.by).filter(Boolean))];
  const parts=[]; if(fails.length) parts.push("ไม่ผ่าน: "+fails.join(", ")); if(passes.length) parts.push("ผ่าน: "+passes.join(", ")); return parts.join(" · "); }
function rowEl(d,rankOf,reach,max,isNew){
    const st=statusOf(d), rk=rankOf.get(d), rv=rvOf(d), R=reviews[rid(d)]||{}; const row=document.createElement("div"); row.className="row"+(st?" "+st:"")+(rv?" "+rv:"")+(isNew?" sugnew":"");
    const nm=d.url?`<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.name)}</a>`:esc(d.name);
    row.innerHTML=`<div class="rk${rk<=10?" lead":""}">${d.sug?"★":rk}</div>
      <div class="who">${avatarEl(d)}<div class="who-t"><div class="nm">${nm}${d.code?`<span class="badge code" title="Code: ${esc(d.code)}">${esc(d.code)}</span>`:""}${d.artist?`<span class="badge art">ARTIST</span>`:""}${d.sug?`<span class="badge sug" title="เพิ่มโดย ${esc(d.by)}">เพิ่มใหม่ · ${esc(d.by||"ลูกค้า")}</span>`:""}${st?`<span class="badge ${st}">${st==="new"?"NEW":"EDIT"}</span>`:""}</div><div class="ct" title="${esc(d.cat)}">${esc(d.cat||"—")}</div></div></div>
      <div class="trk" title="${fmtN(d.f)} ผู้ติดตาม"><div class="fill" style="width:${(widthOf(d.f,max)*100).toFixed(2)}%;background:${heat(d.f)}"></div></div>
      <div class="val">${fmtN(d.f)}<small>${d.f?Math.round(d.f/reach*1000)/10+"% ของ reach":"ไม่ระบุ"}</small></div>
      <div class="rvw"><div class="rv" title="ติ๊กผลพิจารณา"><button type="button" class="pass${rv==="pass"?" on":""}" data-s="pass">✓ ผ่าน</button><button type="button" class="fail${rv==="fail"?" on":""}" data-s="fail">✗ ไม่ผ่าน</button></div>${rv&&R.by?`<div class="meta" title="${esc((R.by||"")+(R.reason?" · "+R.reason:""))}"><b>${rv==="fail"?"✗":"✓"} ${esc(R.by)}</b>${R.reason?` · ${esc(R.reason)}`:""}</div>`:""}${histLine(d)?`<div class="meta" title="${esc(histLine(d))}">${esc(histLine(d))}</div>`:""}</div>`;
    row.querySelectorAll(".rv button").forEach(b=>b.onclick=()=>{ const s=rv===b.dataset.s?"":b.dataset.s; if(s==="fail") askReason(d); else setReview(d,s,""); });
    return row;
}
$("#q").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();render();}); $("#q").addEventListener("change",e=>{ if(e.target.value.trim()) logEv("search",e.target.value.trim()); });
$("#ack").onclick=()=>{ baseline={}; data.forEach(d=>baseline[d.key]=d.h); try{localStorage.setItem("kol_ladder_seen",JSON.stringify(baseline));}catch(e){} render(); };
$("#who").onclick=askName;
render();

function parseGrid(grid){ return parseRows(grid.map(r=>r.map(c=>{ c=c==null?"":String(c); return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c; }).join(",")).join("\n")); }
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>el.hidden=true,2600); }
function setStatus(cls,txt){ const d=$("#dot"); d.className="dot"+(cls?" "+cls:""); $("#status").textContent=txt; }
function setStamp(ms){ $("#stamp").textContent="อัปเดตล่าสุด "+new Date(ms).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"}); }
function showMsg(html){ const m=$("#msg"); m.hidden=!html; m.innerHTML=html||""; }
function showName(){ $("#who-n").textContent=reviewer||"ยังไม่ระบุชื่อ"; }
let pendingAction=null;
function askName(next){ pendingAction=typeof next==="function"?next:null; $("#name-in").value=reviewer; $("#modal").hidden=false; setTimeout(()=>$("#name-in").focus(),50); }
$("#name-cancel").onclick=()=>{ $("#modal").hidden=true; pendingAction=null; };
$("#name-ok").onclick=()=>{ const v=$("#name-in").value.trim(); if(!v){ $("#name-in").focus(); return; } reviewer=v; try{localStorage.setItem("kol_reviewer",v);}catch(e){} showName(); logEv("name",v); $("#modal").hidden=true; const a=pendingAction; pendingAction=null; if(a) a(); };
$("#name-in").addEventListener("keydown",e=>{ if(e.key==="Enter") $("#name-ok").click(); });
let rTarget=null, rSel=new Set();
function askReason(d){ if(!reviewer){ askName(()=>askReason(d)); return; } rTarget=d; rSel=new Set(); $("#r-title").textContent=`${d.name} — ไม่ผ่านเพราะอะไร?`; $("#r-note").value="";
  $("#r-chips").innerHTML=REASONS.map((r,i)=>`<button type="button" data-i="${i}">${esc(r)}</button>`).join("");
  $("#r-chips").querySelectorAll("button").forEach(b=>b.onclick=()=>{ const r=REASONS[+b.dataset.i]; rSel.has(r)?rSel.delete(r):rSel.add(r); b.classList.toggle("on",rSel.has(r)); });
  $("#rmodal").hidden=false; }
$("#r-cancel").onclick=()=>{ $("#rmodal").hidden=true; rTarget=null; };
$("#r-ok").onclick=()=>{ if(!rTarget) return; const note=$("#r-note").value.trim(); const reason=[...rSel].concat(note?[note]:[]).join(", "); if(!reason){ $("#r-note").placeholder="เลือกหรือพิมพ์เหตุผลอย่างน้อย 1 ข้อ"; $("#r-note").focus(); return; } const d=rTarget; $("#rmodal").hidden=true; rTarget=null; setReview(d,"fail",reason); };
function setReview(d,status,reason){ if(!reviewer){ askName(()=>setReview(d,status,reason)); return; }
  const id=rid(d); const prev=reviews[id]; reviews[id]=Object.assign({},prev,{status,by:reviewer,reason:reason||"",at:Date.now()}); if(!history[id]) history[id]=[]; if(status) history[id].push({status,by:reviewer}); render();
  logEv("review",(status||"clear")+" | "+d.name);
  api("setReview",[{key:id,name:d.name,status,by:reviewer,reason:reason||"",code:d.code||""}])
    .then(()=>{ toast(status?`บันทึกแล้ว: ${d.name} — ${status==="pass"?"ผ่าน":"ไม่ผ่าน"}`:`ยกเลิกผลของ ${d.name}`); })
    .catch(err=>{ reviews[id]=prev; render(); toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err)); }); }
function sugRows(list){ return (list||[]).map((s,i)=>{ const it={idx:1000+i,group:"เพิ่มใหม่",name:String(s.name||"").trim(),cat:String(s.cat||"").trim(),fRaw:String(s.f||""),link:String(s.link||""),note:String(s.note||""),sug:true,by:String(s.by||"")}; it.f=num(it.fRaw); it.tier=tierOf(it.f); it.url=linkOf(it.link); it.artist=false; it.key="s:"+it.name.toLowerCase(); it.h=hash([it.cat,it.fRaw,it.link,it.note].join("|")); return it; }).filter(x=>x.name); }
function applyPayload(p){ const rows=parseGrid(p.grid||[]).concat(sugRows(p.suggestions)); if(!rows.length) throw new Error("empty");
  if(!baseline){ baseline={}; rows.forEach(d=>baseline[d.key]=d.h); try{ const s=JSON.parse(localStorage.getItem("kol_ladder_seen")||"null"); if(s&&typeof s==="object") baseline=s; }catch(e){} }
  data=rows; const m={}; (p.reviews||[]).forEach(r=>{ m[r.key]=r; }); reviews=m; history=p.history||{}; if(Array.isArray(p.reasons)&&p.reasons.length) REASONS=p.reasons; render(); progDone(); setStamp(p.at||Date.now()); setStatus("on","LIVE · อัปเดตทุก 30 วิ"); showMsg(""); }
/* ---- suggestions ---- */
$("#suggest").onclick=()=>{ if(!reviewer){ askName(()=>$("#suggest").onclick()); return; } $("#smodal").hidden=false; setTimeout(()=>$("#s-name").focus(),50); };
$("#s-cancel").onclick=()=>{ $("#smodal").hidden=true; };
$("#s-ok").onclick=()=>{ const s={name:$("#s-name").value.trim(),link:$("#s-link").value.trim(),f:$("#s-f").value.trim(),cat:$("#s-cat").value.trim(),note:$("#s-note").value.trim(),by:reviewer,vid:VID};
  if(!s.name){ $("#s-name").focus(); return; } $("#s-ok").disabled=true;
  api("addSuggestion",[s]).then(()=>{ $("#s-ok").disabled=false; $("#smodal").hidden=true; ["s-name","s-link","s-f","s-cat","s-note"].forEach(i=>$("#"+i).value=""); toast("เพิ่มแล้ว: "+s.name); logEv("suggest",s.name); load(); })
    .catch(err=>{ $("#s-ok").disabled=false; toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err)); }); };
/* ---- activity log (anonymous visitor id + events, batched) ---- */
let VID=""; try{ VID=localStorage.getItem("kol_vid")||""; if(!VID){ VID="v_"+Math.random().toString(36).slice(2,10)+Date.now().toString(36); localStorage.setItem("kol_vid",VID); } }catch(e){ VID="v_tmp"+Math.random().toString(36).slice(2,8); }
const META={ua:navigator.userAgent,screen:screen.width+"x"+screen.height,lang:navigator.language,tz:(Intl.DateTimeFormat().resolvedOptions().timeZone||""),ref:document.referrer||""};
const logQ=[]; const t0=Date.now();
function logEv(ev,detail){ logQ.push({t:Date.now(),vid:VID,who:reviewer||"",ev,detail:String(detail||"").slice(0,200),dur:Math.round((Date.now()-t0)/1000)}); if(logQ.length>=12) flushLog(); }
function flushLog(){ if(!logQ.length) return; const batch=logQ.splice(0,logQ.length); try{ api("logEvents",[batch,META]).catch(()=>{}); }catch(e){} }
setInterval(flushLog,20000); document.addEventListener("visibilitychange",()=>{ if(document.hidden){ logEv("hide"); flushLog(); } }); window.addEventListener("pagehide",()=>{ logEv("leave"); flushLog(); });
logEv("open",location.href.slice(0,120));
document.addEventListener("click",e=>{ const a=e.target.closest("a[href]"); if(a) logEv("link",a.href); });
let prog={t:null,v:0};
function ovSet(v,on){ const o=$("#ov"); o.hidden=!on; if(on){ o.firstElementChild.style.setProperty("--p",v); $("#ov-p").textContent=v+"%"; } }
function progStart(){ const el=$("#prog"); el.classList.remove("done"); prog.v=0; el.firstElementChild.style.width="0%"; clearInterval(prog.t); const t0=Date.now(); if(!data.length||prog.manual) ovSet(0,true);
  prog.t=setInterval(()=>{ const s=(Date.now()-t0)/1000; prog.v=Math.min(92,Math.round(100*(1-Math.exp(-s/4)))); el.firstElementChild.style.width=prog.v+"%"; setStatus("warn",`กำลังโหลดข้อมูล… ${prog.v}%`); if(!$("#ov").hidden) ovSet(prog.v,true); if(s>40){ clearInterval(prog.t); setStatus("warn","โหลดช้าผิดปกติ"); showMsg("โหลดนานเกิน 40 วินาที — ลองกดรีเฟรช หรือตรวจว่าสคริปต์ได้รับสิทธิ์เข้าถึงชีตแล้ว (เปิด Apps Script → รัน setup)"); } },200); }
function progDone(){ clearInterval(prog.t); prog.manual=false; const el=$("#prog"); el.firstElementChild.style.width="100%"; el.classList.add("done"); if(!$("#ov").hidden){ ovSet(100,true); setTimeout(()=>ovSet(100,false),350); } }
function skeleton(n){ const s=$("#skel"); if(!s) return; s.innerHTML=Array.from({length:n},(_,i)=>`<div><span style="width:28px"></span><span style="width:${120+((i*37)%90)}px"></span><span style="flex:1;max-width:${30+((i*53)%50)}%"></span><span style="width:50px"></span></div>`).join(""); }
function load(){ progStart(); setStatus("warn","กำลังโหลดข้อมูล… 0%"); api("getData",[]).then(p=>{ try{ applyPayload(p); }catch(e){ setStatus("warn","อ่านข้อมูลไม่ได้"); showMsg("อ่านข้อมูลจากชีตไม่ได้ — ตรวจรูปแบบตารางต้นทาง"); } })
  .catch(err=>{ clearInterval(prog.t); ovSet(0,false); setStatus("warn","โหลดไม่สำเร็จ"); showMsg("โหลดข้อมูลไม่สำเร็จ: "+(err&&err.message||err)); }); }
$("#refresh").onclick=()=>{ prog.manual=true; load(); }; showName(); skeleton(8);
load(); setInterval(()=>{ if(!document.hidden) load(); },30000);
document.addEventListener("visibilitychange",()=>{ if(!document.hidden) load(); });
})();
