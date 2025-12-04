CREATE TYPE "public"."match_category" AS ENUM('men', 'women');--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "category" "match_category" DEFAULT 'men' NOT NULL;