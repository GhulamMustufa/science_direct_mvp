const fs = require('fs');
let content = fs.readFileSync('src/features/search/components/SearchFilters.tsx', 'utf8');

content = content.replace(
  /const \[volumes, setVolumes\] = useState<Volume\[\]>\(\[\]\);/,
  `const [volumes, setVolumes] = useState<Volume[]>([]);\n  const [categories, setCategories] = useState<any[]>([]);`
);

content = content.replace(
  /const selectedVolume = searchParams\.get\("volumeId"\) \|\| "";/,
  `const selectedVolume = searchParams.get("volumeId") || "";\n  const selectedCategory = searchParams.get("categoryId") || "";`
);

content = content.replace(
  /const \[journalsData, volumesData\] = await Promise\.all\(\[/,
  `const [journalsData, volumesData, categoriesData] = await Promise.all([`
);

content = content.replace(
  /searchService\.getVolumes\(\),/,
  `searchService.getVolumes(),\n          fetch('/api/taxonomy/categories').then(r => r.json()).then(d => d.data || []),`
);

content = content.replace(
  /setVolumes\(volumesData\);/,
  `setVolumes(volumesData);\n        setCategories(categoriesData);`
);

const categoryFilterJsx = `
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Filter by Category</h3>
        <select
          value={selectedCategory}
          onChange={(e) => updateParam("categoryId", e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
`;

content = content.replace(
  /<\/div>\n    <\/div>\n  \);\n\}/,
  `</div>\n\n${categoryFilterJsx}\n    </div>\n  );\n}`
);

fs.writeFileSync('src/features/search/components/SearchFilters.tsx', content);
