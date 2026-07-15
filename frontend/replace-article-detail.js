const fs = require('fs');
let content = fs.readFileSync('src/app/articles/[id]/page.tsx', 'utf8');

// Add Image and FileText import
content = content.replace(/import { TrackViewTrigger } from "@\/features\/articles\/components\/TrackViewTrigger";/, 'import { TrackViewTrigger } from "@/features/articles/components/TrackViewTrigger";\nimport Image from "next/image";\nimport { FileText } from "lucide-react";');

// Update header
const metadataAndTitle = `<ArticleMetadata article={article} />
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
              {article.coverImageUrl || article.journalCoverImageUrl ? (
                <Image 
                  src={article.coverImageUrl || article.journalCoverImageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight mb-4">
                {article.title}
              </h1>
              <AuthorsList authors={authors} />
            </div>
          </div>`;

content = content.replace(/<ArticleMetadata article=\{article\} \/>\n          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">\n            \{article\.title\}\n          <\/h1>\n          <AuthorsList authors=\{authors\} \/>/g, metadataAndTitle);

fs.writeFileSync('src/app/articles/[id]/page.tsx', content);
