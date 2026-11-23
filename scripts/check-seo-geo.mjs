import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
const root=resolve(process.cwd(),"dist"), origin="https://iuliabobeica.ro";
const errors=[],warnings=[];
if(!existsSync(root)){console.error("Run node scripts/build-cloudflare.mjs first.");process.exit(2)}
const walk=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith(".html")?[join(dir,e.name)]:[]);
const pages=walk(root).filter(p=>!p.includes("/Intoarcerea_la_tine_files/"));
const sitemap=readFileSync(join(root,"sitemap.xml"),"utf8");
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
for(const u of urls){if(!u.startsWith(origin+"/"))errors.push("Off-domain sitemap URL: "+u);const p=new URL(u).pathname;const target=join(root,p.slice(1)+".html");if(!existsSync(target))errors.push("Sitemap page missing: "+p)}
if(new Set(urls).size!==urls.length)errors.push("Duplicate sitemap URLs");
for(const file of pages){const html=readFileSync(file,"utf8"),rel=file.slice(root.length+1);if(rel==="index.html")continue;
const canon=html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];if(!canon)warnings.push("Missing canonical: "+rel);else if(!canon.startsWith(origin+"/"))errors.push("Off-domain canonical: "+rel+" "+canon);
if(!/<title>[^<]+<\/title>/i.test(html))warnings.push("Missing title: "+rel);
if(!/<meta\s+name=["']description["']/i.test(html))warnings.push("Missing description: "+rel);
if(/noindex/i.test(html)&&urls.some(u=>u.endsWith("/"+rel.replace(/\.html$/,""))))errors.push("Noindex page in sitemap: "+rel);
if(/\/metoda-clar(?:["'/?#]|$)/i.test(html))warnings.push("Old method link: "+rel);
}
for(const p of ["sedinte-individuale.html","constelatii.html"]){const html=readFileSync(join(root,p),"utf8");if(!html.includes('"@type":"Service"'))errors.push("Missing Service schema: "+p)}
const redirects=readFileSync(join(root,"_redirects"),"utf8");if(!redirects.includes("/metoda-clar /echilibrarea-radacinilor 301"))errors.push("Missing old method redirect");

// Conversion and internal-link checks (do not modify editorial copy).
const servicePages=["sedinte-individuale.html","constelatii.html","lucram-impreuna.html"];
for(const p of servicePages){
 const html=readFileSync(join(root,p),"utf8");
 if(!/https:\/\/wa\.me\/|calendar\.app\.google\//.test(html))warnings.push("No direct contact or booking link: "+p);
}
for(const file of pages){
 const html=readFileSync(file,"utf8"),rel=file.slice(root.length+1);
 for(const m of html.matchAll(/href=["']([^"'#?]+)(?:[?#][^"']*)?["']/g)){
  const href=m[1];
  if(/^(?:mailto:|tel:|javascript:|data:)/i.test(href))continue;
  let u;try{u=new URL(href,origin+"/"+rel)}catch{continue}
  if(u.origin!==origin)continue;
  let pathname=u.pathname;
  if(pathname==="/"||pathname==="/index")continue;
  const clean=pathname.replace(/\.html$/,"");
  const target=join(root,clean.slice(1)+".html");
  if(!existsSync(target)&&!existsSync(join(root,pathname.slice(1)))&&!pathname.startsWith("/assets/")&&!pathname.startsWith("/Intoarcerea_la_tine_files/"))
   warnings.push("Potential broken internal link: "+rel+" -> "+href);
 }
}
console.log(JSON.stringify({checkedPages:pages.length,sitemapUrls:urls.length,errors,warnings},null,2));
if(errors.length)process.exitCode=1;
