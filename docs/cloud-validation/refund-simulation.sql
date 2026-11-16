-- DB-only simulation. Does not call or enable Stripe, SmartBill or Brevo.
UPDATE orders SET status='refunded',updated_at=unixepoch() WHERE id='validation-order' AND status='paid';
SELECT status FROM orders WHERE id='validation-order';
SELECT status FROM invoice_jobs WHERE order_id='validation-order';
-- Expected refunded / review. This validates the D1 trigger, not a real Stripe webhook.
