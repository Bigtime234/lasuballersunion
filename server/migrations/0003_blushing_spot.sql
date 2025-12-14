CREATE TABLE "season_standings" (
	"id" serial PRIMARY KEY NOT NULL,
	"season_id" integer NOT NULL,
	"faculty_id" integer NOT NULL,
	"category" "match_category" NOT NULL,
	"final_position" integer NOT NULL,
	"played" integer DEFAULT 0 NOT NULL,
	"won" integer DEFAULT 0 NOT NULL,
	"drawn" integer DEFAULT 0 NOT NULL,
	"lost" integer DEFAULT 0 NOT NULL,
	"goals_for" integer DEFAULT 0 NOT NULL,
	"goals_against" integer DEFAULT 0 NOT NULL,
	"goal_difference" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "season_standings" ADD CONSTRAINT "season_standings_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_standings" ADD CONSTRAINT "season_standings_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_season_faculty_category_idx" ON "season_standings" USING btree ("season_id","faculty_id","category");