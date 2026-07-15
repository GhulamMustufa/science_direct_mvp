const fs = require('fs');
let content = fs.readFileSync('src/app/journals/[id]/page.tsx', 'utf8');

// Add Image and BookOpen import
content = content.replace(/import \{ IssueList \} from "@\/features\/journals\/components\/IssueList";/, 'import { IssueList } from "@/features/journals/components/IssueList";\nimport Image from "next/image";\nimport { BookOpen } from "lucide-react";');

// Update header
const headerReplacement = `<div className="border-b border-zinc-200 pb-8 mb-8 dark:border-zinc-800 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 h-64 md:h-auto flex-shrink-0 relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
          {journal.coverImageUrl ? (
            <Image 
              src={journal.coverImageUrl}
              alt={journal.title}
              fill
              className="object-cover"
            />
          ) : (
            <BookOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {journal.title}
          </h1>
          {journal.issn && (
            <p className="mt-2 text-xs font-mono text-zinc-400 dark:text-zinc-500">
              ISSN: {journal.issn}
            </p>
          )}
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            {journal.description || "No description available for this journal."}
          </p>
        </div>
      </div>`;

content = content.replace(/<div className="border-b border-zinc-200 pb-8 mb-8 dark:border-zinc-800">[\s\S]*?<\/div>/, headerReplacement);

fs.writeFileSync('src/app/journals/[id]/page.tsx', content);
