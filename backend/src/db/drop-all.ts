import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('Dropping and recreating public schema to clear all tables...');
  const client = await pool.connect();
  try {
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO public');
    await client.query('GRANT ALL ON SCHEMA public TO neondb_owner'); // standard Neon database owner
    console.log('✅ Successfully dropped and recreated schema! Database is clean.');
  } catch (error) {
    console.error('Error cleaning schema:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
