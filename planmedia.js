/* PLAN MEDIA — แผนสื่อตามวันเวลา จากเด็ค "22 OCT แผนประชาสัมพันธ์" (หน้า 10, 34–35, 56–64, 104–108, 174–200)
   ร่างแรก: ข้อมูลอยู่ในไฟล์นี้ แก้วันที่/รายการได้ที่ PM_PHASES / PM_ROWS · เข้าหน้านี้ต้องใส่รหัส + ชื่อ (จำไว้เฉพาะแท็บที่เปิดอยู่) */
(function(){ const K=window.KOL; if(!K) return; const {$,esc,setTab,logEv,flushLog}=K;
const PM_CODE="0000";
const PM_START=Date.UTC(2026,9,12), PM_DAYS=63; // 12 ต.ค. – 13 ธ.ค. 2569
const pmIdx=(m,d)=>Math.round((Date.UTC(2026,m-1,d)-PM_START)/864e5);
const PM_MON=["","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

const PM_PHASES=[
  {n:1,k:"Discover the City",s:[10,12],e:[10,18],d:"12–18 ต.ค.",c:"#a9a9b0",w:90,pg:"34–35, 56",
    o:"สร้างการรับรู้ เปิดตัวแนวคิด “อวดเมืองโคราช” ให้คนเริ่มค้นพบพลังสร้างสรรค์ที่เมืองมี",
    items:["Main KV อวดเมืองโคราช + Page Cover","ไฮไลต์ Workshop “เมืองนี้มีอะไรดี? ให้คนโคราชเป็นคนอวด” (16 ต.ค.)"]},
  {n:2,k:"Build the Story",s:[10,19],e:[11,7],d:"19 ต.ค.–7 พ.ย.",c:"#6f6f75",w:70,pg:"34–35, 57–59",
    o:"เล่าเรื่อง Cultural Assets ผ่านคน ผลงาน และเรื่องราวจริง เชื่อมสู่โอกาส 3 มิติ น่าลงทุน น่าเที่ยว น่าอยู่",
    items:["สรุปเวที Nation Forum (20 ต.ค.) มุมมอง TCEB และตัวแทนเมือง","บทความ + Quote รองผู้ว่าฯ และรองผอ. TCEB","เปิดตัว Festival KV และ 3 Experiences · Flash Mob ลานย่าโม","Reel 10 ของดีที่เมืองมี · Infographic 10 พลังสร้างสรรค์","Thematic VDO “เมืองเดียวกัน โอกาสที่มองเห็นอาจไม่เหมือนกัน”","Reel ต้นทาง K-Street / K-Sounder · 3 Young Entrepreneurs"]},
  {n:3,k:"Siam Launch",s:[11,8],e:[11,8],d:"8 พ.ย.",c:"#7b4bd6",w:50,pg:"10, 34–35",
    o:"ขยายการรับรู้สู่คนนอกพื้นที่ นำพลัง Street Culture ของโคราชไปสร้างกระแสในกรุงเทพฯ",
    items:["Kick off “อวดเมืองโคราช” บุกสยาม","KOL กรุงเทพฯ ร่วมงานเปิดตัว (KOL ระยะ 1)"]},
  {n:4,k:"Build Festival Desire",s:[11,9],e:[11,14],d:"9–14 พ.ย.",c:"#f05a85",w:40,pg:"34–35, 60",
    o:"สร้างความอยากมา นำเสนอเสน่ห์ของเมืองและไฮไลต์ K-BATTLE ให้เป็นเหตุผลในการเดินทาง",
    items:["Reel น่าลงทุน · Reel น่าอยู่","Infographic วิถีและเอกลักษณ์ · ไทม์ไลน์ลานย่าโม","Caravan 3 เส้นทาง “โคราชมีอะไรให้อวด?”","Podcast Point of View · Korat Neighborhood EP1–2","เรื่องเล่าจากเมือง: ถนนจอมพล"]},
  {n:5,k:"Drive Attendance",s:[11,15],e:[11,19],d:"15–19 พ.ย.",c:"#e8194c",w:20,pg:"34–35, 62",
    o:"กระตุ้นการตัดสินใจเข้าร่วมงาน สื่อสาร Line-up วันเวลา สถานที่ และการเดินทางให้ชัดเจน",
    items:["Vlog เช็กอิน / Street Food / สายมู","Infographic Guide จุดจอดรถ–ร้านอาหาร + QR แผนที่","Carousel Line-up ศิลปิน · Judge Interview","Artist Interview Jennifer Kim · Painting Show Landmark","TVC / Scoop ข่าว ช่อง 7 (13–19 พ.ย.) · KOL ระยะ 2 + Nano Week"]},
  {n:6,k:"Festival Experience",s:[11,20],e:[11,29],d:"20–29 พ.ย.",c:"#b5103a",w:20,pg:"34–35, 63–64",
    o:"ถ่ายทอดบรรยากาศจริง กิจกรรม และการมีส่วนร่วม เพื่อสร้างกระแสและแสดงศักยภาพของเมือง",
    items:["Recap รายวัน K-Street & K-Sounder · Dance Competition","Wind Symphony Gala · Jennifer Kim × Siam Event Orchestra","K-BATTLE Extreme Battle · K-EXPO Matching","Live Stream ≥ 5 ครั้ง · ภาพถ่าย 300 ภาพ","KOL รีวิว Street Food & Street Fashion (KOL ระยะ 3)","Press Tour 19–20 และ 26–27 พ.ย."]},
  {n:7,k:"Sustain City Perception",s:[11,30],e:[12,13],d:"30 พ.ย. 69–10 ม.ค. 70",c:"#4b4b4e",w:90,pg:"34–35, 108",
    o:"ต่อยอดภาพจำเมืองระยะยาว สื่อสารผลลัพธ์ เรื่องราว และโอกาสที่เกิดจากเทศกาล",
    items:["สกู๊ปใหญ่ “ถอดรหัสมหานคร MICE” (30 พ.ย.–13 ธ.ค.)","Nation TV ครั้งที่ 10: ถอดบทเรียนโคราชโมเดล (2 ธ.ค.)","The Thought Leaders “ถอดรหัสมหานครสร้างสรรค์” (7 ธ.ค.)","Short Video ต่อเนื่อง 30 พ.ย. 69 – 10 ม.ค. 70"]},
];

// แถวช่องทาง: แต่ละแถวมีหลายรายการได้ · s/e = [เดือน, วัน]
const PM_ROWS=[
  {g:"อีเวนต์",lab:"อีเวนต์ในโคราช",c:"#2b2b2e",items:[
    {t:"Workshop",s:[10,16],n:"Workshop ค้นของดี ที่เมืองมีให้อวด"},{t:"K-Sounder ดนตรีในสวน",s:[10,24]},{t:"K-BATTLE · K-Sounder · K-EXPO",s:[11,20],e:[11,29]}]},
  {g:"อีเวนต์",lab:"เวทีนอกพื้นที่",c:"#7b4bd6",items:[
    {t:"Nation Forum",s:[10,20]},{t:"บุกสยาม",s:[11,8]}]},
  {g:"สื่อออฟไลน์",lab:"ทีวี เนชั่นทันข่าวค่ำ (10 ครั้ง)",c:"#e8194c",pg:"176",items:[
    {t:"ครั้งที่ 1",s:[10,19],n:"เวิร์กช็อป 10 คุณค่า + สัมภาษณ์ ผอ.TCEB และผู้ว่าฯ"},{t:"ครั้งที่ 2–6",s:[10,26],e:[10,30],n:"คุณค่าที่สร้างโอกาส ตอนละ 2 คุณค่า"},{t:"ครั้งที่ 7",s:[11,2],n:"ความพร้อมของงาน + ไฮไลต์ K-BATTLE"},{t:"ครั้งที่ 8–9",s:[11,20],e:[11,29],n:"ไฮไลต์ K-STREET K-SOUNDER K-EXPO"},{t:"ครั้งที่ 10",s:[12,2],n:"ถอดบทเรียนโคราชโมเดล สู่ MICE City"}]},
  {g:"สื่อออฟไลน์",lab:"ทีวี TVC/Scoop ช่อง 7 (1 ครั้ง)",c:"#f05a85",pg:"176",items:[
    {t:"เรื่องเล่าเช้านี้ / สนามข่าว 7 สี",s:[11,13],e:[11,19],n:"Thematic VDO + กำหนดการและไฮไลต์เทศกาล"}]},
  {g:"สื่อออฟไลน์",lab:"หนังสือพิมพ์ (30 ครั้ง)",c:"#6f6f75",pg:"174",items:[
    {t:"เดลินิวส์ · กรุงเทพธุรกิจ · ฐานฯ",s:[10,17],e:[10,23],n:"โอกาสทางเศรษฐกิจจาก 10 คุณค่า"},{t:"ไทยรัฐ · เดลินิวส์ · กรุงเทพธุรกิจ",s:[10,24],e:[10,30],n:"ความพร้อมของ K-BATTLE + สัมภาษณ์ TCEB"},{t:"หนังสือพิมพ์ท้องถิ่น",s:[11,1],e:[11,29],n:"“โคราชโมเดล” พฤศจิกายน–ธันวาคม"},{t:"สกู๊ปใหญ่ ถอดรหัสมหานคร MICE",s:[11,30],e:[12,13]}]},
  {g:"สื่อออฟไลน์",lab:"Press Tour",c:"#4b4b4e",pg:"6.3.1",items:[
    {t:"สื่อไลฟ์สไตล์",s:[11,19],e:[11,20],n:"สื่อ/อินฟลูฯ ไลฟ์สไตล์และสตรีท 15–20 คน"},{t:"สื่อแมส/ธุรกิจ",s:[11,26],e:[11,27],n:"สื่อแมส ภาษาอังกฤษ และธุรกิจ 20–30 คน · Option 2: 26–28 (เช้า)"}]},
  {g:"ออนไลน์",lab:"VDO / Podcast สำนักข่าว",c:"#7b4bd6",pg:"197",items:[
    {t:"SPRiNG BOARD",s:[10,26],n:"10 คุณค่าที่สร้างโอกาส"},{t:"Point of View",s:[11,21],e:[11,26],n:"ประวัติศาสตร์ Art & Performance โคราช"},{t:"Thought Leaders",s:[12,7],n:"ถอดรหัสมหานครสร้างสรรค์"}]},
  {g:"ออนไลน์",lab:"Thematic VDO + Ads",c:"#a9a9b0",pg:"57–59, 196",items:[
    {t:"ปล่อย Thematic VDO + ซื้อ Ads (5M views / 2M reach)",s:[11,2],e:[11,29]}]},
  {g:"ออนไลน์",lab:"KOL 50 คน (บอร์ดนี้)",c:"#e8194c",tab:"plan",items:[
    {t:"ระยะ 1",s:[11,6],e:[11,12]},{t:"ระยะ 2",s:[11,13],e:[11,19]},{t:"ระยะ 3",s:[11,20],e:[11,29]}]},
  {g:"ออนไลน์",lab:"Nano Week (โพสต์ที่ 2)",c:"#7b4bd6",tab:"plan",items:[
    {t:"Nano 15 คน",s:[11,13],e:[11,19]}]},
  {g:"ออนไลน์",lab:"หน้างาน: Live / ภาพ / Reels",c:"#b5103a",pg:"64, 108",items:[
    {t:"Live ≥5 · ภาพ 300 · ลอยกระทง / Brand Master / Workshop",s:[11,20],e:[11,29]},{t:"Short Video ต่อเนื่อง → 10 ม.ค. 70",s:[11,30],e:[12,13]}]},
];

function pmOpenGate(){ const m=$("#pmgate"); $("#pm-code").value=""; $("#pm-name").value=(function(){ try{ return sessionStorage.getItem("pm_who")||K.reviewer()||""; }catch(e){ return K.reviewer()||""; } })(); $("#pm-err").hidden=true; m.hidden=false; setTimeout(()=>$("#pm-code").focus(),50); }
function pmLogin(){ const code=$("#pm-code").value.trim(), name=$("#pm-name").value.trim();
  if(code!==PM_CODE){ $("#pm-err").textContent="รหัสไม่ถูกต้อง"; $("#pm-err").hidden=false; $("#pm-code").select(); return; }
  if(!name){ $("#pm-err").textContent="กรุณาใส่ชื่อ"; $("#pm-err").hidden=false; $("#pm-name").focus(); return; }
  try{ sessionStorage.setItem("pm_who",name); }catch(e){}
  $("#pmgate").hidden=true; try{ logEv("pm-login",name); flushLog(); }catch(e){} setTab("pm"); }
function pmLogout(){ try{ sessionStorage.removeItem("pm_who"); }catch(e){} try{ logEv("pm-logout",""); }catch(e){} setTab("review"); }
window.openPmGate=pmOpenGate;

function renderPM(){ const el=$("#pm"); if(!el) return; let who=""; try{ who=sessionStorage.getItem("pm_who")||""; }catch(e){}
  const today=Math.floor((Date.now()-PM_START)/864e5), toEvent=pmIdx(11,20)-today;
  const col=i=>i+2; // คอลัมน์ 1 = ป้ายแถว
  const days=Array.from({length:PM_DAYS},(_,i)=>{ const dt=new Date(PM_START+i*864e5); return {d:dt.getUTCDate(),m:dt.getUTCMonth()+1,w:dt.getUTCDay()}; });
  let g="";
  // แถวเดือน
  let i0=0; while(i0<PM_DAYS){ const m=days[i0].m; let i1=i0; while(i1<PM_DAYS&&days[i1].m===m) i1++; g+=`<div class="pm-mon" style="grid-column:${col(i0)}/${col(i1)}">${PM_MON[m]} ${m===1?"70":"69"}</div>`; i0=i1; }
  g+=days.map((x,i)=>`<div class="pm-day${x.w===0||x.w===6?" we":""}${x.w===1?" mo":""}" style="grid-column:${col(i)}">${x.d}</div>`).join("");
  const bar=(it,c,row,extra)=>{ const s=pmIdx(...it.s), e=it.e?pmIdx(...it.e):s; const one=s===e; const tip=`${it.t}${it.n?" — "+it.n:""}`;
    return `<div class="pm-bar${one?" pt":e-s<3?" sh":""}${extra||""}" style="grid-row:${row};grid-column:${col(s)}/${col(e)+1};--c:${c}" title="${esc(tip)}"><span>${esc(it.t)}</span></div>`; };
  let r=3, grp="";
  g+=`<div class="pm-grp" style="grid-row:${r}">ระยะการสื่อสาร · 7 Phase</div>`; r++;
  PM_PHASES.forEach(p=>{ g+=`<div class="pm-lab" style="grid-row:${r}"><b>${p.n}</b> ${esc(p.k)}</div>`+bar({t:p.d,s:p.s,e:p.e,n:p.o},p.c,r," ph")+(p.more?`<div class="pm-more" style="grid-row:${r}">${p.more}</div>`:""); r++; });
  PM_ROWS.forEach(row=>{ if(row.g!==grp){ grp=row.g; g+=`<div class="pm-grp" style="grid-row:${r}">${esc(grp)}</div>`; r++; }
    g+=`<div class="pm-lab${row.tab?" lk":""}" style="grid-row:${r}"${row.tab?` data-go="${row.tab}"`:""}>${esc(row.lab)}${row.pg?` <span class="pg">หน้า ${esc(row.pg)}</span>`:""}</div>`+row.items.map(it=>bar(it,row.c,r)).join(""); r++; });
  const todayLine=today>=0&&today<PM_DAYS?`<div class="pm-today" style="grid-column:${col(today)};grid-row:1/${r}"><i>วันนี้</i></div>`:"";
  const cards=PM_PHASES.map(p=>`<article class="pm-card" style="--c:${p.c}"><div class="h"><span class="no">${String(p.n).padStart(2,"0")}</span><div><b>${esc(p.k)}</b><span class="d">${esc(p.d)}</span></div></div>
    <p class="o">${esc(p.o)}</p><div class="wt"><i style="width:${p.w}%"></i></div><div class="wl"><span>City Branding ${p.w}%</span><span>Festival ${100-p.w}%</span></div>
    <ul>${p.items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="pg">เด็คหน้า ${esc(p.pg)}</div></article>`).join("");
  el.innerHTML=`<section class="box pm-head"><div><h2>PLAN MEDIA · แผนสื่อตามวันเวลา</h2><div class="pm-t">อวดเมืองโคราช 12 ต.ค. 69 – 10 ม.ค. 70</div>
      <div class="pm-s">ร่างจากเด็ค “22 OCT แผนประชาสัมพันธ์” ยึดวันที่ตามหน้า 34–35 · ชี้ที่แถบเพื่อดูรายละเอียด</div></div>
    <div class="pm-k"><div><b>${toEvent>0?toEvent:0}</b>วันถึงงาน</div><div><b>7</b>ระยะ</div><div><b>11</b>ทีวี</div><div><b>30</b>หนังสือพิมพ์</div><div><b>2</b>Press Tour</div><div><b>50</b>KOL</div></div>
    <div class="pm-who">🔓 ${esc(who)} <button class="btn" id="pm-out" type="button">ออก</button></div></section>
    <section class="box pm-wrap"><div class="pm-g" style="grid-template-rows:repeat(${r-1},auto)">${g}${todayLine}</div></section>
    <section class="pm-cards">${cards}</section>`;
  $("#pm-out").onclick=pmLogout;
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>setTab(b.dataset.go));
}
window.renderPM=renderPM;

$("#pm-ok").onclick=pmLogin; $("#pm-cancel").onclick=()=>{ $("#pmgate").hidden=true; };
["#pm-code","#pm-name"].forEach(s=>$(s).addEventListener("keydown",e=>{ if(e.key==="Enter") pmLogin(); if(e.key==="Escape") $("#pmgate").hidden=true; }));
if(K.tab()==="review"){ try{ if(localStorage.getItem("kol_tab")==="pm"&&sessionStorage.getItem("pm_who")) setTab("pm"); }catch(e){} }
})();
