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
 let html=template;
 const cards=articles.length?articles.map(a=>'<article class="blog-card"><p class="blog-meta">'+esc(a.categorie||"Reflecții")+' · <time datetime="'+a.data+'">'+a.data+'</time></p><h2><a href="./articole/'+a.slug+'.html">'+esc(a.titlu)+'</a></h2><p>'+esc(a.descriere)+'</p><a class="text-link" href="./articole/'+a.slug+'.html">Citește articolul →</a></article>').join("\n"):'<p>Articolele sunt în pregătire. Până atunci, poți explora întrebările și exercițiile din <a href="./resurse.html" style="text-decoration:underline">Resurse</a>.</p>';
 html=html.replace("<!-- LISTA_ARTICOLE -->",cards);writeFileSync(join(output,"articole.html"),html,"utf8");
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
  const body='<main id="continut"><section class="section wrap blog-article"><p class="eyebrow">'+esc(a.categorie||"ARTICOLE")+'</p><h1>'+esc(a.titlu)+'</h1><p class="blog-meta"><time datetime="'+a.data+'">'+a.data+'</time></p>'+(safeUrl(a.imagine)?'<img class="blog-hero-img" src="'+esc(safeUrl(a.imagine))+'" alt="">':"")+'<div class="blog-content">'+markdownToHtml(a.continut)+'</div><p><a class="text-link" href="../articole.html">← Înapoi la articole</a></p></section></main>';
  page=page.replace(/<main id="continut">[\s\S]*?<\/main>/,body);
  page=page.replaceAll('href="./','href="../').replaceAll('src="./','src="../');
  page=page.replace(/<link rel="canonical" href="[^"]*"\s*\/>|<link rel="canonical" href="[^"]*">/g,"");
  if(canonical)page=page.replace("</head>",'<link rel="canonical" href="'+esc(canonical)+'"></head>');
  page=page.replace(/<meta property="og:url" content="[^"]*"/,'<meta property="og:url" content="'+esc(canonical||"")+'"');
  writeFileSync(join(dest,a.slug+".html"),page,"utf8");
  if(origin)sitemap=sitemap.replace("</urlset>",'  <url><loc>'+esc(canonical)+'</loc></url>\n</urlset>');
 }
 if(origin)writeFileSync(join(output,"sitemap.xml"),sitemap,"utf8");
 console.log("Articole publicate:",articles.length,"(ciornele nu au fost copiate)");
}
