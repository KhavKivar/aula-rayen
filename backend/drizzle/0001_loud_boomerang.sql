ALTER TABLE "webpay_sessions" RENAME COLUMN "buy_order_id" TO "buy_order";--> statement-breakpoint
ALTER TABLE "webpay_sessions" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "webpay_sessions" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "course_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "token_ws" text;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "vci" text;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "tb_amount" numeric;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "tb_status" text;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "card_number" text;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "accounting_date" text;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "transaction_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "authorization_code" text;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "payment_type_code" text;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "response_code" integer;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "installments_amount" numeric;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "installments_number" integer;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD COLUMN "committed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "webpay_sessions" ADD CONSTRAINT "webpay_sessions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "webpay_sessions_courseId_idx" ON "webpay_sessions" USING btree ("course_id");