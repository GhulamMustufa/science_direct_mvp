const fs = require('fs');
let content = fs.readFileSync('src/features/journals/components/JournalCard.tsx', 'utf8');

// Add BookOpen import
content = content.replace(/import { Journal } from "@\/types";/, 'import { Journal } from "@/types";\nimport { BookOpen } from "lucide-react";');

// Add else logic
const replacement = `{journal.coverImageUrl ? (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
          <Image 
            src={journal.coverImageUrl} 
            alt={journal.title} 
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
        </div>
      )}`;

content = content.replace(/\{journal\.coverImageUrl && \([\s\S]*?      \)\}/, replacement);

fs.writeFileSync('src/features/journals/components/JournalCard.tsx', content);
