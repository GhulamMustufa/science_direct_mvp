DO $$ BEGIN
 CREATE TYPE "public"."article_status" AS ENUM('DRAFT', 'SUBMITTED', 'REVISIONS_REQUIRED', 'ACCEPTED', 'REJECTED', 'PUBLISHED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "submissions";--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "articles_issue_id_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "issue_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "published_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "submitter_id" uuid;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "volume_id" uuid;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "status" "article_status" DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles" ADD CONSTRAINT "articles_submitter_id_users_id_fk" FOREIGN KEY ("submitter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles" ADD CONSTRAINT "articles_volume_id_volumes_id_fk" FOREIGN KEY ("volume_id") REFERENCES "public"."volumes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles" ADD CONSTRAINT "articles_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "password_hash";