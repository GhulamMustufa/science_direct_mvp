import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index.js';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding database...');
  try {
    console.log('Clearing existing data (cascading)...');
    // Drop all data using TRUNCATE with CASCADE to handle foreign keys
    await pool.query(`
      TRUNCATE TABLE 
        users, 
        journals, 
        volumes, 
        issues, 
        articles, 
        categories, 
        keywords, 
        article_files, 
        notifications 
      RESTART IDENTITY CASCADE;
    `);
    
    console.log('Inserting Admin User...');
    const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
    const [adminUser] = await db.insert(schema.users).values({
      email: 'ojsadmin@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      firstName: 'System',
      lastName: 'Admin',
    }).returning();

    console.log('Inserting Author User...');
    const authorPasswordHash = await bcrypt.hash('Author123!', 10);
    const [authorUser] = await db.insert(schema.users).values({
      email: 'author@gmail.com',
      passwordHash: authorPasswordHash,
      role: 'author',
      firstName: 'Jane',
      lastName: 'Doe',
    }).returning();
    
    console.log('Inserting Reader User...');
    const readerPasswordHash = await bcrypt.hash('Reader123!', 10);
    const [readerUser] = await db.insert(schema.users).values({
      email: 'reader@gmail.com',
      passwordHash: readerPasswordHash,
      role: 'reader',
      firstName: 'John',
      lastName: 'Smith',
    }).returning();

    console.log('Inserting Journals...');
    const [journal1] = await db.insert(schema.journals).values({
      title: 'Journal of Advanced Computer Science',
      description: 'A peer-reviewed academic journal covering all aspects of computer science.',
      issn: '1234-5678',
    }).returning();

    const [journal2] = await db.insert(schema.journals).values({
      title: 'International Journal of Theoretical Physics',
      description: 'Publishes original research and reviews in theoretical physics and related fields.',
      issn: '8765-4321',
    }).returning();

    console.log('Inserting Categories...');
    await db.insert(schema.categories).values([
      { name: 'Computer Science' },
      { name: 'Physics' },
      { name: 'Mathematics' },
    ]);

    console.log('Inserting Submissions (Draft/Submitted)...');
    await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal1.id,
      title: 'A Novel Approach to Machine Learning Optimization',
      abstract: 'This paper introduces a new optimization technique for deep neural networks that significantly reduces training time.',
      status: 'SUBMITTED',
      pdfUrl: null,
    });
    
    await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal2.id,
      title: 'Quantum Entanglement in Macroscopic Systems',
      abstract: 'We explore the theoretical possibilities of maintaining quantum entanglement at macroscopic scales.',
      status: 'DRAFT',
      pdfUrl: null,
    });

    console.log('Inserting Published Articles...');
    await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal1.id,
      title: 'Distributed Consensus Algorithms for Blockchain',
      abstract: 'An extensive survey and analysis of modern distributed consensus algorithms used in blockchain technologies.',
      status: 'PUBLISHED',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      doi: '10.1234/jacs.2026.001',
      publishedAt: new Date(),
      views: 150,
      downloads: 45,
    });

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
