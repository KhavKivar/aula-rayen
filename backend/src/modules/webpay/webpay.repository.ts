import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE } from '../../db/drizzle';
import {
  webpay_sessions,
  type NewWebPaySession,
  type WebPaySession,
} from '../../db/schema';
import type { Database } from '../../db/drizzle';
import { eq } from 'drizzle-orm';

@Injectable()
export class WebPayRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  findAll(): Promise<WebPaySession[]> {
    return this.db.select().from(webpay_sessions);
  }

  async findById(buyOrderId: string): Promise<WebPaySession | null> {
    const [session] = await this.db
      .select()
      .from(webpay_sessions)
      .where(eq(webpay_sessions.buyOrderId, buyOrderId));
    return session ?? null;
  }
  async create(
    newWebPaySession: NewWebPaySession,
  ): Promise<WebPaySession | null> {
    const [webpaySession] = await this.db
      .insert(webpay_sessions)
      .values(newWebPaySession)
      .returning();

    return webpaySession ?? null;
  }
}
