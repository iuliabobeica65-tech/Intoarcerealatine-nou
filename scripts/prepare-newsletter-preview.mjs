import {readFileSync,writeFileSync,mkdirSync,copyFileSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const root=resolve('.local/newsletter-collection-preview'),out=join(root,'package-'+Date.now());mkdirSync(join(out,'assets'),{recursive:true});
const banner='<aside role="note" style="padding:16px;background:#fff0ce;color:#302925;border-bottom:2px solid #8b6333"><strong>PREVIEW PRIVAT — formular și trimiteri OFF.</strong> Proiect de confidențialitate pentru validare juridică. Nu introduce date reale.</aside>';
for(const file of ['comunitate.html','politica-confidentialitate.html']){
 let html=readFileSync(file,'utf8').replace(/<body([^>]*)>/,'<body$1>'+banner).replace('content="index,follow"','content="noindex,nofollow"').replace(/<script[^>]*src="\.\/assets\/content-editor\.js"[^>]*><\/script>/g,'');
 html=html.replace(/href="([^"]+)"/g,(match,value)=>{
  if(/^(?:https?:|mailto:|#)/.test(value))return match;
  const url=new URL(value,'https://preview.example.invalid/');
  if(['/comunitate','/comunitate.html','/politica-confidentialitate','/politica-confidentialitate.html'].includes(url.pathname)||url.pathname.startsWith('/assets/'))return match;
  return `href="https://iuliabobeica.ro${url.pathname==='/'?'/acasa':url.pathname.replace(/\.html$/,'')}${url.search}${url.hash}"`;
 });
 writeFileSync(join(out,file),html);
}
for(const file of ['site-base.css','site-theme.css','brand-unified.css','legal-feminine.css','infrastructure.css','infrastructure.js'])copyFileSync('assets/'+file,join(out,'assets',file));
// Read-only email mock: no real DOI token and no clickable confirmation action.
const doi=readFileSync('docs/brevo-pregatire/COM-01-confirmare-colectare.html','utf8').replace(/<body([^>]*)>/,'<body$1>'+banner).replace('href="{{ params.DOIurl }}"','aria-disabled="true" tabindex="-1"');
writeFileSync(join(out,'doi-confirmare.html'),doi);
writeFileSync(join(out,'newsletter.html'),readFileSync(join(out,'comunitate.html'),'utf8').replaceAll('https://iuliabobeica.ro/comunitate','https://iuliabobeica.ro/newsletter'));
const homeForm=readFileSync('comunitate.html','utf8').match(/<form id="community-form"[\s\S]*?<\/form>/)?.[0];
if(!homeForm)throw Error('home_form_missing');
writeFileSync(join(out,'amplasare-newsletter.html'),readFileSync('tools/newsletter-preview/placement.html','utf8').replace('<body>','<body>'+banner).replace('<!-- NEWSLETTER_FORM -->',homeForm.replace('data-newsletter-source="newsletter"','data-newsletter-source="home"')));
const review='<!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter — pregătire finală</title><style>body{max-width:760px;margin:32px auto;padding:20px;font:18px/1.6 Arial;color:#302925;background:#f5ebdd}a{color:#70485b}li{margin:18px 0}</style>'+banner+'<main><h1>Pregătire finală newsletter</h1><ol><li><strong>Lista #3 este aprobată pentru noul formular API.</strong> Lista #4 și toate contactele existente rămân intacte; nu mutăm și nu reabonăm contacte.</li><li><strong>DOI separat #15:</strong> textul este aprobat și pregătit în copia nouă inactivă. Originalul #2 și formularul nativ #4/#8 sunt păstrate. <a href="/doi-confirmare.html">Vezi mesajul integral propus</a>. Nicio trimitere și nicio automatizare nu sunt activate.</li><li><strong>Păstrarea:</strong> propunerea de revizuire la 6 luni și limita de 12 luni fără lansare este acceptată ca propunere. Ștergerile automate rămân OFF până la validarea politicii.</li><li><strong>Export lunar criptat:</strong> instrument local pregătit pentru trei categorii separate: contacte, dovezi DOI și evidențe de dezabonare. Nicio adresă reală nu a fost exportată; parola nu este inclusă în surse.</li></ol><p><a href="/amplasare-newsletter">Vezi formularul inclus pe Acasă și linkul din subsol</a></p><p><a href="/newsletter">Vezi pagina dedicată /newsletter</a></p><p><a href="/politica-confidentialitate#newsletter">Vezi informațiile GDPR de validat</a></p><p>Rămân numai validarea juridică și a retenției efective, validarea procedurii de contact (identitatea operatorului este confirmată), configurarea noii chei private și aprobarea finală a publicării. Amplasarea și textul DOI sunt aprobate. Campanii, bun-venit, colectare și trimiteri OFF. Producția este nemodificată.</p></main></html>';
writeFileSync(join(out,'decizii-newsletter.html'),review);
writeFileSync(join(out,'index.html'),readFileSync(join(out,'comunitate.html')));writeFileSync(join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');writeFileSync(join(out,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]}));
const require=createRequire('C:/Users/iulia/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/package.json');await require('esbuild').build({entryPoints:['tools/newsletter-preview/worker.mjs'],outfile:join(out,'_worker.js'),bundle:true,format:'esm',platform:'browser',target:'es2022'});
const files=[];function walk(dir,prefix=''){for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name),name=prefix+e.name;if(e.isDirectory())walk(p,name+'/');else files.push({path:name,sha256:createHash('sha256').update(readFileSync(p)).digest('hex')});}}walk(out);
writeFileSync(join(root,'manifest.json'),JSON.stringify({project:'er-brevo-test-izolat',branch:'pregatire-infrastructura-email-plati',artifact:out,previewOnly:true,collectionEnabled:false,noD1Binding:true,noProviderSecrets:true,files},null,2));console.log(JSON.stringify({prepared:true,files:files.length,artifact:out,noEmails:true}));
