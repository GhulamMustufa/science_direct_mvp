import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    const res = await pool.query('SELECT id, ojs_article_id, title, pdf_url FROM articles;');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error('Error querying:', error);
  } finally {
    await pool.end();
  }
}

main();
