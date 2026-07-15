const fs = require('fs');
const content = `- [x] Update \`backend/src/db/schema/journals.ts\` with \`coverImageUrl\`.
- [x] Update \`backend/src/db/schema/articles.ts\` with \`coverImageUrl\`.
- [x] Run \`drizzle-kit generate\` and \`drizzle-kit push\`.
- [x] Update \`journals.routes.ts\` and \`journals.controller.ts\` for file uploads.
- [x] Update \`submissions.routes.ts\` and \`submissions.controller.ts\` for optional file uploads.
- [x] Update \`frontend/src/types/index.ts\`.
- [x] Update Journal creation/edit forms with file upload field.
- [x] Update Submission form with optional file upload field.
- [x] Placeholder image in frontend for articles and journals.`;
fs.writeFileSync('/Users/mac/.gemini/antigravity-ide/brain/016315a8-4d61-4fd9-a305-b5c2aab1a34a/task.md', content);
