CREATE TABLE IF NOT EXISTS "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"ojs_submission_id" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"journal_title" varchar(500),
	"status" varchar(50) NOT NULL,
	"submitted_at" timestamp NOT NULL,
	"last_status_update" timestamp,
	"ojs_url" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "submissions_ojs_submission_id_unique" UNIQUE("ojs_submission_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
