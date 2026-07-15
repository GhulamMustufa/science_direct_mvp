const fs = require('fs');
let content = fs.readFileSync('src/features/articles/components/ArticleCard.tsx', 'utf8');

// Add FileText import
content = content.replace(/import { Article } from "@\/types";/, 'import { Article } from "@/types";\nimport { FileText } from "lucide-react";');

// Add else logic
const replacement = `{displayImageUrl ? (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
          <Image 
            src={displayImageUrl} 
            alt={article.title} 
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
        </div>
      )}`;

content = content.replace(/\{displayImageUrl && \([\s\S]*?      \)\}/, replacement);

fs.writeFileSync('src/features/articles/components/ArticleCard.tsx', content);
