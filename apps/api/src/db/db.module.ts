import { Global, Module, type OnApplicationShutdown } from '@nestjs/common';

import { db, DRIZZLE, pool } from './index';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useValue: db,
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    await pool.end();
  }
}
