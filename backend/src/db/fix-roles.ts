import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('Fixing incorrect admin roles...');
  try {
    // Demote everyone except the main admin
    await pool.query("UPDATE users SET role = 'author' WHERE email != 'ojsadmin@gmail.com' AND role = 'admin'");
    console.log('Successfully fixed roles!');
  } catch (error) {
    console.error('Error fixing roles:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
