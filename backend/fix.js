const fs = require('fs');

// Fix submissions.service.ts
let subService = fs.readFileSync('backend/src/features/submissions/submissions.service.ts', 'utf8');
subService = subService.replace(/    let coverImageUrl: string \| undefined = undefined;\n    if \(coverImageFile\) \{\n      const coverUploadResult = await cloudinary\.uploader\.upload\(coverImageFile\.path, \{\n        resource_type: 'image',\n        folder: 'article_covers',\n      \}\);\n      coverImageUrl = coverUploadResult\.secure_url;\n      try \{\n        fs\.unlinkSync\(coverImageFile\.path\);\n      \} catch \(err\) \{\n        console\.error\(`Failed to delete temporary cover file \$\{coverImageFile\.path\}:`, err\);\n      \}\n    \}\n\n    \/\/ Delete the local file after successful upload/g, (match, offset) => {
  if (offset > 2000) return '    // Delete the local file after successful upload'; // Only remove the second occurrence
  return match;
});
fs.writeFileSync('backend/src/features/submissions/submissions.service.ts', subService);

// Fix journals.service.ts
let jourService = fs.readFileSync('backend/src/features/journals/journals.service.ts', 'utf8');
jourService = jourService.replace(/title: string; description\?: string; issn\?: string; ojsJournalId\?: string/g, 'title: string; description?: string; issn?: string; ojsJournalId?: string; coverImageUrl?: string');
jourService = jourService.replace(/title\?: string; description\?: string; issn\?: string/g, 'title?: string; description?: string; issn?: string; coverImageUrl?: string');
fs.writeFileSync('backend/src/features/journals/journals.service.ts', jourService);

