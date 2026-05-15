CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" serial NOT NULL,
	"preferred_date" varchar(100),
	"notes" text,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"message" text,
	"source" varchar(100) DEFAULT 'ai_agent',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;