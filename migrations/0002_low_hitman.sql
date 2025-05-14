ALTER TABLE "documents" ALTER COLUMN "is_archived" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "is_favorite" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "updated_at" SET NOT NULL;