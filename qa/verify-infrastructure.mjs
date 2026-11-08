import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root='dist',origin='https://iuliabobeica.ro';
const articles=readdirSync(root+'/articole').filter(f=>f.endsWith('.html'));assert.equal(articles.length,82);
const sitemap=readFileSync(root+'/sitemap.xml','utf8');const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const pages=readdirSync(root).filter(f=>f.endsWith('.html')&&f!=='index.html').map(f=>f.slice(0,-5));
const expected=[...pages,...articles.map(f=>'articole/'+f.slice(0,-5))].map(p=>origin+'/'+p);
assert.deepEqual([...urls].sort(),expected.sort());assert.equal(new Set(urls).size,100);
let checked=0,missing=[];
for(const file of [...pages.map(p=>p+'.html'),...articles.map(p=>'articole/'+p)]){
 const html=readFileSync(root+'/'+file,'utf8');assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,file);
 assert(html.includes(`rel="canonical" href="${origin}/${file.slice(0,-5)}"`),file);
 for(const m of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
  let url;try{url=new URL(m[1],origin+'/'+file);}catch{continue;}
  if(url.origin!==origin)continue;
  const p=decodeURIComponent(url.pathname);if(p==='/')continue;
  if(!existsSync(root+p)&&!existsSync(root+p+'.html'))missing.push({file,path:p});checked++;
 }
}
assert.equal(missing.length,0,JSON.stringify(missing.slice(0,10)));
assert.equal(readFileSync(root+'/_redirects','utf8'),'/ /acasa 301\n/metoda-clar /echilibrarea-radacinilor 301\n/metoda-clar.html /echilibrarea-radacinilor 301\n');
for(const p of ['infrastructure','functions','docs','.env.example','package.json'])assert(!existsSync(root+'/'+p));
let unchanged=0;
if(existsSync('.local/baseline.json')){
 const baseline=JSON.parse(readFileSync('.local/baseline.json','utf8').replace(/^\uFEFF/,''));
 for(const item of baseline){if(item.Path==='sitemap.xml')continue;const file=root+'/'+item.Path.replaceAll('\\','/');assert(existsSync(file),file);const digest=createHash('sha256').update(readFileSync(file)).digest('hex').toUpperCase();assert.equal(digest,item.Hash,`Regression: ${item.Path}`);unchanged++;}
}
console.log(JSON.stringify({pages:pages.length,articles:articles.length,sitemap:urls.length,internalReferences:checked,missing:missing.length,baselineUnchanged:unchanged,redirects:'unchanged',privateFiles:'excluded'},null,2));
