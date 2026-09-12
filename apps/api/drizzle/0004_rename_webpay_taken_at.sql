DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'webpay_sessions'
      AND column_name = 'istaken_at'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'webpay_sessions'
      AND column_name = 'taken_at'
  ) THEN
    ALTER TABLE "webpay_sessions" RENAME COLUMN "istaken_at" TO "taken_at";
  END IF;
END $$;
