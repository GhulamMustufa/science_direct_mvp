CREATE TABLE IF NOT EXISTS "article_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"file_url" varchar(2048) NOT NULL,
	"original_name" varchar(500),
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "articles_ojs_article_id_unique";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_files" ADD CONSTRAINT "article_files_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN IF EXISTS "ojs_article_id";