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

    const [journal3] = await db.insert(schema.journals).values({
      title: 'Global Journal of Medical Sciences',
      description: 'Covers recent advancements in medical research, clinical studies, and health sciences.',
      issn: '9988-7766',
    }).returning();

    console.log('Inserting Categories...');
    const insertedCategories = await db.insert(schema.categories).values([
      { name: 'Alpha Amylase, Bacillus Subtilis' },
      { name: 'Antimicrobial Resistance' },
      { name: 'Biochemistry' },
      { name: 'Biodiesel' },
      { name: 'Biopolymer' },
      { name: 'Biotechnology' },
      { name: 'Caesarean Section' },
      { name: 'Environment' },
      { name: 'Enzyme Characterization' },
      { name: 'Enzyme Production' },
      { name: 'Folic acid' },
      { name: 'Global Deficiency Anemia' },
      { name: 'Health' },
      { name: 'Heart Disesse' },
      { name: 'Hepatitis C Virus' },
      { name: 'Hepatocellular Carcinoma (HCC)' },
      { name: 'Homocysteine' },
      { name: 'industrial application' },
      { name: 'Infectious Diseases' },
      { name: 'Keratin' },
      { name: 'Molecular Biology' },
      { name: 'Neuropharmacology' },
      { name: 'Nutrition and Physical Activity' },
      { name: 'Pharmacognosy' },
      { name: 'Physical Therapy' },
      { name: 'Physiotherapist' },
      { name: 'Proteolytic Microorganisms' },
      { name: 'Proteomics' },
      { name: 'Thalassemia' },
      { name: 'Uncategorized' },
      { name: 'Wong-Baker Faces Scale' }
    ]).returning();

    console.log('Inserting Submissions (Draft/Submitted)...');
    const [art1] = await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal1.id,
      title: 'A Novel Approach to Machine Learning Optimization',
      abstract: 'This paper introduces a new optimization technique for deep neural networks that significantly reduces training time.',
      status: 'SUBMITTED',
      pdfUrl: null,
    }).returning();
    
    const [art2] = await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal2.id,
      title: 'Quantum Entanglement in Macroscopic Systems',
      abstract: 'We explore the theoretical possibilities of maintaining quantum entanglement at macroscopic scales.',
      status: 'DRAFT',
      pdfUrl: null,
    }).returning();

    const [art3] = await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal3.id,
      title: 'Advancements in Hepatitis C Treatment',
      abstract: 'Recent clinical trials demonstrate the efficacy of a newly synthesized antiviral compound.',
      status: 'SUBMITTED',
      pdfUrl: null,
    }).returning();

    console.log('Inserting Published Articles...');
    const [art4] = await db.insert(schema.articles).values({
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
    }).returning();

    const [art5] = await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal2.id,
      title: 'The Role of Dark Matter in Galaxy Formation',
      abstract: 'We present new observational evidence supporting the dominant role of dark matter halos in early galaxy formation.',
      status: 'PUBLISHED',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      doi: '10.1234/ijtp.2026.042',
      publishedAt: new Date(),
      views: 340,
      downloads: 120,
    }).returning();

    const [art6] = await db.insert(schema.articles).values({
      submitterId: authorUser.id,
      journalId: journal3.id,
      title: 'Proteomics in Cancer Research: A Decade in Review',
      abstract: 'A comprehensive review of the last ten years of discoveries in cancer proteomics.',
      status: 'PUBLISHED',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      doi: '10.1234/gjms.2026.088',
      publishedAt: new Date(),
      views: 520,
      downloads: 200,
    }).returning();

    console.log('Linking Articles with Categories...');
    await db.insert(schema.articleCategories).values([
      { articleId: art1.id, categoryId: insertedCategories[17].id }, // ML -> industrial application
      { articleId: art2.id, categoryId: insertedCategories[20].id }, // Quantum -> Molecular Biology (placeholder)
      { articleId: art3.id, categoryId: insertedCategories[14].id }, // Hep C -> Hepatitis C Virus
      { articleId: art4.id, categoryId: insertedCategories[17].id }, // Blockchain -> industrial application
      { articleId: art5.id, categoryId: insertedCategories[7].id },  // Dark Matter -> Environment
      { articleId: art6.id, categoryId: insertedCategories[27].id }  // Proteomics -> Proteomics
    ]);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
