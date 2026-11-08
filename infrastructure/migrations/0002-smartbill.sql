CREATE TABLE billing_clients (
 id TEXT PRIMARY KEY, registration_id TEXT NOT NULL UNIQUE REFERENCES registrations(id),
 billing_data TEXT NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE billing_documents (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), client_id TEXT NOT NULL REFERENCES billing_clients(id),
 operation TEXT NOT NULL CHECK(operation IN ('invoice','credit')),
 source_key TEXT NOT NULL UNIQUE, original_document_id TEXT REFERENCES billing_documents(id),
 provider TEXT NOT NULL CHECK(provider IN ('mock','smartbill_native','smartbill_api')),
 status TEXT NOT NULL CHECK(status IN ('prepared','processing','issued_mock','external_recorded','review','failed')),
 series TEXT, number TEXT, provider_reference TEXT, error_code TEXT, created_at INTEGER NOT NULL,
 UNIQUE(provider,series,number)
);
CREATE UNIQUE INDEX one_invoice_per_order ON billing_documents(order_id) WHERE operation='invoice';
CREATE TABLE billing_notifications (
 document_id TEXT PRIMARY KEY REFERENCES billing_documents(id),
 sender TEXT NOT NULL CHECK(sender IN ('brevo','smartbill','none')),
 status TEXT NOT NULL CHECK(status IN ('pending','sending','sent','review','disabled')), message_id TEXT
);
