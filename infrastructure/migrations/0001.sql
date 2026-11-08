PRAGMA foreign_keys = ON;
CREATE TABLE consent_requests (
 id TEXT PRIMARY KEY, email_hash TEXT NOT NULL, version TEXT NOT NULL,
 requested_at INTEGER NOT NULL, request_day INTEGER NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','submitted','failed')),
 source TEXT NOT NULL DEFAULT 'community', UNIQUE(email_hash, request_day)
);
CREATE INDEX consent_recent ON consent_requests(email_hash, requested_at);
CREATE TABLE rate_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE offerings (
 id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('live','webinar','workshop','constellation','individual_program','group_program','session')),
 title TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('draft','open','closed','cancelled','completed')),
 starts_at INTEGER NOT NULL, ends_at INTEGER NOT NULL, timezone TEXT NOT NULL DEFAULT 'Europe/Bucharest',
 capacity INTEGER NOT NULL CHECK(capacity>0), location TEXT NOT NULL,
 access_url TEXT, revision INTEGER NOT NULL DEFAULT 1,
 price_test_id TEXT, amount INTEGER CHECK(amount>0), currency TEXT,
 CHECK(ends_at>starts_at)
);
CREATE TABLE registrations (
 id TEXT PRIMARY KEY, offering_id TEXT NOT NULL REFERENCES offerings(id), email TEXT NOT NULL,
 name TEXT NOT NULL DEFAULT '', token_hash TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL CHECK(status IN ('reserved','confirmed','cancelled','completed')),
 created_at INTEGER NOT NULL, UNIQUE(offering_id,email)
);
CREATE TRIGGER capacity_insert BEFORE INSERT ON registrations WHEN NEW.status IN ('reserved','confirmed')
BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM offerings WHERE id=NEW.offering_id AND status='open' AND starts_at>unixepoch())
 OR (SELECT count(*) FROM registrations WHERE offering_id=NEW.offering_id AND status IN ('reserved','confirmed')) >=
 (SELECT capacity FROM offerings WHERE id=NEW.offering_id) THEN RAISE(ABORT,'unavailable') END;
END;
CREATE TRIGGER capacity_update BEFORE UPDATE OF status ON registrations
WHEN NEW.status IN ('reserved','confirmed') AND OLD.status NOT IN ('reserved','confirmed')
BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM offerings WHERE id=NEW.offering_id AND status='open' AND starts_at>unixepoch())
 OR (SELECT count(*) FROM registrations WHERE offering_id=NEW.offering_id AND status IN ('reserved','confirmed')) >=
 (SELECT capacity FROM offerings WHERE id=NEW.offering_id) THEN RAISE(ABORT,'unavailable') END;
END;
CREATE TABLE orders (
 id TEXT PRIMARY KEY, registration_id TEXT NOT NULL UNIQUE REFERENCES registrations(id),
 session_id TEXT UNIQUE, payment_intent TEXT UNIQUE, amount INTEGER NOT NULL, currency TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('created','pending','paid','failed','refunded','review')),
 updated_at INTEGER NOT NULL
);
CREATE TABLE payment_events (id TEXT PRIMARY KEY, type TEXT NOT NULL, processed_at INTEGER NOT NULL);
CREATE TABLE outbox (
 id TEXT PRIMARY KEY, registration_id TEXT NOT NULL REFERENCES registrations(id), template_id TEXT NOT NULL,
 revision INTEGER NOT NULL, due_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending'
 CHECK(status IN ('pending','sending','sent','stopped','review')), message_id TEXT,
 UNIQUE(registration_id,template_id,revision)
);
CREATE TABLE invoice_jobs (
 order_id TEXT PRIMARY KEY REFERENCES orders(id), status TEXT NOT NULL DEFAULT 'awaiting_provider',
 CHECK(status IN ('awaiting_provider','review'))
);
