const fs = require('fs');
let content = fs.readFileSync('src/app/author/submit/page.tsx', 'utf8');

// Add coverImage state
content = content.replace(/const \[pdfFile, setPdfFile\] = useState<File \| null>\(null\);/g, 'const [pdfFile, setPdfFile] = useState<File | null>(null);\n  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);');

// Save to IndexedDB
const txLogic = `            const tx = db.transaction('files', 'readonly');
            const getReq = tx.objectStore('files').get('draftFile');
            getReq.onsuccess = () => {
              if (getReq.result) setPdfFile(getReq.result);
            };
            const getCoverReq = tx.objectStore('files').get('coverImageFile');
            getCoverReq.onsuccess = () => {
              if (getCoverReq.result) setCoverImageFile(getCoverReq.result);
            };`;
content = content.replace(/            const tx = db\.transaction\('files', 'readonly'\);\n            const getReq = tx\.objectStore\('files'\)\.get\('draftFile'\);\n            getReq\.onsuccess = \(\) => \{\n              if \(getReq\.result\) setPdfFile\(getReq\.result\);\n            \};/g, txLogic);

const saveDBLogic = `      // Save file to IndexedDB
      const saveFileToIndexedDB = (key: string, file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('SubmissionDB', 1);
          request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('files')) {
              db.createObjectStore('files');
            }
          };
          request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction('files', 'readwrite');
            tx.objectStore('files').put(file, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
          };
          request.onerror = () => reject(request.error);
        });
      };

      await saveFileToIndexedDB('draftFile', pdfFile!);
      if (coverImageFile) {
        await saveFileToIndexedDB('coverImageFile', coverImageFile);
      }`;
content = content.replace(/      \/\/ Save file to IndexedDB[\s\S]*?await saveFileToIndexedDB\(pdfFile!\);/g, saveDBLogic);

// Add to UI
const fileInput = `          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Manuscript File (PDF or DOCX, max 10MB) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Article Cover Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
            />`;
content = content.replace(/          <div>\n            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">\n              Manuscript File \(PDF or DOCX, max 10MB\) <span className="text-red-500">\*<\/span>\n            <\/label>\n            <input\n              type="file"\n              accept="\.pdf,\.docx,\.doc,application\/pdf,application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document,application\/msword"\n              onChange=\{\(e\) => setPdfFile\(e\.target\.files\?\.\[0\] \|\| null\)\}\n              className="mt-2 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"\n            \/>/g, fileInput);

fs.writeFileSync('src/app/author/submit/page.tsx', content);
