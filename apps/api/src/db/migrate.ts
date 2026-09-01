import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to run migrations');
}

async function runMigrations() {
  const pool = new Pool({ connectionString, max: 1 });

  try {
    const migrationDb = drizzle({ client: pool });
    await migrate(migrationDb, { migrationsFolder: './drizzle' });
  } finally {
    await pool.end();
  }
}

void runMigrations();
