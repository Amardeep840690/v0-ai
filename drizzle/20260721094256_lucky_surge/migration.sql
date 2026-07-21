CREATE TYPE "message_role" AS ENUM('USER', 'ASSISTANT');--> statement-breakpoint
CREATE TYPE "message_type" AS ENUM('RESULT', 'ERROR');--> statement-breakpoint
CREATE TABLE "fragments" (
	"id" varchar(255) PRIMARY KEY,
	"message_id" varchar(255) NOT NULL UNIQUE,
	"sandbox_url" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"files" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(255) PRIMARY KEY,
	"content" text NOT NULL,
	"role" "message_role" NOT NULL,
	"type" "message_type" NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY,
	"clerk_id" varchar(255) NOT NULL UNIQUE,
	"email" varchar(255) UNIQUE,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"name" varchar(255),
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fragments" ADD CONSTRAINT "fragments_message_id_messages_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;