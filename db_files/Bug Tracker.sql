SELECT 'CREATE DATABASE bugtracker'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bugtracker')\gexec

\c bugtracker

CREATE TABLE IF NOT EXISTS "user" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "email" VARCHAR(254) NOT NULL UNIQUE,
  "password" VARCHAR(95) NOT NULL,
  "first_name" VARCHAR(50) NOT NULL,
  "last_name" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "modified_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "project" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "project_users" (
  "project_id" BIGINT NOT NULL,
  "user_id" BIGINT NOT NULL,
  "role_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS "role" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS "ticket" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "project_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "attached_to" BIGINT NOT NULL,
  "severity" INT NOT NULL,
  "status" INT NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "modified_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ticket_severity" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(25) NOT NULL,
  "color" CHAR(7) NOT NULL
);

CREATE TABLE IF NOT EXISTS "ticket_status" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(25) NOT NULL,
  "color" CHAR(7) NOT NULL
);

CREATE TABLE IF NOT EXISTS "ticket_attachment" (
  "ticket_id" BIGINT NOT NULL,
  "format" VARCHAR(10) NOT NULL,
  "url" VARCHAR(512) NOT NULL
);

CREATE TABLE IF NOT EXISTS "ticket_comment" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "ticket_id" BIGINT NOT NULL,
  "user_id" BIGINT NOT NULL,
  "project_id" BIGINT NOT NULL,
  "text" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "modified_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

ALTER TABLE "project_users" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE CASCADE;

ALTER TABLE "project_users" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE;

ALTER TABLE "project_users" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");

ALTER TABLE "ticket" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE CASCADE;

ALTER TABLE "ticket" ADD FOREIGN KEY ("created_by") REFERENCES "user" ("id") ON DELETE SET NULL;

ALTER TABLE "ticket" ADD FOREIGN KEY ("attached_to") REFERENCES "user" ("id") ON DELETE SET NULL;

ALTER TABLE "ticket" ADD FOREIGN KEY ("severity") REFERENCES "ticket_severity" ("id");

ALTER TABLE "ticket" ADD FOREIGN KEY ("status") REFERENCES "ticket_status" ("id");

ALTER TABLE "ticket_attachment" ADD FOREIGN KEY ("ticket_id") REFERENCES "ticket" ("id") ON DELETE CASCADE;

ALTER TABLE "ticket_comment" ADD FOREIGN KEY ("ticket_id") REFERENCES "ticket" ("id") ON DELETE CASCADE;

ALTER TABLE "ticket_comment" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE SET NULL;

ALTER TABLE "ticket_comment" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_user
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_ticket
BEFORE UPDATE ON ticket
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_comment
BEFORE UPDATE ON ticket_comment
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE VIEW ticket_info AS SELECT t.id, t.project_id, to_char(t.created_at, 'MM/DD/YYY') AS created_at, t.name, u.first_name, u.last_name, u1.first_name AS as_first_name, u1.last_name AS as_last_name, s.name AS severity, status.name AS status, t.description
    FROM ticket AS t, public.user AS u, public.user AS u1, ticket_severity AS s, ticket_status AS status
    WHERE t.created_by = u.id AND t.attached_to = u1.id AND t.severity = s.id AND t.status = status.id
