const fs = require('fs');
const path = 'src/app/admin/submissions/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const downloadLink = submission.pdfUrl ? `${baseUrl}${submission.pdfUrl}` : null;",
  "const downloadLink = submission.pdfUrl ? (submission.pdfUrl.startsWith('http') ? submission.pdfUrl : `${baseUrl}${submission.pdfUrl}`) : null;"
);

fs.writeFileSync(path, content);
console.log('Fixed download link in admin panel');
