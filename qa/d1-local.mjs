import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
// Real SQLite schema/constraints, D1-shaped API. Does not simulate network/D1 quotas.
export function database() {
 const sqlite=new DatabaseSync(':memory:');
 for(const file of readdirSync('infrastructure/migrations').sort())sqlite.exec(readFileSync(`infrastructure/migrations/${file}`,'utf8'));
 return wrapSqlite(sqlite);
}
export function wrapSqlite(sqlite){
 sqlite.exec('PRAGMA foreign_keys=ON');
 const wrap=(sql,args=[])=>({sql,args,bind(...values){return wrap(sql,values);},
  async first(){return sqlite.prepare(sql).get(...args)||null;},
  async all(){return {results:sqlite.prepare(sql).all(...args)};},
  async run(){return {success:true,meta:sqlite.prepare(sql).run(...args)};}
 });
 // D1 batch is one atomic operation. Do not yield between local statements.
 return {sqlite,prepare:sql=>wrap(sql),async batch(statements){sqlite.exec('BEGIN');try{const result=[];for(const s of statements)result.push({success:true,meta:sqlite.prepare(s.sql).run(...s.args)});sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}},close(){sqlite.close();}};
}
