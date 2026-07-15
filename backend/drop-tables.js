require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await pool.query('DROP TABLE IF EXISTS reading_list_articles CASCADE;');
    await pool.query('DROP TABLE IF EXISTS reading_lists CASCADE;');
    console.log('Tables dropped');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
