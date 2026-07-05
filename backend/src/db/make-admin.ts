import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import bcrypt from 'bcrypt';
import * as schema from './schema/index.js';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const ADMIN_EMAIL    = process.argv[2] || 'admin@example.com';
const ADMIN_PASSWORD = process.argv[3] || 'Admin123!';
const ADMIN_NAME     = process.argv[4] || 'Super Admin';

async function makeAdmin() {
  console.log(`\nCreating/promoting admin user: ${ADMIN_EMAIL}`);
  try {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const [existing] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, ADMIN_EMAIL))
      .limit(1);

    if (existing) {
      await db
        .update(schema.users)
        .set({ role: 'admin' })
        .where(eq(schema.users.email, ADMIN_EMAIL));
      console.log(`✅ Existing user "${ADMIN_EMAIL}" promoted to admin.`);
    } else {
      await db.insert(schema.users).values({
        firstName: 'Admin',
        lastName: 'User',
        email: ADMIN_EMAIL,
        role: 'admin',
      });
      console.log(`✅ New admin user created: ${ADMIN_EMAIL}`);
    }

    console.log(`\nLogin credentials:`);
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Use POST /api/auth/login to get your token.\n`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

makeAdmin();
