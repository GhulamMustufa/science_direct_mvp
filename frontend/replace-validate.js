const fs = require('fs');
let content = fs.readFileSync('src/app/author/submit/validate/page.tsx', 'utf8');

// Update getFileFromIndexedDB to get both
const getFileLogic = `  const getFileFromIndexedDB = async (key: string): Promise<File | null> => {
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
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        const getReq = store.get(key);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => reject(getReq.error);
      };
      request.onerror = () => reject(request.error);
    });
  };`;
content = content.replace(/  const getFileFromIndexedDB = async \(\): Promise<File \| null> => \{[\s\S]*?    \}\);\n  \};/g, getFileLogic);

const submitLogic = `    try {
      const file = await getFileFromIndexedDB('draftFile');
      if (!file) {
        throw new Error("Manuscript file not found in local cache. Please re-upload.");
      }
      const coverImageFile = await getFileFromIndexedDB('coverImageFile');

      const formData = new FormData();
      if (formDataState.journalId) {
        formData.append("journalId", formDataState.journalId);
      }
      formData.append("section", formDataState.section);
      formData.append("language", formDataState.language);
      formData.append("authors", JSON.stringify(formDataState.authors));
      formData.append("pdf", file);
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }`;
content = content.replace(/    try \{\n      const file = await getFileFromIndexedDB\(\);\n      if \(!file\) \{\n        throw new Error\("Manuscript file not found in local cache\. Please re-upload\."\);\n      \}\n\n      const formData = new FormData\(\);\n      if \(formDataState\.journalId\) \{\n        formData\.append\("journalId", formDataState\.journalId\);\n      \}\n      formData\.append\("section", formDataState\.section\);\n      formData\.append\("language", formDataState\.language\);\n      formData\.append\("authors", JSON\.stringify\(formDataState\.authors\)\);\n      formData\.append\("pdf", file\);/g, submitLogic);

const cleanupLogic = `      // Clean up IndexedDB
      const request = indexedDB.open('SubmissionDB', 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').delete('draftFile');
        tx.objectStore('files').delete('coverImageFile');
      };`;
content = content.replace(/      \/\/ Clean up IndexedDB\n      const request = indexedDB\.open\('SubmissionDB', 1\);\n      request\.onsuccess = \(\) => \{\n        const db = request\.result;\n        const tx = db\.transaction\('files', 'readwrite'\);\n        tx\.objectStore\('files'\)\.delete\('draftFile'\);\n      \};/g, cleanupLogic);

fs.writeFileSync('src/app/author/submit/validate/page.tsx', content);
