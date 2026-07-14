import { db } from './src/lib/db.js';
import { users, articles, articleAuthors } from './src/db/schema/index.js';
import { eq, or } from 'drizzle-orm';

async function check() {
  const allUsers = await db.select().from(users);
  console.log("All users:");
  console.log(allUsers.map(u => ({ id: u.id, name: u.firstName, email: u.email })));
  
  const allArticles = await db.select().from(articles);
  console.log("All articles:");
  console.log(allArticles.map(a => ({ id: a.id, title: a.title, status: a.status, submitterId: a.submitterId, volumeId: a.volumeId })));

  const allArticleAuthors = await db.select().from(articleAuthors);
  console.log("All articleAuthors:");
  console.log(allArticleAuthors);
}
check().catch(console.error).finally(() => process.exit(0));
