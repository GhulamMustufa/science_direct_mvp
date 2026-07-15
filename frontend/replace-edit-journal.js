const fs = require('fs');
let content = fs.readFileSync('src/app/admin/journals/[id]/edit/page.tsx', 'utf8');

// Add coverImage state
content = content.replace(/const \[formData, setFormData\] = useState\(\{/g, 'const [coverImage, setCoverImage] = useState<File | null>(null);\n  const [formData, setFormData] = useState({');

// Update handleSubmit to use FormData
const submitLogic = `const data = new FormData();
    data.append('title', formData.title);
    if (formData.description) data.append('description', formData.description);
    if (formData.issn) data.append('issn', formData.issn);
    if (coverImage) data.append('coverImage', coverImage);

    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.updateJournal(params.id as string, data);`;

content = content.replace(/setIsSubmitting\(true\);\n    setError\(null\);\n    try \{\n      await adminService\.updateJournal\(params\.id as string, formData\);/g, submitLogic);

// Add file input
const fileInput = `          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cover Image (Optional - Upload to replace)
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">`;

content = content.replace(/<div className="flex justify-end gap-3 pt-4">/g, fileInput);

fs.writeFileSync('src/app/admin/journals/[id]/edit/page.tsx', content);
