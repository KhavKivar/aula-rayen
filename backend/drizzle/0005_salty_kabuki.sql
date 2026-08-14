ALTER TABLE "webpay_sessions" ADD COLUMN "amount" integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "webpay_sessions" ALTER COLUMN "amount" DROP DEFAULT;