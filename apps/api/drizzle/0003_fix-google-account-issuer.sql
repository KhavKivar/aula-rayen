DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "account" legacy
		JOIN "account" current
			ON current."account_id" = legacy."account_id"
			AND current."issuer" = 'https://accounts.google.com'
		WHERE legacy."issuer" = 'local:oauth:google'
			AND legacy."user_id" <> current."user_id"
	) THEN
		RAISE EXCEPTION 'Cannot normalize Google issuer: identity belongs to multiple users';
	END IF;
END $$;--> statement-breakpoint
DELETE FROM "account" legacy
USING "account" current
WHERE legacy."issuer" = 'local:oauth:google'
	AND current."issuer" = 'https://accounts.google.com'
	AND legacy."account_id" = current."account_id"
	AND legacy."user_id" = current."user_id";--> statement-breakpoint
UPDATE "account"
SET "issuer" = 'https://accounts.google.com'
WHERE "issuer" = 'local:oauth:google';
