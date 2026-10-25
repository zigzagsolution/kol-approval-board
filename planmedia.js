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
  {g:"สื่อออฟไลน์",lab:"ทีวี TVC/Scoop ช่อง 7 (1 ครั้ง)",c:"#f05a85",pg:"176",items:[
    {id:"tv7",t:"เรื่องเล่าเช้านี้ / สนามข่าว 7 สี",s:[11,13],e:[11,19],sum:"Thematic VDO + กำหนดการและไฮไลต์เทศกาล",pg:"176",det:[["ประเด็น","ปรากฏการณ์พลิกเมืองโคราช สู่มหานครแห่งโอกาส · โคราชจัดใหญ่! เทศกาลสตรีทระดับโลก 20–29 พ.ย."],["รายการ","เรื่องเล่าเช้านี้ จ–ศ 06.00–08.30 / ส–อา 10.15–12.30 · สนามข่าว 7 สี จ–ศ 07.30–09.00"],["ต้องแก้ในเด็ค","หน้า 176 เขียน “เผยแพร่ช่วง 13-19 Nov 2027” ที่ถูกคือ 2026"]]}]},
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
  {g:"ออนไลน์",lab:"KOL 50 คน (บอร์ดนี้)",c:"#e8194c",tab:"plan",lock:true,items:[
    {id:"kol1",t:"ระยะ 1",s:[11,6],e:[11,12],sum:"ปักหมุดวันงาน",det:[["แก้ที่","แท็บแผน 3 ระยะ / ตารางโพสต์"]]},{id:"kol2",t:"ระยะ 2",s:[11,13],e:[11,19],sum:"ตัดสินใจเดินทาง",det:[["แก้ที่","แท็บแผน 3 ระยะ / ตารางโพสต์"]]},{id:"kol3",t:"ระยะ 3",s:[11,20],e:[11,29],sum:"มาแล้ว-มาต่อ-มาซ้ำ",det:[["แก้ที่","แท็บแผน 3 ระยะ / ตารางโพสต์"]]}]},
  {g:"ออนไลน์",lab:"Nano Week (โพสต์ที่ 2)",c:"#7b4bd6",tab:"plan",lock:true,items:[
    {id:"nw",t:"Nano 15 คน",s:[11,13],e:[11,19],sum:"Nano 15 คน โพสต์ที่ 2 แนวใหม่ ห่างจากโพสต์แรก ≥3 วัน",det:[["แก้ที่","แท็บแผน 3 ระยะ (การ์ด Nano Week)"]]}]},
  {g:"ออนไลน์",lab:"หน้างาน: Live / ภาพ / Reels",c:"#b5103a",pg:"64, 108",items:[
    {id:"live",t:"Live ≥5 · ภาพ 300 · Reels หน้างาน",s:[11,20],e:[11,29],sum:"เก็บโมเมนต์จริงทุกวัน",pg:"64, 108",det:[["Reels","ลอยกระทง / Brand Master / Workshop: ภาพคนลงมือทำ → ผลงาน → ความรู้สึกหลังลอง"]]},
    {id:"sv",t:"Short Video ต่อเนื่อง → 10 ม.ค. 70",s:[11,30],e:[1,10],sum:"Short Video หลังงาน",pg:"108",det:[["ช่วง","30 พ.ย. 69 – 10 ม.ค. 70"]]}]},
];
const ITEMS={}; PM_ROWS.forEach(r=>r.items.forEach(it=>{ it.row=r; ITEMS[it.id]=it; }));

/* ===== วันที่ที่ใช้จริง = ค่าที่ลากไว้ (ชีต) ไม่งั้นค่าจากเด็ค ===== */
function ov(id){ const p=(K.posts()||{})["pm:"+id]; if(!p||!p.brief) return null; try{ const o=JSON.parse(p.brief); return o&&o.s?Object.assign(o,{by:p.by}):null; }catch(e){ return null; } }
function dates(it){ if(it.alias&&ITEMS[it.alias]) return dates(ITEMS[it.alias]); const o=ov(it.id); return o?{s:o.s,e:o.e||o.s,by:o.by,ch:true}:{s:it.s,e:it.e||it.s,ch:false}; }
// ให้แท็บอื่นใช้วันจาก PLAN MEDIA (เช่น หมุดบุกสยาม/Press Tour บนไทม์ไลน์ KOL)
window.pmNovDay=id=>{ const it=ITEMS[id]; if(!it) return null; const d=dates(it); return d.s[0]===11?d.s[1]:null; };

function save(id,s,e){ if(ITEMS[id]&&ITEMS[id].alias) id=ITEMS[id].alias; const it=ITEMS[id]; let who=""; try{ who=sessionStorage.getItem("pm_who")||""; }catch(x){}
  const rec={key:"pm:"+id,kol:"PLAN MEDIA",name:it.t,day:0,format:"pm",brief:s?JSON.stringify({s,e}):"",status:"plan",link:"",by:who};
  const P=K.posts(), prev=P[rec.key]; P[rec.key]=rec; renderPM(); try{ K.render(); }catch(x){} try{ logEv("pm-move",id+" "+(s?fmtRange(s,e):"reset")); }catch(x){}
  K.api("setPost",[rec]).then(()=>K.toast(s?`ย้าย ${it.t} → ${fmtRange(s,e)} แล้ว`:`คืนค่า ${it.t} ตามเด็คแล้ว`)).catch(err=>{ if(prev) P[rec.key]=prev; else delete P[rec.key]; renderPM(); K.toast("บันทึกไม่สำเร็จ: "+(err&&err.message||err)); }); }

function pmOpenGate(){ const m=$("#pmgate"); $("#pm-code").value=""; $("#pm-name").value=(function(){ try{ return sessionStorage.getItem("pm_who")||K.reviewer()||""; }catch(e){ return K.reviewer()||""; } })(); $("#pm-err").hidden=true; m.hidden=false; setTimeout(()=>$("#pm-code").focus(),50); }
function pmLogin(){ const code=$("#pm-code").value.trim(), name=$("#pm-name").value.trim();
  if(code!==PM_CODE){ $("#pm-err").textContent="รหัสไม่ถูกต้อง"; $("#pm-err").hidden=false; $("#pm-code").select(); return; }
  if(!name){ $("#pm-err").textContent="กรุณาใส่ชื่อ"; $("#pm-err").hidden=false; $("#pm-name").focus(); return; }
  try{ sessionStorage.setItem("pm_who",name); }catch(e){}
  $("#pmgate").hidden=true; try{ logEv("pm-login",name); flushLog(); }catch(e){} setTab("pm"); }
function pmLogout(){ try{ sessionStorage.removeItem("pm_who"); }catch(e){} try{ logEv("pm-logout",""); }catch(e){} setTab("review"); }
window.openPmGate=pmOpenGate;

let DRAG=null; window.PM_BUSY=()=>!!DRAG;
const col=i=>i+2; // คอลัมน์ 1 = ป้ายแถว
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function barHTML(it,row,r){ const d=dates(it); const S=pmIdx(...d.s), E=pmIdx(...d.e); const s=clamp(S,0,PM_DAYS-1), e=clamp(E,0,PM_DAYS-1);
  const one=s===e, isPh=row.g===PH, label=isPh?fmtRange(d.s,d.e):it.t;
  const tip=`${it.t} · ${fmtRange(d.s,d.e)} — ${it.sum||""}${row.lock?" (วันตามแท็บแผน 3 ระยะ)":" · ลากเพื่อย้ายวัน / ลากขอบเพื่อยืดหด / กดเพื่อดูรายละเอียด"}`;
  return `<div class="pm-bar${one?" pt":e-s<3?" sh":""}${isPh?" ph":""}${d.ch?" ch":""}${row.lock?" lk":""}${E>PM_DAYS-1?" over":""}" data-id="${it.id}" style="grid-row:${r};grid-column:${col(s)}/${col(e)+1};--c:${row.c}" title="${esc(tip)}">${row.lock?"":`<i class="hl"></i><i class="hr"></i>`}<span>${esc(label)}</span></div>`; }

function renderPM(){ const el=$("#pm"); if(!el||DRAG) return; let who=""; try{ who=sessionStorage.getItem("pm_who")||""; }catch(e){}
  const openId=(el.querySelector(".pm-det details[open]")||{}).dataset; const sy=window.scrollY;
  const today=Math.floor((Date.now()-PM_START)/864e5), toEvent=pmIdx(...dates(ITEMS["ev-fest"]).s)-today;
  const days=Array.from({length:PM_DAYS},(_,i)=>{ const dt=new Date(PM_START+i*864e5); return {d:dt.getUTCDate(),m:dt.getUTCMonth()+1,w:dt.getUTCDay()}; });
  let g=""; let i0=0; while(i0<PM_DAYS){ const m=days[i0].m; let i1=i0; while(i1<PM_DAYS&&days[i1].m===m) i1++; g+=`<div class="pm-mon" style="grid-column:${col(i0)}/${col(i1)}">${MON[m]} ${yy(m)}</div>`; i0=i1; }
  g+=days.map((x,i)=>`<div class="pm-day${x.w===0||x.w===6?" we":""}${x.w===1?" mo":""}" style="grid-column:${col(i)}">${x.d}</div>`).join("");
  let r=3, grp="", changed=0;
  PM_ROWS.forEach(row=>{ if(row.g!==grp){ grp=row.g; g+=`<div class="pm-grp" style="grid-row:${r}">${esc(grp)}</div>`; r++; }
    row.items.forEach(it=>{ if(dates(it).ch) changed++; });
    g+=`<div class="pm-lab${row.tab?" lk":""}" style="grid-row:${r}"${row.tab?` data-go="${row.tab}"`:""}>${row.g===PH?`<b>${row.lab.slice(0,1)}</b>${esc(row.lab.slice(1))}`:esc(row.lab)}${row.pg?` <span class="pg">หน้า ${esc(row.pg)}</span>`:""}</div>`+row.items.map(it=>barHTML(it,row,r)).join(""); r++; });
  const todayLine=today>=0&&today<PM_DAYS?`<div class="pm-today" style="grid-column:${col(today)};grid-row:1/${r}"><i>วันนี้</i></div>`:"";
  // หัวข้อรายละเอียด
  let det="", dg="";
  PM_ROWS.forEach(row=>{ if(row.g!==dg){ dg=row.g; det+=`<h3 class="pm-dh">${esc(dg)}</h3>`; }
    row.items.forEach(it=>{ const d=dates(it), isPh=row.g===PH;
      det+=`<article class="pm-d${isPh?" ph":""}" id="pmd-${it.id}" style="--c:${row.c}">
        <div class="h"><span class="dot"></span><div class="tt"><b>${isPh?`${String(it.ph).padStart(2,"0")} `:""}${esc(it.t)}</b>${isPh?"":`<span class="rw">${esc(row.lab)}</span>`}</div>
          <span class="dt${d.ch?" ch":""}">${fmtRange(d.s,d.e)}</span></div>
        <p class="sm">${esc(it.sum||"")}</p>
        ${isPh?`<div class="wt"><i style="width:${it.w}%"></i></div><div class="wl"><span>City Branding ${it.w}%</span><span>Festival ${100-it.w}%</span></div>`:""}
        ${d.ch?`<div class="chg">ย้ายจากค่าในเด็ค (${fmtRange(it.s,it.e||it.s)})${d.by?` โดย ${esc(d.by)}`:""} <button class="btn" type="button" data-reset="${it.id}">คืนค่าตามเด็ค</button></div>`:""}
        <details data-id="${it.id}"><summary>รายละเอียด${it.pg?` · เด็คหน้า ${esc(it.pg)}`:""}</summary><ul>${(it.det||[]).map(x=>`<li><b>${esc(x[0])}</b>${x[1]?` — ${esc(x[1])}`:""}</li>`).join("")}</ul>
          ${row.tab?`<button class="btn" type="button" data-go="${row.tab}">ไปที่แผน 3 ระยะ →</button>`:""}</details></article>`; }); });
  el.innerHTML=`<section class="box pm-head"><div><h2>PLAN MEDIA · แผนสื่อตามวันเวลา</h2><div class="pm-t">อวดเมืองโคราช 12 ต.ค. 69 – 10 ม.ค. 70</div>
      <div class="pm-s">กดแถบ = ดูรายละเอียดด้านล่าง · ลากแถบ = ย้ายวัน · ลากขอบ = ยืด/หด · บันทึกทันที ทุกคนเห็นเหมือนกัน${changed?` · <b>ย้ายจากเด็คแล้ว ${changed} รายการ</b>`:""}</div></div>
    <div class="pm-k"><div><b>${toEvent>0?toEvent:0}</b>วันถึงงาน</div><div><b>7</b>ระยะ</div><div><b>11</b>ทีวี</div><div><b>30</b>หนังสือพิมพ์</div><div><b>2</b>Press Tour</div><div><b>50</b>KOL</div></div>
    <div class="pm-who">🔓 ${esc(who)} <button class="btn" id="pm-out" type="button">ออก</button></div></section>
    <section class="box pm-wrap"><div class="pm-g" id="pm-g" style="grid-template-rows:repeat(${r-1},auto)">${g}${todayLine}</div></section>
    <section class="pm-det">${det}</section>`;
  if(openId&&openId.id){ const dd=el.querySelector(`details[data-id="${openId.id}"]`); if(dd) dd.open=true; } window.scrollTo(0,sy);
  $("#pm-out").onclick=pmLogout;
  el.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>setTab(b.dataset.go));
  el.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>save(b.dataset.reset,null,null));
  el.querySelectorAll(".pm-bar").forEach(b=>b.addEventListener("pointerdown",down));
}
window.renderPM=renderPM;

function goDetail(id){ const a=$("#pmd-"+id); if(!a) return; const dd=a.querySelector("details"); if(dd) dd.open=true; a.scrollIntoView({behavior:"smooth",block:"center"}); a.classList.remove("flash"); void a.offsetWidth; a.classList.add("flash"); try{ logEv("pm-open",id); }catch(e){} }
function down(ev){ const b=ev.currentTarget, it=ITEMS[b.dataset.id]; if(!it) return; const d=dates(it);
  const day=document.querySelector("#pm-g .pm-day"); const cw=day?day.getBoundingClientRect().width:14;
  const rect=b.getBoundingClientRect(); const x=ev.clientX-rect.left;
  const lock=!!it.row.lock, S=pmIdx(...d.s), E=pmIdx(...d.e), over=E>PM_DAYS-1;
  const mode=lock?"none":x<8&&rect.width>16?"l":(x>rect.width-8&&rect.width>16&&!over)?"r":"m";
  DRAG={b,it,mode,x0:ev.clientX,cw,S,E,s:S,e:E,moved:false};
  b.setPointerCapture(ev.pointerId); b.addEventListener("pointermove",move); b.addEventListener("pointerup",up); b.addEventListener("pointercancel",up); ev.preventDefault(); }
function move(ev){ const D=DRAG; if(!D) return; const dd=Math.round((ev.clientX-D.x0)/D.cw); if(Math.abs(ev.clientX-D.x0)>4) D.moved=true; if(D.mode==="none"||!D.moved) return;
  let s=D.S, e=D.E; if(D.mode==="m"){ s=D.S+dd; e=D.E+dd; const lo=-D.S, hi=PM_DAYS-1-Math.min(D.E,PM_DAYS-1); const k=clamp(dd,lo,D.E>PM_DAYS-1?PM_DAYS-1-D.S:hi); s=D.S+k; e=D.E+k; }
  else if(D.mode==="l"){ s=clamp(D.S+dd,0,D.E); } else { e=clamp(D.E+dd,D.S,PM_DAYS-1); }
  D.s=s; D.e=e; D.b.style.gridColumn=`${col(clamp(s,0,PM_DAYS-1))}/${col(clamp(e,0,PM_DAYS-1))+1}`; D.b.classList.add("drag");
  const sp=D.b.querySelector("span"); if(sp) sp.textContent=fmtRange(md(s),md(e)); }
function up(){ const D=DRAG; DRAG=null; if(!D) return; D.b.classList.remove("drag");
  if(!D.moved||D.mode==="none"){ if(D.it.row.lock&&D.moved){ K.toast("ช่วง KOL/Nano Week แก้ที่แท็บแผน 3 ระยะ"); } goDetail(D.it.id); return; }
  if(D.s===D.S&&D.e===D.E){ renderPM(); return; }
  const it=D.it, orig={s:it.s,e:it.e||it.s}; const s=md(D.s), e=md(D.e);
  if(pmIdx(...s)===pmIdx(...orig.s)&&pmIdx(...e)===pmIdx(...orig.e)) save(it.id,null,null); else save(it.id,s,e); }

$("#pm-ok").onclick=pmLogin; $("#pm-cancel").onclick=()=>{ $("#pmgate").hidden=true; };
["#pm-code","#pm-name"].forEach(s=>$(s).addEventListener("keydown",e=>{ if(e.key==="Enter") pmLogin(); if(e.key==="Escape") $("#pmgate").hidden=true; }));
if(K.tab()==="review"){ try{ if(localStorage.getItem("kol_tab")==="pm"&&sessionStorage.getItem("pm_who")) setTab("pm"); }catch(e){} }
})();
