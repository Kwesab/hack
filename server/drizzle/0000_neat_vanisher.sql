CREATE TYPE "public"."delivery_method" AS ENUM('digital', 'courier', 'cash_on_delivery');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('transcript', 'certificate', 'attestation');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('paystack', 'cash_on_delivery');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending', 'processing', 'ready', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'student');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"resource" varchar(100) NOT NULL,
	"resource_id" varchar(255),
	"details" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_requests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"sub_type" varchar(100),
	"status" "request_status" DEFAULT 'pending',
	"delivery_method" "delivery_method" NOT NULL,
	"delivery_address" text,
	"amount" numeric(10, 2) NOT NULL,
	"is_paid" boolean DEFAULT false,
	"payment_method" "payment_method",
	"payment_reference" varchar(255),
	"documents" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"admin_notes" text,
	"download_url" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "file_uploads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" numeric NOT NULL,
	"url" varchar(500) NOT NULL,
	"purpose" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "otp_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"otp" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"student_id" varchar(50),
	"is_verified" boolean DEFAULT false,
	"ghana_card" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;