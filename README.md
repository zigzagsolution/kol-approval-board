# KOL Approval Board — อวดเมืองโคราช 2569

หน้าเว็บให้ลูกค้าติ๊ก ผ่าน/ไม่ผ่าน KOL (MIDI digital Co., Ltd.)

| ไฟล์ | หน้าที่ | แก้แล้วมีผลเมื่อ |
|---|---|---|
| `index.html` `style.css` `app.js` `logo.png` | หน้าเว็บ (GitHub Pages) | ~1–2 นาทีหลัง push |
| `config.js` | URL ของ Apps Script (`APP_URL`) | ~1–2 นาที |
| `server.js` | หลังบ้าน: อ่านชีต, บันทึกผล, LINE, Log (Apps Script โหลดจาก GitHub ตอนรัน) | ~1–2 นาที |
| `Code.gs` | ตัวโหลด + API — วางใน Apps Script **ครั้งเดียว** | ต้อง Deploy ใหม่ (นาน ๆ ครั้ง) |

- หน้าเว็บ: https://zigzagsolution.github.io/kol-approval-board/
- ความลับ (LINE token ฯลฯ) อยู่ใน Script Properties ของ Apps Script เท่านั้น ไม่อยู่ใน repo นี้
