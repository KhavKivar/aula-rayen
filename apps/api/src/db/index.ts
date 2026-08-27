import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';
import { env } from '@/config/env';

export const db = drizzle({ client: neon(env.DATABASE_URL), schema });
export const DRIZZLE = Symbol('DRIZZLE');
