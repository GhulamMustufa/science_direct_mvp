import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { categories } from '../src/db/schema/categories.js';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment variables');
}

const pool = new pg.Pool({ connectionString });
const db = drizzle(pool);

const predefinedCategories = [
  "Alpha Amylase, Bacillus Subtilis",
  "Antimicrobial Resistance",
  "Biochemistry",
  "Biodiesel",
  "Biopolymer",
  "Biotechnology",
  "Caesarean Section",
  "Environment",
  "Enzyme Characterization",
  "Enzyme Production",
  "Folic acid",
  "Global Deficiency Anemia",
  "Health",
  "Heart Disesse",
  "Hepatitis C Virus",
  "Hepatocellular Carcinoma (HCC)",
  "Homocysteine",
  "industrial application",
  "Infectious Diseases",
  "Keratin",
  "Molecular Biology",
  "Neuropharmacology",
  "Nutrition and Physical Activity",
  "Pharmacognosy",
  "Physical Therapy",
  "Physiotherapist",
  "Proteolytic Microorganisms",
  "Proteomics",
  "Thalassemia",
  "Uncategorized",
  "Wong-Baker Faces Scale"
];

async function seed() {
  console.log('Seeding categories...');
  
  for (const name of predefinedCategories) {
    try {
      await db.insert(categories).values({ name }).onConflictDoNothing({ target: categories.name });
      console.log(`Inserted or ignored category: ${name}`);
    } catch (error) {
      console.error(`Error inserting category ${name}:`, error);
    }
  }
  
  console.log('Category seeding complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
