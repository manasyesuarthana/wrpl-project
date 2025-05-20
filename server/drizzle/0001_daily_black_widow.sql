ALTER TABLE "job_applications" ADD CONSTRAINT "pk_job_applications" PRIMARY KEY("user_id","company_name","applied_position","date_applied");--> statement-breakpoint
ALTER TABLE "recruiter_contacts" ADD CONSTRAINT "pk_recruiter_contacts" PRIMARY KEY("user_id","contact_email");--> statement-breakpoint
ALTER TABLE "job_applications" DROP COLUMN "job_id";--> statement-breakpoint
ALTER TABLE "recruiter_contacts" DROP COLUMN "recruiter_contact_id";