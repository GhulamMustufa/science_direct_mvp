const fs = require('fs');
let content = fs.readFileSync('src/app/author/submit/page.tsx', 'utf8');

// 1. Add state for categories and selectedCategories
content = content.replace(
  /const \[journals, setJournals\] = useState<Journal\[\]>\(\[\]\);/,
  `const [journals, setJournals] = useState<Journal[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);`
);

// 2. Add fetch for categories in useEffect
content = content.replace(
  /\/\/ Load journals\n\s*journalsService\.getJournals\(\)\.then\(setJournals\)\.catch\(console\.error\);/,
  `// Load journals
    journalsService.getJournals().then(setJournals).catch(console.error);
    // Load categories
    fetch('/api/taxonomy/categories').then(r => r.json()).then(data => {
      if(data.success && data.data) setCategories(data.data);
    }).catch(console.error);`
);

// 3. Add to handleValidation / handleSubmit FormData
content = content.replace(
  /formData\.append\("journalId", journalId\);/,
  `formData.append("journalId", journalId);
    if (selectedCategories.length > 0) {
      formData.append("categoryIds", JSON.stringify(selectedCategories));
    }`
);

// 4. Add the JSX for category selection
const categoryJsx = `
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Categories (Select up to 5)
              </label>
              <select
                multiple
                value={selectedCategories}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, option => option.value);
                  if (options.length <= 5) {
                    setSelectedCategories(options);
                  }
                }}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[120px]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <p className="text-xs text-zinc-500 mt-1">Hold Cmd/Ctrl to select multiple. Selected: {selectedCategories.length}/5</p>
            </div>
`;

content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/,
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">` + categoryJsx
);

fs.writeFileSync('src/app/author/submit/page.tsx', content);
