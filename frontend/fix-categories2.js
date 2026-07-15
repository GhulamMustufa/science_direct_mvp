const fs = require('fs');

// Fix submit page
let submitContent = fs.readFileSync('src/app/author/submit/page.tsx', 'utf8');
submitContent = submitContent.replace(
  /apiFetch\('\/api\/categories'\)/,
  `apiFetch('/categories')`
);
fs.writeFileSync('src/app/author/submit/page.tsx', submitContent);

// Fix search filters
let serviceContent = fs.readFileSync('src/features/search/services/search.service.ts', 'utf8');
serviceContent = serviceContent.replace(
  /apiFetch<any\[\]>\("\/api\/categories"\)/,
  `apiFetch<any[]>("/categories")`
);
fs.writeFileSync('src/features/search/services/search.service.ts', serviceContent);
