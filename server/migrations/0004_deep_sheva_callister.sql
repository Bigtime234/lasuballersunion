DROP INDEX "unique_user_match_idx";--> statement-breakpoint
ALTER TABLE "match_likes" ADD COLUMN "liked_faculty_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "faculty_id" integer;--> statement-breakpoint
ALTER TABLE "match_likes" ADD CONSTRAINT "match_likes_liked_faculty_id_faculties_id_fk" FOREIGN KEY ("liked_faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_match_team_idx" ON "match_likes" USING btree ("user_id","match_id","liked_faculty_id");