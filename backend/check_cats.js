require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function check() {
  await client.connect();
  const res = await client.query('SELECT * FROM article_categories;');
  console.log('article_categories count:', res.rows.length);
  if (res.rows.length > 0) {
    console.log(res.rows);
  }
  await client.end();
}
check();
