import { chromium } from "playwright-core";

const appUrl = process.argv[2] || process.env.APP_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "msedge", headless: true });
const results = { viewports: [], interactions: {}, assets: {}, metadata: {}, directRoute: {} };
const errors = [];
const stubExternalFonts = (page) => page.route("https://fonts.googleapis.com/**", (route) => route.fulfill({ status: 200, contentType: "text/css", body: "" }));

const expectedMetadata = {
  title: "Aisha Onola | Founder, writer & builder",
  description: "Aisha Onola is a founder, writer and product-minded operator building media, ideas and useful things on the internet. Read her essays and reported stories at read.aishaonola.me.",
  canonical: "https://aishaonola.me/",
  ogTitle: "Aisha Onola | Founder, writer & builder",
  ogDescription: "I think, write, build and ship things — from independent media to small internet products.",
  ogImage: "https://aishaonola.me/og-image.png",
  twitterCard: "summary_large_image",
};

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 820, height: 1180 },
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
  await stubExternalFonts(page);
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(appUrl, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    sections: document.querySelectorAll("main > section").length,
    heroLoaded: document.querySelector(".hero-image")?.complete && document.querySelector(".hero-image")?.naturalWidth > 0,
  }));
  const record = { ...viewport, ...metrics, overflow: metrics.scrollWidth > metrics.clientWidth, consoleErrors };
  results.viewports.push(record);
  if (record.overflow || !record.heroLoaded || record.sections !== 6 || consoleErrors.length) errors.push(`Viewport ${viewport.name} failed: ${JSON.stringify(record)}`);
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await stubExternalFonts(page);
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.locator(".book-one").hover();
  const mouseTitle = await page.locator("#book-title-1").evaluate((element) => element.classList.contains("is-active"));
  const mouseTarget = await page.locator(".book-one").getAttribute("target");
  results.interactions.mouseBookshelf = { mouseTitle, mouseTarget };
  if (!mouseTitle || mouseTarget !== "_blank") errors.push("Desktop bookshelf hover/link behavior failed");
  await page.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  await context.route("https://read.aishaonola.me/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Writing</title>" }));
  const page = await context.newPage();
  await stubExternalFonts(page);
  await page.goto(appUrl, { waitUntil: "networkidle" });
  const countBefore = context.pages().length;
  await page.locator(".book-one").tap();
  const firstTapSelected = await page.locator(".book-one").evaluate((element) => element.classList.contains("is-active"));
  const firstTapDidNotOpen = context.pages().length === countBefore;
  const secondPopupPromise = context.waitForEvent("page");
  await page.locator(".book-one").tap();
  const secondPopup = await secondPopupPromise;
  await secondPopup.waitForLoadState("domcontentloaded");
  const secondTapUrl = secondPopup.url();
  await secondPopup.close();
  await page.locator(".book-two").tap();
  const anotherSelected = await page.locator(".book-two").evaluate((element) => element.classList.contains("is-active"));
  const previousDeselected = await page.locator(".book-one").evaluate((element) => !element.classList.contains("is-active"));
  results.interactions.touchBookshelf = { firstTapSelected, firstTapDidNotOpen, secondTapUrl, anotherSelected, previousDeselected };
  if (!firstTapSelected || !firstTapDidNotOpen || !secondTapUrl.includes("people-who-made-my-world") || !anotherSelected || !previousDeselected) errors.push("Touch bookshelf first-tap/second-tap behavior failed");
  await page.locator(".nav-toggle").tap();
  const navOpen = await page.locator("#nav-links").evaluate((element) => element.classList.contains("is-open"));
  await page.locator("#nav-links a[href='#about']").tap();
  const navClosed = await page.locator("#nav-links").evaluate((element) => !element.classList.contains("is-open"));
  results.interactions.mobileNavigation = { navOpen, navClosed };
  if (!navOpen || !navClosed) errors.push("Mobile navigation behavior failed");
  await context.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" });
  await stubExternalFonts(page);
  await page.goto(appUrl, { waitUntil: "networkidle" });
  const trigger = page.locator(".hero-contact-trigger");
  await trigger.click();
  const contactOpen = await page.locator("#contact-room").evaluate((element) => element.classList.contains("is-open"));
  await page.waitForFunction(() => document.activeElement?.classList.contains("contact-close"));
  const closeFocused = await page.locator(".contact-close").evaluate((element) => element === document.activeElement);
  const pageInert = await page.locator("#root > div").getAttribute("inert") !== null;
  await page.keyboard.press("Escape");
  await page.locator("#contact-room").waitFor({ state: "detached", timeout: 1000 });
  const contactClosed = await page.locator("#contact-room").count() === 0;
  const focusReturned = await trigger.evaluate((element) => element === document.activeElement);
  results.interactions.contact = { contactOpen, closeFocused, pageInert, contactClosed, focusReturned };
  if (!contactOpen || !closeFocused || !pageInert || !contactClosed || !focusReturned) errors.push("Contact open/focus/Escape behavior failed");

  results.metadata = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute("content"),
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
  }));
  if (JSON.stringify(results.metadata) !== JSON.stringify(expectedMetadata)) errors.push(`Metadata mismatch: ${JSON.stringify(results.metadata)}`);

  const assetPaths = ["/aisha-onola.jpg", "/aisha-onola.jpeg", "/Aisha-Onola-CV.pdf", "/og-image.png", "/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/robots.txt", "/sitemap.xml", "/assets/screenshots/stillcam-desktop.png", "/assets/screenshots/check-desktop.png", "/assets/screenshots/writing-desktop.png"];
  for (const path of assetPaths) {
    const response = await page.request.get(`${appUrl}${path}`);
    results.assets[path] = response.status();
    if (!response.ok()) errors.push(`Asset failed: ${path} (${response.status()})`);
  }
  await page.close();
}

{
  const response = await fetch(`${appUrl}/speaking`, { headers: { "Sec-Fetch-Mode": "navigate" } });
  const html = await response.text();
  results.directRoute = { status: response.status, appShell: html.includes('id="root"') };
  if (!response.ok || !results.directRoute.appShell) errors.push("Direct-route SPA fallback failed");
}

await browser.close();
console.log(JSON.stringify({ ok: errors.length === 0, errors, results }, null, 2));
if (errors.length) process.exitCode = 1;
