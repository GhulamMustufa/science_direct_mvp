require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function seed() {
  await client.connect();
  
  // Get all articles
  const articlesRes = await client.query('SELECT id FROM articles;');
  const articles = articlesRes.rows;
  
  // Get all categories
  const categoriesRes = await client.query('SELECT id FROM categories;');
  const categories = categoriesRes.rows;

  if (articles.length === 0 || categories.length === 0) {
    console.log("No articles or categories found.");
    return await client.end();
  }

  // Assign 2 random categories to each article
  for (const article of articles) {
    const cat1 = categories[Math.floor(Math.random() * categories.length)].id;
    let cat2 = categories[Math.floor(Math.random() * categories.length)].id;
    while(cat2 === cat1) {
       cat2 = categories[Math.floor(Math.random() * categories.length)].id;
    }

    try {
        await client.query('INSERT INTO article_categories (article_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [article.id, cat1]);
        await client.query('INSERT INTO article_categories (article_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [article.id, cat2]);
    } catch(e) {
        console.error(e);
    }
  }

  console.log(`Successfully seeded ${articles.length} articles with categories!`);
  await client.end();
}
seed();
