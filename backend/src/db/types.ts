import type { course_purchases, courses, webpay_sessions } from './schema';
import type { db } from './index';

export type Database = typeof db;

export type WebPaySession = typeof webpay_sessions.$inferSelect;
export type NewWebPaySession = typeof webpay_sessions.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type CoursePurchase = typeof course_purchases.$inferSelect;
export type NewCoursePurchase = typeof course_purchases.$inferInsert;
