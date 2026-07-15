const fs = require('fs');

// Fix submit page
let submitContent = fs.readFileSync('src/app/author/submit/page.tsx', 'utf8');
submitContent = submitContent.replace(
  /import { FormPageSkeleton } from "@\/components\/ui\/Loading";/,
  `import { FormPageSkeleton } from "@/components/ui/Loading";\nimport { apiFetch } from "@/lib/api";`
);
submitContent = submitContent.replace(
  /\/\/ Load categories\n\s*fetch\('\/api\/taxonomy\/categories'\)\.then\(r => r\.json\(\)\)\.then\(data => {\n\s*if\(data\.success && data\.data\) setCategories\(data\.data\);\n\s*}\)\.catch\(console\.error\);/,
  `// Load categories
    apiFetch('/api/categories').then(data => {
      setCategories(data as any[]);
    }).catch(console.error);`
);
fs.writeFileSync('src/app/author/submit/page.tsx', submitContent);

// Fix search filters
let filtersContent = fs.readFileSync('src/features/search/components/SearchFilters.tsx', 'utf8');
filtersContent = filtersContent.replace(
  /fetch\('\/api\/taxonomy\/categories'\)\.then\(r => r\.json\(\)\)\.then\(d => d\.data \|\| \[\]\)/,
  `searchService.getCategories()`
);
fs.writeFileSync('src/features/search/components/SearchFilters.tsx', filtersContent);

// Add getCategories to search.service.ts
let serviceContent = fs.readFileSync('src/features/search/services/search.service.ts', 'utf8');
serviceContent = serviceContent.replace(
  /async getVolumes\(\): Promise<Volume\[\]> \{/,
  `async getCategories(): Promise<any[]> {
    return apiFetch<any[]>("/api/categories");
  },

  async getVolumes(): Promise<Volume[]> {`
);
fs.writeFileSync('src/features/search/services/search.service.ts', serviceContent);
