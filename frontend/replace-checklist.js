const fs = require('fs');
let content = fs.readFileSync('src/app/author/submit/page.tsx', 'utf8');

// Update state
content = content.replace(/styling: false,\n    ethics: false,/, 'styling: false,\n    ethics: false,\n    contentLimits: false,');

// Add new checkbox
const newCheckbox = `            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.contentLimits}
                onChange={() => handleCheckboxChange("contentLimits")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Content Limits:</strong> The abstract is under 250 words and there are no more than 5 keywords.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.ethics}`;

content = content.replace(/            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800\/50 cursor-pointer transition">\n              <input\n                type="checkbox"\n                checked=\{checklist\.ethics\}/, newCheckbox);

fs.writeFileSync('src/app/author/submit/page.tsx', content);
