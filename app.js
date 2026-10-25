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
const TARGET=Number(window.KOL_CONFIG&&window.KOL_CONFIG.TARGET)||50;
const PHASES=(window.KOL_CONFIG&&window.KOL_CONFIG.PHASES)||[
  {n:"1",title:"โปรโมทก่อนงาน",d:"6–13 พ.ย. 2569",goal:"Awareness — Teaser เชิญชวน วันจัดงาน สถานที่ ไฮไลต์ Hashtag กลาง",c:"#6f6f75"},
  {n:"2",title:"สร้างความสนใจ",d:"13–19 พ.ย. 2569",goal:"Consideration — ไฮไลต์กิจกรรม เส้นทางเที่ยว จุดเช็กอิน แผนทริปตัวอย่าง นับถอยหลัง",c:"#f05a85"},
  {n:"3",title:"ระหว่างงาน",d:"20–29 พ.ย. 2569",goal:"Conversion — รีวิวประสบการณ์จริง บรรยากาศงาน จุดเช็กอิน ข้อมูลการเดินทาง",c:"#e8194c"}];
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
const avSrc=d=>{ const f=AV[normName(d.name)]; return f?"avatars/"+f:""; };
const iniOf=d=>esc(String(d.name||"?").trim().replace(/^[^a-zA-Zก-๙0-9]+/,"").slice(0,1).toUpperCase()||"?");
const phasesOf=d=>{ const r=reviews[rid(d)]; return String(r&&r.phase||"").split(",").map(s=>s.trim()).filter(Boolean); };
/* ป้าย Code ที่แสดงบนหน้า: ชื่อที่โชว์ (ค่าว่าง = ไม่โชว์) */
const CODE_LABEL={ PANU:"P'PANU Recommend", BEE:"" };
const codeLabel=c=>c?(c in CODE_LABEL?CODE_LABEL[c]:c):"";
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
  const codes=[...new Set(data.map(d=>d.code).filter(c=>codeLabel(c)))].sort(); const cc=$("#codechips"); cc.hidden=!codes.length;
  cc.innerHTML=codes.length?[["","ทุก Code",data.length]].concat(codes.map(c=>[c,codeLabel(c),data.filter(d=>d.code===c).length])).map(([k,l,n])=>`<button type="button" class="chip code${filterCode===k?" active":""}" data-k="${esc(k)}">${esc(l)} <b>${n}</b></button>`).join(""):"";
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
  $("#t-review").textContent=nw; $("#t-team").textContent=`${Math.min(np,TARGET)}/${TARGET}`; $("#t-target").textContent=TARGET;
  $("#t-plan").textContent=data.filter(d=>rvOf(d)==="pass"&&phasesOf(d).length).length+"/"+np;
  renderTeam(sorted,reach); renderPlan(sorted); renderAI(sorted.filter(d=>rvOf(d)==="pass"));
}
/* ===== tabs ===== */
let TAB="review"; try{ TAB=localStorage.getItem("kol_tab")||"review"; }catch(e){}
function setTab(t){ TAB=t; document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===t)); document.querySelectorAll(".page").forEach(p=>p.hidden=p.dataset.page!==t); try{localStorage.setItem("kol_tab",t);}catch(e){} try{ logEv("tab",t); }catch(e){} }
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setTab(b.dataset.tab)); setTab(TAB);
$("#present").onclick=()=>{ const on=document.body.classList.toggle("present"); $("#present").textContent=on?"✕ ออกจากนำเสนอ":"▶ นำเสนอ"; if(on&&document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{}); if(!on&&document.fullscreenElement) document.exitFullscreen().catch(()=>{}); logEv("present",on?"on":"off"); };
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&document.body.classList.contains("present")) $("#present").click(); });
/* ===== team 50 ===== */
const CATS=[["ศิลปิน",/ศิลปิน|นักร้อง|ไอดอล/],["กิน / ร้านอาหาร",/กิน|อาหาร|อร่อย|ร้าน|food|restaurant/i],["คาเฟ่",/คาเฟ่|cafe/i],["ท่องเที่ยว",/เที่ยว|travel|ทริป/i],["ที่พัก / โรงแรม",/ที่พัก|โรงแรม|hotel/i],["ไลฟ์สไตล์ / อื่น ๆ",/.*/]];
function catsOf(d){ const s=(d.cat||"")+" "+(d.group||""); const out=CATS.filter(([k,re],i)=>i<CATS.length-1&&re.test(s)).map(x=>x[0]); return out.length?out:[CATS[CATS.length-1][0]]; }
function renderTeam(sorted,reachAll){
  const passed=sorted.filter(d=>rvOf(d)==="pass"), fails=sorted.filter(d=>rvOf(d)==="fail"), np=passed.length;
  const team=passed.slice(0,TARGET), spare=passed.slice(TARGET);
  const pct=Math.min(100,Math.round(np/TARGET*100)); const ring=$("#tp-ring"); ring.style.setProperty("--p",pct); ring.classList.toggle("full",np>=TARGET);
  $("#tp-n").textContent=Math.min(np,TARGET); $("#tp-t").textContent=TARGET; $("#tp-t2").textContent=TARGET;
  const candidates=sorted.length-fails.length, need=TARGET-np, short=TARGET-candidates;
  $("#tp-line").textContent=np>=TARGET?`ครบ ${TARGET} คนแล้ว${spare.length?` · สำรองอีก ${spare.length} คน`:""}`:`ผ่านแล้ว ${np} · เหลืออีก ${need} ช่อง · รอพิจารณา ${candidates-np} คน`;
  const w=$("#tp-warn"); if(short>0){ w.hidden=false; w.className="tp-warn"; w.textContent=`⚠ ไม่ผ่าน ${fails.length} คน — ถึงที่เหลือผ่านหมดก็ยังขาด ${short} คน ทีมงานกำลังหา KOL เพิ่ม`; } else if(np>=TARGET){ w.hidden=false; w.className="tp-warn ok"; w.textContent="✓ ทีมครบตามเป้า"; } else if(fails.length){ w.hidden=false; w.className="tp-warn ok"; w.textContent=`ไม่ผ่าน ${fails.length} คน · ผู้สมัครที่เหลือยังพอครบ ${TARGET} (เผื่อได้อีก ${candidates-TARGET} คน)`; } else w.hidden=true;
  const reach=team.reduce((s,d)=>s+(d.f||0),0);
  $("#tp-stats").innerHTML=`<div><div class="l">Reach ของทีม</div><div class="v">${fmtN(reach)}</div></div><div><div class="l">จากผู้สมัครทั้งหมด</div><div class="v">${reachAll?Math.round(reach/reachAll*100):0}%</div></div><div><div class="l">หมวดที่ครอบคลุม</div><div class="v">${new Set(team.flatMap(catsOf)).size}/${CATS.length}</div></div>`;
  const slots=$("#slots"); slots.innerHTML="";
  for(let i=0;i<TARGET;i++){ const d=team[i]; const el=document.createElement("div");
    if(!d){ el.className="slot empty"; el.textContent=i+1; }
    else { const src=avSrc(d); el.className="slot"+(i<10?" lead":"")+(d.sug?" new":"")+(src?"":" txt"); el.title=`${d.name} · ${fmtN(d.f)}`; el.innerHTML=(src?`<img src="${src}" alt="" loading="lazy">`:iniOf(d))+`<span class="n">${i+1}</span>`+(d.sug?`<span class="nw">ใหม่</span>`:""); el.onclick=()=>openCard(d); }
    slots.appendChild(el); }
  const sp=$("#spare"); sp.hidden=!spare.length; sp.innerHTML=spare.length?`<span class="lb">สำรอง +${spare.length}</span>`+spare.map(d=>{ const src=avSrc(d); return `<div class="slot${src?"":" txt"}" title="${esc(d.name)}">${src?`<img src="${src}" alt="">`:iniOf(d)}</div>`; }).join("")+`<span>ผ่านเกินเป้า — ใช้แทนได้ถ้ามีคนถอนตัว</span>`:"";
  sp.querySelectorAll(".slot").forEach((el,i)=>el.onclick=()=>openCard(spare[i]));
  // mixes
  const tierRows=TIERS.map(t=>[t.n+" "+t.d,team.filter(d=>d.tier===t.k).length,t.c]);
  $("#mix-tier").innerHTML=mixHtml(tierRows,team.length,"คน");
  const catRows=CATS.map(([k])=>[k,team.filter(d=>catsOf(d).includes(k)).length,"var(--ink2)"]);
  $("#mix-cat").innerHTML=mixHtml(catRows,team.length,"คน",true);
}
function mixHtml(rows,total,unit,warnZero){ const mx=Math.max(1,...rows.map(r=>r[1])); return rows.map(([k,n,c])=>`<div class="m"><span class="k${warnZero&&!n&&total?" warn-k":""}" title="${esc(k)}">${esc(k)}${warnZero&&!n&&total?" · ยังไม่มี":""}</span><span class="bar"><i style="width:${n/mx*100}%;background:${c}"></i></span><span class="v">${n} ${unit}</span></div>`).join(""); }
/* ===== plan (3 phases) ===== */
function renderPlan(sorted){
  const passed=sorted.filter(d=>rvOf(d)==="pass");
  $("#phases").innerHTML=PHASES.map(p=>{ const list=passed.filter(d=>phasesOf(d).includes(p.n)); const reach=list.reduce((s,d)=>s+(d.f||0),0);
    const faces=list.slice(0,14).map(d=>{ const s=avSrc(d); return s?`<img src="${s}" alt="" title="${esc(d.name)}" data-k="${esc(d.key)}">`:`<span class="f" title="${esc(d.name)}" data-k="${esc(d.key)}">${iniOf(d)}</span>`; }).join("")+(list.length>14?`<span class="f more">+${list.length-14}</span>`:"");
    return `<div class="ph" style="--ph:${p.c}"><div class="num">ระยะที่ ${p.n}</div><h3>${esc(p.title)}</h3><div class="d">${esc(p.d)}</div><div class="g">${esc(p.goal)}</div><div class="kpi"><div><b>${list.length}</b>KOL</div><div><b>${fmtN(reach)}</b>reach</div></div><div class="faces">${list.length?faces:`<div class="empty-p">ยังไม่มี KOL ในระยะนี้ — เลือกจากรายชื่อด้านล่าง</div>`}</div></div>`; }).join("");
  $("#phases").querySelectorAll("[data-k]").forEach(el=>el.onclick=()=>{ const d=data.find(x=>x.key===el.dataset.k); if(d) openCard(d); });
  const unset=passed.filter(d=>!phasesOf(d).length).length; const byz=[...new Set(passed.map(d=>(reviews[rid(d)]||{}).phaseBy).filter(Boolean))]; $("#plan-who").textContent=byz.length?"จัดโดย: "+byz.join(", "):"";
  const list=$("#plan-list"); if(!passed.length){ list.innerHTML=`<div class="empty">ยังไม่มี KOL ที่ผ่าน — ติ๊ก "ผ่าน" ในหน้าพิจารณาก่อน แล้วค่อยจัดลงระยะ</div>`; return; }
  list.innerHTML=(unset?`<p class="plan-note">ยังไม่ได้จัดระยะ ${unset} คน (แถบเหลือง)</p>`:`<p class="plan-note">จัดครบทุกคนแล้ว ✓</p>`)+passed.map(d=>{ const ph=phasesOf(d); return `<div class="pl${ph.length?"":" unset"}" data-k="${esc(d.key)}">${avatarEl(d)}<div><div class="nm">${esc(d.name)}</div><div class="ct">${fmtN(d.f)} · ${esc(d.cat||"—")}</div></div><div class="pch">${PHASES.map(p=>`<button type="button" data-p="${p.n}" class="${ph.includes(p.n)?"on":""}" style="--ph:${p.c}" title="${esc(p.title)} ${esc(p.d)}">ระยะ ${p.n}</button>`).join("")}</div></div>`; }).join("");
  list.querySelectorAll(".pl").forEach(el=>{ const d=data.find(x=>x.key===el.dataset.k); el.querySelector(".nm").onclick=()=>openCard(d); el.querySelector(".av").onclick=()=>openCard(d);
    el.querySelectorAll(".pch button").forEach(b=>b.onclick=()=>togglePhase(d,b.dataset.p)); });
}
/* ===== AI plan: กติกาที่อธิบายได้ ===== */
const LOCAL_RE=/โคราช|korat|นครราชสีมา|เมืองย่า|ย่าโม/i;
function aiPlan(passed){
  const total=passed.reduce((s,d)=>s+(d.f||0),0); const out=new Map();
  passed.forEach(d=>{ const sc=[0,0,0], why=[[],[],[]]; const txt=(d.name+" "+d.cat); const f=d.f||0;
    const add=(i,n,w)=>{ sc[i]+=n; why[i].push(w); };
    if(d.artist){ add(0,4,"ศิลปิน — ทำ Teaser เปิดตัวแคมเปญ"); if(/สามารถ.{0,12}ร่วมงาน|วันเปิดงาน/.test(d.cat||"")) add(2,5,"ระบุว่ามาร่วมงานได้ (วันเปิดงาน) — ใช้ช่วงระหว่างงาน"); }
    if(f>=1e6) add(0,3,"Mega "+fmtN(f)+" — เปิดการรับรู้วงกว้าง"); else if(f>=3e5) add(0,2,"Macro "+fmtN(f)+" — reach สูง เหมาะช่วงเปิดตัว"); else if(f>=1e5) add(1,1,"Macro ระดับกลาง — ชวนวางแผนทริป");
    if(LOCAL_RE.test(txt)){ add(2,3,"บัญชีท้องถิ่นโคราช — รีวิวหน้างาน/จุดเช็กอินได้จริง"); add(1,1,"รู้จักพื้นที่ — แนะนำเส้นทางได้"); }
    if(/ท่องเที่ยว|travel|ทริป|เที่ยว/i.test(d.cat||d.group)){ add(1,2,"สายท่องเที่ยว — เส้นทาง/แผนทริปตัวอย่าง"); if(f>=1.5e5) add(0,1,"ท่องเที่ยวยอดสูง — ชวนคนต่างจังหวัดมาโคราช"); }
    if(/คาเฟ่|cafe/i.test(d.cat)) add(1,1,"คาเฟ่ — จุดเช็กอินช่วงวางแผน");
    if(/กิน|อาหาร|อร่อย|food|ร้าน/i.test(d.cat)) add(2,2,"สายกิน — รีวิวร้านช่วงงานกระตุ้นให้มาจริง");
    if(/ที่พัก|โรงแรม|hotel/i.test(d.cat)) add(1,2,"ที่พัก — ช่วยตัดสินใจค้างคืน");
    if(/คอมมูนิตี้|community/i.test(d.cat)) add(1,2,"บัญชีคอมมูนิตี้ — กระจายข้อมูลกิจกรรม");
    if(f<5e4&&!d.artist) add(2,1,"Micro/Nano — คอนเทนต์หน้างานจริงดูน่าเชื่อถือ");
    if(!sc.some(Boolean)) add(1,1,"ทั่วไป — ใส่ช่วงกลางเพื่อเสริมความถี่");
    out.set(d.key,{d,sc,why}); });
  // assign primary = argmax; balance by reach share (target ≈ 32/30/38 %)
  const target=[.32,.30,.38].map(x=>x*total); const sum=[0,0,0]; const pick={};
  const order=[...passed].sort((a,b)=>(b.f||0)-(a.f||0));
  order.forEach(d=>{ const o=out.get(d.key); const ranked=[0,1,2].sort((i,j)=>o.sc[j]-o.sc[i]||sum[i]-sum[j]); let i=ranked[0];
    if(sum[i]+(d.f||0)>target[i]*1.25 && o.sc[ranked[1]]>=o.sc[i]-2){ i=ranked[1]; o.why[i].push("ย้ายมาระยะนี้เพื่อบาลานซ์ reach ระหว่างระยะ"); }
    const ph=[String(i+1)]; const j=ranked.find(k=>k!==i&&o.sc[k]>=4&&o.sc[k]>=o.sc[i]-1); if(j!=null) ph.push(String(j+1));
    sum[i]+=(d.f||0); pick[d.key]={d,ph:ph.sort(),whyP:o.why,why:ph.map(p=>o.why[+p-1]).flat().filter((v,k,a)=>a.indexOf(v)===k)}; });
  // guarantee each phase has at least 3 people when possible
  [0,1,2].forEach(i=>{ const have=Object.values(pick).filter(x=>x.ph.includes(String(i+1))).length; if(have<3&&passed.length>=9){ Object.values(pick).sort((a,b)=>out.get(b.d.key).sc[i]-out.get(a.d.key).sc[i]).filter(x=>!x.ph.includes(String(i+1))).slice(0,3-have).forEach(x=>{ x.ph.push(String(i+1)); x.ph.sort(); x.whyP[i].push("เพิ่มให้ระยะที่ "+(i+1)+" มีคนครบขั้นต่ำ"); x.why.push("เพิ่มให้ระยะที่ "+(i+1)+" มีคนครบขั้นต่ำ"); }); } });
  return {pick,sum,total};
}
let PLAN_MODE="manual";
$("#plan-seg").querySelectorAll("button").forEach(b=>b.onclick=()=>{ PLAN_MODE=b.dataset.m; $("#plan-seg").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b)); $("#plan-manual").hidden=PLAN_MODE!=="manual"; $("#plan-ai").hidden=PLAN_MODE!=="ai"; logEv("planmode",PLAN_MODE); render(); });
function renderAI(passed){
  if(PLAN_MODE!=="ai") return; if(!passed.length){ $("#ai-sum").textContent="ยังไม่มี KOL ที่ผ่าน — AI จะจัดให้ทันทีเมื่อมีคนผ่าน"; $("#ai-phases").innerHTML=""; $("#ai-list").innerHTML=""; return; }
  const {pick,total}=aiPlan(passed); const rows=Object.values(pick);
  const cnt=[1,2,3].map(n=>rows.filter(x=>x.ph.includes(String(n))).length), sum=[1,2,3].map(n=>rows.filter(x=>x.ph.includes(String(n))).reduce((s,x)=>s+(x.d.f||0),0));
  const diff=rows.filter(x=>{ const cur=phasesOf(x.d).join(","); return cur&&cur!==x.ph.join(","); }).length, unset=rows.filter(x=>!phasesOf(x.d).length).length;
  $("#ai-sum").innerHTML=`จัด ${rows.length} คน จาก reach รวม ${fmtN(total)} → ระยะ 1 <b>${cnt[0]} คน · ${fmtN(sum[0])}</b> (${Math.round(sum[0]/total*100)}%) · ระยะ 2 <b>${cnt[1]} คน · ${fmtN(sum[1])}</b> (${Math.round(sum[1]/total*100)}%) · ระยะ 3 <b>${cnt[2]} คน · ${fmtN(sum[2])}</b> (${Math.round(sum[2]/total*100)}%)<br>หลักคิด: เปิดตัวด้วยศิลปิน + ยอดสูงสุด → ช่วงกลางให้สายท่องเที่ยว/คาเฟ่/ที่พักช่วยวางแผน → ช่วงงานให้คนท้องถิ่นโคราชและสายกินรีวิวหน้างานจริง · ศิลปินทำให้ระยะ 1 reach สูงสุดโดยธรรมชาติ ส่วนระยะ 2–3 บาลานซ์จำนวนคนและ reach ให้ใกล้เคียงกัน${unset?` · ยังไม่จัดเอง ${unset} คน`:""}${diff?` · ต่างจากที่จัดเองอยู่ ${diff} คน`:""}`;
  $("#ai-phases").innerHTML=PHASES.map(p=>{ const list=rows.filter(x=>x.ph.includes(p.n)).sort((a,b)=>(b.d.f||0)-(a.d.f||0)); const reach=list.reduce((s,x)=>s+(x.d.f||0),0);
    return `<div class="ph" style="--ph:${p.c}"><div class="num">ระยะที่ ${p.n}</div><h3>${esc(p.title)}</h3><div class="d">${esc(p.d)}</div><div class="kpi"><div><b>${list.length}</b>KOL</div><div><b>${fmtN(reach)}</b>reach</div></div><div class="who-l">${list.slice(0,8).map(x=>{ const s=avSrc(x.d); return `<div class="wl" data-k="${esc(x.d.key)}">${s?`<img src="${s}" alt="">`:`<span class="f">${iniOf(x.d)}</span>`}<div><b>${esc(x.d.name)}</b><span>${fmtN(x.d.f)} · ${esc((x.whyP[+p.n-1]||[])[0]||x.why[0]||"")}</span></div></div>`; }).join("")}${list.length>8?`<div class="wl"><span class="f">+${list.length-8}</span><div><span>ดูทั้งหมดด้านล่าง</span></div></div>`:""}</div></div>`; }).join("");
  $("#ai-phases").querySelectorAll("[data-k]").forEach(el=>el.onclick=()=>{ const d=data.find(x=>x.key===el.dataset.k); if(d) openCard(d); });
  $("#ai-list").innerHTML=rows.sort((a,b)=>(b.d.f||0)-(a.d.f||0)).map(x=>{ const cur=phasesOf(x.d).join(","); return `<div class="ai-row" data-k="${esc(x.d.key)}">${avatarEl(x.d)}<div><div class="nm">${esc(x.d.name)} <i style="font-style:normal;color:var(--mute);font-weight:500;font-size:12px">${fmtN(x.d.f)}</i>${cur&&cur!==x.ph.join(",")?` <span class="diff">จัดเองไว้: ระยะ ${esc(cur)}</span>`:""}</div><div class="why">${x.why.map(w=>"• "+esc(w)).join(" ")}</div></div><div class="tags">${x.ph.map(p=>`<span style="--ph:${PHASES[+p-1].c}">ระยะ ${p}</span>`).join("")}</div></div>`; }).join("");
  $("#ai-list").querySelectorAll(".ai-row .av,.ai-row .nm").forEach(el=>el.onclick=()=>{ const d=data.find(x=>x.key===el.closest(".ai-row").dataset.k); if(d) openCard(d); });
  $("#ai-apply-all").onclick=()=>applyAI(rows,false); $("#ai-apply-unset").onclick=()=>applyAI(rows,true);
}
function applyAI(rows,onlyUnset){ if(!reviewer){ askName(()=>applyAI(rows,onlyUnset)); return; } const list=rows.filter(x=>!onlyUnset||!phasesOf(x.d).length).map(x=>({key:rid(x.d),name:x.d.name,phase:x.ph.join(","),by:reviewer}));
  if(!list.length){ toast("ไม่มีรายการให้จัด"); return; } const prev={}; list.forEach(r=>{ prev[r.key]=reviews[r.key]; reviews[r.key]=Object.assign({},reviews[r.key],{phase:r.phase}); }); render(); logEv("ai-apply",(onlyUnset?"unset ":"all ")+list.length);
  api("setPhases",[list]).then(()=>{ toast(`บันทึกแผน AI ให้ ${list.length} คนแล้ว`); PLAN_MODE="manual"; $("#plan-seg").querySelector('[data-m="manual"]').click(); }).catch(err=>{ Object.assign(reviews,prev); render(); toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err)); }); }
function togglePhase(d,p){ if(!reviewer){ askName(()=>togglePhase(d,p)); return; } const id=rid(d); const cur=phasesOf(d); const next=cur.includes(p)?cur.filter(x=>x!==p):cur.concat([p]).sort(); const prev=reviews[id];
  reviews[id]=Object.assign({},prev,{phase:next.join(",")}); render(); logEv("phase",d.name+" → "+(next.join(",")||"-"));
  api("setPhase",[{key:id,name:d.name,phase:next.join(","),by:reviewer}]).then(()=>toast(`${d.name}: ระยะ ${next.join(", ")||"—"}`)).catch(err=>{ reviews[id]=prev; render(); toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err)); }); }
/* ===== KOL card ===== */
function openCard(d){ const R=reviews[rid(d)]||{}, rv=rvOf(d), ph=phasesOf(d), t=TIERS.find(x=>x.k===d.tier); const rank=[...data].sort((a,b)=>(b.f||0)-(a.f||0)).indexOf(d)+1; const hs=histLine(d);
  $("#kcard").innerHTML=`<button class="kc-x" type="button" id="kc-x" aria-label="ปิด">×</button><div class="kc-top">${avatarEl(d)}<div><h3>${esc(d.name)}</h3><div class="ct">${esc(d.cat||"—")}</div>${codeLabel(d.code)?`<span class="badge code">${esc(codeLabel(d.code))}</span>`:""}${d.artist?` <span class="badge art">ARTIST</span>`:""}</div></div>
  <div class="kc-bd"><div class="kc-k"><div><div class="l">ผู้ติดตาม</div><div class="v">${fmtN(d.f)}</div></div><div><div class="l">ระดับ</div><div class="v">${t?t.n:"—"}</div></div><div><div class="l">อันดับ reach</div><div class="v">#${rank}</div></div></div>
  <div class="kc-row">ผลพิจารณา: <b>${rv==="pass"?"✓ ผ่าน":rv==="fail"?"✗ ไม่ผ่าน":"รอพิจารณา"}</b>${R.by?` · โดย ${esc(R.by)}`:""}${R.reason?`<br>เหตุผล: ${esc(R.reason)}`:""}</div>${hs?`<div class="kc-row">ประวัติ: ${esc(hs)}</div>`:""}${d.note?`<div class="kc-row">หมายเหตุ: ${esc(d.note).slice(0,300)}</div>`:""}
  ${rv==="pass"?`<div class="kc-row">ระยะในแผน:<div class="kc-ph">${PHASES.map(p=>`<button type="button" data-p="${p.n}" class="${ph.includes(p.n)?"on":""}" style="--ph:${p.c}">ระยะ ${p.n}</button>`).join("")}</div></div>`:""}
  <div class="kc-acts">${d.url?`<a class="btn" href="${esc(d.url)}" target="_blank" rel="noopener">เปิดโปรไฟล์ ↗</a>`:""}<button class="btn${rv==="pass"?" primary":""}" type="button" id="kc-pass">✓ ผ่าน</button><button class="btn" type="button" id="kc-fail">✗ ไม่ผ่าน</button></div></div>`;
  $("#kmodal").hidden=false; $("#kc-x").onclick=closeCard; $("#kc-pass").onclick=()=>{ closeCard(); setReview(d,rv==="pass"?"":"pass",""); }; $("#kc-fail").onclick=()=>{ closeCard(); if(rv==="fail") setReview(d,"",""); else askReason(d); };
  $("#kcard").querySelectorAll(".kc-ph button").forEach(b=>b.onclick=()=>{ togglePhase(d,b.dataset.p); setTimeout(()=>openCard(d),50); }); logEv("card",d.name); }
function closeCard(){ $("#kmodal").hidden=true; }
$("#kmodal").addEventListener("click",e=>{ if(e.target.id==="kmodal") closeCard(); });
function histLine(d){ const hs=history[rid(d)]||[]; const fails=[...new Set(hs.filter(x=>x.status==="fail").map(x=>x.by).filter(Boolean))], passes=[...new Set(hs.filter(x=>x.status==="pass").map(x=>x.by).filter(Boolean))];
  const parts=[]; if(fails.length) parts.push("ไม่ผ่าน: "+fails.join(", ")); if(passes.length) parts.push("ผ่าน: "+passes.join(", ")); return parts.join(" · "); }
function rowEl(d,rankOf,reach,max,isNew){
    const st=statusOf(d), rk=rankOf.get(d), rv=rvOf(d), R=reviews[rid(d)]||{}; const row=document.createElement("div"); row.className="row"+(st?" "+st:"")+(rv?" "+rv:"")+(isNew?" sugnew":"");
    const nm=`<a href="#" class="open-card">${esc(d.name)}</a>`;
    row.innerHTML=`<div class="rk${rk<=10?" lead":""}">${d.sug?"★":rk}</div>
      <div class="who">${avatarEl(d)}<div class="who-t"><div class="nm">${nm}${codeLabel(d.code)?`<span class="badge code" title="Code: ${esc(d.code)}">${esc(codeLabel(d.code))}</span>`:""}${d.artist?`<span class="badge art">ARTIST</span>`:""}${d.sug?`<span class="badge sug" title="เพิ่มโดย ${esc(d.by)}">เพิ่มใหม่ · ${esc(d.by||"ลูกค้า")}</span>`:""}${st?`<span class="badge ${st}">${st==="new"?"NEW":"EDIT"}</span>`:""}</div><div class="ct" title="${esc(d.cat)}">${esc(d.cat||"—")}</div></div></div>
      <div class="trk" title="${fmtN(d.f)} ผู้ติดตาม"><div class="fill" style="width:${(widthOf(d.f,max)*100).toFixed(2)}%;background:${heat(d.f)}"></div></div>
      <div class="val">${fmtN(d.f)}<small>${d.f?Math.round(d.f/reach*1000)/10+"% ของ reach":"ไม่ระบุ"}</small></div>
      <div class="rvw"><span class="rv-lbl ${rv||"wait"}">${rv==="pass"?"✓ ผ่าน":rv==="fail"?"✗ ไม่ผ่าน":"รอพิจารณา"}</span><div class="rv" title="ติ๊กผลพิจารณา"><button type="button" class="pass${rv==="pass"?" on":""}" data-s="pass">✓ ผ่าน</button><button type="button" class="fail${rv==="fail"?" on":""}" data-s="fail">✗ ไม่ผ่าน</button></div>${rv&&R.by?`<div class="meta" title="${esc((R.by||"")+(R.reason?" · "+R.reason:""))}"><b>${rv==="fail"?"✗":"✓"} ${esc(R.by)}</b>${R.reason?` · ${esc(R.reason)}`:""}</div>`:""}${histLine(d)?`<div class="meta" title="${esc(histLine(d))}">${esc(histLine(d))}</div>`:""}</div>`;
    row.querySelectorAll(".rv button").forEach(b=>b.onclick=()=>{ const s=rv===b.dataset.s?"":b.dataset.s; if(s==="fail") askReason(d); else setReview(d,s,""); });
    row.querySelector(".open-card").onclick=e=>{ e.preventDefault(); openCard(d); }; row.querySelector(".av").onclick=()=>openCard(d); row.querySelector(".av").style.cursor="pointer";
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
  const fails=data.filter(x=>rvOf(x)==="fail").length, short=TARGET-(data.length-fails);
  api("setReview",[{key:id,name:d.name,status,by:reviewer,reason:reason||"",code:d.code||"",extra:status==="fail"?`ไม่ผ่านแล้ว ${fails} คน · ${short>0?`ต้องหา KOL เพิ่มอีก ${short} คน`:`ยังพอครบ ${TARGET} (เผื่อ ${-short} คน)`}`:""}])
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
