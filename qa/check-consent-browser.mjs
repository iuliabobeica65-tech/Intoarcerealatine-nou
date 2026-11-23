import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true});
const base="http://127.0.0.1:4173";
try{
 const context=await browser.newContext();
 const requests=[];
 const page=await context.newPage();
 page.on("request",r=>{if(/googletagmanager\.com\/gtag|google-analytics\.com/.test(r.url()))requests.push(r.url())});
 await page.goto(base+"/echilibrarea-radacinilor.html",{waitUntil:"domcontentloaded"});
 await page.locator("#ib-consent").waitFor({state:"visible"});
 assert.equal(requests.length,0,"Analytics loaded before consent");
 await page.locator('#ib-consent [data-choice="deny"]').click();
 assert.equal(await page.locator("#ib-consent").isVisible(),false,"Deny must close consent dialog");
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#ib-consent").isVisible(),false,"Deny must persist after reload");
 assert.equal(requests.length,0,"Analytics loaded after denial");
 await page.locator("#ib-preferences").click();
 assert.equal(await page.locator("#ib-consent").isVisible(),true,"Preferences must reopen dialog");
 await page.locator('#ib-consent [data-choice="allow"]').click();
 await page.waitForTimeout(400);
 assert.equal(await page.evaluate(()=>localStorage.getItem("iulia-analytics-consent")),"allow");
 assert.ok(requests.some(x=>x.includes("googletagmanager.com/gtag")),"Analytics tag should load after opt-in");
 console.log("Consent browser QA passed: initial dialog, denied by default, persistence, reopen, opt-in");
 await context.close();
}finally{await browser.close()}
