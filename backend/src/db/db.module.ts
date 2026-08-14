import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-http';

import { DRIZZLE } from './drizzle';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const sql = neon(process.env.DATABASE_URL!);
        return drizzle({ client: sql, schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
