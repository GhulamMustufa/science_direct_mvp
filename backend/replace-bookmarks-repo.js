const fs = require('fs');
let content = fs.readFileSync('src/features/bookmarks/bookmarks.repository.ts', 'utf8');

content = content.replace(/          pdfUrl: articles\.pdfUrl,/g, '          pdfUrl: articles.pdfUrl,\n          coverImageUrl: articles.coverImageUrl,');
content = content.replace(/          journalTitle: journals\.title,/g, '          journalTitle: journals.title,\n          journalCoverImageUrl: journals.coverImageUrl,');

fs.writeFileSync('src/features/bookmarks/bookmarks.repository.ts', content);
