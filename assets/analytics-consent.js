(() => {
  const KEY = "iulia-analytics-consent";
  const ID = "G-DCLDSBZ2S8";
  const choice = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const save = value => { try { localStorage.setItem(KEY, value); } catch {} };
  let started = false;
  function enable() {
    if (started) return;
    started = true;
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
    document.cookie.split(";").forEach(item => {
      const name = item.split("=")[0].trim();
      if (/^_ga($|_)/.test(name)) {
        document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
        document.cookie = name + "=; Max-Age=0; path=/; domain=." + location.hostname + "; SameSite=Lax";
      }
    });
    if (started) location.reload();
  }
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
    else if (choice() === "deny") hide();
    else show();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
