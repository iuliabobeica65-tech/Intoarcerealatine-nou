import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const available=existsSync('.local/cloud-validation/baseline-export.sql')&&existsSync('.local/cloud-validation/post-test-export.sql');
test('Actual D1 baseline export restores six migrations and synthetic initial records locally',{skip:!available},()=>{
 const db=new DatabaseSync(':memory:');try{
  db.exec(readFileSync('.local/cloud-validation/baseline-export.sql','utf8'));
  assert.equal(db.prepare('SELECT count(*) n FROM d1_migrations').get().n,6);
  assert.equal(db.prepare('SELECT count(*) n FROM registrations').get().n,2);
  assert.equal(db.prepare("SELECT count(*) n FROM registrations WHERE email NOT LIKE '%@example.invalid'").get().n,0);
  assert.equal(db.prepare("SELECT status FROM invoice_jobs WHERE order_id='validation-order'").get().status,'awaiting_provider');
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
  assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
 }finally{db.close();}
});
test('Actual post-test D1 export preserves capacity, duplicate and review evidence',{skip:!available},()=>{
 const db=new DatabaseSync(':memory:');try{
  db.exec(readFileSync('.local/cloud-validation/post-test-export.sql','utf8'));
  assert.equal(db.prepare("SELECT count(*) n FROM registrations WHERE offering_id='validation-load'").get().n,3);
  assert.equal(db.prepare("SELECT count(*) n FROM registrations WHERE offering_id='validation-duplicate'").get().n,1);
  assert.equal(db.prepare("SELECT status FROM registrations WHERE id='validation-confirmed'").get().status,'cancelled');
  assert.equal(db.prepare("SELECT status FROM invoice_jobs WHERE order_id='validation-order'").get().status,'review');
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
  assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
 }finally{db.close();}
});
