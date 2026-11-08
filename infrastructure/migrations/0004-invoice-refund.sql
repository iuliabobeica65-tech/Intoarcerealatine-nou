CREATE TRIGGER invoice_refund_review AFTER UPDATE OF status ON orders
WHEN NEW.status='refunded' AND OLD.status!='refunded'
BEGIN
 UPDATE invoice_jobs SET status='review' WHERE order_id=NEW.id;
 UPDATE billing_documents SET status='review',error_code='refund_accountant_review' WHERE order_id=NEW.id AND operation='invoice';
 UPDATE billing_notifications SET status='review' WHERE status='pending' AND document_id IN (SELECT id FROM billing_documents WHERE order_id=NEW.id);
END;
