-- Additive migration. No participant or financial records are removed.
CREATE INDEX registrations_offering_status_id ON registrations(offering_id,status,id);
CREATE INDEX outbox_status_due ON outbox(status,due_at);
CREATE TRIGGER capacity_reduce BEFORE UPDATE OF capacity ON offerings
WHEN NEW.capacity < (SELECT count(*) FROM registrations WHERE offering_id=OLD.id AND status IN ('reserved','confirmed'))
BEGIN
 SELECT RAISE(ABORT,'capacity_below_occupied');
END;
