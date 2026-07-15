const fs = require('fs');
let content = fs.readFileSync('backend/src/features/submissions/submissions.service.ts', 'utf8');

content = content.replace(/async submitArticle\(submitterId: string, data: any, file: Express\.Multer\.File\) {/, 'async submitArticle(submitterId: string, data: any, file: Express.Multer.File, coverImageFile?: Express.Multer.File) {');

const coverImageUpload = `    let coverImageUrl: string | undefined = undefined;
    if (coverImageFile) {
      const coverUploadResult = await cloudinary.uploader.upload(coverImageFile.path, {
        resource_type: 'image',
        folder: 'article_covers',
      });
      coverImageUrl = coverUploadResult.secure_url;
      try {
        fs.unlinkSync(coverImageFile.path);
      } catch (err) {
        console.error(\`Failed to delete temporary cover file \${coverImageFile.path}:\`, err);
      }
    }`;

content = content.replace(/const fileUrl = uploadResult\.secure_url;\n\n    \/\/ Delete the local file after successful upload/g, 'const fileUrl = uploadResult.secure_url;\n\n' + coverImageUpload + '\n\n    // Delete the local file after successful upload');

content = content.replace(/file\.originalname,\n      data\.additionalAuthors\n    \);/g, 'file.originalname,\n      data.additionalAuthors,\n      coverImageUrl\n    );');

fs.writeFileSync('backend/src/features/submissions/submissions.service.ts', content);

let repoContent = fs.readFileSync('backend/src/features/submissions/submissions.repository.ts', 'utf8');
repoContent = repoContent.replace(/fileUrl: string,\n    originalFileName: string,\n    additionalAuthors\?: string\n  \) {/, 'fileUrl: string,\n    originalFileName: string,\n    additionalAuthors?: string,\n    coverImageUrl?: string\n  ) {');

repoContent = repoContent.replace(/additionalAuthors,\n      status:/, 'additionalAuthors,\n      coverImageUrl,\n      status:');

fs.writeFileSync('backend/src/features/submissions/submissions.repository.ts', repoContent);
