ALTER TABLE "account" ADD COLUMN "issuer" text;--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "account"
		WHERE "provider_id" NOT IN ('credential', 'google')
	) THEN
		RAISE EXCEPTION 'Cannot backfill account issuer: unsupported provider_id found';
	END IF;
END $$;--> statement-breakpoint
UPDATE "account"
SET
	"issuer" = CASE
		WHEN "provider_id" = 'credential' THEN 'local:credential'
		WHEN "provider_id" = 'google' THEN 'https://accounts.google.com'
	END,
	"account_id" = CASE
		WHEN "provider_id" = 'credential' THEN "user_id"
		ELSE "account_id"
	END;--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "account"
		GROUP BY "issuer", "account_id"
		HAVING COUNT(*) > 1
	) THEN
		RAISE EXCEPTION 'Cannot create account identity index: duplicate issuer/account_id values found';
	END IF;
END $$;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" USING btree ("issuer","account_id");
