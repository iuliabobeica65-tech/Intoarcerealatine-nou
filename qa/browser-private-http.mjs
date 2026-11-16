// Isolated headless browser: every request fulfilled locally; no Cloudflare/Brevo.
import {chromium} from 'playwright';import assert from 'node:assert/strict';import {readFileSync,writeFileSync} from 'node:fs';import {join} from 'node:path';
import {database} from './d1-local.mjs';import {validationFetch} from '../infrastructure/cloud-validation/worker.mjs';import {now} from '../infrastructure/security.mjs';
const manifest=JSON.parse(readFileSync('.local/final-validation-2026-11-13/http-package-manifest.json'));
const origin='https://pregatire-infrastructura-ema.er-brevo-test-izolat.pages.dev',marker='12345678-1234-4234-8234-123456789abc',DB=database();
DB.sqlite.exec(readFileSync('docs/cloud-validation/bootstrap.sql.template','utf8').replaceAll('NOT_CREATED',marker));
DB.sqlite.prepare("INSERT INTO offerings(id,kind,title,status,starts_at,ends_at,capacity,location) VALUES('validation-http','live','Fixture','open',?,?,1,'Sintetic')").run(now()+7200,now()+10800);
const env={...JSON.parse(readFileSync('docs/cloud-validation/wrangler.preview.template.json')).env.preview.vars,DB,VALIDATION_ACTIVE:'true',VALIDATION_HTTP_REGISTRATIONS:'true',VALIDATION_EXPIRES_AT:String(now()+1800),VALIDATION_DATABASE_ID:'d630add8-e006-4379-b3ee-0b16307afdcb',VALIDATION_DATABASE_MARKER:marker,TEST_MODE:'true',TURNSTILE_SECRET:'fixture',TURNSTILE_SITE_KEY:'fixture',DATA_HMAC_KEY:'fixture-hmac-'.repeat(4),ADMIN_TOKEN:'fixture-admin-'.repeat(4)};
const prior=globalThis.fetch;let challenges=0,registrationCalls=0;
globalThis.fetch=async url=>{assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');challenges++;return Response.json({success:true,hostname:new URL(origin).hostname,action:'registration'});};
let browser;const errors=[];
try{
 browser=await chromium.launch({headless:true,...process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}});
 const context=await browser.newContext(),page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{const req=route.request(),url=new URL(req.url());
  if(url.hostname==='challenges.cloudflare.com'&&url.pathname==='/turnstile/v0/api.js')return route.fulfill({contentType:'text/javascript',body:"window.turnstile={render:(s,o)=>{window.fixtureCallback=o.callback;o.callback('fixture-token');return 1;},reset:()=>window.fixtureCallback('fixture-new-token')};"});
  assert.equal(url.origin,origin,'Unexpected external browser request');
  if(url.pathname.startsWith('/api/')){if(url.pathname==='/api/register')registrationCalls++;const response=await validationFetch(new Request(req.url(),{method:req.method(),headers:await req.allHeaders(),body:req.postData()||undefined}),env,{verifyAccess:async()=>true});return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});}
  const file=url.pathname==='/http-events.html'?'http-events.html':url.pathname.slice(1);if(!manifest.files.some(f=>f.file===file))return route.fulfill({status:404,body:''});
  return route.fulfill({contentType:file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':'text/html',body:readFileSync(join(manifest.artifactDirectory,file))});
 });
 await page.goto(origin+'/http-events.html');await page.locator('#admin').fill(env.ADMIN_TOKEN);await page.locator('#login button').click();await page.locator('#test').waitFor({state:'visible'});
 await page.locator('#consent').check();
 await page.locator('#submit').click();await page.waitForFunction(()=>document.querySelector('#rows')?.textContent.includes('confirmed'));assert.match(await page.locator('#status').innerText(),/confirmed/);
 await page.locator('#submit').click();await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('already_requested'));
 await page.locator('#email').fill('fixture-2@example.invalid');await page.locator('#submit').click();await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('409'));
 await page.locator('#rows button').click();await page.waitForFunction(()=>document.querySelector('#rows')?.textContent.includes('cancelled'));
 await page.locator('#submit').click();await page.waitForFunction(()=>document.querySelector('#rows')?.textContent.includes('fixture-2@example.invalid'));
 await page.locator('#email').fill('fixture@example.com');await page.locator('#submit').click();await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('adrese fictive'));assert.equal(registrationCalls,4);
 assert.equal(await page.locator('#admin').inputValue(),'');assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.deepEqual(errors,[]);
 const result={localBrowser:true,AccessAndTurnstileMocked:true,externalRequests:0,checks:['login','enroll','duplicate','capacity_refusal','cancel','released_seat','reject_non_synthetic','no_credential_storage'],registrationCalls,challenges,errors};writeFileSync('.local/final-validation-2026-11-13/browser-http-local.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser?.close();DB.close();globalThis.fetch=prior;}
