import { renderArticles } from "./generate-articles.mjs";
/**
 * Pregateste doar fisierele publice pentru Cloudflare Pages, fara modificari in GitHub/Netlify.
 * Cloudflare: Build command = node scripts/build-cloudflare.mjs ; Output directory = dist
 * CF_SITE_URL este optional; la build Cloudflare se foloseste adresa stabila <proiect>.pages.dev.
 * Daca exista domeniu propriu confirmat, CF_SITE_URL seteaza acel domeniu explicit.
 */
import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),".."),out=resolve(root,"dist");
const legacy="https://spontaneous-quokka-e0bede.netlify.app";
// CF_PAGES_URL este adesea un URL unic pe deploy (<hash>.<project>.pages.dev).
// Canonical trebuie sa indice adresa STABILA a proiectului, nu hash-ul de deploy.
const explicit=process.env.CF_SITE_URL||"";
let origin="";
if(explicit){
 const u=new URL(explicit);
 if(u.protocol!=="https:"||u.username||u.password||u.search||u.hash||u.pathname!=="/")
  throw Error("CF_SITE_URL trebuie sa fie doar originea HTTPS (fara cale/query).");
 origin=u.origin;
}else if(process.env.CF_PAGES_URL){
 const u=new URL(process.env.CF_PAGES_URL);
 const labels=u.hostname.split(".");
 if(u.protocol!=="https:"||labels.length<3||labels.length>4||labels.at(-2)!=="pages"||labels.at(-1)!=="dev")
  throw Error("CF_PAGES_URL nu este un hostname Cloudflare Pages recunoscut; seteaza CF_SITE_URL explicit.");
 const project=labels.at(-3);
 if(!/^[a-z0-9-]+$/.test(project))throw Error("Nume de proiect Cloudflare invalid.");
 origin="https://"+project+".pages.dev";
}
if(process.env.CF_PAGES&&!origin)throw Error("Lipseste URL-ul Cloudflare; build blocat pentru SEO si politici.");
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
const files=[
 "index.html","acasa.html","metoda-clar.html","constelatii.html","lucram-impreuna.html",
 "despre-mine.html","resurse.html","live.html","articole.html","politica-confidentialitate.html",
 "politica-cookies.html","termeni-utilizare.html","robots.txt","sitemap.xml"
];
for(const file of files){const src=resolve(root,file);if(!existsSync(src))throw Error("Fișier public absent: "+file);
 let text=readFileSync(src,"utf8");
 if(origin){
  text=text.replaceAll(legacy,origin);
  if(file==="politica-confidentialitate.html"){
   text=text.replaceAll("https://www.netlify.com/privacy/","https://www.cloudflare.com/privacypolicy/");
   text=text.replaceAll("Netlify","Cloudflare");
  }
  if(file==="politica-cookies.html"){
   text=text.replace("Netlify găzduiește în prezent versiunea existentă. Dacă găzduirea se mută pe Cloudflare, această informație trebuie actualizată înainte de lansare.","Această versiune a site-ului este găzduită pe Cloudflare Pages.");
   text=text.replaceAll("Netlify","Cloudflare");
  }
 }
 // Cloudflare Pages face redirect de la /pagina.html la /pagina (URL canonic fara extensie).
 // Metadatele SEO si sitemap-ul trebuie sa indice direct adresa finala, fara 301.
 if(origin){
  const pages=["acasa","metoda-clar","constelatii","lucram-impreuna","despre-mine","live","resurse","articole","politica-confidentialitate","politica-cookies","termeni-utilizare"];
  for(const page of pages)text=text.replaceAll(origin+"/"+page+".html",origin+"/"+page);
  if(file==="index.html"){
   text=text.replace('href="./acasa.html"','href="'+origin+'/acasa"');
  }
  if(file.endsWith(".html") && file!=="index.html" && !/<link\s+rel=["']canonical["']/i.test(text)){
   const page=file.slice(0,-5);
   text=text.replace("</head>",'<link rel="canonical" href="'+origin+"/"+page+'"></head>');
  }
  if(file==="sitemap.xml")text=text.replace('  <url><loc>'+origin+'/</loc></url>\n','');
 }
 // Legături de navigare vizibile și utile pe toate paginile, fără repetarea cuvintelor-cheie în titluri.
 if(file.endsWith(".html")&&file!=="index.html"){
  if(file==="constelatii.html"){
   const title="Constelații familiale și sistemice | Iulia Bobeica";
   const desc="Descoperă cum se desfășoară o constelație familială sau sistemică: roluri, reprezentanți, tipare și explorarea percepțiilor, fără concluzii impuse.";
   text=text.replace(/<title>[^<]*<\/title>/,"<title>"+title+"</title>");
   text=text.replace(/<meta name="description" content="[^"]*"/,'<meta name="description" content="'+desc+'"');
   text=text.replace(/<meta property="og:title" content="[^"]*"/,'<meta property="og:title" content="'+title+'"');
   text=text.replace(/<meta property="og:description" content="[^"]*"/,'<meta property="og:description" content="'+desc+'"');
  }
  if(file==="metoda-clar.html"){
   const title="Metoda CLAR: tipare și legi universale | Iulia Bobeica";
   const desc="Metoda CLAR din Întoarcerea la tine: explorăm tipare, percepții, valori și cele șapte legi universale prin întrebări și situații concrete.";
   text=text.replace(/<title>[^<]*<\/title>/,"<title>"+title+"</title>");
   text=text.replace(/<meta name="description" content="[^"]*"/,'<meta name="description" content="'+desc+'"');
   text=text.replace(/<meta property="og:title" content="[^"]*"/,'<meta property="og:title" content="'+title+'"');
   text=text.replace(/<meta property="og:description" content="[^"]*"/,'<meta property="og:description" content="'+desc+'"');
  }
  const topics='<nav class="wrap" aria-label="Teme de explorat" style="padding-top:22px;padding-bottom:12px"><span style="margin-right:12px">Descoperă și:</span><a style="text-decoration:underline;margin-right:20px" href="./constelatii.html">Constelații familiale și sistemice</a><a style="text-decoration:underline;margin-right:20px" href="./metoda-clar.html#cele-sapte-legi">Legi universale și Metoda CLAR</a><a style="text-decoration:underline" href="./articole.html">Articole pe categorii</a></nav>';
  if(!text.includes('<footer class="site-footer">'))throw Error("Lipsește subsolul din "+file);
  text=text.replace('<footer class="site-footer">','<footer class="site-footer">'+topics);
  if(file==="acasa.html"&&origin){
   const schema={"@context":"https://schema.org","@type":"WebSite","name":"Întoarcerea la tine","url":origin+"/","inLanguage":"ro-RO","creator":{"@type":"Person","name":"Iulia Bobeica"}};
   text=text.replace("</head>",'<script type="application/ld+json">'+JSON.stringify(schema)+'</script></head>');
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
// O singura pagina de start indexabila: / redirectioneaza permanent la /acasa.
// Regula Cloudflare are prioritate fata de fisierul index.html.
writeFileSync(resolve(out,"_redirects"),"/ /acasa 301\n","utf8");
// Nu publicam fise de audit, configuratia Pages CMS, surse istorice, scripturi QA sau fisiere ascunse.
if(existsSync(resolve(out,".pages.yml")))throw Error("Config CMS nu trebuie publicata in dist.");
const homepage=readFileSync(resolve(out,"acasa.html"),"utf8");
if(!homepage.includes('assets/carusel-metoda/07.webp'))throw Error("Nu exista imaginea creației conștiente.");
if(origin){
 const canonical=`<link rel="canonical" href="${origin}/acasa"`;
 if(!homepage.includes(canonical))throw Error("Canonical neschimbat; oprește publicarea.");
}
renderArticles(out,origin);
console.log("Cloudflare Pages: build static pregătit în dist; origin:",origin||"(local, sursa Netlify)"); 
