import { db } from './db.js';
import { articles } from './schema/articles.js';

async function main() {
  const result = await db.select({
    id: articles.id,
    pdfUrl: articles.pdfUrl,
    ojsUrl: articles.ojsUrl
  }).from(articles);
  console.log(result);
}

main().catch(console.error);
