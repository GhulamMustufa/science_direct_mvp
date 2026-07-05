import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('Clearing old journals, submissions, and articles...');
  try {
    // Delete in correct order to respect foreign key constraints
    await pool.query('DELETE FROM articles');
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM journals');
    
    console.log('Successfully cleared old data!');
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
