const fs = require('fs');
let content = fs.readFileSync('src/types/index.ts', 'utf8');

content = content.replace(/  journalTitle\?: string;/g, '  journalTitle?: string;\n  journalCoverImageUrl?: string | null;');

fs.writeFileSync('src/types/index.ts', content);
