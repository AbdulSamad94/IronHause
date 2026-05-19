ALTER TABLE "bookings" ALTER COLUMN "lead_id" DROP DEFAULT;--> statement-breakpoint
DROP SEQUENCE IF EXISTS "bookings_lead_id_seq";
