import 'dotenv/config';
import { db } from '../src/lib/db.js';
import { sql, isNull, and, eq, desc } from 'drizzle-orm';
import { articles } from '../src/db/schema/articles.js';

async function testSearch() {
  const publishedArticles = await db.select({
      id: articles.id,
      title: articles.title,
      volumeId: articles.volumeId
  }).from(articles).where(eq(articles.status, 'PUBLISHED'));
  
  console.log("Published articles:", publishedArticles);
  process.exit(0);
}

testSearch().catch(console.error);
