-- Read-path indexes for event listing, reminder lookup and expired throttle cleanup.
-- No table/record deletion and no changes to capacity or payment semantics.
CREATE INDEX offerings_status_starts ON offerings(status,starts_at,id);
CREATE INDEX registrations_status_offering ON registrations(status,offering_id,id);
CREATE INDEX rate_limits_expiry ON rate_limits(expires_at);
