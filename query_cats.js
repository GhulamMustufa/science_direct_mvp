const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/science_direct' });
async function check() {
  const res = await pool.query('SELECT * FROM article_categories;');
  console.log('article_categories count:', res.rows.length);
  if (res.rows.length > 0) {
    console.log(res.rows);
  }
  pool.end();
}
check();
