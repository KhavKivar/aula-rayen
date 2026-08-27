import { Global, Module } from '@nestjs/common';

import { db, DRIZZLE } from './index';

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
export class DbModule {}
