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
 articles.sort((a,b)=>b.data.localeCompare(a.data)||a.slug.localeCompare(b.slug));
 const categoryGroups=[
  {id:"blocaje-si-decizii",label:"Blocaje și situații de zi cu zi",desc:"Situații de viață în care poate te recunoști, fără explicații prestabilite."},
  {id:"relatii-si-familie",label:"Relații și familie",desc:"Momente din viața de familie în care apropierea, sprijinul sau liniștea par departe."},
  {id:"imagine-de-sine",label:"Imagine de sine și bani",desc:"Când te doare felul în care te privești sau te preocupă banii și lucrurile rămase pe mai târziu."},
  {id:"constelatii-familiale",label:"Constelații familiale și sistemice",desc:"Articole educative despre constelații, folosite în metoda mea în funcție de context."},
  {id:"legi-universale",label:"Cele șapte legi universale",desc:"Articole educative despre reperele din metoda mea. Fără exerciții sau întrebări inventate."}
 ];
 const groupOf=a=>{
  const cat=(a.categorie||"").toLowerCase(),slug=a.slug;
  if(cat.includes("legile universale"))return "legi-universale";
  if(cat.includes("constelații")||cat.includes("constelatii"))return "constelatii-familiale";
  if(cat.includes("imagine")||cat.includes("merit")||cat.includes("vinov")||cat.includes("critică")||cat.includes("limite")||cat.includes("bani"))return "imagine-de-sine";
  if(cat.includes("famil")||cat.includes("relații")||cat.includes("relați")||cat.includes("cuplu")||cat.includes("maternitat"))return "relatii-si-familie";
  if(slug.includes("parintii")||slug.includes("familie"))return "relatii-si-familie";
  return "blocaje-si-decizii";
 };
 const isEducational=a=>groupOf(a)==="legi-universale"||groupOf(a)==="constelatii-familiale";
 const cardsFor=list=>list.map(a=>{
   const kind=isEducational(a)?"Articol educativ":"O situație în care te poți recunoaște";
   return '<article class="blog-card"><p class="blog-type">'+esc(kind)+'</p><h3><a href="./articole/'+a.slug+'.html">'+esc(a.titlu)+'</a></h3><p class="blog-card-desc">'+esc(a.descriere)+'</p><a class="blog-card-link" href="./articole/'+a.slug+'.html">'+(isEducational(a)?"Citește articolul educativ":"Citește povestea")+' <span aria-hidden="true">→</span></a></article>';
 }).join("\n");
 const activeGroups=categoryGroups.map(g=>({...g,items:articles.filter(a=>groupOf(a)===g.id)})).filter(g=>g.items.length);
 const categoryNav='<nav class="blog-category-nav" aria-label="Categorii articole">'+activeGroups.map(g=>'<a href="#'+g.id+'">'+esc(g.label)+' <span>('+g.items.length+')</span></a>').join("")+'</nav>';
 const categorySections=activeGroups.map(g=>'<section class="blog-category-group" id="'+g.id+'" aria-labelledby="head-'+g.id+'"><h2 id="head-'+g.id+'">'+esc(g.label)+'</h2><p class="blog-group-desc">'+esc(g.desc)+'</p><div class="blog-list">'+cardsFor(g.items)+'</div></section>').join("\n");
 let html=template;
 const empty='<p>Articolele sunt în pregătire. Vezi <a href="./resurse.html">Resurse</a>.</p>';
 html=html.replace(/<div class="blog-list">\s*<!-- LISTA_ARTICOLE -->\s*<\/div>/,articles.length?categoryNav+categorySections:empty);
 if(html.includes("<!-- LISTA_ARTICOLE -->"))throw Error("Nu s-a putut organiza lista articolelor.");
 html=html.replace("</style>",`
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
 writeFileSync(join(output,"articole.html"),html,"utf8");
 const dest=join(output,"articole");mkdirSync(dest,{recursive:true});
 let sitemap=readFileSync(join(output,"sitemap.xml"),"utf8");
 for(const a of articles){
  const canonical=origin?origin+"/articole/"+a.slug:"";
  let page=html; // stiluri și navigare identice cu indexul articolelor; secțiunea main este înlocuită mai jos
  const seoTitle=esc(a.seo_titlu||a.titlu+" | Întoarcerea la tine");
  const seoDesc=esc(a.seo_descriere||a.descriere);
  page=page.replace(/<title>[^<]*<\/title>/,'<title>'+seoTitle+'</title>');
  page=page.replace(/<meta name="description" content="[^"]*"/,'<meta name="description" content="'+seoDesc+'"');
  page=page.replace(/<meta property="og:title" content="[^"]*"/,'<meta property="og:title" content="'+seoTitle+'"');
  page=page.replace(/<meta property="og:description" content="[^"]*"/,'<meta property="og:description" content="'+seoDesc+'"');
  const kind=groupOf(a);
  const edu=isEducational(a);
  const cta=kind==="constelatii-familiale"?{href:"../constelatii.html",label:"Descoperă cum folosesc constelațiile"}:
     kind==="legi-universale"?{href:"../metoda-clar.html",label:"Descoperă metoda «Întoarcerea la tine»"}:
     {href:"../metoda-clar.html",label:"Vezi cum lucrez"};
  const nextStep='<aside class="blog-next-step" aria-label="Mai multe despre metoda mea"><h2>'+(edu?"Vrei să afli cum lucrez?":"Te-ai regăsit în această situație?")+'</h2><p>'+(edu?"Poți descoperi cum integrez aceste repere în procesul meu.":"Nu trebuie să găsești singură o explicație. Dacă îți este cunoscută această trăire, poți afla cum lucrez.")+'</p><a class="button" href="'+cta.href+'">'+esc(cta.label)+' <span aria-hidden="true">→</span></a></aside>';
  // Articolele de atragere au uneori o invitație scrisă în ultimul paragraf.
  // Nu afișăm și acea invitație, și cardul CTA de la final.
  const articleText=edu?a.continut:String(a.continut).replace(/\\n\\s*Dacă[^\\n]*\\[[^\\]]+\\]\\(https:\\/\\/intoarcerealatine-nou\\.pages\\.dev\\/[^)]+\\)\\.?\\s*$/u,"").replace(/\\n\\s*Poți[^\\n]*\\[[^\\]]+\\]\\(https:\\/\\/intoarcerealatine-nou\\.pages\\.dev\\/[^)]+\\)\\.?\\s*$/u,"");
  const body='<main id="continut"><article class="section wrap blog-article"><header class="blog-article-head"><span class="blog-type">'+(edu?"Articol educativ":"O situație în care poate te recunoști")+'</span><h1>'+esc(a.titlu)+'</h1><p class="blog-meta"><time datetime="'+a.data+'">'+a.data+'</time> · Iulia Bobeica</p></header>'+(safeUrl(a.imagine)?'<img class="blog-hero-img" src="'+esc(safeUrl(a.imagine))+'" alt="">':"")+'<div class="blog-content">'+markdownToHtml(articleText)+'</div>'+nextStep+'<p class="blog-back"><a class="text-link" href="../articole.html#'+groupOf(a)+'">← Înapoi la articole</a></p></article></main>';
  page=page.replace(/<main id="continut">[\s\S]*?<\/main>/,body);
  page=page.replaceAll('href="./','href="../').replaceAll('src="./','src="../');
  page=page.replace(/<link rel="canonical" href="[^"]*"\s*\/>|<link rel="canonical" href="[^"]*">/g,"");
  if(canonical){
    const schema={"@context":"https://schema.org","@type":"BlogPosting","headline":a.titlu,"description":a.seo_descriere||a.descriere,"datePublished":a.data,"author":{"@type":"Person","name":"Iulia Bobeica","url":origin+"/despre-mine"},"publisher":{"@type":"Organization","name":"Întoarcerea la tine"},"mainEntityOfPage":canonical};
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
