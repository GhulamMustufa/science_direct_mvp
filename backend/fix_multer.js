const fs = require('fs');
let content = fs.readFileSync('src/features/submissions/submissions.routes.ts', 'utf8');

if (!content.includes("import os from 'os';")) {
  content = content.replace("import path from 'path';", "import path from 'path';\nimport os from 'os';");
}

content = content.replace(
  "cb(null, path.join(process.cwd(), 'uploads'));",
  "cb(null, os.tmpdir());"
);

fs.writeFileSync('src/features/submissions/submissions.routes.ts', content);
console.log('Fixed multer config in submissions.routes.ts');
