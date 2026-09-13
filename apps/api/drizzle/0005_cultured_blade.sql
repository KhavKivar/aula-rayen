CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."slot_status" AS ENUM('available', 'disabled');--> statement-breakpoint
CREATE TABLE "availability_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"assigned_to" text NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "slot_status" DEFAULT 'available' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"slot_id" integer NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_attempts" ADD CONSTRAINT "booking_attempts_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_attempts" ADD CONSTRAINT "booking_attempts_slot_id_availability_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."availability_slots"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_active_booking_per_slot" ON "booking_attempts" USING btree ("slot_id") WHERE "booking_attempts"."status" IN ('pending', 'confirmed');


CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
ALTER TABLE "availability_slots"
ADD CONSTRAINT "no_overlapping_slots_per_professional"
EXCLUDE USING gist (
  "assigned_to" WITH =,
  tsrange("start_time", "end_time", '[)') WITH &&
);