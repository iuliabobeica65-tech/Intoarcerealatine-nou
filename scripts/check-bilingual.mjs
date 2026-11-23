import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const base = resolve("dist");
const origin = "https://iuliabobeica.ro";
const pairs = [
  ["acasa", "index"],
  ["echilibrarea-radacinilor", "root-balancing"],
  ["constelatii", "systemic-constellations"],
  ["lucram-impreuna", "work-with-me"],
  ["sedinte-individuale", "individual-sessions"],
  ["program-individual-patru-luni", "four-month-programme"],
  ["program-nivelul-de-merit", "self-worth-programme"],
  ["despre-mine", "about"],
  ["legi-universale", "universal-laws"],
  ["live", "weekly-live"]
];
const errors = [];
const sitemap = readFileSync(resolve(base, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (locations.length !== new Set(locations).size) errors.push("Duplicate sitemap URLs");
if (locations.some(url => url.includes("/metoda-clar"))) errors.push("Old method URL in sitemap");
for (const [ro, en] of pairs) {
  const roPath = resolve(base, ro + ".html");
  const enPath = resolve(base, "en", en + ".html");
  if (!existsSync(roPath) || !existsSync(enPath)) {
    errors.push("Missing language pair: " + ro + " / " + en);
    continue;
  }
  const roHtml = readFileSync(roPath, "utf8");
  const enHtml = readFileSync(enPath, "utf8");
  const roUrl = origin + "/" + ro;
  const enUrl = origin + "/en/" + (en === "index" ? "" : en);
  if (!locations.includes(roUrl) || !locations.includes(enUrl)) errors.push("Sitemap missing: " + ro + " / " + en);
  for (const [label, html] of [["RO", roHtml], ["EN", enHtml]]) {
    if (!html.includes('hreflang="ro"') || !html.includes('hreflang="en"')) errors.push("Missing hreflang: " + label + " " + ro);
    if (!html.includes(roUrl) || !html.includes(enUrl)) errors.push("Incorrect bilingual URLs: " + label + " " + ro);
    if (!html.includes("/assets/analytics-consent.js")) errors.push("Missing consent script: " + label + " " + ro);
  }
  if (!/<html[^>]+lang="en"/i.test(enHtml)) errors.push("Missing English HTML lang: " + en);
  if (!enHtml.includes("application/ld+json")) errors.push("Missing English GEO structured data: " + en);
  if (enHtml.includes("Balancing the Roots")) errors.push("Unapproved English method name: " + en);
}
const bookingUrl = "https://calendar.app.google/USL6MFdEhyjbdNgH8";
for (const page of ["sedinte-individuale", "en/individual-sessions"]) {
  const html = readFileSync(resolve(base, page + ".html"), "utf8");
  if (!html.includes(bookingUrl)) errors.push("Missing real Google booking URL: " + page);
  if (!html.includes("/assets/google-calendar-links.js")) errors.push("Missing Google Calendar JS: " + page);
}
for (const page of ["live", "en/weekly-live"]) {
  const html = readFileSync(resolve(base, page + ".html"), "utf8");
  if (!html.includes("data-google-calendar-live")) errors.push("Missing LIVE calendar button: " + page);
  if (!html.includes("/assets/google-calendar-links.js")) errors.push("Missing LIVE calendar JS: " + page);
}
for (const asset of ["assets/google-calendar-links.js", "assets/root-balancing-lotus.svg"]) {
  if (!existsSync(resolve(base, asset))) errors.push("Missing build asset: " + asset);
}
if (errors.length) {
  console.error("Bilingual checks failed:\n" + errors.map(e => "- " + e).join("\n"));
  process.exit(1);
}
console.log("Bilingual checks passed: " + pairs.length + " language pairs; " + locations.length + " sitemap URLs.");
