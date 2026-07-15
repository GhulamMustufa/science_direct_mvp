const fs = require('fs');
const path = 'src/features/auth/auth.controller.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/sameSite: 'lax'/g, "sameSite: isProduction ? 'none' : 'lax'");
fs.writeFileSync(path, content);
console.log('Fixed cookies in auth.controller.ts');
