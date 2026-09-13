import { relations, sql } from 'drizzle-orm';

import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  numeric,
  serial,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const slotStatusEnum = pgEnum('slot_status', ['available', 'disabled']);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'expired',
  'cancelled',
]);

export const availability_slots = pgTable('availability_slots', {
  id: serial('id').primaryKey().notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  assignedTo: text('assigned_to')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: slotStatusEnum('status').notNull().default('available'),
});

export const booking_attempts = pgTable(
  'booking_attempts',
  {
    id: serial('id').primaryKey().notNull(),
    clientId: text('client_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    slotId: integer('slot_id')
      .notNull()
      .references(() => availability_slots.id, { onDelete: 'restrict' }),
    status: bookingStatusEnum('status').notNull().default('pending'),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('one_active_booking_per_slot')
      .on(table.slotId)
      .where(sql`${table.status} IN ('pending', 'confirmed')`),
  ],
);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const webpay_sessions = pgTable(
  'webpay_sessions',
  {
    buyOrderId: text('buy_order').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'restrict' }),
    amount: integer('amount').notNull(),
    tokenWs: text('token_ws'),
    vci: text('vci'),
    tbAmount: numeric('tb_amount', { mode: 'number' }),
    tbStatus: text('tb_status'),
    cardNumber: text('card_number'),
    accountingDate: text('accounting_date'),
    transactionDate: timestamp('transaction_date', { withTimezone: true }),
    authorizationCode: text('authorization_code'),
    paymentTypeCode: text('payment_type_code'),
    responseCode: integer('response_code'),
    installmentsAmount: numeric('installments_amount', { mode: 'number' }),
    installmentsNumber: integer('installments_number'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    committedAt: timestamp('committed_at', { withTimezone: true }),
    takenAt: timestamp('taken_at', { withTimezone: true }),
  },
  (table) => [
    index('webpay_sessions_userId_idx').on(table.userId),
    index('webpay_sessions_courseId_idx').on(table.courseId),
  ],
);

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  videoLink: text('video_link').notNull(),
  fileLink: text('file_link').notNull(),
  duration: text('duration').notNull(),
  price: integer('price').notNull(),
});

export const course_purchases = pgTable(
  'course_purchases',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('course_purchases_userId_idx').on(table.userId),
    index('course_purchases_courseId_idx').on(table.courseId),
    uniqueIndex('course_purchases_user_course_idx').on(
      table.userId,
      table.courseId,
    ),
  ],
);

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    issuer: text('issuer').notNull(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('account_issuer_accountId_uidx').on(
      table.issuer,
      table.accountId,
    ),
    index('account_userId_idx').on(table.userId),
  ],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
