/**
 * Pregateste doar fisierele publice pentru Cloudflare Pages, fara modificari in GitHub/Netlify.
 * Cloudflare: Build command = node scripts/build-cloudflare.mjs ; Output directory = dist
 * Domeniu propriu viitor: variabila CF_SITE_URL=https://intoarcerealatine.ro
 */
import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),".."),out=resolve(root,"dist");
const legacy="https://spontaneous-quokka-e0bede.netlify.app";
const raw=process.env.CF_SITE_URL||process.env.CF_PAGES_URL||"";
const origin=raw?new URL(raw).origin:"";
if(process.env.CF_PAGES&& !origin)throw Error("CF_PAGES_URL lipsește; nu publicăm SEO cu domeniul greșit.");
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
const files=[
 "index.html","acasa.html","metoda-clar.html","constelatii.html","lucram-impreuna.html",
 "despre-mine.html","resurse.html","live.html","politica-confidentialitate.html",
 "politica-cookies.html","termeni-utilizare.html","robots.txt","sitemap.xml"
];
for(const file of files){const src=resolve(root,file);if(!existsSync(src))throw Error("Fișier public absent: "+file);
 let text=readFileSync(src,"utf8");
 if(origin){
  text=text.replaceAll(legacy,origin);
  if(file==="politica-confidentialitate.html"){
   text=text.replaceAll("furnizorul de găzduire Netlify","furnizorul de găzduire Cloudflare");
   text=text.replaceAll("<strong>Netlify</strong> pentru găzduirea site-ului","<strong>Cloudflare</strong> pentru găzduirea site-ului");
   text=text.replaceAll("https://www.netlify.com/privacy/","https://www.cloudflare.com/privacypolicy/");
   text=text.replaceAll(">Netlify</a>",">Cloudflare</a>");
   text=text.replaceAll("de către Netlify","de către Cloudflare");
  }
  if(file==="politica-cookies.html"){
   text=text.replace("Netlify găzduiește în prezent versiunea existentă. Dacă găzduirea se mută pe Cloudflare, această informație trebuie actualizată înainte de lansare.","Această versiune a site-ului este găzduită pe Cloudflare Pages. Datele tehnice și posibilele cookie-uri ale infrastructurii trebuie verificate în răspunsurile efective ale serviciului.");
  }
 }
 writeFileSync(resolve(out,file),text,"utf8");
}
for(const dir of ["assets","content","Intoarcerea_la_tine_files"]){
 const src=resolve(root,dir);if(!existsSync(src))throw Error("Director necesar absent: "+dir);
 cpSync(src,resolve(out,dir),{recursive:true});
}
const headers=`/content/*.json
  Cache-Control: public, max-age=0, must-revalidate
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
`;
writeFileSync(resolve(out,"_headers"),headers,"utf8");
// Nu publicam fise de audit, configuratia Pages CMS, surse istorice, scripturi QA sau fisiere ascunse.
if(existsSync(resolve(out,".pages.yml")))throw Error("Config CMS nu trebuie publicata in dist.");
const homepage=readFileSync(resolve(out,"acasa.html"),"utf8");
if(!homepage.includes('assets/carusel-metoda/07.webp'))throw Error("Nu exista imaginea creației conștiente.");
if(origin){
 const canonical=`<link rel="canonical" href="${origin}/acasa.html"`;
 if(!homepage.includes(canonical))throw Error("Canonical neschimbat; oprește publicarea.");
}
console.log("Cloudflare Pages: build static pregătit în dist; origin:",origin||"(local, sursa Netlify)"); 
