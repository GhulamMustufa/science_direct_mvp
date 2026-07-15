const fs = require('fs');
let fileNames = [
  'src/app/articles/[id]/page.tsx',
  'src/features/articles/components/ArticleCard.tsx',
  'src/features/journals/components/JournalCard.tsx',
  'src/app/journals/[id]/page.tsx'
];

fileNames.forEach(name => {
  let content = fs.readFileSync(name, 'utf8');
  if (name.includes('ArticleCard.tsx')) {
    content = content.replace(/src=\{displayImageUrl\}/, 'src={displayImageUrl as string}');
  } else if (name.includes('JournalCard.tsx')) {
    content = content.replace(/src=\{journal\.coverImageUrl\}/, 'src={journal.coverImageUrl as string}');
  } else if (name.includes('articles/[id]/page.tsx')) {
    content = content.replace(/src=\{article\.coverImageUrl \|\| article\.journalCoverImageUrl\}/, 'src={(article.coverImageUrl || article.journalCoverImageUrl) as string}');
  } else if (name.includes('journals/[id]/page.tsx')) {
    content = content.replace(/src=\{journal\.coverImageUrl\}/, 'src={journal.coverImageUrl as string}');
  }
  fs.writeFileSync(name, content);
});
