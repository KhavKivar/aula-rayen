import 'dotenv/config';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';

export const db = drizzle({ client: neon(process.env.DATABASE_URL!), schema });
