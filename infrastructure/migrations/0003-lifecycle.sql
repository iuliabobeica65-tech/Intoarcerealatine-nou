CREATE TRIGGER offering_lifecycle AFTER UPDATE OF revision ON offerings
WHEN NEW.revision=OLD.revision+1
BEGIN
 UPDATE outbox SET status='stopped' WHERE status='pending' AND registration_id IN (SELECT id FROM registrations WHERE offering_id=NEW.id);
 INSERT OR IGNORE INTO outbox(id,registration_id,template_id,revision,due_at)
 SELECT lower(hex(randomblob(16))),r.id,
 CASE NEW.kind
 WHEN 'live' THEN CASE NEW.status WHEN 'cancelled' THEN 'LIVE-06' WHEN 'completed' THEN 'LIVE-04' ELSE 'LIVE-05' END
 WHEN 'webinar' THEN CASE NEW.status WHEN 'cancelled' THEN 'WEB-05' WHEN 'completed' THEN 'WEB-04' ELSE 'WEB-03' END
 WHEN 'session' THEN CASE NEW.status WHEN 'cancelled' THEN 'SES-04' ELSE 'SES-03' END
 WHEN 'workshop' THEN CASE NEW.status WHEN 'cancelled' THEN 'WRK-05' WHEN 'completed' THEN 'WRK-06' ELSE 'WRK-07' END
 WHEN 'constellation' THEN CASE NEW.status WHEN 'cancelled' THEN 'WRK-05' WHEN 'completed' THEN 'WRK-06' ELSE 'WRK-07' END
 ELSE CASE NEW.status WHEN 'cancelled' THEN 'PRG-08' WHEN 'completed' THEN 'PRG-06' ELSE 'PRG-07' END END,
 NEW.revision,unixepoch()
 FROM registrations r WHERE r.offering_id=NEW.id AND r.status IN ('reserved','confirmed') AND NOT(NEW.kind='session' AND NEW.status='completed');
 UPDATE registrations SET status=CASE NEW.status WHEN 'cancelled' THEN 'cancelled' ELSE 'completed' END
 WHERE offering_id=NEW.id AND status IN ('reserved','confirmed') AND NEW.status IN ('cancelled','completed');
END;
