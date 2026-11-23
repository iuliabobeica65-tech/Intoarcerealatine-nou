import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import assert from 'node:assert/strict';
import {newEnglishArticlePairs} from '../scripts/english-article-pairs.mjs';
import {remainingEnglishArticlePairs,remainingEnglishPagePairs} from '../scripts/remaining-english-translations.mjs';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist'),origin='https://iuliabobeica.ro';
const pages=[['metoda-clar','root-balancing'],['legi-universale','universal-laws'],['constelatii','systemic-constellations'],['lucram-impreuna','work-with-me'],['program-individual-patru-luni','four-month-programme'],['program-nivelul-de-merit','self-worth-programme'],['acasa','index'],['sedinte-individuale','individual-sessions'],['despre-mine','about'],['live','weekly-live'],...remainingEnglishPagePairs];
const earlier=[['rana-de-abandon','abandonment-wound'],['rana-de-respingere','rejection-wound'],['rana-de-tradare','betrayal-wound'],['rana-de-umilinta','humiliation-wound'],['rana-de-nedreptate','injustice-wound'],['legea-dualitatii-de-ce-imi-este-frica-sa-spun-nu','law-of-duality-saying-no']];
const articles=[...earlier,...newEnglishArticlePairs,...remainingEnglishArticlePairs];
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"');
const main=html=>html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const headings=html=>[...main(html).matchAll(/<h([1-6])\b/gi)].map(m=>Number(m[1]));
const linkMap=new Map([...pages.map(([ro,en])=>['/'+(ro==='metoda-clar'?'echilibrarea-radacinilor':ro),'/en/'+(en==='index'?'':en)]),...articles.map(([ro,en])=>['/articole/'+ro,'/en/articles/'+en])]);
linkMap.set('/metoda-clar','/en/root-balancing');linkMap.set('/','/en/');
const errors=[],structure=[];let references=0;
for(const [ro,en] of pages){
 const source=readFileSync(resolve(root,ro+'.html'),'utf8'),target=readFileSync(resolve(root,'en',en+'.html'),'utf8');
 const compare=ro==='articole'?readFileSync(resolve(dist,'articole.html'),'utf8'):source;
 assert.deepEqual(headings(target),headings(compare),en+': heading levels or order differ');
 if(ro!=='articole'&&ro!=='resurse'){
  for(const tag of ['p','li','summary']){
   const count=s=>(main(s).replace(/<details data-source-image-captions="method">[\s\S]*?<\/details>/,'').match(new RegExp('<'+tag+'\\b','g'))||[]).length;
   assert.equal(count(target),count(source),en+': '+tag+' count differs');
  }
 }
 for(const m of main(source).matchAll(/href="([^"]+)"/g)){
  const value=decode(m[1]);if(value.startsWith('#')){assert(main(target).includes(m[0]),en+': source anchor changed');continue;}
  const u=new URL(value,origin+'/');
  if(u.origin!==origin){assert(target.includes(m[1]),en+': missing original external CTA '+value);continue;}
  const clean=u.pathname.replace(/\.html$/,''),destination=linkMap.get(clean);
  if(destination)assert(target.includes(destination+u.hash),en+': missing translated counterpart '+destination+u.hash);
 }
 for(const m of source.matchAll(/<img\b[^>]+src="([^"]+)"/g))assert(target.includes(m[1].replace(/^\.\//,'/')),en+': original image missing');
 if(ro==='metoda-clar')assert.equal((target.match(/data-source-image="\d\d\.webp"/g)||[]).length,7,'All seven original image texts need English counterparts');
 const originalStyles=[...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1].replaceAll('Navigare principală','Main navigation'));
 for(const css of originalStyles)assert(target.includes(css),en+': source inline styling changed');
 structure.push({ro:ro+'.html',en:'en/'+en+'.html',headings:headings(target).length,status:'source sections reviewed'});
}
for(const [ro,en] of articles){
 const source=JSON.parse(readFileSync(resolve(root,'editorial/articole',ro+'.json'),'utf8'));
 const html=readFileSync(resolve(root,'en/articles',en+'.html'),'utf8');
 const authored=html.match(/<div class="hero">[\s\S]*?<\/div>/)[0];
 for(const m of source.continut.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
  const u=new URL(m[1]),clean=u.pathname.replace(/\.html$/,''),translated=u.origin===origin?linkMap.get(clean):null;
  assert(authored.includes(translated||m[1].replaceAll('&','&amp;')),en+': omitted or rewritten source link '+m[1]);
 }
 assert(!html.includes('Personal development is not a substitute for medical or psychological treatment. No outcome is guaranteed.'),en+': non-source disclaimer');
 assert(!html.includes('Root Balancing'),en+': method brand replaced');
}
const files=[...pages.map(([,en])=>resolve(dist,'en',en+'.html')),...articles.map(([,en])=>resolve(dist,'en/articles',en+'.html'))];
for(const file of files){
 const html=readFileSync(file,'utf8');
 assert(!/The Romanian source page|These English summaries|According to the original Romanian text|The author claims/.test(html),'Translation commentary in '+relative(dist,file));
 for(const m of html.matchAll(/(?:href|src)="([^"<>]+)"/g)){
  const u=new URL(decode(m[1]),origin+'/'+relative(dist,file).replaceAll('\\','/'));
  if(u.origin!==origin)continue;
  const p=decodeURIComponent(u.pathname).replace(/^\//,'');
  const target=[resolve(dist,p||'index.html'),resolve(dist,p+'.html'),resolve(dist,p,'index.html')].find(f=>existsSync(f)&&statSync(f).isFile());
  if(!target){errors.push(relative(dist,file)+' -> '+u.pathname);continue;}
  if(u.hash&&!readFileSync(target,'utf8').includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'))errors.push(relative(dist,file)+' -> missing '+u.hash);
  references++;
 }
}
assert.deepEqual(errors,[],'Broken translated references');
console.log(JSON.stringify({pages:pages.length,articles:articles.length,localReferences:references,structure,errors},null,2));
console.log('Integrity checks passed. Structural checks support the recorded source-to-target editorial review; they do not certify meaning on their own.');
