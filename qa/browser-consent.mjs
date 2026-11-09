import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
const checks=[];
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 let analyticsLoads=0;
 // Real GA and other external services are never contacted by this test.
 await context.route('**/*',route=>{
  const u=new URL(route.request().url());
  if(u.hostname==='127.0.0.1')return route.continue();
  if(u.hostname==='www.googletagmanager.com'){analyticsLoads++;return route.fulfill({contentType:'text/javascript',body:'/* inert GA fixture */'});}
  return route.abort();
 });
 const page=await context.newPage();const disabled=()=>page.evaluate(()=>window['ga-disable-G-DCLDSBZ2S8']);
 await page.goto('http://127.0.0.1:4173/comunitate',{waitUntil:'networkidle'});
 assert.equal(analyticsLoads,0);assert.equal(await disabled(),true);checks.push('initial: no GA load');
 await page.getByRole('button',{name:'Refuză',exact:true}).click();
 await page.reload({waitUntil:'networkidle'});assert.equal(analyticsLoads,0);assert.equal(await disabled(),true);checks.push('deny persists without GA');
 await page.getByRole('button',{name:'Preferințe cookies',exact:true}).click();
 await page.getByRole('button',{name:'Acceptă',exact:true}).click();
 await page.waitForFunction(()=>window.dataLayer?.length>=4);
 assert.equal(await disabled(),false);assert.equal(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count(),1);checks.push('allow creates one inert GA loader');
 await page.getByRole('button',{name:'Preferințe cookies',exact:true}).click();
 await page.getByRole('button',{name:'Refuză',exact:true}).click();
 await page.waitForFunction(()=>localStorage.getItem('iulia-analytics-consent')==='deny'&&window['ga-disable-G-DCLDSBZ2S8']===true);
 await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('script[src*="googletagmanager.com/gtag/js"]').count(),0);checks.push('withdraw reloads with GA disabled');
 await context.close();
}finally{await browser.close();}
writeFileSync('qa-artifacts/consent-results.json',JSON.stringify({checks,externalServices:'blocked or inert fixtures'},null,2));
console.log(`Consent browser: ${checks.length} checks passed; no real GA requests.`);
