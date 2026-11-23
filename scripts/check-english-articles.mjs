import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { newEnglishArticlePairs } from './english-article-pairs.mjs';
import { remainingEnglishArticlePairs } from './remaining-english-translations.mjs';

const root=resolve(import.meta.dirname,'..'), dist=resolve(root,'dist');
const origin='https://iuliabobeica.ro';
const sitemap=readFileSync(resolve(dist,'sitemap.xml'),'utf8');
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(locations.length,new Set(locations).size,'Duplicate sitemap entries');
assert.equal(new Set(newEnglishArticlePairs.map(([ro])=>ro)).size,newEnglishArticlePairs.length,'Duplicate Romanian sources');
assert.equal(new Set(newEnglishArticlePairs.map(([,en])=>en)).size,newEnglishArticlePairs.length,'Duplicate English slugs');
const articlePairs=[...newEnglishArticlePairs,...remainingEnglishArticlePairs];
let localLinks=0, externalLinks=0;
const decode=s=>s.replaceAll('&amp;','&');
for(const [ro,en] of articlePairs){
 const source=JSON.parse(readFileSync(resolve(root,'editorial/articole',ro+'.json'),'utf8'));
 const sourcePath=resolve(root,'en/articles',en+'.html');
 const html=readFileSync(resolve(dist,'en/articles',en+'.html'),'utf8');
 assert.equal(html,readFileSync(sourcePath,'utf8'),en+': build changed translated content');
 const roHtml=readFileSync(resolve(dist,'articole',ro+'.html'),'utf8');
 const roUrl=origin+'/articole/'+ro, enUrl=origin+'/en/articles/'+en;
 assert.match(html,/<html lang="en">/);
 assert.equal((html.match(/<h1>/g)||[]).length,1,en+': H1 count');
 assert.equal((html.match(/<h2>/g)||[]).length,(source.continut.match(/^## /gm)||[]).length,en+': heading structure changed');
 const body=html.split('</h1>')[1].split('</div>')[0];
 const paragraphs=source.continut.trim().split(/\n\n+/).filter(p=>!p.startsWith('## ')&&!p.startsWith('- ')&&p!=='---');
 assert.equal((body.match(/<p>/g)||[]).length,paragraphs.length,en+': paragraph structure changed');
 assert.match(html,/<meta name="description" content="[^"]+">/);
 for(const url of [roUrl,enUrl]) assert(locations.includes(url),'Missing sitemap URL: '+url);
 for(const page of [html,roHtml]){
  assert(page.includes('hreflang="ro" href="'+roUrl+'"'),en+': Romanian alternate');
  assert(page.includes('hreflang="en" href="'+enUrl+'"'),en+': English alternate');
 }
 assert(html.includes('rel="canonical" href="'+enUrl+'"'),en+': canonical');
 assert(html.includes('property="og:url" content="'+enUrl+'"'),en+': Open Graph URL');
 assert(html.includes('href="'+roUrl+'" lang="ro">RO</a>'),en+': language switch');
 assert(roHtml.includes('href="'+enUrl+'"'),en+': English switch');
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema.url,enUrl); assert.equal(schema.inLanguage,'en');
 assert.equal(schema.datePublished,source.data); assert.equal(schema.author.name,'Iulia Bobeica');
 assert(html.includes('/assets/analytics-consent.js'),en+': consent script');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=new URL(decode(match[1]),enUrl);
  if(url.origin!==origin){
   externalLinks++;
   assert(source.continut.includes(decode(match[1])),en+': external link not present in source: '+match[1]);
   continue;
  }
  localLinks++;
  let path=decodeURIComponent(url.pathname).replace(/^\//,'');
  const target=resolve(dist,path||'index.html');
  assert(existsSync(target)||existsSync(target+'.html')||existsSync(resolve(target,'index.html')),en+': broken link '+url.pathname);
  if(url.hash){
   const linked=readFileSync(existsSync(target)?target:target+'.html','utf8');
   assert(linked.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),en+': missing anchor');
  }
 }
 for(const match of source.continut.matchAll(/https:\/\/(?:wa\.me|calendar\.app\.google|m\.me)\/[^)\s]+/g)){
  assert(html.includes(match[0].replaceAll('&','&amp;')),en+': original contact link changed');
 }
 if(source.imagine) assert(html.includes(source.imagine),en+': original image missing');
}
console.log(`English article checks passed: ${articlePairs.length} translations across both batches; ${localLinks} local references; ${externalLinks} original external links; reciprocal hreflang, sitemap, schema and source structure.`);
