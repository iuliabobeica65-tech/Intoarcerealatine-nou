/* Continut editabil: afiseaza datele din GitHub fara dependinte externe. Fallback HTML ramane accesibil. */
(()=>{"use strict";const safeLink=(raw)=>{try{const u=new URL(raw,location.href);if(u.protocol==="https:"||u.protocol==="http:"&&u.origin===location.origin||u.protocol==="mailto:"&&/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(raw)||u.protocol==="tel:"&&/^tel:\+?[0-9\s()-]+$/.test(raw))return raw;}catch(e){}return null;};const setText=(selector,value)=>{const el=document.querySelector(selector);if(el&&typeof value==="string"&&value.trim())el.textContent=value;};const setButtonText=(selector,value)=>{const el=document.querySelector(selector);if(!el||typeof value!=="string"||!value.trim())return;const txt=[...el.childNodes].find(n=>n.nodeType===3);if(txt)txt.textContent=value+" ";else el.prepend(document.createTextNode(value+" "));};const setHref=(selector,value)=>{const el=document.querySelector(selector),url=typeof value==="string"?safeLink(value):null;if(el&&url)el.setAttribute("href",url);};const urls=[["content/acasa.json",(c)=>{if(c.titlu!=="Poate că e timpul să te vezi și pe tine.")setText("[data-cms=hero-title]",c.titlu);setText("[data-cms=hero-subtitle]",c.subtitlu);setText("[data-cms=hero-context]",c.text_hero_continuare);setText("[data-cms=contact-title]",c.contact_titlu);setText("[data-cms=contact-text]",c.contact_text);setButtonText("[data-cms=contact-cta]",c.contact_buton);setHref("[data-cms=contact-cta]",c.contact_link);if(Array.isArray(c.oferte)){c.oferte.slice(0,3).forEach((item,i)=>{const box=document.querySelector('[data-cms-offer="'+i+'"]');if(!box||!item)return;const h=box.querySelector("[data-cms-offer-title]"),p=box.querySelector("[data-cms-offer-text]"),a=box.querySelector("[data-cms-offer-link]");if(h&&typeof item.titlu==="string"&&item.titlu.trim())h.textContent=item.titlu;if(p&&typeof item.text==="string"&&item.text.trim())p.textContent=item.text;if(a){if(item.buton&&typeof item.buton==="string")a.textContent=item.buton;const href=typeof item.link==="string"?safeLink(item.link):null;if(href)a.href=href;}});}if(Array.isArray(c.situatii)){c.situatii.slice(0,4).forEach((item,i)=>{const box=document.querySelector('[data-cms-situation="'+i+'"]');if(!box||!item)return;const h=box.querySelector("[data-cms-situation-title]"),p=box.querySelector("[data-cms-situation-text]");if(h&&item.titlu)h.textContent=item.titlu;if(p&&item.text)p.textContent=item.text;});}setText('[data-cms="example-title"]',c.exemplu_titlu);if(Array.isArray(c.exemplu_paragrafe))c.exemplu_paragrafe.slice(0,3).forEach((t,i)=>setText('[data-cms-example-paragraph="'+i+'"]',t));setText('[data-cms="about-short-title"]',c.despre_titlu);setText('[data-cms="about-short-text"]',c.despre_text);if(Array.isArray(c.carusel))c.carusel.slice(0,7).forEach((item,i)=>{const box=document.querySelector('[data-cms-carousel="'+i+'"]');if(!box||!item)return;const h=box.querySelector("[data-cms-carousel-title]"),d=box.querySelector("[data-cms-carousel-description]");if(h&&item.titlu)h.textContent=item.titlu;if(d&&item.descriere)d.textContent=item.descriere;});if(typeof c.fotografie==="string"){const img=document.querySelector(".hero-portrait"),u=safeLink(c.fotografie);if(img&&u)img.src=u;}setText("[data-cms=recognition-title]",c.titlu_recunoastere);setText("[data-cms=recognition-intro]",c.text_recunoastere);setButtonText("[data-cms=hero-cta-primary]",c.buton_principal);setHref("[data-cms=hero-cta-primary]",c.link_principal);setButtonText("[data-cms=hero-cta-secondary]",c.buton_secundar);setHref("[data-cms=hero-cta-secondary]",c.link_secundar);}]];for(const [url,apply] of urls){if(!document.querySelector("[data-cms=hero-title]"))continue;fetch(url,{cache:"no-cache"}).then(r=>r.ok?r.json():Promise.reject(Error("Content not found"))).then(apply).catch(()=>{});}
if(document.getElementById("calendar-intalniri"))fetch("content/evenimente.json",{cache:"no-cache"}).then(r=>r.ok?r.json():Promise.reject(Error("Calendar not found"))).then(c=>{const root=document.getElementById("calendar-intalniri");if(!root||!Array.isArray(c.evenimente))return;setText("[data-cms=events-title]",c.titlu);setText("[data-cms=events-intro]",c.introducere);root.replaceChildren();for(const e of c.evenimente){if(!e||!e.nume)continue;const card=document.createElement("article");card.className="event-card";const h=document.createElement("h3");h.textContent=e.nume;card.append(h);const p=document.createElement("p");p.textContent=e.descriere||"";card.append(p);const meta=document.createElement("p");meta.className="event-meta";meta.textContent=e.confirmat?(e.data||"Data urmează să fie confirmată")+" · "+(e.loc||""):"Data următoarei întâlniri va fi anunțată. "+(e.loc||"");card.append(meta);const href=safeLink(e.link||"");if(href){const a=document.createElement("a");a.href=href;a.className="text-link";a.textContent="Află detalii →";card.append(a);}root.append(card);}}).catch(()=>{});/* Cele trei materiale de reflectie sunt editabile prin Pages CMS. */
if(document.querySelector("[data-cms-material]"))fetch("content/resurse.json",{cache:"no-cache"}).then(r=>r.ok?r.json():Promise.reject(Error("Resurse not found"))).then(c=>{if(!Array.isArray(c.materiale))return;for(const [i,item] of c.materiale.slice(0,3).entries()){const card=document.querySelector('[data-cms-material="'+i+'"]');if(!card||!item)continue;for(const [name,key] of [["title","titlu"],["lead","introducere"],["body","exercitiu"],["note","nota"]]){const el=card.querySelector('[data-cms-material-'+name+']');if(el&&typeof item[key]==="string"&&item[key].trim()&&el.textContent.replace(/\s+/g," ").trim()!==item[key].replace(/\s+/g," ").trim())el.textContent=item[key];}}}).catch(()=>{});
/* Paginile interioare pastreaza stilizarea originala daca nu ai editat campul. */
const page=document.body.getAttribute("data-cms-file");if(page&&/^(metoda|constelatii|colaborare|despre|live|resurse)$/.test(page)){fetch("./content/"+page+".json",{cache:"no-cache"}).then(r=>r.ok?r.json():Promise.reject(Error("Content not found"))).then(c=>{const update=(selector,value)=>{const el=document.querySelector(selector);if(!el||typeof value!=="string"||!value.trim())return;const norm=t=>t.replace(/\s+/g," ").trim();if(norm(el.textContent)!==norm(value))el.textContent=value;};if(c.titlu!==c.initial_titlu)update("[data-cms=inner-title]",c.titlu);if(c.introducere!==c.initial_introducere)update("[data-cms=inner-intro]",c.introducere);if(c.titlu_sectiune!==c.initial_titlu_sectiune)update("[data-cms=inner-section-title]",c.titlu_sectiune);}).catch(()=>{});}

/* Textele suplimentare sunt separate de campurile principale si de aspectul HTML.
   Cand textul ramane identic, pastram marcajul HTML original; altfel setam doar textContent,
   evitand interpretarea codului furnizat prin editor. */
const extraPage=document.body.getAttribute("data-cms-extra");
if(extraPage&&/^(acasa|metoda-clar|constelatii|lucram-impreuna|despre-mine|resurse|live)$/.test(extraPage)){
 fetch("./content/texte-"+extraPage+".json",{cache:"no-cache"})
 .then(r=>r.ok?r.json():Promise.reject(Error("Extra content not found")))
 .then(c=>{if(!Array.isArray(c.texte))return;
  for(const item of c.texte){if(!item||typeof item.id!=="string"||! /^(?:text|rich)-\d+$/.test(item.id)||typeof item.continut!=="string")continue;
   const el=document.querySelector('[data-cms-edit="'+item.id+'"]');if(!el||!item.continut.trim()||item.initial===item.continut)continue;
   const clean=t=>t.replace(/\s+/g," ").trim();
   if(clean(el.textContent)!==clean(item.continut))el.textContent=item.continut;
  }
  if(Array.isArray(c.linkuri))for(const item of c.linkuri){
   if(!item||typeof item.id!=="string"||!/^link-\d+$/.test(item.id))continue;
   const el=document.querySelector('[data-cms-link="'+item.id+'"]');if(!el)continue;
   if(typeof item.text==="string"&&item.text.trim()&&item.text!==item.initial){
    const clean=t=>t.replace(/\s+/g," ").trim();
    if(clean(el.textContent)!==clean(item.text)){const icon=el.querySelector(".arrow");if(icon){const first=[...el.childNodes].find(n=>n.nodeType===3);if(first){first.textContent=item.text+" ";}else el.insertBefore(document.createTextNode(item.text+" "),icon);}else el.textContent=item.text;}
   }
   const href=typeof item.url==="string"?safeLink(item.url):null;
   if(href)el.setAttribute("href",href);
  }
 }).catch(()=>{});
}


/* Setari globale pentru identitatea afisata, etichetele meniului si contact.
   Nu schimba DNS-ul sau numele real al proiectului de gazduire. */
fetch("./content/setari-site.json",{cache:"no-cache"})
 .then(r=>r.ok?r.json():Promise.reject(Error("Site settings not found")))
 .then(c=>{
   if(c&&typeof c.brand==="string"&&c.brand.trim()){
    document.querySelectorAll("a.brand").forEach(a=>{
     const span=a.querySelector("span,small");
     const first=[...a.childNodes].find(n=>n.nodeType===3);
     if(first&&first.textContent.trim().toLocaleLowerCase("ro")!==c.brand.trim().toLocaleLowerCase("ro"))first.textContent=c.brand;
     if(span&&typeof c.subtitlu_brand==="string"&&c.subtitlu_brand.trim()&&span.textContent.trim()!==c.subtitlu_brand.trim())span.textContent=c.subtitlu_brand;
    });
   }
   if(Array.isArray(c.meniu)){
    const known=new Set(["acasa.html","metoda-clar.html","constelatii.html","lucram-impreuna.html","despre-mine.html","resurse.html","articole.html","live.html"]);
    for(const item of c.meniu){
     if(!item||!known.has(item.pagina)||typeof item.eticheta!=="string"||!item.eticheta.trim())continue;
     document.querySelectorAll(".site-header nav a").forEach(a=>{
      if(a.getAttribute("href")==="./"+item.pagina&&a.textContent.trim()!==item.eticheta.trim())a.textContent=item.eticheta;
     });
    }
   }
   if(typeof c.mesaj_subsol==="string"&&c.mesaj_subsol.trim())setText(".footer-status",c.mesaj_subsol);
   if(typeof c.email_contact==="string"&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email_contact)){
    document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{
     if(a.getAttribute("href")==="mailto:Iuliabobeica65@gmail.com"||a.getAttribute("href")==="mailto:"+c.email_contact){
      a.href="mailto:"+c.email_contact;if(a.textContent.includes("@"))a.textContent=c.email_contact;
     }
    });
   }
   if(typeof c.whatsapp_contact==="string"&&/^\+?[0-9]{10,15}$/.test(c.whatsapp_contact)){
    const phone=c.whatsapp_contact.replace("+","");
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{
      try{const old=new URL(a.href);if(old.pathname!=="/"+phone){old.pathname="/"+phone;a.href=old.href;}}catch(e){}
    });
   }
 }).catch(()=>{});


/* Secțiuni foto/text adăugate prin Pages CMS; structura originală rămâne neatinsă. */
const pageName=document.body.getAttribute("data-cms-extra");
if(pageName&&/^(acasa|metoda-clar|constelatii|lucram-impreuna|despre-mine|resurse|live)$/.test(pageName)){
 fetch("./content/sectiuni-site.json",{cache:"no-cache"}).then(r=>r.ok?r.json():Promise.reject(Error("Missing sections"))).then(data=>{
  const item=Array.isArray(data.pagini)?data.pagini.find(p=>p.pagina===pageName):null;
  const main=document.querySelector("#continut");if(!main||!item||!Array.isArray(item.sectiuni))return;
  const imageUrl=value=>{if(typeof value!=="string")return null;try{const u=new URL(value,location.href);return u.origin===location.origin&&/^\/(assets|Intoarcerea_la_tine_files)\//.test(u.pathname)?u.href:null;}catch(e){return null;}};
  const el=(tag,value)=>{if(typeof value!=="string"||!value.trim())return null;const node=document.createElement(tag);node.textContent=value;return node;};
  const picture=(src,caption)=>{const url=imageUrl(src);if(!url)return null;const f=document.createElement("figure");const img=document.createElement("img");img.src=url;img.alt=caption||"";img.loading="lazy";f.append(img);const cap=el("figcaption",caption);if(cap)f.append(cap);return f;};
  for(const block of item.sectiuni){if(!block||block.vizibil!==true)continue;
   const section=document.createElement("section");section.className="section wrap iulia-extra-section";
   const h=el("h2",block.titlu),p=el("p",block.text);if(h)section.append(h);if(p)section.append(p);
   const pic=picture(block.imagine,block.legenda);if(pic)section.append(pic);
   if(Array.isArray(block.imagini)){const gallery=document.createElement("div");gallery.className="iulia-extra-gallery";
    for(const entry of block.imagini.slice(0,24)){const fig=entry&&picture(entry.imagine,entry.legenda);if(fig)gallery.append(fig);}if(gallery.childElementCount)section.append(gallery);}
   const href=typeof block.link_buton==="string"?safeLink(block.link_buton):null;
   if(href&&block.text_buton){const a=el("a",block.text_buton);if(a){a.href=href;a.className="button primary";section.append(a);}}
   if(section.childElementCount)main.append(section);
  }
 }).catch(()=>{});
}
})();
