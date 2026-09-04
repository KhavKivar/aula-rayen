import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE } from '@/db';
import { course_purchases, courses, user, webpay_sessions } from '@/db/schema';
import type { Database, NewWebPaySession, WebPaySession } from '@/db/types';
import { and, desc, eq, isNull } from 'drizzle-orm';

type CommitDetails = Pick<
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
>;

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

  async findPayments(limit: number) {
    return this.db
      .select({
        buyOrderId: webpay_sessions.buyOrderId,
        amount: webpay_sessions.amount,
        createdAt: webpay_sessions.createdAt,
        committedAt: webpay_sessions.committedAt,
        responseCode: webpay_sessions.responseCode,
        tbStatus: webpay_sessions.tbStatus,
        cardNumber: webpay_sessions.cardNumber,
        authorizationCode: webpay_sessions.authorizationCode,
        userId: user.id,
        buyerName: user.name,
        buyerEmail: user.email,
        courseId: courses.id,
        courseTitle: courses.title,
      })
      .from(webpay_sessions)
      .innerJoin(user, eq(webpay_sessions.userId, user.id))
      .innerJoin(courses, eq(webpay_sessions.courseId, courses.id))
      .orderBy(desc(webpay_sessions.createdAt))
      .limit(limit);
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
    response: CommitDetails,
  ): Promise<WebPaySession | null> {
    return this.db.transaction(async (tx) => {
      const [webPaySession] = await tx
        .update(webpay_sessions)
        .set({
          ...response,
          committedAt: new Date(),
        })
        .where(eq(webpay_sessions.buyOrderId, buyOrderId))
        .returning();

      await tx
        .insert(course_purchases)
        .values({
          userId,
          courseId,
        })
        .onConflictDoNothing();

      return webPaySession ?? null;
    });
  }

  /**
   * Persists a non-authorized gateway response for audit without
   * completing the payment. Never touches already completed rows and
   * never grants course access.
   */
  async recordAttempt(
    buyOrderId: string,
    response: CommitDetails,
  ): Promise<WebPaySession | null> {
    const [webPaySession] = await this.db
      .update(webpay_sessions)
      .set({ ...response })
      .where(
        and(
          eq(webpay_sessions.buyOrderId, buyOrderId),
          isNull(webpay_sessions.committedAt),
        ),
      )
      .returning();

    return webPaySession ?? null;
  }
}
