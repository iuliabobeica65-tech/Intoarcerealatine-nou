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
  {id:"blocaje-si-decizii",label:"Blocaje, decizii și creație conștientă",desc:"Când știi ce îți dorești, dar continui să faci la fel."},
  {id:"relatii-si-familie",label:"Relații și familie",desc:"Situații concrete care dor, se repetă sau îți pun limitele la încercare."},
  {id:"imagine-de-sine",label:"Imagine de sine, vinovăție și merit",desc:"Cum te privești când ceri, primești, greșești sau te compari."},
  {id:"constelatii-familiale",label:"Constelații familiale și sistemice",desc:"Explorări experiențiale ale relațiilor și rolurilor, separate de Metoda CLAR."},
  {id:"legi-universale",label:"Cele șapte legi universale",desc:"Fiecare lege explicată prin situații reale, întrebări și exerciții."}
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
 const cardsFor=list=>list.map(a=>'<article class="blog-card"><p class="blog-meta">'+esc(a.categorie||"Reflecții")+' · <time datetime="'+a.data+'">'+a.data+'</time></p><h3><a href="./articole/'+a.slug+'.html">'+esc(a.titlu)+'</a></h3><p>'+esc(a.descriere)+'</p><a class="text-link" href="./articole/'+a.slug+'.html">Citește articolul →</a></article>').join("\n");
 const activeGroups=categoryGroups.map(g=>({...g,items:articles.filter(a=>groupOf(a)===g.id)})).filter(g=>g.items.length);
 const categoryNav='<nav class="blog-category-nav" aria-label="Categorii articole">'+activeGroups.map(g=>'<a href="#'+g.id+'">'+esc(g.label)+' <span>('+g.items.length+')</span></a>').join("")+'</nav>';
 const categorySections=activeGroups.map(g=>'<section class="blog-category-group" id="'+g.id+'" aria-labelledby="head-'+g.id+'"><h2 id="head-'+g.id+'">'+esc(g.label)+'</h2><p class="blog-group-desc">'+esc(g.desc)+'</p><div class="blog-list">'+cardsFor(g.items)+'</div></section>').join("\n");
 let html=template;
 const empty='<p>Articolele sunt în pregătire. Vezi <a href="./resurse.html">Resurse</a>.</p>';
 html=html.replace(/<div class="blog-list">\s*<!-- LISTA_ARTICOLE -->\s*<\/div>/,articles.length?categoryNav+categorySections:empty);
 if(html.includes("<!-- LISTA_ARTICOLE -->"))throw Error("Nu s-a putut organiza lista articolelor.");
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
  let page=template;
  const seoTitle=esc(a.seo_titlu||a.titlu+" | Întoarcerea la tine");
  const seoDesc=esc(a.seo_descriere||a.descriere);
  page=page.replace(/<title>[^<]*<\/title>/,'<title>'+seoTitle+'</title>');
  page=page.replace(/<meta name="description" content="[^"]*"/,'<meta name="description" content="'+seoDesc+'"');
  page=page.replace(/<meta property="og:title" content="[^"]*"/,'<meta property="og:title" content="'+seoTitle+'"');
  page=page.replace(/<meta property="og:description" content="[^"]*"/,'<meta property="og:description" content="'+seoDesc+'"');
  const kind=groupOf(a);
  const cta=kind==="imagine-de-sine"?{href:"../program-nivelul-de-merit.html",label:"Descoperă programul individual «Merit să primesc?»"}:kind==="constelatii-familiale"?{href:"../constelatii.html",label:"Află despre constelații familiale și sistemice"}:kind==="legi-universale"?{href:"../metoda-clar.html#cele-sapte-legi",label:"Vezi cum folosesc cele șapte legi universale"}:{href:"../lucram-impreuna.html",label:"Vezi programele de lucru individual"};
  const nextStep='<aside class="blog-related" aria-label="Cum putem lucra împreună"><h2>Vrei să explorăm și situația ta?</h2><p>Nu îți ofer o cauză gata pregătită. Pornim de la ceea ce trăiești și de la concluziile pe care le-ai format.</p><p><a href="'+cta.href+'">'+esc(cta.label)+' →</a></p></aside>';
  const related=articles.filter(b=>b.slug!==a.slug&&groupOf(b)===groupOf(a)).slice(0,3);
  const relatedHtml=related.length?'<aside aria-label="Citește și" class="blog-related"><h2>Citește și</h2><ul>'+related.map(b=>'<li><a href="../articole/'+b.slug+'.html">'+esc(b.titlu)+'</a></li>').join("")+'</ul></aside>':"";
  const body='<main id="continut"><section class="section wrap blog-article"><p class="eyebrow">'+esc(a.categorie||"ARTICOLE")+'</p><h1>'+esc(a.titlu)+'</h1><p class="blog-meta"><time datetime="'+a.data+'">'+a.data+'</time> · <a href="../despre-mine.html">Iulia Bobeica</a></p>'+(safeUrl(a.imagine)?'<img class="blog-hero-img" src="'+esc(safeUrl(a.imagine))+'" alt="">':"")+'<div class="blog-content">'+markdownToHtml(a.continut)+'</div>'+nextStep+relatedHtml+'<p><a class="text-link" href="../articole.html#'+groupOf(a)+'">← Vezi toate articolele din categorie</a></p></section></main>';
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
