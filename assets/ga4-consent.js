(function () {
  'use strict';
  var KEY = 'iulia_ga4_consent_v1';
  var MEASUREMENT_ID = 'G-DCLDSBZ2S8';
  var loaded = false;
  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(choice) {
    try { localStorage.setItem(KEY, choice); } catch (e) {}
  }
  function startAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }
  function revokeAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (/^_ga(?:_|$)/.test(name)) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + location.hostname + '; SameSite=Lax';
      }
    });
  }
  function init() {
    var style = document.createElement('style');
    style.textContent = '#iulia-consent{position:fixed;z-index:2147483640;bottom:16px;left:16px;right:16px;max-width:640px;margin:auto;padding:22px;background:#fff9ef;color:#28231f;border:1px solid #b88a42;box-shadow:0 10px 38px #30292533;border-radius:12px;font:15px/1.55 Arial,sans-serif}#iulia-consent h2{font:normal 23px Georgia,serif;margin:0 0 8px}#iulia-consent p{margin:0 0 12px}#iulia-consent .actions{display:flex;gap:8px;flex-wrap:wrap}#iulia-consent button{cursor:pointer;padding:10px 14px;border:1px solid #8b6333;background:#fff9ef;color:#28231f;border-radius:5px;font:inherit}#iulia-consent button.primary{background:#28231f;color:white}#iulia-consent button:focus-visible,#iulia-consent-open:focus-visible{outline:3px solid #8b6333;outline-offset:3px}#iulia-consent a{color:#66451f;text-decoration:underline}#iulia-consent-open{position:fixed;z-index:2147483639;bottom:12px;left:12px;background:#fff9ef;color:#28231f;border:1px solid #b88a42;padding:7px 10px;border-radius:5px;font:12px Arial,sans-serif;cursor:pointer}';
    document.head.appendChild(style);
    var open = document.createElement('button');
    open.id = 'iulia-consent-open';
    open.type = 'button';
    open.textContent = 'Preferințe cookies';
    document.body.appendChild(open);
    var panel = document.createElement('section');
    panel.id = 'iulia-consent';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Preferințe privind cookie-urile');
    panel.innerHTML = '<h2>Preferințele tale contează</h2><p>Folosim Google Analytics pentru a înțelege ce pagini sunt vizitate, doar dacă îți dai acordul. Poți refuza fără să pierzi accesul la site.</p><p><a href="/politica-cookies.html">Politica de cookies</a> · <a href="/politica-confidentialitate.html">Confidențialitate</a></p><div class="actions"><button type="button" data-choice="deny">Refuză</button><button type="button" data-choice="preferences">Preferințe</button><button type="button" class="primary" data-choice="allow">Acceptă</button></div><div id="iulia-consent-detail" hidden><p>Cookie-uri necesare: active. Cookie-uri de analiză Google Analytics: opționale.</p><div class="actions"><button type="button" data-choice="deny">Salvează fără analiză</button><button type="button" data-choice="allow">Permite analiza</button></div></div>';
    document.body.appendChild(panel);
    function show() { panel.hidden = false; panel.style.display = 'block'; }
    function hide() { panel.hidden = true; panel.style.display = 'none'; }
    panel.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-choice]');
      if (!button) return;
      var choice = button.getAttribute('data-choice');
      if (choice === 'preferences') {
        document.getElementById('iulia-consent-detail').hidden = false;
        return;
      }
      setChoice(choice);
      if (choice === 'allow') {
        if (loaded) window.gtag('consent', 'update', { analytics_storage: 'granted' });
        else startAnalytics();
      } else {
        revokeAnalytics();
        if (loaded) { window.location.reload(); return; }
      }
      hide();
    });
    open.addEventListener('click', show);
    if (getChoice() === 'allow') { hide(); startAnalytics(); }
    else if (getChoice() === 'deny') hide();
    else show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
