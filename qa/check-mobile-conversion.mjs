import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true});
const base="http://127.0.0.1:4173";
const pages=["acasa","echilibrarea-radacinilor","constelatii","legi-universale","sedinte-individuale","articole","lucram-impreuna"];
const widths=[320,390,768,1440];
const issues=[];
try{
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:850}});
  await context.addInitScript(()=>localStorage.setItem("iulia-analytics-consent","deny"));
  for(const name of pages){
   const page=await context.newPage();
   page.setDefaultTimeout(7000);
   try{
    const response=await page.goto(base+"/"+name+".html",{waitUntil:"domcontentloaded",timeout:15000});
    if(response?.status()!==200)issues.push(name+" "+width+": HTTP "+response?.status());
    const state=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth,main:!!document.querySelector("main"),h1:document.querySelectorAll("h1").length,links:[...document.querySelectorAll('a[href^="https://wa.me/"]')].length}));
    if(state.scroll>state.viewport+4)issues.push(name+" "+width+": horizontal overflow "+state.scroll);
    if(!state.main||state.h1!==1)issues.push(name+" "+width+": main/h1 "+state.main+"/"+state.h1);
    if(["sedinte-individuale","constelatii","lucram-impreuna"].includes(name)&&!state.links)issues.push(name+" "+width+": no WhatsApp CTA");
   }catch(e){issues.push(name+" "+width+": "+e.message.slice(0,160))}
   finally{await page.close()}
  }
  await context.close();
 }
 console.log(JSON.stringify({pages:pages.length,widths,issues},null,2));
 assert.equal(issues.length,0,"Mobile/layout checks failed");
}finally{await browser.close()}
