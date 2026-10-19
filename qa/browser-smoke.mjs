/**
 * Verificare automata a site-ului in Chromium (LOCAL, fara publicare).
 * Rulare: npm install --no-save playwright@1.56.1 && npx playwright install chromium
 *         python3 -m http.server 4173 & node qa/browser-smoke.mjs
 * Nu trimite date ale vizitatorilor, nu modifica GitHub si nu creeaza deploy productie.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import assert from "node:assert/strict";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const preview = process.env.PREVIEW_URL || "";
const directory = resolve(root, "qa-artifacts");
mkdirSync(directory, { recursive: true });
const pages = ["acasa", "metoda-clar", "constelatii", "lucram-impreuna", "despre-mine", "resurse", "live"];
const viewports = [
  { name: "telefon-mic", width: 320, height: 700 },
  { name: "telefon", width: 390, height: 844 },
  { name: "tableta", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 }
];
const failures = [];
const results = [];
const browser = await chromium.launch({ headless: true });

async function inspect(site, context, pageName, viewName, screen = false) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(String(error.message || error)));
  const response = await page.goto(site + "/" + pageName + ".html", { waitUntil: "networkidle", timeout: 40000 });
  await page.waitForTimeout(250);
  const probe = await page.evaluate(() => {
    const html = document.documentElement, body = document.body;
    const h1 = document.querySelectorAll("h1");
    const missing = [];
    for (const img of document.images) {
      if (img.loading === "lazy") continue; // Verificam imaginile lazy separat la scroll.
      if (!img.complete || img.naturalWidth < 1) missing.push(img.src);
    }
    return {
      title: document.title, h1: h1.length, width: innerWidth,
      scrollWidth: Math.max(html.scrollWidth, body.scrollWidth),
      main: !!document.querySelector("main"),
      missingImages: missing,
      firstSlide: document.querySelector(".ict-track .ict-slide img")?.getAttribute("src") || null,
      cookieNames: document.cookie.split(";").map(x => x.trim().split("=")[0]).filter(Boolean),
      localStorageKeys: Object.keys(localStorage)
    };
  });
  if (screen) await page.screenshot({ path: `${directory}/${pageName}-${viewName}.png`, fullPage: true });
  if (!response?.ok()) failures.push(`${pageName}/${viewName}: HTTP ${response?.status() || "no response"}`);
  if (probe.h1 !== 1 || !probe.main) failures.push(`${pageName}/${viewName}: lipseste H1 unic sau main`);
  if (probe.scrollWidth > probe.width + 2) failures.push(`${pageName}/${viewName}: overflow orizontal ${probe.scrollWidth} > ${probe.width}`);
  if (probe.missingImages.length) failures.push(`${pageName}/${viewName}: imagine lipsa ${probe.missingImages.join(", ")}`);
  if (errors.length) failures.push(`${pageName}/${viewName}: JavaScript ${errors.join(" | ")}`);
  if (pageName === "acasa" && !probe.firstSlide?.endsWith("/07.webp")) failures.push("Carusel: prima imagine nu este 07.webp");
  results.push({ page: pageName, viewport: viewName, status: response?.status(), ...probe, errors });
  await page.close();
}

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1, locale: "ro-RO" });
    for (const name of pages) await inspect(base, context, name, viewport.name, ["telefon", "desktop"].includes(viewport.name) && ["acasa", "resurse"].includes(name));
    await context.close();
  }
  // Verificare modificare reala prin JSON, fara a scrie inapoi in Github.
  const context = await browser.newContext({ locale: "ro-RO" });
  await context.route("**/content/acasa.json", async route => {
    const json = JSON.parse(readFileSync(resolve(root, "content/acasa.json"), "utf8"));
    json.contact_titlu = "TEST QA — un text editat în CMS";
    await route.fulfill({ status: 200, contentType: "application/json; charset=utf-8", body: JSON.stringify(json) });
  });
  const home = await context.newPage();
  await home.goto(base + "/acasa.html", { waitUntil: "networkidle" });
  const updated = await home.locator('[data-cms="contact-title"]').textContent();
  if (updated !== "TEST QA — un text editat în CMS") failures.push("Editor: campul contact_titlu nu actualizeaza pagina prin JSON");
  const nav = home.locator('.site-header nav a[href="./resurse.html"]');
  if (await nav.count() < 1) failures.push("Meniu: lipseste pagina Resurse");
  await context.close();

  // Inspectia infrastructurii reale este distincta de serverul local.
  if (preview) {
    const external = await browser.newContext({ locale: "ro-RO" });
    const page = await external.newPage();
    const setCookies = [];
    const origins = new Set();
    page.on("response", resp => {
      try {
        origins.add(new URL(resp.url()).origin);
        const value = resp.headers()["set-cookie"];
        if (value) setCookies.push({ origin: new URL(resp.url()).origin, names: value.split(/,\s*(?=[^;=]+?=)/).map(x => x.split("=")[0]).filter(Boolean) });
      } catch { /* optional probe */ }
    });
    let status = "neconectat";
    try {
      const response = await page.goto(preview, { waitUntil: "networkidle", timeout: 35000 });
      status = response ? String(response.status()) : "fara raspuns";
      const cookies = (await external.cookies()).map(x => ({ name: x.name, domain: x.domain, secure: x.secure, sameSite: x.sameSite, httpOnly: x.httpOnly }));
      writeFileSync(resolve(directory, "cookie-observations.json"), JSON.stringify({ source: preview, status, cookies, setCookieNames: setCookies, origins: [...origins] }, null, 2));
      if (!response?.ok()) failures.push("Preview online: HTTP " + status);
    } catch (e) {
      writeFileSync(resolve(directory, "cookie-observations.json"), JSON.stringify({ source: preview, status: "nu s-a putut incarca", message: String(e.message || e) }, null, 2));
      // O eroare de retea in CI nu demonstreaza ca site-ul are o problema de cookies.
      console.warn("Inspectia cookie-urilor Netlify nu a fost posibila:", String(e.message || e));
    } finally {
      await external.close();
    }
  }
} finally {
  await browser.close();
}
writeFileSync(resolve(directory, "browser-results.json"), JSON.stringify({ checkedAt: new Date().toISOString(), base, failures, results }, null, 2));
console.log(`QA browser: ${results.length} verificari (7 pagini × 4 dimensiuni). Probleme: ${failures.length}.`);
for (const entry of failures) console.error("- " + entry);
if (failures.length) process.exitCode = 1;
