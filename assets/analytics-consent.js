(() => {
  const KEY = "iulia-analytics-consent";
  const ID = "G-DCLDSBZ2S8";
  const choice = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const save = value => { try { localStorage.setItem(KEY, value); } catch {} };
  // Default to no GA collection until the saved preference is checked.
  window["ga-disable-" + ID] = true;
  let started = false;
  function enable() {
    if (started) return;
    started = true;
    window["ga-disable-" + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", ID);
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.append(tag);
  }
  function revoke() {
    if (window.gtag) gtag("consent", "update", { analytics_storage: "denied" });
    // Block GA collection for this browser after withdrawal, including reloads.
    window["ga-disable-" + ID] = true;
    document.cookie.split(";").forEach(item => {
      const name = item.split("=")[0].trim();
      if (/^_ga($|_)/.test(name)) {
        document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
        document.cookie = name + "=; Max-Age=0; path=/; domain=." + location.hostname + "; SameSite=Lax";
      }
    });
    if (started) location.reload();
  }
  // Measure contact intent only after analytics consent; never record message text or phone numbers.
  document.addEventListener("click", event => {
    const link = event.target.closest && event.target.closest("a[href]");
    if (!link || choice() !== "allow" || !started || typeof window.gtag !== "function") return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    const host = url.hostname.toLowerCase();
    const whatsapp = host === "wa.me" || host === "api.whatsapp.com" || host === "web.whatsapp.com";
    const messenger = host === "m.me" || (host === "www.facebook.com" && url.pathname.startsWith("/messages"));
    // Internal offer navigation: count only known public offer paths, never URLs with queries.
    if (!whatsapp && !messenger) {
      if (url.origin !== location.origin) return;
      const target = url.pathname.replace(/\\.html$/, "").replace(/\\/$/, "");
      const offers = new Set([
        "/sedinte-individuale", "/constelatii", "/program-nivelul-de-merit",
        "/program-individual-patru-luni", "/program-alegeri-fara-vinovatie",
        "/lucram-impreuna"
      ]);
      if (!offers.has(target) || target === location.pathname.replace(/\\.html$/, "").replace(/\\/$/, "")) return;
      window.gtag("event", "offer_link_click", {
        source_page: location.pathname,
        offer_path: target,
        transport_type: "beacon"
      });
      return;
    }
    const page = location.pathname;
    const consultation = /consulta[țt]i|30 de minute|30 min/i.test(link.textContent || "");
    window.gtag("event", "contact_click", {
      contact_channel: whatsapp ? "whatsapp" : "messenger",
      contact_intent: consultation ? "consultation" : "details",
      page_path: page,
      transport_type: "beacon"
    });
  });
  function init() {
    const style = document.createElement("style");
    style.textContent = "#ib-consent{position:fixed;z-index:2147483646;bottom:15px;left:15px;right:15px;max-width:620px;margin:auto;padding:20px;background:#fff9ef;color:#28231f;border:1px solid #b88a42;border-radius:12px;box-shadow:0 10px 36px #0003;font:15px/1.5 Arial,sans-serif}#ib-consent h2{font:24px Georgia,serif;margin:0 0 8px}#ib-consent p{margin:0 0 12px}#ib-consent button,#ib-preferences{padding:10px 14px;margin:3px;border:1px solid #8b6333;border-radius:5px;background:#fff9ef;color:#28231f;cursor:pointer}#ib-consent button.accept{background:#28231f;color:white}#ib-preferences{position:fixed;z-index:2147483645;bottom:8px;left:8px;font-size:12px}#ib-consent a{color:#66451f}";
    document.head.append(style);
    const opener = document.createElement("button");
    opener.id = "ib-preferences";
    opener.textContent = "Preferințe cookies";
    document.body.append(opener);
    const panel = document.createElement("section");
    panel.id = "ib-consent";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Preferințe cookies");
    panel.innerHTML = '<h2>Preferințele tale contează</h2><p>Folosim Google Analytics numai dacă accepți, pentru a înțelege ce pagini sunt vizitate. Poți refuza fără să pierzi accesul la site.</p><p><a href="/politica-cookies">Politica de cookies</a> · <a href="/politica-confidentialitate">Confidențialitate</a></p><button data-choice="deny">Refuză</button><button data-choice="details">Preferințe</button><button class="accept" data-choice="allow">Acceptă</button><p id="ib-detail" hidden>Cookie-uri necesare: active. Cookie-uri de analiză: opționale. Alege Acceptă sau Refuză pentru a salva preferința.</p>';
    document.body.append(panel);
    const show = () => { panel.hidden = false; panel.style.display = "block"; };
    const hide = () => { panel.hidden = true; panel.style.display = "none"; };
    panel.addEventListener("click", event => {
      const btn = event.target.closest("button[data-choice]");
      if (!btn) return;
      const value = btn.dataset.choice;
      if (value === "details") { panel.querySelector("#ib-detail").hidden = false; return; }
      save(value);
      if (value === "allow") enable();
      else revoke();
      hide();
    });
    opener.addEventListener("click", show);
    if (choice() === "allow") { hide(); enable(); }
    else if (choice() === "deny") { window["ga-disable-" + ID] = true; hide(); }
    else show();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
