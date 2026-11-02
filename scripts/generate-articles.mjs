/** Generează pagina de listă și pagini SEO din articolele aprobate în Pages CMS.
 * Citește DOAR editorial/articole/*.json; nu copiază fișierele editoriale brute pe site.
 * Folosit identic de Netlify și Cloudflare; nu există articole inventate.
 */
import {readdirSync,readFileSync,writeFileSync,existsSync,mkdirSync} from "node:fs";
import {join,resolve} from "node:path";
export function renderArticles(output,origin=""){
 const root=resolve(import.meta.dirname,".."),dir=join(root,"editorial","articole");
 const template=readFileSync(join(output,"articole.html"),"utf8");
 const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const safeUrl=u=>{if(typeof u!=="string")return null;if(/^\/(?!\/)[a-z0-9/_-]+\.(?:webp|png|jpe?g)$/i.test(u))return u;if(/^https:\/\/[^\s"<>]+$/i.test(u))return u;return null;};
 const textInline=v=>esc(v).replace(/\*\*([^*\n]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*\n]+)\*/g,"<em>$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,name,url)=>{const target=safeUrl(url);return target?'<a rel="noopener noreferrer" href="'+esc(target)+'">'+name+'</a>':name});
 const markdownToHtml=raw=>{
   const lines=String(raw??"").replace(/\r\n?/g,"\n").split("\n");let html=[],list="";
   const close=()=>{if(list){html.push("</"+list+">");list="";}};
   for(const line of lines){let s=line.trim();if(!s){close();continue;}
     const img=s.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);if(img){close();let url=safeUrl(img[2]);if(url)html.push('<img loading="lazy" src="'+esc(url)+'" alt="'+esc(img[1])+'">');continue;}
     const h=s.match(/^(#{2,3})\s+(.+)$/);if(h){close();html.push("<h"+h[1].length+">"+textInline(h[2])+"</h"+h[1].length+">");continue;}
     let li=s.match(/^[-*]\s+(.+)$/),type="ul";if(!li){li=s.match(/^\d+\.\s+(.+)$/);type="ol";}
     if(li){if(list!==type){close();html.push("<"+type+">");list=type;}html.push("<li>"+textInline(li[1])+"</li>");continue;}
     close();if(s.startsWith("> "))html.push("<blockquote>"+textInline(s.slice(2))+"</blockquote>");else html.push("<p>"+textInline(s)+"</p>");
   }
   close();return html.join("\n");
 };
 let articles=[];
 if(existsSync(dir))for(const file of readdirSync(dir).filter(x=>/^[a-z0-9][a-z0-9_-]*\.json$/i.test(x))){
   const data=JSON.parse(readFileSync(join(dir,file),"utf8"));
   if(data.publicat!==true)continue;
   const slug=file.slice(0,-5);
   if(!data.titlu||!data.descriere||!data.continut||!/^\d{4}-\d{2}-\d{2}$/.test(data.data||""))
     throw Error("Articol publicat incomplet: "+slug);
   articles.push({...data,slug});
 }
 // Public presentation layer only: retain original editorial source files unchanged.
 const publicBrand=s=>String(s??"").replace(/Întoarcerea la tine|Întoarce-te la tine/gi,"Echilibrarea rădăcinilor");
 articles=articles.map(a=>({...a,titlu:publicBrand(a.titlu),descriere:publicBrand(a.descriere),continut:publicBrand(a.continut)}));
 // Audit editorial non-destructiv: nu rescriem automat vocea autoarei și nu publicăm texte noi fără revizie.
 const editorialWarnings=[];
 const endings=new Map();
 for(const a of articles){
   const words=a.continut.trim().split(/\s+/).length;
   const sections=(a.continut.match(/^## /gm)||[]).length;
   const repeated=(a.continut.match(/Pornim de la (?:ceea ce trăiești|situația concretă)|Nu promitem rezultate garantate|Nu presupunem dinainte o cauză/gi)||[]).length;
   const last=a.continut.split(/\n\s*\n/).at(-1)?.trim()||"";
   const flags=[];
   if(words<350)flags.push("prea_scurt_pentru_articol_substantial");
   if(sections>=5 && words<450)flags.push("schematic_preponderent");
   if(repeated>=2)flags.push("formule_standard_repetate");
   // Semnale pentru revizie umană; nu rescriem automat textul autoarei.
   const defensive=(a.continut.match(/(?:nu îți dau eu răspunsuri|nu îți spun eu ce să|nu presupun(?:em)? cauza|nu promit(?:em)? rezultate garantate)/gi)||[]).length;
   if(defensive>=2)flags.push("formule_defensive_repetate");
   if(/(?:ești de vină|este vina ta|tu ai atras|ți-ai provocat|trebuia să treci prin)/i.test(a.continut))
     flags.push("formulare_potential_culpabilizanta");
   const sensitive=/(avort|sinucider|suicid|crim[aă]|traum[aă]|abuz|doliu|deces|pierder|infertilitat|infidelitat|r[aă]zboi)/i.test(a.titlu+" "+(a.categorie||""));
   if(sensitive && /(?:cu siguranță|întotdeauna|obligatoriu|cauza este|se transmite inevitabil)/i.test(a.continut))
     flags.push("afirmatie_categorica_pe_tema_sensibila");
   if(/^(Avort|Sinucidere|Crimă|Traumă|Abuz)/i.test(a.titlu)&&words<600)flags.push("tema_sensibila_necesita_revizie");
   if(last){const key=last.toLocaleLowerCase("ro");if(endings.has(key))flags.push("final_identic_cu_"+endings.get(key));else endings.set(key,a.slug);}
   if(flags.length)editorialWarnings.push({slug:a.slug,titlu:a.titlu,cuvinte:words,semnale:flags});
 }
 if(editorialWarnings.length)console.warn("[AUDIT EDITORIAL] "+editorialWarnings.length+" articole necesită revizie de conținut; textele-sursă rămân intacte.\n"+editorialWarnings.map(x=>x.slug+": "+x.semnale).join("\n").replaceAll("sem nale","semnale"));
 // Inventar tematic orientativ: doar titluri/categorii/descrieri, fără a modifica articolele.
 // O potrivire lexicală nu dovedește că tema este tratată suficient sau corect.
 const thematicRegistry=[
  ["Avort",["avort"]],["Infidelitate",["infidel"]],["Moarte/deces",["deces","moarte"]],["Divorț",["divorț","divort"]],["Separare",["separare"]],["Certuri și conflicte",["certuri","conflicte"]],["Probleme legate de copii",["copii","copil"]],["Sinucidere",["sinucider","suicid"]],["Dependențe",["dependenț","dependen"]],["Crimă",["crimă","crima"]],["Durere",["durere"]],["Traumă",["traum"]],["Comportamente inexplicabile",["comportamente inexplicabile"]],["Persoane excluse din familie",["exclu"]],["Arbore genealogic",["arbore genealogic"]],["Traume transgeneraționale",["traume transgeneraționale"]],["Loialități ascunse",["loialități","loialitati"]],["Fidelități familiale",["fidelități familiale"]],["Vinovăție",["vinov"]],["Rușine",["rușin","rusin"]],["Mândrie",["mândrie","mandrie"]],["Frica de abandon",["abandon"]],["Frica de respingere",["resping"]],["Frica de judecată",["judecat","judecată"]],["Neputință",["neputin"]],["Subordonare",["subordon"]],["Imagine de sine",["imagine de sine"]],["Stimă de sine",["stimă de sine","stima de sine"]],["Nivelul de merit",["nivelul de merit","merit"]],["Tipare repetitive",["tipare","tipar"]],["Blocaje emoționale",["blocaje emoționale"]],["Relația cu părinții",["părinți","parinti"]],["Relația de cuplu",["cuplu"]],["Onorarea",["onorare","onorarea"]],["Probleme transgeneraționale",["transgenera"]],["Subconștient",["subconștient","subconstient"]],["Încredere în sine",["încredere în sine"]],["Creație conștientă",["creație conștientă","creatia constienta"]],
  ["Avort spontan/pierdere de sarcină",["avort spontan","pierdere de sarcină"]],["Infertilitate",["infertil"]],["Adopție/copii dați spre adopție",["adop"]],["Persoane aflate în detenție",["detenție","închisoare"]],["Război",["război"]],["Secrete de familie",["secrete de familie"]],["Copii născuți în afara căsătoriei",["în afara căsătoriei"]],["Tată biologic nerecunoscut/exclus",["tată biologic"]],["Persoane internate în instituții psihiatrice",["instituții psihiatrice"]],["Faliment și pierderi financiare",["faliment","pierderi financiare"]],["Prostituție/persoane stigmatizate social",["prostituție","stigmatizate"]],["Persoane uitate/respinse din familie",["uitate din familie","respinse din familie"]],["Doliu/pierderea unei persoane apropiate",["doliu"]],["Pierderea unui copil",["pierderea unui copil"]],["Rana de trădare",["trădare","tradare"]],["Rana de umilință",["umilin"]],["Rana de nedreptate",["nedrept"]],["Măștile emoționale",["măștile emoționale","mastile emotionale"]],["Sufletul și apartenența",["apartenen"]]
 ];
 const thematicMatches=thematicRegistry.map(([tema,terms],i)=>{
   const matches=articles.filter(a=>terms.some(t=>(a.titlu+" "+(a.categorie||"")+" "+a.descriere).toLocaleLowerCase("ro").includes(t))).map(a=>a.slug);
   return {pozitie:i+1,tema,stare:matches.length?"de_verificat_in_continut":"fara_potrivire_in_metadate",articole:matches};
 });
 console.info("[AUDIT 57 TEME] "+JSON.stringify(thematicMatches));
 // SEO: fiecare dintre cele cinci răni are intenție de căutare distinctă.
 // Raportăm numai existența unei pagini candidate, fără a crea pagini SEO duplicate.
 const wounds=["abandon","respingere","trădare","umilință","nedreptate"];
 const woundAudit=wounds.map(w=>{
   const normalize=t=>String(t??"").toLocaleLowerCase("ro").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");
   const term=normalize(w);
   const candidates=articles.filter(a=>normalize(a.slug+" "+a.titlu).includes(term));
   const exact=candidates.filter(a=>normalize(a.slug+" "+a.titlu).includes("rana de "+term)||normalize(a.slug).includes("rana-"+term));
   return {rana:w,pagini_candidate:candidates.map(a=>a.slug),pagina_dedicata_probabila:exact.map(a=>a.slug),necesita_verificare:exact.length!==1};
 });
 const missingMetadata=thematicMatches.filter(x=>x.stare==="fara_potrivire_in_metadate");
 console.info("[AUDIT TEMATIC - SINTEZA] "+JSON.stringify({
   teme_in_registru:thematicMatches.length,
   teme_fara_potrivire_in_metadate:missingMetadata.length,
   pozitii_de_verificat:missingMetadata.map(x=>({pozitie:x.pozitie,tema:x.tema})),
   rani_emotionale:woundAudit
 }));

 articles.sort((a,b)=>b.data.localeCompare(a.data)||a.slug.localeCompare(b.slug));
 const categoryGroups=[
  {id:"frici-si-perceptii",label:"Frici, răni emoționale și percepții",desc:"Frica de respingere, abandon sau judecată și rănile emoționale explorate prin situații concrete, cu atenție la experiența fiecărei femei."},
  {id:"blocaje-si-decizii",label:"Blocaje, tipare și alegeri",desc:"Situații dureroase care se repetă, reacții pe care vrei să le înțelegi și alegeri pe care ți-ai dori să le faci diferit."},
  {id:"relatii-si-familie",label:"Relații, familie și pierderi",desc:"Conflicte, distanță în cuplu, separare și alte experiențe de familie care pot aduce întrebări și durere."},
  {id:"imagine-de-sine",label:"Imagine de sine, merit și bani",desc:"Vinovăție, rușine, felul în care te privești, ce îți permiți să ceri și alegerile financiare care te preocupă."},
  {id:"constelatii-familiale",label:"Constelații familiale și sistemice",desc:"Articole educative despre constelații familiale și sistemice, o modalitate distinctă de lucru, folosită în funcție de context."},
  {id:"legi-universale",label:"Legi universale și echilibrarea percepțiilor",desc:"Articole educative despre legi universale și echilibrarea percepțiilor. Nu toate legile prezentate în surse sunt componente validate ale metodei."}
 ];
 const groupOf=a=>{
  const cat=(a.categorie||"").toLowerCase(),slug=a.slug;
  if(cat.includes("frică")||cat.includes("frica")||cat.includes("rană")||cat.includes("rana")||slug.startsWith("frica-")||slug.startsWith("rana-"))return "frici-si-perceptii";
  if(cat.includes("legile universale"))return "legi-universale";
  if(cat.includes("constelații")||cat.includes("constelatii"))return "constelatii-familiale";
  if(cat.includes("imagine")||cat.includes("merit")||cat.includes("vinov")||cat.includes("critică")||cat.includes("limite")||cat.includes("bani"))return "imagine-de-sine";
  if(/infidelitat|divort|divorț|separar|doliu|deces|pierder|adop|infertil|conflict|părin|parint/i.test(cat+" "+slug))return "relatii-si-familie";
  if(cat.includes("famil")||cat.includes("relații")||cat.includes("relați")||cat.includes("cuplu")||cat.includes("maternitat"))return "relatii-si-familie";
  if(slug.includes("parintii")||slug.includes("familie"))return "relatii-si-familie";
  return "blocaje-si-decizii";
 };
 const isEducational=a=>groupOf(a)==="legi-universale"||groupOf(a)==="constelatii-familiale";
 const cardsFor=list=>list.map(a=>{
   const kind=isEducational(a)?"Articol educativ":"Articol";
   return '<article class="blog-card"><p class="blog-type">'+esc(kind)+'</p><h3><a href="./articole/'+a.slug+'.html">'+esc(a.titlu)+'</a></h3><p class="blog-card-desc">'+esc(a.descriere)+'</p><a class="blog-card-link" href="./articole/'+a.slug+'.html">'+"Citește articolul"+' <span aria-hidden="true">→</span></a></article>';
 }).join("\n");
 const activeGroups=categoryGroups.map(g=>({...g,items:articles.filter(a=>groupOf(a)===g.id)})).filter(g=>g.items.length);
 const categoryNav='<nav class="blog-category-nav" aria-label="Categorii articole">'+activeGroups.map(g=>'<a href="#'+g.id+'">'+esc(g.label)+' <span>('+g.items.length+')</span></a>').join("")+'</nav>';
 const categorySections=activeGroups.map(g=>'<section class="blog-category-group" id="'+g.id+'" aria-labelledby="head-'+g.id+'"><h2 id="head-'+g.id+'">'+esc(g.label)+'</h2><p class="blog-group-desc">'+esc(g.desc)+'</p><div class="blog-list">'+cardsFor(g.items)+'</div></section>').join("\n");
 let html=template;
 const empty='<p>Articolele sunt în pregătire. Vezi <a href="./resurse.html">Resurse</a>.</p>';
 html=html.replace(/<div class="blog-list">\s*<!-- LISTA_ARTICOLE -->\s*<\/div>/,articles.length?'<div class="blog-catalog-guide">'+categoryNav+'</div>'+categorySections+'':empty);
 if(html.includes("<!-- LISTA_ARTICOLE -->"))throw Error("Nu s-a putut organiza lista articolelor.");
 html=html.replace("</style>",`
/* Optimizare mobil și lizibilitate: fără schimbarea textelor editoriale. */
#iulia-live .editorial-catalog .blog-category-nav{display:flex;flex-wrap:wrap;gap:9px;margin:0 0 30px}
#iulia-live .editorial-catalog .blog-category-nav a{display:inline-flex;align-items:center;min-height:42px;padding:10px 15px;font:600 13px/1.35 Arial,sans-serif;text-decoration:none;white-space:normal;border-radius:999px}
#iulia-live .editorial-catalog .blog-category-nav a:focus-visible{outline:3px solid #7b4b62;outline-offset:3px}
#iulia-live .editorial-catalog .blog-card{display:flex;flex-direction:column;height:100%}
#iulia-live .editorial-catalog .blog-card h3{overflow-wrap:break-word}
#iulia-live .editorial-catalog .blog-card .blog-card-link{margin-top:auto;min-height:42px;align-items:center}
@media(max-width:680px){
 #iulia-live .editorial-intro{padding:24px 0 14px!important;margin:8px auto 4px!important}
 #iulia-live .editorial-intro h1{font-size:clamp(33px,9vw,43px)!important}
 #iulia-live .editorial-intro>p:not(.eyebrow){font-size:15px!important;line-height:1.55!important}
 #iulia-live .editorial-catalog .blog-category-nav{flex-wrap:nowrap;overflow-x:auto;scroll-snap-type:x proximity;overscroll-behavior-inline:contain;padding:3px 3px 13px;margin:0 0 22px;scrollbar-width:thin}
 #iulia-live .editorial-catalog .blog-category-nav a{flex:0 0 auto;max-width:82vw;scroll-snap-align:start}
 #iulia-live .editorial-catalog .blog-category-group{margin:8px 0 34px!important;padding-top:18px!important}
 #iulia-live .editorial-catalog .blog-category-group>h2{font-size:clamp(25px,7vw,32px)!important}
 #iulia-live .editorial-catalog .blog-group-desc{font-size:14px;line-height:1.6}
 #iulia-live .editorial-catalog .blog-list{grid-template-columns:minmax(0,1fr)!important;gap:14px}
 #iulia-live .editorial-catalog .blog-card{min-height:0!important;padding:22px 21px!important;border-radius:17px!important}
 #iulia-live .editorial-catalog .blog-card h3{font-size:clamp(23px,6vw,28px)!important}
 #iulia-live .editorial-catalog .blog-card p.blog-card-desc{font-size:14px!important;line-height:1.65!important}
}
/* Catalog editorial: introducere aerisită, categorii direct accesibile. */
#iulia-live .editorial-intro{max-width:1050px!important;padding:clamp(28px,4vw,50px) 0 20px!important;margin:18px auto 12px!important;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important}
#iulia-live .editorial-intro .eyebrow{margin:0 0 15px!important}
#iulia-live .editorial-intro h1{font-size:clamp(36px,4.6vw,58px)!important;margin:0 0 12px!important}
#iulia-live .editorial-intro>p:not(.eyebrow){max-width:720px!important;font-size:17px!important;line-height:1.6!important}
#iulia-live .blog-catalog-guide{padding:0!important;margin:10px 0 20px!important;background:transparent!important;border:0!important;border-radius:0!important}
#iulia-live .blog-catalog-guide .blog-category-nav{margin:0!important}
</style>`);
 html=html.replace("</style>",`
#iulia-live .blog-catalog-guide{padding:22px 24px 10px;margin:0 0 22px;border-radius:18px;background:#fff9f6;border:1px solid #ead4d9}#iulia-live .blog-catalog-guide>p{margin:0 0 12px}#iulia-live .blog-catalog-guide .blog-category-nav{margin:12px 0 16px}#iulia-live .blog-category-nav a:focus-visible,#iulia-live .blog-card a:focus-visible{outline:3px solid #8b536a;outline-offset:4px}#iulia-live .blog-card{overflow-wrap:anywhere}#iulia-live .blog-category-group{scroll-margin-top:95px}
/* Editorial 24.10 – articole lizibile, feminine și centrate pe o singură experiență. */
#iulia-live .blog-list{grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:22px}
#iulia-live .blog-card{position:relative;display:flex;flex-direction:column;min-height:265px;padding:30px 29px 27px;border:1px solid #e8ccca;border-radius:18px;background:linear-gradient(155deg,#fff9f5,#ffeff1);box-shadow:0 10px 28px rgba(67,35,40,.045);transition:transform .2s,box-shadow .2s}
#iulia-live .blog-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(67,35,40,.09)}
#iulia-live .blog-card .blog-type{font:700 11px/1.5 Arial,sans-serif!important;letter-spacing:.13em;text-transform:uppercase;color:#885866;margin:0 0 17px}
#iulia-live .blog-card h3{font:400 clamp(23px,2.3vw,31px)/1.17 Georgia,serif!important;letter-spacing:-.03em;margin:0 0 14px;overflow-wrap:anywhere}
#iulia-live .blog-card h3 a{color:#31262b;text-decoration:none}
#iulia-live .blog-card h3 a:hover{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px}
#iulia-live .blog-card p.blog-card-desc{font:15px/1.75 Arial,sans-serif!important;color:#63575a;margin:0 0 23px;flex:1}
#iulia-live .blog-card .blog-card-link{font:700 14px/1.5 Arial,sans-serif;color:#844f60;text-decoration:none;display:inline-flex;gap:8px;align-items:center;align-self:flex-start;padding-bottom:3px;border-bottom:1px solid currentColor}
#iulia-live .blog-category-group{margin:52px 0 62px}
#iulia-live .blog-category-group>h2{font:400 clamp(29px,3vw,43px)/1.16 Georgia,serif!important}
#iulia-live .blog-category-nav{margin:14px 0 46px}
#iulia-live .blog-category-nav a{background:#fff7f4;border:1px solid #e5cad0;color:#45373b;border-radius:999px}
#iulia-live .blog-category-nav a:hover{background:#fae3e9}
#iulia-live .blog-article{width:min(100% - 40px,860px);max-width:860px;margin:20px auto 80px}
#iulia-live .blog-article-head{border-radius:23px;background:linear-gradient(135deg,#fff7f0 0%,#f9e2e7 100%);padding:clamp(28px,5vw,65px) clamp(24px,5vw,66px);margin:30px 0 42px;border:1px solid #f0d7d9}
#iulia-live .blog-article-head .blog-type{display:inline-block;color:#795160;text-transform:uppercase;font:700 11px/1.6 Arial,sans-serif!important;letter-spacing:.16em;margin-bottom:16px}
#iulia-live .blog-article-head h1{font:400 clamp(33px,5vw,61px)/1.1 Georgia,serif!important;letter-spacing:-.045em!important;color:#352831;margin:0 0 22px}
#iulia-live .blog-article-head .blog-lead{font:17px/1.8 Arial,sans-serif!important;color:#5b4c53;max-width:620px;margin:0 0 18px}
#iulia-live .blog-article .blog-meta{color:#795e65;font-size:12px!important;letter-spacing:.04em}
#iulia-live .blog-article .blog-content{max-width:710px;margin:0 auto;font:18px/1.95 Arial,sans-serif!important;color:#322d2d}
#iulia-live .blog-article .blog-content p{font:inherit!important;margin:0 0 1.65em}
#iulia-live .blog-article .blog-content p:first-of-type{font-size:clamp(19px,2.1vw,23px)!important;line-height:1.7!important;color:#46323a}
#iulia-live .blog-article .blog-content h2{font:400 clamp(26px,3vw,36px)/1.25 Georgia,serif!important;margin:1.8em 0 .7em}
#iulia-live .blog-article .blog-content h3{font:400 25px/1.3 Georgia,serif!important;margin:1.5em 0 .65em}
#iulia-live .blog-article .blog-content blockquote{font:italic 24px/1.6 Georgia,serif!important;color:#674857;padding:18px 25px;margin:34px 0;border-left:3px solid #d892a9;background:#fff1f3;border-radius:0 14px 14px 0}
#iulia-live .blog-article .blog-content a{color:#864c60;text-underline-offset:4px}
#iulia-live .blog-article .blog-next-step{max-width:710px;margin:55px auto 34px;padding:31px;border-radius:18px;background:#f9e8ee;border:1px solid #e8cbd5}
#iulia-live .blog-article .blog-next-step h2{font:400 clamp(26px,3vw,33px)/1.2 Georgia,serif!important;margin:0 0 12px}
#iulia-live .blog-article .blog-next-step p{font:16px/1.7 Arial,sans-serif!important;margin:0 0 18px}
#iulia-live .blog-article .blog-next-step .button{display:inline-flex;min-height:46px;align-items:center;background:#51373f;color:#fff9f8;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700}
#iulia-live .blog-article .blog-back{max-width:710px;margin:25px auto 0}
@media(max-width:680px){#iulia-live .blog-card{min-height:0;padding:25px 23px}#iulia-live .blog-article{width:calc(100% - 28px)}#iulia-live .blog-article-head{margin:8px 0 26px;padding:30px 23px;border-radius:17px}#iulia-live .blog-article .blog-content{font-size:16.5px!important;line-height:1.82!important}#iulia-live .blog-article .blog-content p:first-of-type{font-size:19px!important}#iulia-live .blog-article .blog-next-step{padding:25px 22px}}
@media(prefers-reduced-motion:reduce){#iulia-live .blog-card{transition:none;transform:none!important}}

</style>`);
 html=html.replace("</style>",`#iulia-live .blog-related{margin:30px 0;padding:20px;background:#FFF9EF;border:1px solid #D9C7AC;border-radius:8px}#iulia-live .blog-related li{margin:9px 0}\n
#iulia-live .blog-category-nav{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 40px}
#iulia-live .blog-category-nav a{display:inline-flex;align-items:center;gap:7px;padding:10px 16px;border-radius:32px;background:#FFF9EF;border:1px solid #D9C7AC;color:#302B28;font-size:14px;text-decoration:none}
#iulia-live .blog-category-nav a:hover,#iulia-live .blog-category-nav a:focus-visible{background:#EEE1D5;outline-offset:3px}
#iulia-live .blog-category-nav span{font-weight:700}
#iulia-live .blog-category-group{margin:48px 0 56px;scroll-margin-top:100px}
#iulia-live .blog-category-group h2{font-size:clamp(28px,3vw,42px);margin:0 0 8px}
#iulia-live .blog-group-desc{margin:0 0 22px;max-width:680px;color:#665B50}
#iulia-live .blog-card h3{font-size:clamp(23px,2.3vw,32px);line-height:1.24;margin:0 0 12px}
</style>`);
 html=html.replace("</style>",`
/* Stil editorial pentru catalogul cu navigație deasupra articolelor. */
#iulia-live .editorial-intro{position:relative;max-width:1030px;padding:clamp(32px,5vw,64px) clamp(22px,5.5vw,76px)!important;margin:26px auto 12px!important;border-radius:26px;background:radial-gradient(circle at 90% 20%,#f1d5dc 0,transparent 42%),linear-gradient(145deg,#fff8f3,#f7e8e4);border:1px solid #efd9d9;box-shadow:0 18px 46px rgba(97,56,69,.045)}
#iulia-live .editorial-intro .editorial-mark{font:italic 40px Georgia,serif;color:#be8899;line-height:1}
#iulia-live .editorial-intro .eyebrow{font-size:11px!important;letter-spacing:.16em!important;color:#996475;margin:12px 0 16px!important}
#iulia-live .editorial-intro h1{max-width:850px;font:400 clamp(34px,5vw,62px)/1.13 Georgia,serif!important;letter-spacing:-.038em;margin:0 0 17px!important;color:#3e2932}
#iulia-live .editorial-intro h1 em{color:#9e617b;font-style:italic}
#iulia-live .editorial-intro>p:not(.eyebrow){max-width:690px!important;font:16px/1.72 Arial,sans-serif!important;color:#665459;margin:0!important}
#iulia-live .editorial-catalog{padding-top:0!important}
#iulia-live .editorial-catalog .blog-category-group{margin:18px 0 58px!important;padding:24px 0 0!important}
#iulia-live .editorial-catalog .blog-category-group>h2{margin:0 0 6px!important;font:400 clamp(27px,3.3vw,40px)/1.16 Georgia,serif!important;color:#49323b}
#iulia-live .editorial-catalog .blog-category-group>h2:before{content:"✧";font-size:.7em;color:#b88e9c;padding-right:12px}
#iulia-live .editorial-catalog .blog-group-desc{color:#79686d;margin:0 0 19px}
#iulia-live .editorial-catalog .blog-card{border:1px solid #ead1d5;background:linear-gradient(165deg,#fffaf7,#fceef1);border-radius:24px 24px 18px 18px;box-shadow:0 11px 32px rgba(120,77,90,.055);min-height:252px;padding:27px 25px 24px}
#iulia-live .editorial-catalog .blog-card h3{font-size:clamp(22px,2.25vw,29px)!important;line-height:1.22!important}
#iulia-live .editorial-catalog .blog-card .blog-type{color:#9a617a}
#iulia-live .blog-categories-end{background:linear-gradient(145deg,#fff7f3,#f7e8ec);border:1px solid #ecd2d9;border-radius:22px;padding:34px clamp(20px,4vw,43px);margin:55px 0 10px}
#iulia-live .blog-categories-end h2{font:400 clamp(27px,3.4vw,40px)/1.12 Georgia,serif!important;color:#44303a;margin:0 0 22px}
#iulia-live .blog-categories-end .eyebrow{letter-spacing:.12em;color:#976577;font-size:11px}
#iulia-live .blog-categories-end .blog-category-nav{display:flex;flex-wrap:wrap;gap:10px;margin:0}
#iulia-live .blog-categories-end .blog-category-nav a{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border-radius:32px;background:#fffaf8;border:1px solid #e2c1cb;color:#6b4353;font-size:13px;text-decoration:none}
#iulia-live .blog-categories-end .blog-category-nav a:hover{background:#efd5e0}
@media(max-width:700px){
#iulia-live .editorial-intro{padding:30px 22px!important;margin:7px 14px 6px!important;border-radius:20px}
#iulia-live .editorial-intro .editorial-mark{font-size:28px}
#iulia-live .editorial-intro h1{font-size:clamp(32px,8.3vw,44px)!important}
#iulia-live .editorial-intro>p:not(.eyebrow){font-size:15px!important;line-height:1.64}
#iulia-live .editorial-catalog .blog-category-group{margin-top:0!important;margin-bottom:39px!important}
#iulia-live .editorial-catalog .blog-card{min-height:0}
#iulia-live .blog-categories-end{margin-top:26px;padding:27px 19px}
#iulia-live .blog-categories-end .blog-category-nav a{font-size:13px}
}

</style>`);
 writeFileSync(join(output,"articole.html"),html,"utf8");
 const dest=join(output,"articole");mkdirSync(dest,{recursive:true});
 let sitemap=readFileSync(join(output,"sitemap.xml"),"utf8");
 for(const a of articles){
  const canonical=origin?origin+"/articole/"+a.slug:"";
  let page=html; // stiluri și navigare identice cu indexul articolelor; secțiunea main este înlocuită mai jos
  const seoTitle=esc(publicBrand(a.seo_titlu||a.titlu+" | Echilibrarea rădăcinilor"));
  const seoDesc=esc(publicBrand(a.seo_descriere||a.descriere));
  page=page.replace(/<meta property="og:type" content="[^"]*"/,'<meta property="og:type" content="article"');
  page=page.replace(/<title>[^<]*<\/title>/,'<title>'+seoTitle+'</title>');
  page=page.replace(/<meta name="description" content="[^"]*"/,'<meta name="description" content="'+seoDesc+'"');
  page=page.replace(/<meta property="og:title" content="[^"]*"/,'<meta property="og:title" content="'+seoTitle+'"');
  page=page.replace(/<meta property="og:description" content="[^"]*"/,'<meta property="og:description" content="'+seoDesc+'"');
  const kind=groupOf(a);
  const edu=isEducational(a);
  const aboutMerit=/vinov|rușin|rusin|merit|imagine.de.sine|stima.de.sine/i.test(a.titlu+" "+(a.categorie||"")+" "+a.slug);
  const cta=kind==="constelatii-familiale"?{href:"../constelatii.html",label:"Descoperă cum folosesc constelațiile"}:
     kind==="legi-universale"?{href:"../metoda-clar.html",label:"Descoperă Echilibrarea rădăcinilor"}:
     aboutMerit?{href:"../program-nivelul-de-merit.html",label:"Explorează programul Nivelul tău de merit"}:
     {href:"../sedinte-individuale.html",label:"Descoperă ședințele individuale"};
  const nextStep='<aside class="blog-next-step" aria-label="Descoperă cum putem lucra"><h2>Povestea ta nu trebuie să rămână la fel</h2><p>Poate că până acum te-ai privit pe tine, pe ceilalți sau viața printr-o poveste care te doare. Nu trebuie să o schimbi cu forța și nici să găsești singură toate răspunsurile. Există posibilitatea să descoperi și alte perspective, în ritmul tău. Prin Echilibrarea rădăcinilor și, în funcție de context, prin constelații familiale sau sistemice, putem explora împreună ceea ce trăiești.</p><p>Dacă vrei să vezi cum lucrăm, îmi poți scrie pentru o consultație inițială gratuită de 30 de minute. Îți pot spune și despre workshopuri și programele mele, ca să alegi ce ți se potrivește.</p><a class="button" href="https://wa.me/40758321125?text=Buna%2C%20Iulia!%20As%20dori%20o%20consultatie%20initiala%20gratuita%20de%2030%20de%20minute.">Scrie-mi pentru consultația gratuită de 30 de minute <span aria-hidden="true">→</span></a></aside>';
  // Păstrăm integral textul editorial, inclusiv invitația scrisă de autoare.
  // Dacă articolul are deja un CTA către site, nu dublăm cardul automat.
  const articleText=String(a.continut).trim()
    .replaceAll("https://intoarcerealatine-nou.pages.dev/",origin?origin+"/":"https://iuliabobeica.ro/")
    .replaceAll("https://spontaneous-quokka-e0bede.netlify.app/",origin?origin+"/":"https://iuliabobeica.ro/");
  const lastParagraph=articleText.split(/\n\s*\n/).at(-1)||"";
  const hasEditorialCta=lastParagraph.includes("](https://iuliabobeica.ro/") || lastParagraph.includes("](../") || lastParagraph.includes("](./");
  // Legături interne contextualizate: numai articole deja aprobate și publicate.
  // Nu adăugăm text în sursa editorială și nu inventăm articole noi.
  const currentGroup=groupOf(a);
  const relatedItems=articles.filter(other=>other.slug!==a.slug&&groupOf(other)===currentGroup)
    .map(other=>{
      const source=new Set((a.titlu+" "+a.descriere).toLocaleLowerCase("ro").split(/[^a-zăâîșț0-9]+/u).filter(w=>w.length>=5));
      const common=(other.titlu+" "+other.descriere).toLocaleLowerCase("ro").split(/[^a-zăâîșț0-9]+/u).filter(w=>source.has(w)).length;
      return {article:other,score:common};
    }).sort((x,y)=>y.score-x.score||x.article.titlu.localeCompare(y.article.titlu,"ro")).slice(0,3);
  const relatedBlock=''; // Editorial preference: no automated cross-article suggestions.
  const body='<main id="continut"><article class="section wrap blog-article"><header class="blog-article-head"><span class="blog-type">'+(edu?"Articol educativ":"O situație în care poate te recunoști")+'</span><h1>'+esc(a.titlu)+'</h1><p class="blog-meta"><time datetime="'+a.data+'">'+a.data+'</time> · Iulia Bobeica</p></header>'+(safeUrl(a.imagine)?'<img class="blog-hero-img" src="'+esc(safeUrl(a.imagine))+'" alt="">':"")+'<div class="blog-content">'+markdownToHtml(articleText)+'</div>'+nextStep+'<p class="blog-back"><a class="text-link" href="../articole.html#'+groupOf(a)+'">← Înapoi la articole</a></p></article></main>';
  page=page.replace(/<main id="continut">[\s\S]*?<\/main>/,body);
  page=page.replaceAll('href="./','href="../').replaceAll('src="./','src="../');
  page=page.replace(/<link rel="canonical" href="[^"]*"\s*\/>|<link rel="canonical" href="[^"]*">/g,"");
  if(canonical){
    const schema={"@context":"https://schema.org","@type":"BlogPosting","headline":a.titlu,"description":a.seo_descriere||a.descriere,"datePublished":a.data,"author":{"@type":"Person","name":"Iulia Bobeica","url":origin+"/despre-mine"},"publisher":{"@type":"Organization","name":"Iulia Bobeica – Echilibrarea rădăcinilor"},"mainEntityOfPage":canonical};
    const json=JSON.stringify(schema).replace(/</g,"\\u003c");
    page=page.replace("</head>",'<link rel="canonical" href="'+esc(canonical)+'"><script type="application/ld+json">'+json+'</script></head>');
  }
  page=page.replace(/<meta property="og:url" content="[^"]*"/,'<meta property="og:url" content="'+esc(canonical||"")+'"');
  writeFileSync(join(dest,a.slug+".html"),page,"utf8");
  if(origin)sitemap=sitemap.replace("</urlset>",'  <url><loc>'+esc(canonical)+'</loc></url>\n</urlset>');
 }
 if(origin)writeFileSync(join(output,"sitemap.xml"),sitemap,"utf8");
 console.log("Articole publicate:",articles.length,"(ciornele nu au fost copiate)");
}

