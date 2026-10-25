/* PLAN MEDIA — แผนสื่อตามวันเวลา จากเด็ค "22 OCT แผนประชาสัมพันธ์" (หน้า 10, 34–35, 56–64, 82, 104–108, 174–200)
   ข้อมูลตั้งต้นอยู่ในไฟล์นี้ (PM_ROWS) · ลากแถบเปลี่ยนวันได้ → บันทึกลงชีตแท็บ Posts (key "pm:<id>", แนวคอนเทนต์ = {"s":[m,d],"e":[m,d]}) ทุกคนเห็นเหมือนกัน
   กดแถบ = เลื่อนลงไปหัวข้อรายละเอียดของรายการนั้น · เข้าหน้านี้ต้องใส่รหัส + ชื่อ (จำไว้เฉพาะแท็บที่เปิดอยู่) */
(function(){ const K=window.KOL; if(!K) return; const {$,esc,setTab,logEv,flushLog}=K;
const PM_CODE="0000";
const PM_START=Date.UTC(2026,9,12), PM_DAYS=63; // แสดง 12 ต.ค. – 13 ธ.ค. 2569
const yOf=m=>m<6?2027:2026;
const pmIdx=(m,d)=>Math.round((Date.UTC(yOf(m),m-1,d)-PM_START)/864e5);
const md=i=>{ const dt=new Date(PM_START+i*864e5); return [dt.getUTCMonth()+1,dt.getUTCDate()]; };
const MON=["","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const yy=m=>m<6?"70":"69";
function fmtRange(s,e){ if(!e||(s[0]===e[0]&&s[1]===e[1])) return `${s[1]} ${MON[s[0]]}`; if(s[0]===e[0]) return `${s[1]}–${e[1]} ${MON[s[0]]}`; return `${s[1]} ${MON[s[0]]}${yy(s[0])!==yy(e[0])?" "+yy(s[0]):""}–${e[1]} ${MON[e[0]]}${yy(s[0])!==yy(e[0])?" "+yy(e[0]):""}`; }

/* ===== ข้อมูล: กลุ่ม → แถว → รายการ · sum = สรุปง่าย · det = รายละเอียดจริงจากเด็ค [หัวข้อ, เนื้อหา] ===== */
const PH="ระยะการสื่อสาร · 7 Phase";
const PM_ROWS=[
  {g:PH,lab:"1 Discover the City",c:"#a9a9b0",items:[{id:"ph1",ph:1,w:90,t:"Discover the City",s:[10,12],e:[10,18],pg:"34–35, 56",
    sum:"เปิดตัวแนวคิด “อวดเมืองโคราช” ให้คนเริ่มเห็นพลังสร้างสรรค์ที่เมืองมี",
    det:[["Main KV อวดเมืองโคราช | อวดพลังสร้างสรรค์ที่เมืองมี","เผยแพร่ Main KV City Branding พร้อม Page Cover ใช้ภาพหลักที่อนุมัติ · Caption เปิดแนวคิดพลังสร้างสรรค์ เชื่อมโอกาส “น่าลงทุน น่าเที่ยว น่าอยู่” และชวนติดตามเรื่องเล่าคน/ผลงานจริงในระยะถัดไป"],
      ["เมืองนี้มีอะไรดี? ให้คนโคราชเป็นคนอวด","ไฮไลต์ Workshop ประมวลภาพบรรยากาศงาน “ค้นของดี ที่เมืองมีให้อวด” (16 ต.ค.) พร้อมสรุป Key Takeaway"]]}]},
  {g:PH,lab:"2 Build the Story",c:"#6f6f75",items:[{id:"ph2",ph:2,w:70,t:"Build the Story",s:[10,19],e:[11,7],pg:"34–35, 57–59",
    sum:"เล่าเรื่องคน ผลงาน และคุณค่าที่เมืองมี ให้คนสนใจและเชื่อมั่นในเมือง",
    det:[["อวดเมืองครั้งนี้ เมืองจะได้อะไรกลับไป?","ถ่ายทอดประเด็นจากเวที Nation Forum ผ่านมุมมอง TCEB และตัวแทนเมือง ถึงการต่อยอด Creative Assets ให้เกิดโอกาส 3 ด้าน"],
      ["โคราชผนึก TCEB ปั้น City Branding","บทความ + Quote จากบทสัมภาษณ์รองผู้ว่าฯ โคราช และรองผอ. TCEB ถึงความร่วมมือสร้าง City Branding ที่มีประชาชนเป็นศูนย์กลาง"],
      ["K-BATTLE | โคราชพร้อมปล่อยของ","เปิดตัว Festival KV และ 3 Experiences แยก Line-up/Experience"],
      ["โคราชอวดสเต็ป! ซีนความมันส์กลางลานย่าโม","Short Video โมเมนต์ Flash Mob Street Dance กลางลานย่าโม สร้าง Viral Moment"],
      ["Reel 10 ของดีที่เมืองมี + Infographic 10 พลังสร้างสรรค์","ซีรีส์ 10 ตอน เปิดด้วย “รู้ไหมโคราชมี…” พาไปเบื้องหลัง แนวคิด และโอกาสต่อยอด พร้อมการ์ด 10 คุณค่า + QR"],
      ["Thematic VDO “เมืองเดียวกัน โอกาสที่มองเห็นอาจไม่เหมือนกัน”","เล่าสลับคนจริง 3 กลุ่ม: ผู้ประกอบการ (น่าลงทุน) นักท่องเที่ยว (น่าเที่ยว) คนโคราชที่สร้าง Creative Community (น่าอยู่)"],
      ["จากลานซ้อมเล็ก ๆ สู่เวที / เสียงคนรุ่นใหม่เป็นจังหวะเมือง","Reel ต้นทาง K-Street (เบื้องหลังนักเต้น) และ K-Sounder (ดนตรีในสวน 24 ต.ค.)"],
      ["จากแบรนด์เล็ก ๆ สู่โอกาสทางธุรกิจ","สัมภาษณ์ 3 Young Entrepreneurs เชื่อมสู่ K-EXPO ให้ Buyer ได้ค้นพบสินค้า"],
      ["ดินด่านเกวียน จะไปได้ไกลกว่าเครื่องปั้นแบบเดิมไหม?","Before–Process–After ในสตูดิโอช่าง/ดีไซเนอร์ ไม่อ้างยอดขายโดยไม่มีหลักฐาน"]]}]},
  {g:PH,lab:"3 Siam Launch",c:"#7b4bd6",items:[{id:"ph3",ph:3,w:50,t:"Siam Launch",s:[11,8],pg:"10, 34–35",
    sum:"ยกพลัง Street Culture โคราชไปเปิดตัวที่สยาม ชวนคนกรุงเทพฯ มาค้นพบเมือง",
    det:[["Kick off “อวดเมืองโคราช” บุกสยาม","ขยายการรับรู้สู่คนนอกพื้นที่ นำพลัง Street Culture ของโคราชไปสร้างกระแสในกรุงเทพฯ"],["KOL ระยะ 1","ศิลปิน/บัญชี reach สูงลงโพสต์วันเปิดตัว (ดูแท็บแผน 3 ระยะ)"]]}]},
  {g:PH,lab:"4 Build Festival Desire",c:"#f05a85",items:[{id:"ph4",ph:4,w:40,t:"Build Festival Desire",s:[11,9],e:[11,14],pg:"34–35, 60",
    sum:"ทำให้คนอยากมา ด้วยเสน่ห์ของเมืองและไฮไลต์ K-BATTLE",
    det:[["Reel น่าลงทุน: ทำของเก่งอย่างเดียวพอไหม?","ผลิตภัณฑ์/งานออกแบบจริง → ถามเจ้าของว่าขายความคิดสร้างสรรค์อย่างไร → กระบวนการออกแบบ ผลิต สร้างแบรนด์ → โอกาส Creative Economy"],
      ["Reel น่าอยู่: คนรุ่นใหม่กลับบ้านมาอวดพลังสร้างสรรค์","ตามคนรุ่นใหม่ 1 คน 1 วัน: Creative Space → เพื่อนร่วมอาชีพ → กิจกรรมชุมชน → ทำไมเลือกอยู่ที่นี่"],
      ["Infographic วิถีและเอกลักษณ์","Visual Guide 4 ช่อง: อาหารตีความใหม่ / แฟชั่นและงานออกแบบ / ดนตรีและกิจกรรม / พื้นที่พบปะคนรุ่นใหม่"],
      ["Infographic ลานย่าโม: ลานเดิม แต่เรื่องไม่เหมือนเดิม","ไทม์ไลน์จากอดีตสู่ศูนย์กลางวัฒนธรรมร่วมสมัย"],
      ["Caravan 3 เส้นทาง: อวดเมืองถึงหน้าบ้าน","รถประชาสัมพันธ์ 3 เส้นทาง + พิธีกรชวนตอบ “โคราชมีอะไรให้อวด?” เก็บคำตอบทำ Reel"],
      ["Podcast Point of View / Korat Neighborhood EP1–2 / ถนนจอมพล","ประวัติศาสตร์การค้า · คนกลับบ้านมาเปิดร้าน · เดินถนนจอมพล 4 จุดกับคนพื้นที่"]]}]},
  {g:PH,lab:"5 Drive Attendance",c:"#e8194c",items:[{id:"ph5",ph:5,w:20,t:"Drive Attendance",s:[11,15],e:[11,19],pg:"34–35, 62",
    sum:"บอกชัด ๆ ว่ามางานยังไง มีอะไร วันไหน ให้คนตัดสินใจมา",
    det:[["Vlog เช็กอิน / Street Food / สายมู","Creator เลือก 4 จุดจาก 4 Pillars แต่ละจุดมีคนเล่าเบื้องหลัง จบด้วยแผนที่ตามรอยและชวนมาเทศกาล"],
      ["Artist K-Street & K-Sounder","ศิลปินไทย/ต่างชาติทำกิจกรรมในเมือง ตอกย้ำ Vibe สากลที่เป็นมิตร"],
      ["Infographic Guide จุดจอดรถ/ร้านอาหาร","3 ขั้น: จอดตรงไหน → ไปโซนไหนก่อน → แวะกินที่ใด พร้อม QR แผนที่"],
      ["Infographic K-BATTLE Line-up","Carousel สายเต้น สายเพลง สายช้อป สายกิน พร้อมเวลา สถานที่ CTA"],
      ["Judge Interview / Jennifer Kim / Painting Show Landmark","กรรมการชวนมา · หนึ่งเสียงชวนทั้งเมือง · เบื้องหลัง Painting Show Before–During–After"]]}]},
  {g:PH,lab:"6 Festival Experience",c:"#b5103a",items:[{id:"ph6",ph:6,w:20,t:"Festival Experience",s:[11,20],e:[11,29],pg:"34–35, 63–64",
    sum:"ถ่ายทอดบรรยากาศจริงทุกวัน ให้คนที่ยังไม่มารีบมา",
    det:[["Highlight K-Street & K-Sounder","Recap รายวัน: คนซ้อม → คนแสดง → คนดู จบด้วยภาพเมืองที่คึกคัก"],
      ["Dance Competition / K-BATTLE Extreme Battle","3 จังหวะ: ก่อนขึ้นเวที → วินาทีเด็ด → ปฏิกิริยาคนดู ระบุผลที่ยืนยันแล้วเท่านั้น"],
      ["Wind Symphony Gala / Jennifer Kim × Siam Event Orchestra","เตรียมเครื่องดนตรี → การแสดง → เสียงปรบมือ + ความประทับใจผู้ชม"],
      ["KOL รีวิว Street Food & Street Fashion","ลองเมนูตีความใหม่ + แฟชั่นแบรนด์พื้นที่ ให้เจ้าของเล่าแรงบันดาลใจ จบด้วยพิกัดบูธจริง"],
      ["Live Stream ≥ 5 ครั้ง · ภาพถ่าย 300 ภาพ","Live ตามตารางจริง + Shot List แยกโฟลเดอร์ตาม 6 Pillars และ 3 แกนเมือง"],
      ["Press Tour + K-EXPO Matching","3 สถานี Creative Maker / Experience / Business Connection · ตามเจ้าของบูธนำเสนอ Buyer ไม่ประกาศดีลที่ยังไม่ยืนยัน"]]}]},
  {g:PH,lab:"7 Sustain City Perception",c:"#4b4b4e",items:[{id:"ph7",ph:7,w:90,t:"Sustain City Perception",s:[11,30],e:[1,10],pg:"34–35, 108",
    sum:"สรุปผลและต่อยอดภาพจำเมืองระยะยาว หลังจบงาน",
    det:[["สกู๊ปใหญ่ “ถอดรหัสมหานคร MICE”","หนังสือพิมพ์ 30 พ.ย.–13 ธ.ค."],["Nation TV ครั้งที่ 10","ถอดบทเรียนโคราชโมเดล สู่ MICE City เทศกาลกระจายรายได้สู่ท้องถิ่น (2 ธ.ค.)"],["The Thought Leaders","“ถอดรหัสมหานครสร้างสรรค์” City Branding และ Impact ของโครงการ (7 ธ.ค.)"],["Short Video ต่อเนื่อง","30 พ.ย. 69 – 10 ม.ค. 70"]]}]},

  {g:"อีเวนต์",lab:"อีเวนต์ในโคราช",c:"#2b2b2e",items:[
    {id:"ev-ws",t:"Workshop",s:[10,16],sum:"Workshop ค้นของดี ที่เมืองมีให้อวด — ค้นหา 10 คุณค่า",pg:"10",det:[["กิจกรรม","คน 100 คนโคราชร่วมค้นหา 10 คุณค่าสร้างสรรค์ · 17–18 ต.ค. สรุปข้อมูลเพื่อสื่อสาร"]]},
    {id:"ev-ks",t:"K-Sounder ดนตรีในสวน",s:[10,24],sum:"กิจกรรมดนตรีในสวน จุดเริ่ม K-Sounder",pg:"58",det:[["ใช้ต่อ","เป็นฉากใน Reel “เมื่อเสียงของคนรุ่นใหม่ กลายเป็นจังหวะของเมือง”"]]},
    {id:"ev-fest",t:"K-BATTLE · K-Sounder · K-EXPO",s:[11,20],e:[11,29],sum:"เทศกาลหลัก 10 วัน",pg:"10, 34",det:[["ไฮไลต์","20–22 เปิดเมือง K-Street/K-Sounder · 23–26 จุดกิจกรรม 7 จุดช่วงเย็น · 27–29 เปิดงานทางการ K-BATx Expo / รอบชิง / Jennifer Kim"]]}]},
  {g:"อีเวนต์",lab:"เวทีนอกพื้นที่",c:"#7b4bd6",items:[
    {id:"ev-nf",t:"Nation Forum",s:[10,20],sum:"ออกบูธอวดเมืองโคราช + ตัวแทน TCEB ขึ้นเวทีเสวนา",pg:"77",det:[["ใช้ต่อ","คอนเทนต์ “อวดเมืองครั้งนี้ เมืองจะได้อะไรกลับไป?” ใน Build the Story"]]},
    {id:"ev-siam",alias:"ph3",t:"บุกสยาม",s:[11,8],sum:"Kick off อวดเมืองโคราชที่สยาม (วันเดียวกับระยะ 3 Siam Launch ย้ายอันใดอันหนึ่ง อีกอันตาม)",pg:"10",det:[["เชื่อมกับ","KOL ระยะ 1 (ศิลปิน/บัญชี reach สูง) และหมุด “บุกสยาม” ในแท็บแผน 3 ระยะ"]]}]},
  {g:"สื่อออฟไลน์",lab:"ทีวี เนชั่นทันข่าวค่ำ (10 ครั้ง)",c:"#e8194c",pg:"176",items:[
    {id:"tv1",t:"ครั้งที่ 1",s:[10,19],sum:"เวิร์กช็อป 10 คุณค่า",pg:"176",det:[["ประเด็น","การเวิร์กช็อป 10 คุณค่าที่สร้างโอกาสของเมืองโคราช พร้อมสัมภาษณ์ ผอ.TCEB และผู้ว่าราชการจังหวัดนครราชสีมา"],["รายการ","เนชั่นทันข่าวค่ำ ช่องเนชั่นทีวี 22 · จันทร์–ศุกร์ 18.00–19.55 น."]]},
    {id:"tv2",t:"ครั้งที่ 2–6",s:[10,26],e:[10,30],sum:"คุณค่าที่สร้างโอกาส ตอนละ 2 คุณค่า",pg:"176",det:[["ประเด็น","ขยายให้เห็นโอกาสทางเศรษฐกิจของเมือง ดึงดูดคนที่สนใจลงทุน"]]},
    {id:"tv3",t:"ครั้งที่ 7",s:[11,2],sum:"ความพร้อมของงาน + ไฮไลต์ K-BATTLE",pg:"176",det:[["ประเด็น","ความพร้อมของการจัดงานและโปรโมทไฮไลต์ พร้อมกิจกรรมของงาน K-BATTLE"]]},
    {id:"tv4",t:"ครั้งที่ 8–9",s:[11,20],e:[11,29],sum:"ไฮไลต์ K-STREET K-SOUNDER K-EXPO ช่วงงาน",pg:"176",det:[["ประเด็น","ภาพคู่ขนานบนเวทีกิจกรรมและเสียงของนักท่องเที่ยวกับประชาชนในโคราช"],["ต้องแก้ในเด็ค","หน้า 176 เขียน 20–29/10/69 ที่ถูกคือ 20–29/11/69"]]},
    {id:"tv5",t:"ครั้งที่ 10",s:[12,2],sum:"ถอดบทเรียนโคราชโมเดล",pg:"176",det:[["ประเด็น","ถอดบทเรียนความสำเร็จของโคราชโมเดล สู่ MICE City เทศกาลกระจายรายได้สู่ท้องถิ่น"]]}]},
  {g:"สื่อออฟไลน์",lab:"ทีวี TVC/Scoop ช่อง 7 (ตาม TOR)",c:"#f05a85",pg:"176",items:[
    {id:"tv7",t:"TVC/Scoop: ปรากฏการณ์พลิกเมืองโคราช",s:[11,13],e:[11,19],ch:["TV"],sum:"Thematic VDO + กำหนดการ ไฮไลต์ และ K-EXPO เจรจาธุรกิจ",pg:"176",det:[["ประเด็น","ปรากฏการณ์พลิกเมืองโคราช สู่มหานครแห่งโอกาส ยกระดับ Street Culture สร้างเศรษฐกิจสร้างสรรค์ และ K-EXPO ดึงผู้ประกอบการเปิดการเจรจาธุรกิจ"],["รายละเอียด","นำเสนอ Thematic VDO พร้อมกำหนดการและไฮไลต์ K-BATTLE เน้นเศรษฐกิจ MICE และกระจายเศรษฐกิจในเมือง"],["รายการ","เรื่องเล่าเช้านี้ จ–ศ 06.00–08.30 / ส–อา 10.15–12.30 · สนามข่าว 7 สี จ–ศ 07.30–09.00"],["เผยแพร่ช่วง","13–19 พ.ย. (เด็คเขียน 13-19 Nov 2027 ต้องแก้เป็น 2026)"]]}]},
  {g:"สื่อออฟไลน์",lab:"ทีวี Scoop ช่อง 7 (Special offer FREE)",c:"#f05a85",pg:"176",items:[
    {id:"tv8",t:"Scoop: โคราชจัดใหญ่! เทศกาลสตรีทระดับโลก",s:[11,13],e:[11,19],ch:["TV"],sum:"ศิลปิน/อินฟลูฯ ยกทัพมาโคราช 20–29 พ.ย. + Activation ช็อปและแต้ม",pg:"176",det:[["ประเด็น","โคราชจัดใหญ่! เทศกาลสตรีทระดับโลก พร้อมศิลปินและอินฟลูเอ็นเซอร์แถวหน้า เตรียมยกทัพบุกนครราชสีมา 20–29 พ.ย."],["รายละเอียด","Thematic VDO ฉายภาพโคราช MICE City ไฮไลต์ K-BATTLE ศิลปิน/อินฟลูฯ ที่จะมา กิจกรรมที่ผู้ชมร่วมได้ และ Activation ช็อปและแต้ม ลุ้นรางวัล"],["เผยแพร่ช่วง","13–19 พ.ย. (เด็คเขียน 2027 ต้องแก้)"]]}]},
  {g:"สื่อออฟไลน์",lab:"OOH ป้าย + จอ (≥20 จุด)",c:"#2b2b2e",pg:"177–186",items:[
    {id:"ooh",t:"OUT OF HOME ขึ้นจริง",s:[11,1],e:[11,30],ch:["OOH"],sum:"KV รวม 3 งาน + VDO Motion 15–30 วิ · กรุงเทพฯ/สนามบิน → เส้นทางเข้าโคราช → ในเมือง",pg:"177–186",det:[["กลยุทธ์ภูมิศาสตร์","กรุงเทพฯ/สนามบิน = Make People Know · เส้นทางเข้าโคราชและจังหวัดรอบข้าง = Make People Plan · โคราช/สื่อท้องถิ่น = Make People Join"],["1: Static picture","ใช้ KV รวมของ K-BATTLE International เป็น Hero Visual รวม 3 งานในภาพเดียว"],["2: VDO Motion 15–30 วิ","Hook: นำไฮไลต์ทั้ง 3 งานขึ้นก่อน → K-STREET: Breakdance, Rap, DJ, Extreme Sports และศิลปิน + Agenda → K-SOUNDER: คอนเสิร์ต Orchestra, Jazz และศิลปิน + Agenda → K-EXPO: สินค้า Creative Industry, Exhibition, Business Networking + Agenda → CALL TO ACTION: SAVE THE DATE 20–29 พ.ย.นี้ ที่โคราช"],["จุดติดตั้ง","≥20 จุด โคราช + ≥5 จังหวัดใกล้เคียง (TOR 6.3.3(2)) · จอสนามบิน 217 จอ (ดอนเมือง 120 + เชียงใหม่ ภูเก็ต หาดใหญ่ เชียงราย) · ทางลงทางด่วนอนุสาวรีย์ชัยฯ · อโศก-สุขุมวิท 21"],["ช่วงขึ้นสื่อ","1–30 พ.ย."]]}]},
  {g:"สื่อออฟไลน์",lab:"หนังสือพิมพ์ (30 ครั้ง)",c:"#6f6f75",pg:"174",items:[
    {id:"np1",t:"เดลินิวส์ · กรุงเทพธุรกิจ · ฐานฯ",s:[10,17],e:[10,23],sum:"โอกาสทางเศรษฐกิจจาก 10 คุณค่า",pg:"174",det:[["ประเด็น","วิเคราะห์ “โอกาสทางเศรษฐกิจจาก 10 คุณค่า” เชิญนักธุรกิจและนักคิดรุ่นใหม่ในโคราชร่วมวงสนทนา"]]},
    {id:"np2",t:"ไทยรัฐ · เดลินิวส์ · กรุงเทพธุรกิจ",s:[10,24],e:[10,30],sum:"ความพร้อมของ K-BATTLE + สัมภาษณ์ TCEB",pg:"174",det:[["ประเด็น","ปูพรมข่าวความพร้อมของ K-BATTLE และสัมภาษณ์ TCEB ถึงยุทธศาสตร์เปลี่ยนโคราชสู่มหานครแห่งโอกาส"]]},
    {id:"np3",t:"หนังสือพิมพ์ท้องถิ่น",s:[11,1],e:[11,29],sum:"“โคราชโมเดล” พลิกโฉมพลังสร้างสรรค์",pg:"174, 188",det:[["ประเด็น","“โคราชโมเดล” พลิกโฉมพลังสร้างสรรค์สู่มหานครแห่งโอกาส ผ่าน K-BATTLE และ 10 คุณค่า · ช่วงงาน: เทศกาลปลุกเศรษฐกิจชุมชนคึกคัก"],["สื่อ","โคราชคนอีสาน · เดลินิวส์ · กรุงเทพธุรกิจ · ฐานเศรษฐกิจ · ปทุมมาลัย · โคราชเอ็กเซ็คคิวทีฟ · เสียงภูพาน"]]},
    {id:"np4",t:"สกู๊ปใหญ่ ถอดรหัสมหานคร MICE",s:[11,30],e:[12,13],sum:"สกู๊ปวิเคราะห์หลังงาน",pg:"174",det:[["ประเด็น","สกู๊ปวิเคราะห์ใหญ่ “ถอดรหัสมหานคร MICE”"]]}]},
  {g:"สื่อออฟไลน์",lab:"Press Tour",c:"#4b4b4e",pg:"6.3.1",items:[
    {id:"pt1",t:"สื่อไลฟ์สไตล์",s:[11,19],e:[11,20],sum:"สื่อ/อินฟลูฯ ไลฟ์สไตล์และสตรีท 15–20 คน",pg:"6.3.1",det:[["โปรแกรม","ชมการเพ้นต์กราฟฟิตี้ของศิลปินมือบอนที่ประตูเมือง ร่วมงานสถาปนิกอีสาน (เชิญสื่อท้องถิ่น) และเที่ยวถนนสตรีทฟู้ดโคราช"]]},
    {id:"pt2",t:"สื่อแมส/ธุรกิจ",s:[11,26],e:[11,27],sum:"สื่อแมส ภาษาอังกฤษ และธุรกิจ 20–30 คน (Option 2: 26–28 เช้า)",pg:"6.3.1",det:[["โปรแกรม","Skywalk เขาพริก รถไฟความเร็วสูง งานพืชสวนโลก M6 Korat Geopark กังหันพลังงานสะอาด · ดูงานนวนคร Zero Waste · เวิร์กช็อป K-SOUNDER · พิธีเปิด K-EXPO (เซ็นทรัลโคราช) และ K-BATTLE (ลานย่าโม)"]]}]},
  {g:"ออนไลน์",lab:"VDO / Podcast สำนักข่าว",c:"#7b4bd6",pg:"197",items:[
    {id:"on1",t:"SPRiNG BOARD",s:[10,26],sum:"เปลี่ยนเมืองโคราชด้วย 10 คุณค่าที่สร้างโอกาส",pg:"197",det:[["ประเด็น","ทำยังไงให้เมืองโอบรับและเปิดโอกาสให้คนรุ่นใหม่ มาลงทุน มาเที่ยว มาอยู่"]]},
    {id:"on2",t:"Point of View",s:[11,21],e:[11,26],sum:"ประวัติศาสตร์ Art & Performance โคราช",pg:"197",det:[["ประเด็น","จากภาพเขียนเขาจันทร์งามสู่สตรีทคัลเจอร์ปัจจุบัน เสน่ห์พหุวัฒนธรรมจากเมืองเก่าสู่เมืองใหม่"]]},
    {id:"on3",t:"Thought Leaders",s:[12,7],sum:"ถอดรหัสมหานครสร้างสรรค์",pg:"197",det:[["ประเด็น","เจาะลึก City Branding และ Impact ของโครงการ ผลกระทบทางเศรษฐกิจ และโมเดล MICE City (กรุงเทพธุรกิจ)"]]}]},
  {g:"ออนไลน์",lab:"Thematic VDO + Ads",c:"#a9a9b0",pg:"82, 196",items:[
    {id:"ads",t:"ปล่อย Thematic VDO + ซื้อ Ads",s:[11,2],e:[11,29],sum:"เป้า 5M views / 2M reach (ตั้งเป้าภายใน 7M views / 3M reach)",pg:"82, 196",det:[["แพลตฟอร์ม","Facebook · Instagram · TikTok · YouTube"],["กลุ่มเป้าหมาย","Business Investors · Travel & Culture · Local & Regional"]]}]},
  {g:"ออนไลน์",lab:"Short Video / Reels ชุดหลัก",c:"#e8194c",pg:"104–108",items:[
    {id:"sv1",t:"Short Video 8 ชิ้น · ก่อนงาน",s:[10,12],e:[10,31],ch:["Facebook","TikTok"],list:1,sum:"เปิดตัวแคมเปญ + เวิร์กช็อป + ต้นทาง K-Street/K-Sounder/K-EXPO",pg:"104–105",det:[["#1 โคราชมีอะไรให้อวด? มากกว่าที่คุณเคยเห็น","Reel เปิดตัวต่อจาก Main KV พาเห็นพลังสร้างสรรค์ผ่านภาพจริงของคน ผลงาน วัฒนธรรมร่วมสมัย"],["#2 เมืองนี้มีอะไรดี? ให้คนโคราชเป็นคนอวด","เวิร์กช็อป 10 กลุ่มเลือก Creative Asset บอก “มีดีตรงไหน/ต่อยอดอะไรได้” ตัดเป็นชุด 10 เรื่อง"],["#3 โคราชอวดสเต็ป! ซีนความมันส์กลางลานย่าโม","Flash Mob Street Dance กลางลานย่าโม สร้าง Viral Moment"],["#4 จากลานซ้อมเล็ก ๆ สู่เวทีที่ความฝันได้เฉิดฉาย","ต้นทาง K-Street เบื้องหลังนักเต้น ชวนมาชมโชว์จริง"],["#5 เมื่อเสียงของคนรุ่นใหม่ กลายเป็นจังหวะของเมือง","ต้นทาง K-Sounder จากดนตรีในสวน 24 ต.ค."],["#6 จากแบรนด์เล็ก ๆ สู่โอกาสทางธุรกิจที่ใหญ่กว่า","3 Young Entrepreneurs เชื่อมสู่ K-EXPO"],["#7 เมืองที่คุณคุ้นเคย กับเรื่องราวที่คุณอาจไม่เคยรู้","คนสร้างสรรค์ 4 กลุ่ม: นักออกแบบ ศิลปิน Street Art เจ้าของแบรนด์ ผู้สร้างคอมมูนิตี้"],["#8 ของดีโคราชที่คุณอยากอวด แต่คนอื่นอาจยังไม่รู้จัก?","สัมภาษณ์ตัวแทน 10 กลุ่ม Workshop คำถามเดียว ชวนคอมเมนต์"]]},
    {id:"sv3",t:"Short Video 15 ชิ้น · ชวนมางาน",s:[11,1],e:[11,19],ch:["Facebook","TikTok"],list:1,sum:"นับถอยหลัง เรื่องคนกลับบ้าน บุกสยาม ศิลปิน กรรมการ",pg:"105–107",det:[["#9 ปักหมุดไว้ แล้วมาเจอโคราชกัน","วิดีโอนับถอยหลัง ไฮไลต์เต้น ดนตรี ศิลปะ (เด็คเขียนวันงาน 26–29 ต้องแก้เป็น 20–29)"],["#23 จากคนที่เคยออกไปหาโอกาส สู่คนที่กลับมาสร้างโอกาส","Creator/ผู้ประกอบการรุ่นใหม่ที่กลับมาทำงานในโคราช"],["#24 โคราชยกจังหวะมาโชว์กลางสยาม","Street Dance หยุดคนกรุงเทพฯ ปฏิกิริยาและเสียงนักเต้นโคราช"],["#25 ที่มาของโครงการอวดเมืองโคราช","เล่าที่มาและเป้าหมายโครงการ"],["#26 60 วินาทีที่จะทำให้รู้จักสตรีทโคราช","Reel ตัด Beat กลอง-ท่าเต้น-เสียงเชียร์ จบด้วยภาพ K-BATTLE และวันงาน"],["#27 ทำของเก่งอย่างเดียวพอไหม? เมื่อโคราชเริ่มสร้างแบรนด์","ผลิตภัณฑ์จริง → ขายความคิดสร้างสรรค์อย่างไร → Creative Economy"],["#28 กลับโคราช แล้วสร้างชีวิตแบบที่อยากอยู่","คนรุ่นใหม่ 1 วันใน Creative Space → ชุมชน → ทำไมเลือกอยู่"],["#29 อวดเมืองถึงหน้าบ้าน: 3 เส้นทางชวนออกมาเจอกัน","Caravan 3 เส้นทาง เก็บคำตอบ “โคราชมีอะไรให้อวด?”"],["#30 กลับบ้านมาเปิดร้าน แล้วได้อะไรมากกว่าร้านหนึ่งร้าน","เจ้าของร้านสร้างสรรค์ที่กลับโคราช"],["#31 พื้นที่เล็ก ๆ ที่ทำให้คนอยากอยู่ต่อ","Creative Space หนึ่งแห่งและกิจกรรมที่คนมารวมตัว"],["#32 โคราชหนึ่งวัน แบบไม่ต้องเที่ยวตามใคร","Creator เลือก 4 จุดจาก 4 Pillars จบด้วยแผนที่ตามรอย"],["#33–34 ศิลปินมาผสานกับโลคอล","ศิลปินไทย/ต่างชาติเตรียมตัวหรือทำกิจกรรมในเมือง"],["#35 กรรมการชวนมา: เวทีนี้ต้องเห็นด้วยตา","ถามกรรมการ “โชว์แบบไหนที่อยากเห็นบนเวที?”"],["#36 หนึ่งเสียงชวนทั้งเมืองมาฟัง","Jennifer Kim เล่าว่าคนดูจะได้สัมผัสอะไร"]]},
    {id:"sv4",t:"Short Video 23 ชิ้น · ช่วงงาน",s:[11,20],e:[11,29],ch:["Facebook","TikTok"],list:1,sum:"Recap รายวัน ไฮไลต์เวที KOL และ K-EXPO",pg:"105, 107–108",det:[["#10 จากเทศกาลสร้างสรรค์ สู่โอกาสใหม่ของเมืองโคราช","TCEB อธิบาย City Expo Model แบบภาษาคนทั่วไป"],["#11 อวดเมืองครั้งนี้ เมืองจะได้อะไรกลับไป?","ประเด็นจากเวที Nation Forum ตัด 3 ประเด็นเป็น Short Clips"],["#37 กำแพงนี้กำลังกลายเป็นงานศิลป์","Timelapse กำแพงเปล่าสู่ผลงาน"],["#38 ก่อนจะเป็นแลนด์มาร์ก ต้องมีคนลงมือวาด","Painting Show Before–During–After"],["#39–47 เมืองนี้มีจังหวะ: 1 วันใน K-Street & K-Sounder (recap รายวัน)","เปิดด้วยเสียงจริงจากเวที ไล่คนซ้อม-คนแสดง-คนดู จบด้วยภาพเมืองคึกคัก"],["#48 จังหวะเดียว คนทั้งฮอลล์ลุกขึ้นเชียร์","Dance Competition 3 ช่วง"],["#49 ค่ำคืนที่เสียงดนตรีพาเมืองมาพบกัน","Wind Symphony Gala"],["#50 เมื่อเสียงร้องเจอกับวงออร์เคสตรา","Jennifer Kim × Siam Event Orchestra"],["#51 เดือดทุกจังหวะ: ศึกนี้ไม่มีใครยอมใคร","K-BATTLE Extreme Battle 3 Beat"],["#52 กินของใหม่ ใส่ของเท่: โคราชในสไตล์วันนี้","KOL ลองเมนู/แฟชั่นแบรนด์พื้นที่ จบด้วยพิกัดบูธ"],["#53 เมื่อคนทำของ ได้เจอคนมองเห็นโอกาส","K-EXPO Matching ตามเจ้าของบูธพบ Buyer"],["#54–56 ลองทำเอง แล้วจะรู้ว่าโคราชมีอะไรสนุก","แยก Reel ลอยกระทง / Brand Master / Workshop"]]},
    {id:"sv5",t:"Short Video 10 ชิ้น · หลังงาน",s:[11,30],e:[1,10],ch:["Facebook","TikTok"],list:1,sum:"สรุปผล เมืองได้อะไรต่อ และโอกาสระยะยาว",pg:"108",det:[["#57 จบเทศกาลแล้ว เมืองได้อะไรต่อ?","สัมภาษณ์ TCEB และตัวแทนเมือง 3 คำถาม ไม่สรุป Impact เกินหลักฐาน"],["#58 คนมาเห็นอะไร คนขายได้เจอใคร คนเมืองได้อะไร?","ตัด 3 เสียง ผู้มาเยือน Seller คนโคราช"],["#59–63 จากวันที่เมืองอวดเอง สู่โอกาสที่เริ่มต้น (5 ตอน)","Recap Creative Assets → คนมาสัมผัส → Buyer/Creator → ผลลัพธ์ที่ยืนยันได้"],["#64 คนรุ่นใหม่ไม่ได้สร้างโอกาสเอง แล้วใครจะสร้าง?","จาก M6/รถไฟ สู่ Creative Entrepreneur"],["#65 โคราชเป็นฉากได้ แล้วเป็นโอกาสให้คนทำงานได้ไหม?","Film Destination"],["#66 บ้านหลังที่มีพื้นที่ให้เราเป็นตัวเอง","Creative Community 1 แห่ง"]]}]},
  {g:"ออนไลน์",lab:"Reel ซีรีส์ 10 ของดีที่เมืองมี",c:"#f05a85",pg:"105",items:[
    {id:"sv2",t:"Reel 10 ตอน · 10 ของดีที่เมืองมี",s:[10,26],e:[11,19],ch:["Facebook","TikTok"],list:1,sum:"ตอนละ 1 คุณค่า จาก 10 คุณค่าที่ค้นพบในเวิร์กช็อป",pg:"105",det:[["#12–21 10 ของดีที่เมืองมี เพื่อต่อยอดโอกาสให้กับเมือง (10 ตอน)","แต่ละตอนเปิด “รู้ไหมโคราชมี…” พาดูเบื้องหลัง แนวคิด ศักยภาพ ปิดด้วยโอกาสต่อยอด ธุรกิจ/ท่องเที่ยว/คุณภาพชีวิต"]]}]},
  {g:"ออนไลน์",lab:"KOL 50 คน (บอร์ดนี้)",c:"#e8194c",tab:"plan",lock:true,items:[
    {id:"kol1",t:"ระยะ 1",s:[11,6],e:[11,12],sum:"ปักหมุดวันงาน",det:[["แก้ที่","แท็บแผน 3 ระยะ / ตารางโพสต์"]]},{id:"kol2",t:"ระยะ 2",s:[11,13],e:[11,19],sum:"ตัดสินใจเดินทาง",det:[["แก้ที่","แท็บแผน 3 ระยะ / ตารางโพสต์"]]},{id:"kol3",t:"ระยะ 3",s:[11,20],e:[11,29],sum:"มาแล้ว-มาต่อ-มาซ้ำ",det:[["แก้ที่","แท็บแผน 3 ระยะ / ตารางโพสต์"]]}]},
  {g:"ออนไลน์",lab:"Nano Week (โพสต์ที่ 2)",c:"#7b4bd6",tab:"plan",lock:true,items:[
    {id:"nw",t:"Nano 15 คน",s:[11,13],e:[11,19],sum:"Nano 15 คน โพสต์ที่ 2 แนวใหม่ ห่างจากโพสต์แรก ≥3 วัน",det:[["แก้ที่","แท็บแผน 3 ระยะ (การ์ด Nano Week)"]]}]},
  {g:"ออนไลน์",lab:"หน้างาน: Live / ภาพถ่าย",c:"#b5103a",pg:"64",items:[
    {id:"live",t:"Live ≥5 ครั้ง · ภาพถ่าย 300 ภาพ",s:[11,20],e:[11,29],ch:["Facebook","เว็บ"],sum:"Live ตามตารางจริง + Shot List ภาพ 300 ภาพ",pg:"64",det:[["Live Stream ≥ 5 ครั้ง","จัด Live 5 ช่วงตามตารางจริง แนะนำสิ่งที่จะเห็น สัมภาษณ์คนทำ/ผู้ชมระหว่างพัก พร้อมกราฟิกตารางกิจกรรม (TOR: ≥5 จุด × ≥1 ชม. รวม ≥10,000 Live Viewers)"],["ภาพถ่าย 300 ภาพ","Shot List ครบ คนทำงานสร้างสรรค์ งานศิลป์ สินค้า/บูธ ผู้ร่วมงาน พื้นที่ โมเมนต์เชื่อมธุรกิจ แยกโฟลเดอร์ตาม 6 Pillars และ 3 แกนเมือง"]]}]},
];
const ITEMS={}; PM_ROWS.forEach(r=>r.items.forEach(it=>{ it.row=r; ITEMS[it.id]=it; }));
const CHS=["Facebook","TikTok","Instagram","YouTube","เว็บ","LINE KORAT POINT","TV","หนังสือพิมพ์","OOH","Press Tour","On-ground"];
const STS=[["plan","วางแผน"],["prod","กำลังผลิต"],["review","รออนุมัติ"],["live","เผยแพร่แล้ว"]];
function defCh(it){ if(it.ch) return it.ch; const l=it.row.lab, g=it.row.g; if(g===PH) return []; if(/ทีวี/.test(l)) return ["TV"]; if(/หนังสือพิมพ์/.test(l)) return ["หนังสือพิมพ์"]; if(/Press/.test(l)) return ["Press Tour"]; if(/Podcast/.test(l)) return ["YouTube","Facebook"]; if(/Ads/.test(l)) return ["Facebook","Instagram","TikTok","YouTube"]; if(/KOL|Nano/.test(l)) return ["TikTok","Facebook","Instagram"]; if(g==="อีเวนต์") return ["On-ground"]; return []; }

/* ===== ที่เก็บ: ชีตแท็บ Posts · "pm:<id>" = วันที่ · "pmc:<id>:<n>" = เนื้อหาที่แก้ (JSON แบ่งชิ้นละ ≤1500 ตัวอักษร เพราะช่องแนวคอนเทนต์เก็บได้ 2000) ===== */
const P=()=>K.posts()||{};
function who(){ try{ return sessionStorage.getItem("pm_who")||""; }catch(e){ return ""; } }
function ovRaw(id){ const p=P()["pm:"+id]; if(!p||!p.brief) return null; try{ return Object.assign(JSON.parse(p.brief)||{},{by:p.by}); }catch(e){ return null; } }
function ov(id){ const o=ovRaw(id); return o&&o.s?o:null; }
const ago=t=>{ if(!t) return ""; const d=new Date(t); return `${d.getDate()} ${MON[d.getMonth()+1]} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };
// บันทึกการแก้ไขของแต่ละรายการ: เนื้อหา (lg ใน pmc) + วันที่ (pm:) + ติ๊ก (pmx:) — เรียงใหม่สุดก่อน
function logOf(it){ const L=[]; const c=readC(it.id); if(c&&c.lg) c.lg.forEach(x=>L.push(x));
  const o=ovRaw(it.alias||it.id); if(o&&o.at) L.push({f:o.s?`วันที่ → ${fmtRange(o.s,o.e||o.s)}`:"คืนวันที่ตามเด็ค",by:o.by,at:o.at});
  const p=P()["pmx:"+it.id]; if(p&&p.brief){ try{ const x=JSON.parse(p.brief); if(x.at) L.push({f:x.m||"ติ๊กลงแล้ว",by:p.by,at:x.at}); }catch(e){} }
  return L.filter(x=>x.at).sort((a,b)=>b.at-a.at); }
const logLine=x=>`<span class="f">${esc(x.f)}</span> · ${esc(x.by||"—")} · ${ago(x.at)}`;
function readC(id){ let str="", n=0, by=""; for(;n<30;n++){ const p=P()["pmc:"+id+":"+n]; if(!p||!p.brief) break; str+=p.brief; by=p.by||by; } if(!str) return null; try{ return Object.assign(JSON.parse(str),{_by:by}); }catch(e){ return null; } }
function dates(it){ if(it.alias&&ITEMS[it.alias]) return dates(ITEMS[it.alias]); const o=ov(it.id); return o?{s:o.s,e:o.e||o.s,by:o.by,ch:true}:{s:it.s,e:it.e||it.s,ch:false}; }
function eff(it){ const c=readC(it.id)||{}; return {t:c.t||it.t, sum:c.sum!=null?c.sum:(it.sum||""), ch:c.ch||defCh(it), st:c.st||"plan", own:c.own||"", det:c.det||it.det||[], note:c.note||"", edited:!!c.t||!!c.det||!!c.sum||!!c.ch||!!c.st||!!c.own||!!c.note, by:c._by||""}; }
// ติ๊ก "ลงแล้ว": "pmx:<id>" = {a:1} (ทั้งรายการ) หรือ {u:["12","13",…]} (รายชิ้นของคลิปสั้น)
const track=it=>it.row.g!==PH&&!it.row.lock;
function units(it,E){ if(!it.list) return null; const u=[]; (E||eff(it)).det.forEach((x,i)=>{ const m=String(x[0]).match(/^#(\d+)(?:\s*[–-]\s*(\d+))?/); if(m){ for(let n=+m[1];n<=(m[2]?+m[2]:+m[1]);n++) u.push(String(n)); } else u.push("i"+i); }); return u; }
function doneOf(id){ const p=P()["pmx:"+id]; let o={}; if(p&&p.brief){ try{ o=JSON.parse(p.brief)||{}; }catch(e){} } return {a:!!o.a,u:new Set(o.u||[]),by:p&&p.brief?p.by:""}; }
function prog(it,E){ if(!track(it)) return null; const D=doneOf(it.id), U=units(it,E); if(!U) return {n:D.a?1:0,t:1,D}; return {n:U.filter(x=>D.u.has(x)).length,t:U.length,D,U}; }
let DQ=Promise.resolve();
function saveDone(id,obj,msg){ const it=ITEMS[id]; obj.at=Date.now(); obj.m=msg; const rec=recOf("pmx:"+id,it.t,JSON.stringify(obj)); P()[rec.key]=rec; renderPM(); try{ logEv("pm-done",id+" "+msg); }catch(x){}
  DQ=DQ.then(()=>K.api("setPost",[rec])).then(()=>K.toast(`${msg}: ${it.t} — ทุกคนเห็นแล้ว`)).catch(err=>K.toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err))); }
function toggleAll(id){ const it=ITEMS[id], g=prog(it,eff(it)); if(!g) return; const full=g.n===g.t;
  saveDone(id,g.U?{u:full?[]:g.U}:{a:full?0:1},full?"เอาติ๊กออก":"ติ๊กลงแล้ว"); }
function toggleUnit(id,u){ const it=ITEMS[id], D=doneOf(id); const on=D.u.has(u); on?D.u.delete(u):D.u.add(u);
  saveDone(id,{u:[...D.u]},`${on?"เอาติ๊กออก":"ติ๊กลงแล้ว"} ชิ้น ${/^i/.test(u)?"":"#"+u}`); }
// ให้แท็บอื่นใช้วันจาก PLAN MEDIA (หมุดบุกสยาม/TVC/Press Tour บนไทม์ไลน์ KOL)
window.pmNovDay=id=>{ const it=ITEMS[id]; if(!it) return null; const d=dates(it); return d.s[0]===11?d.s[1]:null; };

function putPost(rec){ const Pm=P(), prev=Pm[rec.key]; Pm[rec.key]=rec; return K.api("setPost",[rec]).catch(err=>{ if(prev) Pm[rec.key]=prev; else delete Pm[rec.key]; throw err; }); }
const recOf=(key,name,brief)=>({key,kol:"PLAN MEDIA",name,day:0,format:"pm",brief,status:"plan",link:"",by:who()});
function saveDates(id,s,e,quiet){ if(ITEMS[id]&&ITEMS[id].alias) id=ITEMS[id].alias; const it=ITEMS[id];
  const pr=putPost(recOf("pm:"+id,it.t,JSON.stringify(s?{s,e,at:Date.now()}:{at:Date.now()}))); renderPM(); try{ K.render(); }catch(x){} try{ logEv("pm-move",id+" "+(s?fmtRange(s,e):"reset")); }catch(x){}
  return pr.then(()=>{ if(!quiet) K.toast(s?`ย้าย ${it.t} → ${fmtRange(s,e)} แล้ว`:`คืนวันที่ ${it.t} ตามเด็คแล้ว`); }).catch(err=>{ renderPM(); K.toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err)); }); }
function saveContent(id,obj,what){ const it=ITEMS[id]; const prev=(readC(id)||{}).lg||[]; obj=Object.assign({},obj||{},{lg:[{f:what||(obj?"แก้เนื้อหา":"คืนเนื้อหาตามเด็ค"),by:who(),at:Date.now()}].concat(prev).slice(0,8)}); const reset=!what&&Object.keys(obj).length===1; const str=obj?JSON.stringify(obj):""; const parts=[]; for(let i=0;i<str.length;i+=1500) parts.push(str.slice(i,i+1500));
  let old=0; while(P()["pmc:"+id+":"+old]&&P()["pmc:"+id+":"+old].brief) old++;
  const jobs=[]; for(let i=0;i<Math.max(parts.length,old);i++) jobs.push(recOf("pmc:"+id+":"+i,it.t,parts[i]||""));
  jobs.forEach(r=>{ P()[r.key]=r; }); renderPM(); try{ logEv("pm-edit",id); }catch(x){}
  return jobs.reduce((pr,r)=>pr.then(()=>K.api("setPost",[r])),Promise.resolve()).then(()=>K.toast(!reset?`บันทึก ${obj.t||it.t} แล้ว — ทุกคนเห็นแล้ว`:`คืนเนื้อหา ${it.t} ตามเด็คแล้ว`)).catch(err=>K.toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err))); }

function pmOpenGate(){ const m=$("#pmgate"); $("#pm-code").value=""; $("#pm-name").value=who()||K.reviewer()||""; $("#pm-err").hidden=true; m.hidden=false; setTimeout(()=>$("#pm-code").focus(),50); }
function pmLogin(){ const code=$("#pm-code").value.trim(), name=$("#pm-name").value.trim();
  if(code!==PM_CODE){ $("#pm-err").textContent="รหัสไม่ถูกต้อง"; $("#pm-err").hidden=false; $("#pm-code").select(); return; }
  if(!name){ $("#pm-err").textContent="กรุณาใส่ชื่อ"; $("#pm-err").hidden=false; $("#pm-name").focus(); return; }
  try{ sessionStorage.setItem("pm_who",name); }catch(e){}
  $("#pmgate").hidden=true; try{ logEv("pm-login",name); flushLog(); }catch(e){} setTab("pm"); }
function pmLogout(){ try{ sessionStorage.removeItem("pm_who"); }catch(e){} try{ logEv("pm-logout",""); }catch(e){} setTab("review"); }
window.openPmGate=pmOpenGate;

let DRAG=null, EDIT=null, OPEN=null, FILTER="all", Q="", HIDE=false;
window.PM_BUSY=()=>!!DRAG||!!EDIT;
const col=i=>i+2; // คอลัมน์ 1 = ป้ายแถว
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const GROUPS=[["all","ทั้งหมด"],[PH,"7 Phase"],["อีเวนต์","อีเวนต์"],["สื่อออฟไลน์","ออฟไลน์"],["ออนไลน์","ออนไลน์"]];
function barHTML(it,row,r){ const d=dates(it), E2=eff(it); const S=pmIdx(...d.s), E=pmIdx(...d.e); const s=clamp(S,0,PM_DAYS-1), e=clamp(E,0,PM_DAYS-1);
  const one=s===e, isPh=row.g===PH, G=prog(it,E2), full=G&&G.n===G.t, label=isPh?fmtRange(d.s,d.e):(full?"✓ ":"")+E2.t+(G&&G.t>1?` · ${G.n}/${G.t}`:"");
  const tip=`${E2.t} · ${fmtRange(d.s,d.e)} — ${E2.sum}${row.lock?" (วันตามแท็บแผน 3 ระยะ)":" · ลากเพื่อย้ายวัน / ลากขอบเพื่อยืดหด / กดเพื่อดูรายละเอียด"}`;
  return `<div class="pm-bar${one?" pt":e-s<3?" sh":""}${isPh?" ph":""}${d.ch?" ch":""}${row.lock?" lk":""}${E>PM_DAYS-1?" over":""}${OPEN===it.id?" on":""}${full?" dn":""}" data-id="${it.id}" style="grid-row:${r};grid-column:${col(s)}/${col(e)+1};--c:${row.c}${G?`;--p:${Math.round(G.n/G.t*100)}%`:""}" title="${esc(tip)}">${row.lock?"":`<i class="hl"></i><i class="hr"></i>`}<span>${esc(label)}</span></div>`; }

const chip=c=>`<span class="pm-ch" data-c="${esc(c)}">${esc(c)}</span>`;
const stPill=st=>{ const x=STS.find(a=>a[0]===st)||STS[0]; return `<span class="pm-st st-${x[0]}">${x[1]}</span>`; };
function dateTile(d){ const one=d.s[0]===d.e[0]&&d.s[1]===d.e[1]; return `<div class="pm-dt"><b>${d.s[1]}</b><span>${MON[d.s[0]]}</span>${one?"":`<em>→ ${d.e[1]} ${MON[d.e[0]]}</em>`}</div>`; }
function detBody(it,E){ const D=track(it)?doneOf(it.id):null; if(!E.det.length) return `<p class="pm-empty">ยังไม่มีรายละเอียด — กด “แก้ไข” เพื่อเพิ่ม</p>`;
  if(it.list) return `<ol class="pm-list">${E.det.map((x,i)=>{ const m=String(x[0]).match(/^#([\d–-]+)\s*(.*)$/); const r=String(x[0]).match(/^#(\d+)(?:\s*[–-]\s*(\d+))?/); const us=[]; if(r){ for(let n=+r[1];n<=(r[2]?+r[2]:+r[1]);n++) us.push(String(n)); } else us.push("i"+i);
    const all=D&&us.every(u=>D.u.has(u));
    return `<li class="${all?"dn":""}">${D?`<div class="tks">${us.map(u=>`<button type="button" class="pm-tk${D.u.has(u)?" on":""}" data-tk="${it.id}" data-u="${u}" aria-pressed="${D.u.has(u)}" title="${D.u.has(u)?"ลงแล้ว — กดเพื่อเอาติ๊กออก":"กดเมื่อลงแล้ว"}">${D.u.has(u)?"✓":""}<span>${/^i/.test(u)?"•":u}</span></button>`).join("")}</div>`:`<span class="no">${m?esc(m[1]):"•"}</span>`}<div><b>${esc(m?m[2]:x[0])}</b>${x[1]?`<p>${esc(x[1])}</p>`:""}</div></li>`; }).join("")}</ol>`;
  return `<dl class="pm-dl">${E.det.map(x=>`<dt>${esc(x[0])}</dt><dd>${esc(x[1]||"")}</dd>`).join("")}</dl>`; }
function editorHTML(it,E,d){ const iso=a=>`${yOf(a[0])}-${String(a[0]).padStart(2,"0")}-${String(a[1]).padStart(2,"0")}`;
  return `<form class="pm-ed" data-id="${it.id}">
    <label class="w2">ชื่อหัวข้อ<input name="t" value="${esc(E.t)}" maxlength="120"></label>
    <label>เริ่ม<input type="date" name="s" value="${iso(d.s)}" ${it.row.lock?"disabled":""}></label><label>ถึง<input type="date" name="e" value="${iso(d.e)}" ${it.row.lock?"disabled":""}></label>
    <label class="w2">สรุปสั้น (1 บรรทัด)<input name="sum" value="${esc(E.sum)}" maxlength="200"></label>
    <div class="w2"><span class="lb">ช่องทาง</span><div class="pm-chs">${CHS.map(c=>`<label class="pm-cb"><input type="checkbox" name="ch" value="${esc(c)}"${E.ch.includes(c)?" checked":""}><span>${esc(c)}</span></label>`).join("")}</div></div>
    <label>สถานะ<select name="st">${STS.map(x=>`<option value="${x[0]}"${x[0]===E.st?" selected":""}>${x[1]}</option>`).join("")}</select></label>
    <label>ผู้รับผิดชอบ<input name="own" value="${esc(E.own)}" maxlength="60" placeholder="เช่น ทีมคอนเทนต์ / ชื่อคน"></label>
    <label class="w2">รายละเอียด <small>1 บรรทัด = 1 ข้อ · พิมพ์ “หัวข้อ | เนื้อหา”</small><textarea name="det" rows="${Math.min(14,Math.max(5,E.det.length+2))}">${esc(E.det.map(x=>x[0]+(x[1]?" | "+x[1]:"")).join("\n"))}</textarea></label>
    <label class="w2">โน้ตทีม<textarea name="note" rows="2" maxlength="600" placeholder="สิ่งที่ต้องตาม / ติดอะไร">${esc(E.note)}</textarea></label>
    <div class="acts w2">${E.edited?`<button type="button" class="btn ghost" data-act="reset-c">คืนเนื้อหาตามเด็ค</button>`:""}<span class="sp"></span><button type="button" class="btn" data-act="cancel">ยกเลิก</button><button type="submit" class="btn primary">บันทึก · ซิงค์ทุกคน</button></div></form>`; }

function renderPM(){ const el=$("#pm"); if(!el||DRAG||EDIT) return; const sy=window.scrollY;
  const today=Math.floor((Date.now()-PM_START)/864e5), toEvent=pmIdx(...dates(ITEMS["ev-fest"]).s)-today;
  const days=Array.from({length:PM_DAYS},(_,i)=>{ const dt=new Date(PM_START+i*864e5); return {d:dt.getUTCDate(),m:dt.getUTCMonth()+1,w:dt.getUTCDay()}; });
  let g=""; let i0=0; while(i0<PM_DAYS){ const m=days[i0].m; let i1=i0; while(i1<PM_DAYS&&days[i1].m===m) i1++; g+=`<div class="pm-mon" style="grid-column:${col(i0)}/${col(i1)}">${MON[m]} ${yy(m)}</div>`; i0=i1; }
  g+=days.map((x,i)=>`<div class="pm-day${x.w===0||x.w===6?" we":""}${x.w===1?" mo":""}" style="grid-column:${col(i)}">${x.d}</div>`).join("");
  let r=3, grp="", changed=0, total=0, dn=0, dt=0;
  PM_ROWS.forEach(row=>{ if(row.g!==grp){ grp=row.g; g+=`<div class="pm-grp" style="grid-row:${r}">${esc(grp)}</div>`; r++; }
    row.items.forEach(it=>{ total++; const E=eff(it), G=prog(it,E); if(dates(it).ch||E.edited) changed++; if(G){ dn+=G.n; dt+=G.t; } });
    g+=`<div class="pm-lab${row.tab?" lk":""}" style="grid-row:${r}"${row.tab?` data-go="${row.tab}"`:""}>${row.g===PH?`<b>${row.lab.slice(0,1)}</b>${esc(row.lab.slice(1))}`:esc(row.lab)}${row.pg?` <span class="pg">หน้า ${esc(row.pg)}</span>`:""}</div>`+row.items.map(it=>barHTML(it,row,r)).join(""); r++; });
  const todayLine=today>=0&&today<PM_DAYS?`<div class="pm-today" style="grid-column:${col(today)};grid-row:1/${r}"><i>วันนี้</i></div>`:"";
  // ปฏิทินรายสัปดาห์ (เริ่มวันจันทร์) — เรียงตามวันเริ่ม
  const q=Q.trim().toLowerCase();
  const all=[]; PM_ROWS.forEach(row=>row.items.forEach(it=>{ if(FILTER!=="all"&&row.g!==FILTER) return; const E=eff(it); if(HIDE){ const G=prog(it,E); if(!G||G.n===G.t) return; } if(q&&!(E.t+" "+E.sum+" "+row.lab+" "+E.ch.join(" ")+" "+E.det.map(x=>x.join(" ")).join(" ")).toLowerCase().includes(q)) return; all.push({it,E,d:dates(it)}); }));
  all.sort((a,b)=>pmIdx(...a.d.s)-pmIdx(...b.d.s)||PM_ROWS.indexOf(a.it.row)-PM_ROWS.indexOf(b.it.row));
  const wk={}; all.forEach(x=>{ const i=pmIdx(...x.d.s); const dt=new Date(PM_START+i*864e5); const mon=i-((dt.getUTCDay()+6)%7); (wk[mon]=wk[mon]||[]).push(x); });
  const weeks=Object.keys(wk).map(Number).sort((a,b)=>a-b).map(w=>{ const a=md(w), b=md(w+6), now=today>=w&&today<=w+6;
    return `<section class="pm-wk${now?" now":""}"><header><b>${a[0]===b[0]?`${a[1]}–${b[1]} ${MON[a[0]]}`:`${a[1]} ${MON[a[0]]} – ${b[1]} ${MON[b[0]]}`}</b><span>${wk[w].length} รายการ</span>${(()=>{ let n=0,t=0; wk[w].forEach(x=>{ const G=prog(x.it,x.E); if(G){ n+=G.n; t+=G.t; } }); return t?`<span class="wd${n===t?" ok":""}">ทำแล้ว ${n}/${t} ชิ้น</span>`:""; })()}${now?`<i>สัปดาห์นี้</i>`:""}</header>${wk[w].map(({it,E,d})=>{ const row=it.row, op=OPEN===it.id, G=prog(it,E), full=G&&G.n===G.t;
      return `<article class="pm-it${op?" open":""}${full?" dn":""}" id="pmd-${it.id}" style="--c:${row.c}"><div class="pm-rw">
        ${G?`<button type="button" class="pm-chk${full?" on":G.n?" half":""}" data-done="${it.id}" aria-pressed="${full}" title="${full?"ลงแล้ว — กดเพื่อเอาติ๊กออก":G.t>1?"กดเพื่อติ๊กว่าลงครบทุกชิ้น":"กดเมื่อลงแล้ว"}"><b>${full?"✓":G.t>1&&G.n?G.n:""}</b><span>${full?"ลงแล้ว":"ติ๊กลง"}</span></button>`:`<span class="pm-chk na"></span>`}
        <button type="button" class="pm-row" data-tog="${it.id}">${dateTile(d)}<div class="pm-main"><div class="pm-k1"><span class="grp">${row.g===PH?"PHASE "+it.ph:esc(row.lab)}</span>${stPill(E.st)}${d.ch?`<span class="pm-mv">ย้ายวันแล้ว</span>`:""}${E.edited?`<span class="pm-mv">แก้เนื้อหาแล้ว</span>`:""}</div>
          <b class="ttl">${esc(E.t)}</b><p class="sum">${esc(E.sum)}</p>${E.ch.length?`<div class="pm-chl">${E.ch.map(chip).join("")}</div>`:""}${G&&G.t>1?`<div class="pm-pg"><div class="bar"><i style="width:${Math.round(G.n/G.t*100)}%"></i></div><small>ทำแล้ว <b>${G.n}/${G.t}</b> ชิ้น</small></div>`:""}${(()=>{ const L=logOf(it); return L.length?`<small class="pm-log1">แก้ล่าสุด: ${logLine(L[0])}</small>`:""; })()}</div><span class="chev" aria-hidden="true">▾</span></button>
        ${row.lock?"":`<button type="button" class="pm-qe" data-qedit="${it.id}">✎<span> แก้ไข</span></button>`}</div>
        ${op?`<div class="pm-body">${EDIT===it.id?"":`<div class="pm-cols"><div>${detBody(it,E)}${E.note?`<div class="pm-note"><b>โน้ตทีม</b>${esc(E.note)}</div>`:""}</div>
          <aside><div><span>ช่วงเวลา</span><b>${fmtRange(d.s,d.e)}</b>${d.ch?`<small>เด็ค: ${fmtRange(it.s,it.e||it.s)}${d.by?` · ย้ายโดย ${esc(d.by)}`:""}</small>`:""}</div>
            ${row.g===PH?`<div><span>น้ำหนักการสื่อสาร</span><div class="wt"><i style="width:${it.w}%"></i></div><small>City Branding ${it.w}% · Festival ${100-it.w}%</small></div>`:""}
            <div><span>ผู้รับผิดชอบ</span><b>${esc(E.own||"—")}</b></div>${it.pg?`<div><span>อ้างอิงเด็ค</span><b>หน้า ${esc(it.pg)}</b></div>`:""}${(()=>{ const L=logOf(it); return L.length?`<div class="pm-hist"><span>บันทึกการแก้ไข</span><ul>${L.slice(0,8).map(x=>`<li>${logLine(x)}</li>`).join("")}</ul></div>`:""; })()}
            <div class="acts"><button type="button" class="btn primary big" data-edit="${it.id}">✎ แก้ไข</button>${d.ch?`<button type="button" class="btn" data-reset="${it.id}">คืนวันที่ตามเด็ค</button>`:""}${row.tab?`<button type="button" class="btn" data-go="${row.tab}">ไปแท็บแผน 3 ระยะ →</button>`:""}</div></aside></div>`}</div>`:""}
      </article>`; }).join("")}</section>`; }).join("");
  el.innerHTML=`<section class="box pm-head"><div><h2>PLAN MEDIA · แผนสื่อตามวันเวลา</h2><div class="pm-t">อวดเมืองโคราช 12 ต.ค. 69 – 10 ม.ค. 70</div>
      <div class="pm-s">กดแถบ = เปิดรายละเอียดด้านล่าง · กดวงกลม = ติ๊กว่าลงแล้ว · ลากแถบ = ย้ายวัน · ลากขอบ = ยืด/หด · กด “แก้ไข” ในรายละเอียดเพื่อแก้เนื้อหา — บันทึกแล้วทุกคนเห็นทันที${changed?` · <b>ปรับจากเด็คแล้ว ${changed} รายการ</b>`:""}</div></div>
    <div class="pm-k"><div><b>${toEvent>0?toEvent:0}</b>วันถึงงาน</div><div><b>${total}</b>รายการ</div><div class="dn"><b>${dn}<small>/${dt}</small></b>ชิ้นที่ลงแล้ว<span class="kb"><i style="width:${dt?Math.round(dn/dt*100):0}%"></i></span></div><div><b>66</b>Short Video</div><div><b>11</b>ทีวี</div><div><b>20+</b>จุด OOH</div></div>
    ${(()=>{ const A=[]; Object.values(ITEMS).forEach(it=>logOf(it).forEach(x=>A.push(Object.assign({t:eff(it).t,id:it.id},x)))); A.sort((a,b)=>b.at-a.at); return A.length?`<div class="pm-feed"><span>อัปเดตล่าสุด</span>${A.slice(0,4).map(x=>`<button type="button" data-goto="${x.id}"><b>${esc(x.t)}</b> — ${logLine(x)}</button>`).join("")}</div>`:""; })()}
    <div class="pm-who">🔓 ${esc(who())} <button class="btn" id="pm-out" type="button">ออก</button></div></section>
    <section class="box pm-wrap"><div class="pm-g" id="pm-g" style="grid-template-rows:repeat(${r-1},auto)">${g}${todayLine}</div></section>
    <section class="pm-agenda"><div class="pm-tools"><h2>รายละเอียดตามสัปดาห์</h2><div class="pm-fl">${GROUPS.map(x=>`<button type="button" class="pm-f${FILTER===x[0]?" on":""}" data-f="${esc(x[0])}">${x[1]}</button>`).join("")}<button type="button" class="pm-f hd${HIDE?" on":""}" id="pm-hide">${HIDE?"✓ ":""}ซ่อนที่ลงแล้ว</button></div><input type="search" id="pm-q" placeholder="ค้นหา หัวข้อ / ช่องทาง / ประเด็น…" value="${esc(Q)}"></div>
      ${weeks||`<p class="pm-empty">ไม่พบรายการที่ตรงกับคำค้น</p>`}</section>`;
  window.scrollTo(0,sy);
  $("#pm-out").onclick=pmLogout;
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=e=>{ e.stopPropagation(); setTab(b.dataset.go); });
  el.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>saveDates(b.dataset.reset,null,null));
  el.querySelectorAll("[data-tog]").forEach(b=>b.onclick=()=>{ OPEN=OPEN===b.dataset.tog?null:b.dataset.tog; renderPM(); });
  el.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openEditor(b.dataset.edit));
  el.querySelectorAll("[data-qedit]").forEach(b=>b.onclick=()=>{ OPEN=b.dataset.qedit; renderPM(); openEditor(OPEN); });
  el.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>goDetail(b.dataset.goto));
  el.querySelectorAll("[data-done]").forEach(b=>b.onclick=()=>toggleAll(b.dataset.done));
  el.querySelectorAll("[data-tk]").forEach(b=>b.onclick=()=>toggleUnit(b.dataset.tk,b.dataset.u));
  $("#pm-hide").onclick=()=>{ HIDE=!HIDE; renderPM(); };
  el.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{ FILTER=b.dataset.f; renderPM(); });
  const qi=$("#pm-q"); qi.oninput=()=>{ Q=qi.value; clearTimeout(qi._t); qi._t=setTimeout(()=>{ renderPM(); const n=$("#pm-q"); n.focus(); n.setSelectionRange(n.value.length,n.value.length); },250); };
  el.querySelectorAll(".pm-bar").forEach(b=>b.addEventListener("pointerdown",down));
}
window.renderPM=renderPM;

function openEditor(id){ const it=ITEMS[id], a=$("#pmd-"+id); if(!it||!a) return; EDIT=id; const body=a.querySelector(".pm-body"); body.innerHTML=editorHTML(it,eff(it),dates(it)); const f=body.querySelector("form");
  f.querySelector('[data-act="cancel"]').onclick=()=>{ EDIT=null; renderPM(); };
  const rc=f.querySelector('[data-act="reset-c"]'); if(rc) rc.onclick=()=>{ EDIT=null; saveContent(id,null); };
  f.onsubmit=e=>{ e.preventDefault(); const fd=new FormData(f); const E0=eff(it);
    const det=String(fd.get("det")||"").split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{ const k=l.indexOf("|"); return k<0?[l,""]:[l.slice(0,k).trim(),l.slice(k+1).trim()]; });
    const obj={t:String(fd.get("t")||"").trim()||it.t,sum:String(fd.get("sum")||"").trim(),ch:fd.getAll("ch").map(String),st:String(fd.get("st")||"plan"),own:String(fd.get("own")||"").trim(),det,note:String(fd.get("note")||"").trim()};
    const toMD=v=>{ const m=String(v||"").match(/^(\d{4})-(\d{2})-(\d{2})$/); return m?[+m[2],+m[3]]:null; };
    const s=toMD(fd.get("s")), en=toMD(fd.get("e")); EDIT=null;
    const same=JSON.stringify([obj.t,obj.sum,obj.ch,obj.st,obj.own,obj.det,obj.note])===JSON.stringify([E0.t,E0.sum,E0.ch,E0.st,E0.own,E0.det,E0.note]);
    const NM={t:"ชื่อหัวข้อ",sum:"สรุป",ch:"ช่องทาง",st:"สถานะ",own:"ผู้รับผิดชอบ",det:"รายละเอียด",note:"โน้ต"};
    const fl=Object.keys(NM).filter(k=>JSON.stringify(obj[k])!==JSON.stringify(E0[k])).map(k=>k==="st"?`สถานะ → ${(STS.find(x=>x[0]===obj.st)||STS[0])[1]}`:NM[k]);
    if(!same) saveContent(id,obj,"แก้ "+fl.join(", "));
    if(!it.row.lock&&s&&en){ const d=dates(it); const a1=pmIdx(...s), b1=Math.max(a1,pmIdx(...en)); if(a1!==pmIdx(...d.s)||b1!==pmIdx(...d.e)){ const orig=[pmIdx(...it.s),pmIdx(...(it.e||it.s))]; if(a1===orig[0]&&b1===orig[1]) saveDates(id,null,null,!same); else saveDates(id,s,md(b1),!same); } }
    if(same) renderPM(); };
  setTimeout(()=>{ const t=f.querySelector('[name="t"]'); if(t) t.focus(); },30); }

function goDetail(id){ if(ITEMS[id]&&ITEMS[id].alias) id=ITEMS[id].alias; const it=ITEMS[id]; if(FILTER!=="all"&&it&&it.row.g!==FILTER) FILTER="all"; Q=""; OPEN=id; renderPM(); const a=$("#pmd-"+id); if(!a) return; a.scrollIntoView({behavior:"smooth",block:"start"}); a.classList.remove("flash"); void a.offsetWidth; a.classList.add("flash"); try{ logEv("pm-open",id); }catch(e){} }
function down(ev){ const b=ev.currentTarget, it=ITEMS[b.dataset.id]; if(!it) return; const d=dates(it);
  const day=document.querySelector("#pm-g .pm-day"); const cw=day?day.getBoundingClientRect().width:14;
  const rect=b.getBoundingClientRect(); const x=ev.clientX-rect.left;
  const lock=!!it.row.lock, S=pmIdx(...d.s), E=pmIdx(...d.e), over=E>PM_DAYS-1;
  const mode=lock?"none":x<8&&rect.width>16?"l":(x>rect.width-8&&rect.width>16&&!over)?"r":"m";
  DRAG={b,it,mode,x0:ev.clientX,cw,S,E,s:S,e:E,moved:false};
  b.setPointerCapture(ev.pointerId); b.addEventListener("pointermove",move); b.addEventListener("pointerup",up); b.addEventListener("pointercancel",up); ev.preventDefault(); }
function move(ev){ const D=DRAG; if(!D) return; const dd=Math.round((ev.clientX-D.x0)/D.cw); if(Math.abs(ev.clientX-D.x0)>4) D.moved=true; if(D.mode==="none"||!D.moved) return;
  let s=D.S, e=D.E; if(D.mode==="m"){ const k=clamp(dd,-D.S,D.E>PM_DAYS-1?PM_DAYS-1-D.S:PM_DAYS-1-D.E); s=D.S+k; e=D.E+k; }
  else if(D.mode==="l"){ s=clamp(D.S+dd,0,D.E); } else { e=clamp(D.E+dd,D.S,PM_DAYS-1); }
  D.s=s; D.e=e; D.b.style.gridColumn=`${col(clamp(s,0,PM_DAYS-1))}/${col(clamp(e,0,PM_DAYS-1))+1}`; D.b.classList.add("drag");
  const sp=D.b.querySelector("span"); if(sp) sp.textContent=fmtRange(md(s),md(e)); }
function up(){ const D=DRAG; DRAG=null; if(!D) return; D.b.classList.remove("drag");
  if(!D.moved||D.mode==="none"){ if(D.it.row.lock&&D.moved) K.toast("ช่วง KOL/Nano Week แก้ที่แท็บแผน 3 ระยะ"); goDetail(D.it.id); return; }
  if(D.s===D.S&&D.e===D.E){ renderPM(); return; }
  const it=D.it.alias?ITEMS[D.it.alias]:D.it, s=md(D.s), e=md(D.e);
  if(D.s===pmIdx(...it.s)&&D.e===pmIdx(...(it.e||it.s))) saveDates(it.id,null,null); else saveDates(it.id,s,e); }

$("#pm-ok").onclick=pmLogin; $("#pm-cancel").onclick=()=>{ $("#pmgate").hidden=true; };
["#pm-code","#pm-name"].forEach(s=>$(s).addEventListener("keydown",e=>{ if(e.key==="Enter") pmLogin(); if(e.key==="Escape") $("#pmgate").hidden=true; }));
if(K.tab()==="review"){ try{ if(localStorage.getItem("kol_tab")==="pm"&&sessionStorage.getItem("pm_who")) setTab("pm"); }catch(e){} }
})();
