-- Read-only checkpoints, run only against the approved test D1 UUID.
SELECT marker,purpose FROM _validation_identity;
SELECT o.id,o.capacity,
 (SELECT count(*) FROM registrations r WHERE r.offering_id=o.id AND r.status IN ('reserved','confirmed')) AS occupied
FROM offerings o WHERE o.id LIKE 'validation-%';
SELECT count(*) AS non_synthetic_contacts FROM registrations WHERE email NOT LIKE '%@example.invalid';
SELECT status,count(*) AS jobs FROM outbox GROUP BY status;
SELECT id,status FROM orders WHERE id LIKE 'validation-%';
SELECT order_id,status FROM invoice_jobs WHERE order_id LIKE 'validation-%';
PRAGMA foreign_key_check;
PRAGMA integrity_check;
