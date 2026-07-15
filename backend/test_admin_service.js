require('dotenv').config();
const { editorialService } = require('./dist/features/editorial/editorial.service.js');
async function test() {
  const subs = await editorialService.getAllSubmissions();
  const sub = subs.find(s => s.id === '71ab732e-e737-445b-ac3d-336d961b2c23');
  console.log('Keys:', Object.keys(sub));
  console.log('pdfUrl:', sub.pdfUrl);
  process.exit(0);
}
test();
