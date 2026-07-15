const fs = require('fs');
let content = fs.readFileSync('src/features/articles/articles.repository.ts', 'utf8');

content = content.replace(/      pdfUrl: articles\.pdfUrl,/g, '      pdfUrl: articles.pdfUrl,\n      coverImageUrl: articles.coverImageUrl,');
content = content.replace(/      journalTitle: journals\.title,/g, '      journalTitle: journals.title,\n      journalCoverImageUrl: journals.coverImageUrl,');

fs.writeFileSync('src/features/articles/articles.repository.ts', content);
