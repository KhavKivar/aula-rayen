import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE } from '@/db';
import { course_purchases, webpay_sessions } from '@/db/schema';
import type { Database, NewWebPaySession, WebPaySession } from '@/db/types';
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

  async completeAuthorizedPayment(
    buyOrderId: string,
    userId: string,
    courseId: number,
    response: Pick<
      NewWebPaySession,
      | 'vci'
      | 'tbAmount'
      | 'tbStatus'
      | 'cardNumber'
      | 'accountingDate'
      | 'transactionDate'
      | 'authorizationCode'
      | 'paymentTypeCode'
      | 'responseCode'
      | 'installmentsAmount'
      | 'installmentsNumber'
    >,
  ): Promise<WebPaySession | null> {
    await this.db.batch([
      this.db
        .update(webpay_sessions)
        .set({
          ...response,
          committedAt: new Date(),
        })
        .where(eq(webpay_sessions.buyOrderId, buyOrderId))
        .returning({ buyOrderId: webpay_sessions.buyOrderId }),
      this.db
        .insert(course_purchases)
        .values({
          userId,
          courseId,
        })
        .onConflictDoNothing(),
    ]);

    return this.findById(buyOrderId);
  }
}
