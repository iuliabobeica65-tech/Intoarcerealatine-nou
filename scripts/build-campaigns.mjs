/**
 * Microsite independent pentru campanii (Cloudflare Pages, alt proiect decât site-ul oficial).
 * Framework: None | Build command: node scripts/build-campaigns.mjs | Output: dist-campanii
 * Root în GitHub rămâne /, dar se publică EXCLUSIV conținutul din campanii/ + legale selectate.
 * O nouă campanie = campanii/<slug>/index.html; fiecare își păstrează URL-ul.
 */
import {cpSync,existsSync,mkdirSync,readFileSync,rmSync,writeFileSync,copyFileSync} from "node:fs";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const out=resolve(root,"dist-campanii");
const base=resolve(root,"campanii");
const defaultCampaign="nu-mai-vreau-asa";
let origin=(process.env.CAMPAIGNS_SITE_URL||"").trim().replace(/\/$/,"");
if(!origin && process.env.CF_PAGES_URL){
 const u=new URL(process.env.CF_PAGES_URL);
 const parts=u.hostname.split(".");
 if(u.protocol!=="https:"||parts.at(-2)!=="pages"||parts.at(-1)!=="dev") throw Error("CF_PAGES_URL invalid");
 origin="https://"+parts.at(-3)+".pages.dev";
}
if(origin && (!origin.startsWith("https://")||new URL(origin).pathname!=="/"))throw Error("CAMPAIGNS_SITE_URL trebuie să fie originea HTTPS");
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
cpSync(resolve(base,"assets"),resolve(out,"assets"),{recursive:true});
const pic="6ad1278ba01de7.05166081_9d2529da-d079-4183-89d4-6b674ef83217.jpg";
copyFileSync(resolve(root,"Intoarcerea_la_tine_files",pic),resolve(out,"assets/portret-iulia.jpg"));
const folders=["nu-mai-vreau-asa"];
for(const slug of folders){
 const src=resolve(base,slug,"index.html");
 if(!existsSync(src))throw Error("Lipsește campania "+slug);
 let html=readFileSync(src,"utf8");
 const target=origin?origin+"/"+slug+"/":"";
 html=html.replaceAll("__PAGE_URL__",target).replaceAll("__SITE_ORIGIN__",origin);
 if(!origin) html=html.replace(/<link rel="canonical" href="">/,"");
 mkdirSync(resolve(out,slug),{recursive:true});
 writeFileSync(resolve(out,slug,"index.html"),html);
 if(!html.includes("chat.whatsapp.com/Jc7JR8fdItK82QeTleS732"))throw Error("Link WhatsApp lipsă în campanie");
}
for(const legal of ["politica-confidentialitate.html","politica-cookies.html","termeni-utilizare.html"]){
 let html=readFileSync(resolve(root,legal),"utf8")
  .replaceAll("https://spontaneous-quokka-e0bede.netlify.app",origin||"")
  .replaceAll("https://www.netlify.com/privacy/","https://www.cloudflare.com/privacypolicy/")
  .replaceAll("Netlify","Cloudflare")
  .replaceAll('href="/"','href="/nu-mai-vreau-asa/"');
 // Pagina de campanie nu colectează date prin formular; datele în grup sunt procesate de Meta.
 html=html.replace("</main>",'<section class="wrap" style="margin:20px auto 35px"><p><strong>Campanii și grupuri WhatsApp:</strong> pagina campaniei oferă un link extern către grupul WhatsApp. Alăturarea este voluntară, iar membrii grupului pot vedea numărul de telefon al celorlalți membri. Datele din WhatsApp sunt prelucrate și conform politicii furnizorului Meta. Nu transmite în grup informații medicale sau alte date sensibile.</p></section></main>');
 writeFileSync(resolve(out,legal),html);
}
const rootIndex='<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/nu-mai-vreau-asa/"><title>Campanii · Întoarcerea la tine</title></head><body><p>Campania activă: <a href="/nu-mai-vreau-asa/">Nu mai vreau așa. Dar de ce fac tot la fel?</a></p></body></html>';
writeFileSync(resolve(out,"index.html"),rootIndex);
writeFileSync(resolve(out,"_headers"),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n');
writeFileSync(resolve(out,"robots.txt"),"User-agent: *\nAllow: /\n");
console.log("Microsite campanii pregătit:",out, "campanii:",folders.join(", "));
