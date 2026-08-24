import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: './drizzle',
    });

    console.log('Migration successful');
  } catch (error) {
    console.error('Migration failed:');
    console.error(error);

    if (error instanceof Error && error.cause) {
      console.error('\nCause:');
      console.error(error.cause);
    }

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
