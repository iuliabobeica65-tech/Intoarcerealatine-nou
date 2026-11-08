import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
const results=[];
try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const slug of ['comunitate','evenimente']){
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:4173/'+slug,{waitUntil:'networkidle'});
   const reject=page.getByRole('button',{name:'Refuză',exact:true});if(await reject.isVisible())await reject.click();
   assert(await page.locator('form button').isDisabled());assert.equal(await page.locator('h1').count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
   assert.equal(await page.locator('input[type=checkbox]:checked').count(),0);
   if(slug==='comunitate')assert(await page.locator('#whatsapp').isHidden());
   await page.screenshot({path:`qa-artifacts/${slug}-validated-${width}.png`,fullPage:true});
   assert.deepEqual(errors,[]);results.push({slug,width,defaultOff:true,overflow:false,errors});await page.close();
  }
  await context.close();
 }
 // Exercise UI with explicit provider/Turnstile fixtures; no external API or emails.
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();let submitted;
 await page.route('**/api/config',r=>r.fulfill({json:{community:true,events:false,turnstileSiteKey:'fixture',consentVersion:'community-2026-11-08-v1',whatsapp:null}}));
 await page.route('https://challenges.cloudflare.com/**',r=>r.fulfill({contentType:'text/javascript',body:'window.turnstile={render:(s,o)=>{o.callback("fixture-token");return 1},reset:()=>{}};window.erTurnstileReady();'}));
 await page.route('**/api/community',async r=>{submitted=r.request().postDataJSON();await r.fulfill({status:202,json:{status:'check_email'}});});
 await page.goto('http://127.0.0.1:4173/comunitate',{waitUntil:'networkidle'});
 const reject=page.getByRole('button',{name:'Refuză',exact:true});if(await reject.isVisible())await reject.click();
 await page.locator('#email').fill('fixture@example.invalid');await page.locator('#name').fill('Test');await page.locator('[name=consent]').check();await page.locator('form button').click();
 await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('Verifică e-mailul'));
 assert.equal(submitted.consent,true);assert.equal(submitted.turnstile,'fixture-token');assert.equal(submitted.email,'fixture@example.invalid');
 results.push({uiSubmit:'passed',providers:'simulated',realEmails:0});await context.close();
}finally{await browser.close();}
writeFileSync('qa-artifacts/infrastructure-browser-results.json',JSON.stringify(results,null,2));console.log(`Infrastructure browser: ${results.length} checks passed (8 layouts + simulated submission).`);
