import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
import {remainingEnglishArticlePairs,remainingEnglishPagePairs} from './remaining-english-translations.mjs';
import {newEnglishArticlePairs} from './english-article-pairs.mjs';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist'),origin='https://iuliabobeica.ro';
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
const resolveTarget=url=>{
 const pathname=decodeURIComponent(url.pathname).replace(/^\//,'');
 return [resolve(dist,pathname||'index.html'),resolve(dist,pathname+'.html'),resolve(dist,pathname,'index.html')].find(p=>existsSync(p)&&!readdirSafe(p));
};
const readdirSafe=p=>{try{readdirSync(p);return true;}catch{return false;}};
let checked=0,anchors=0;
const broken=[];
for(const path of [...remainingEnglishArticlePairs.map(([,en])=>'en/articles/'+en+'.html'),...remainingEnglishPagePairs.map(([,en])=>'en/'+en+'.html')]){
 const html=readFileSync(resolve(dist,path),'utf8');
 for(const m of html.matchAll(/(?:href|src)="([^"<>]+)"/g)){
  const url=new URL(decode(m[1]),origin+'/'+path.replace(/\.html$/,''));
  if(!['http:','https:'].includes(url.protocol)||url.origin!==origin)continue;
  const target=resolveTarget(url);
  if(!target){broken.push(path+': missing '+url.pathname);continue;}
  if(url.hash){
   anchors++;
   const content=readFileSync(target,'utf8');
   if(!content.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'))broken.push(path+': missing anchor '+url.pathname+url.hash);
  }
  checked++;
 }
}
assert.deepEqual(broken,[],'Broken links');
const siteMap=readFileSync(resolve(dist,'sitemap.xml'),'utf8');
for(const [ro,en] of remainingEnglishPagePairs){
 const html=readFileSync(resolve(dist,'en',en+'.html'),'utf8'),url=origin+'/en/'+en;
 const roHtml=readFileSync(resolve(dist,ro+'.html'),'utf8');
 assert(html.includes('<html lang="en"'),en+': missing lang');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,en+': H1');
 assert(html.includes('rel="canonical" href="'+url+'"'),en+': canonical');
 assert(html.includes('property="og:url" content="'+url+'"'),en+': Open Graph');
 assert(html.includes('hreflang="ro" href="'+origin+'/'+ro+'"'),en+': Romanian alternate');
 assert(roHtml.includes('hreflang="en" href="'+url+'"'),en+': English alternate');
 assert(siteMap.includes('<loc>'+url+'</loc>'),en+': sitemap');
 assert(html.includes('/assets/analytics-consent.js'),en+': existing consent integration missing');
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert(schemas.some(s=>s.url===url&&s.inLanguage==='en'),en+': structured data');
 const src=readFileSync(resolve(root,ro+'.html'),'utf8');
 for(const image of src.matchAll(/<img[^>]*src="([^"]+)"/g)){
  assert(html.includes(image[1].replace(/^\.\//,'/')),en+': original image missing');
 }
 for(const link of src.matchAll(/href="((?:https:\/\/(?!iuliabobeica\.ro)[^"]+|mailto:[^"]+))"/g)){
  assert(html.includes(link[1]),en+': original contact or external link changed');
 }
 // Page-specific interactive scripts must retain the same operations. Only gallery paths and labels are localised.
 const scripts=text=>[...text.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 const normalize=text=>text.replaceAll('./assets/testimoniale/','/assets/testimoniale/').replaceAll('Fotografie originală a mărturiei ','Original photograph of testimonial ').replaceAll('Mărește mărturia ','Enlarge testimonial ').replaceAll("' din '","' of '").replaceAll(' — mărită',' — enlarged');
 const srcScripts=scripts(src).map(normalize);
 for(const script of srcScripts)assert(html.includes(script),en+': interactive script changed');
}
const known=new Set(['rana-de-abandon','rana-de-respingere','rana-de-tradare','rana-de-umilinta','rana-de-nedreptate','legea-dualitatii-de-ce-imi-este-frica-sa-spun-nu',...newEnglishArticlePairs.map(([ro])=>ro),...remainingEnglishArticlePairs.map(([ro])=>ro)]);
const sourceArticles=readdirSync(resolve(root,'editorial/articole')).filter(f=>f.endsWith('.json')).filter(f=>JSON.parse(readFileSync(resolve(root,'editorial/articole',f),'utf8')).publicat);
assert.equal(sourceArticles.length,82);assert.equal(known.size,82);
assert(sourceArticles.every(f=>known.has(f.slice(0,-5))),'Untranslated source article');
const index=readFileSync(resolve(dist,'en/articles.html'),'utf8');
assert.equal((index.match(/<article class="blog-card">/g)||[]).length,82,'English catalogue coverage');
assert(!index.includes('href="https://iuliabobeica.ro/articole/'),'Romanian article link in English catalogue');
console.log(`Remaining translations passed: 59 new articles, 7 new pages; ${checked} local references, ${anchors} anchors; 82/82 published articles covered in the English catalogue. Images, original external links and page interactions preserved.`);
