import { chromium } from "playwright-core";

const appUrl = process.argv[2] || process.env.APP_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "msedge", headless: true });
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 820, height: 1180 },
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
];
const results = { home: { viewports: {}, interactions: {} }, speaking: { viewports: {}, interactions: {}, metadata: {} }, routing: {}, assets: {} };
const errors = [];
const stubExternalFonts = (page) => page.route("https://fonts.googleapis.com/**", (route) => route.fulfill({ status: 200, contentType: "text/css", body: "" }));
const observeErrors = (page, messages) => {
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) messages.push(message.text());
  });
  page.on("pageerror", (error) => messages.push(error.message));
};

const homeMetadata = {
  title: "Aisha Onola | Founder, writer & builder",
  description: "Aisha Onola is a founder, writer and product-minded operator building media, ideas and useful things on the internet. Read her essays and reported stories at read.aishaonola.me.",
  canonical: "https://aishaonola.me/",
  ogTitle: "Aisha Onola | Founder, writer & builder",
  ogDescription: "I think, write, build and ship things — from independent media to small internet products.",
  ogImage: "https://aishaonola.me/og-image.png",
  twitterCard: "summary_large_image",
};
const speakingMetadata = {
  title: "Speaking | Aisha Onola",
  description: "Aisha Onola speaks about nonlinear careers, building on the internet, young people and technology, writing, media and AI for builders.",
  canonical: "https://aishaonola.me/speaking",
  ogTitle: "Speaking | Aisha Onola",
  ogDescription: "Aisha Onola speaks about nonlinear careers, building on the internet, young people and technology, writing, media and AI for builders.",
  ogImage: "https://aishaonola.me/og-image.png",
  ogUrl: "https://aishaonola.me/speaking",
  twitterCard: "summary_large_image",
  twitterTitle: "Speaking | Aisha Onola",
  twitterDescription: "Aisha Onola speaks about nonlinear careers, building on the internet, young people and technology, writing, media and AI for builders.",
  twitterImage: "https://aishaonola.me/og-image.png",
};
const readMetadata = () => ({
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
  canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
  ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
  ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute("content"),
  ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
  ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
  twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
  twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute("content"),
  twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute("content"),
  twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute("content"),
});

for (const route of ["/", "/speaking"]) {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
    await stubExternalFonts(page);
    const consoleErrors = [];
    observeErrors(page, consoleErrors);
    await page.goto(`${appUrl}${route}`, { waitUntil: "networkidle" });
    const metrics = await page.evaluate((isHome) => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      heroLoaded: isHome ? Boolean(document.querySelector(".hero-image")?.complete && document.querySelector(".hero-image")?.naturalWidth > 0) : true,
      homeSections: document.querySelectorAll("main > section").length,
      appearances: document.querySelectorAll(".appearance-option").length,
      topics: document.querySelectorAll(".topic-index button").length,
    }), route === "/");
    const record = { ...metrics, overflow: metrics.scrollWidth > metrics.clientWidth, consoleErrors };
    const target = route === "/" ? results.home.viewports : results.speaking.viewports;
    target[viewport.name] = record;
    const structuralFailure = route === "/" ? !metrics.heroLoaded || metrics.homeSections !== 6 : metrics.appearances !== 2 || metrics.topics !== 5;
    if (record.overflow || structuralFailure || consoleErrors.length) errors.push(`${route} ${viewport.name} failed: ${JSON.stringify(record)}`);
    await page.close();
  }
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await stubExternalFonts(page);
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.locator(".book-one").hover();
  const mouseTitle = await page.locator("#book-title-1").evaluate((element) => element.classList.contains("is-active"));
  const mouseTarget = await page.locator(".book-one").getAttribute("target");
  const speakingNav = await page.getByRole("link", { name: "Speaking", exact: true }).getAttribute("href");
  const speakingPathway = await page.locator(".home-speaking-link").getAttribute("href");
  results.home.interactions.mouseBookshelf = { mouseTitle, mouseTarget };
  results.home.interactions.speakingLinks = { speakingNav, speakingPathway };
  if (!mouseTitle || mouseTarget !== "_blank") errors.push("Desktop bookshelf hover/link behavior failed");
  if (speakingNav !== "/speaking" || speakingPathway !== "/speaking") errors.push("Homepage Speaking navigation links failed");

  const trigger = page.locator(".hero-contact-trigger");
  await trigger.click();
  await page.waitForFunction(() => document.activeElement?.classList.contains("contact-close"));
  const homepageReason = await page.locator("#contact-reason").inputValue();
  const pageInert = await page.locator("[inert]").count() === 1;
  await page.keyboard.press("Escape");
  await page.locator("#contact-room").waitFor({ state: "detached", timeout: 1000 });
  const focusReturned = await trigger.evaluate((element) => element === document.activeElement);
  results.home.interactions.contact = { homepageReason, pageInert, focusReturned };
  if (homepageReason !== "" || !pageInert || !focusReturned) errors.push("Homepage contact behavior changed");

  const metadata = await page.evaluate(readMetadata);
  const comparable = Object.fromEntries(Object.keys(homeMetadata).map((key) => [key, metadata[key]]));
  if (JSON.stringify(comparable) !== JSON.stringify(homeMetadata)) errors.push(`Homepage metadata changed: ${JSON.stringify(metadata)}`);
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
  const popupPromise = context.waitForEvent("page");
  await page.locator(".book-one").tap();
  const popup = await popupPromise;
  const secondTapUrl = popup.url();
  await popup.close();
  await page.locator(".book-two").tap();
  const anotherSelected = await page.locator(".book-two").evaluate((element) => element.classList.contains("is-active"));
  results.home.interactions.touchBookshelf = { firstTapSelected, firstTapDidNotOpen, secondTapUrl, anotherSelected };
  if (!firstTapSelected || !firstTapDidNotOpen || !secondTapUrl.includes("people-who-made-my-world") || !anotherSelected) errors.push("Touch bookshelf behavior failed");
  await page.locator(".nav-toggle").tap();
  const navOpen = await page.locator("#nav-links").evaluate((element) => element.classList.contains("is-open"));
  await page.getByRole("link", { name: "Speaking", exact: true }).tap();
  await page.waitForURL("**/speaking");
  const navReachedSpeaking = page.url().endsWith("/speaking");
  results.home.interactions.mobileNavigation = { navOpen, navReachedSpeaking };
  if (!navOpen || !navReachedSpeaking) errors.push("Mobile navigation to Speaking failed");
  await context.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await stubExternalFonts(page);
  await page.goto(`${appUrl}/speaking`, { waitUntil: "networkidle" });
  await page.locator(".appearance-option").nth(1).click();
  const galaxySelected = await page.locator(".appearance-option").nth(1).getAttribute("aria-pressed") === "true";
  const galaxyHeading = await page.locator("#selected-appearance h3").textContent();
  const galaxyProgramme = await page.locator("#selected-appearance .appearance-programme").textContent();
  const inventedTitleAbsent = await page.locator("#selected-appearance .appearance-title").count() === 0;
  await page.locator(".appearance-option").first().focus();
  await page.keyboard.press("Enter");
  const keyboardSelected = await page.locator(".appearance-option").first().getAttribute("aria-pressed") === "true";
  results.speaking.interactions.appearancesDesktop = { galaxySelected, galaxyHeading, galaxyProgramme, inventedTitleAbsent, keyboardSelected };
  if (!galaxySelected || galaxyHeading?.trim() !== "Galaxy Television" || galaxyProgramme?.trim() !== "Women’s Corner" || !inventedTitleAbsent || !keyboardSelected) errors.push("Desktop/keyboard appearance selector failed");

  await page.locator(".topic-index button").nth(4).click();
  const topicSelected = await page.locator(".topic-index button").nth(4).getAttribute("aria-pressed") === "true";
  const topicHeading = await page.locator("#selected-topic h3").textContent();
  results.speaking.interactions.topics = { topicSelected, topicHeading };
  if (!topicSelected || topicHeading?.trim() !== "AI as a tool for builders") errors.push("Speaking topic selector failed");

  const cta = page.getByRole("button", { name: "Invite me to speak" });
  await cta.click();
  await page.waitForFunction(() => document.activeElement?.classList.contains("contact-close"));
  const speakingReason = await page.locator("#contact-reason").inputValue();
  await page.keyboard.press("Escape");
  await page.locator("#contact-room").waitFor({ state: "detached", timeout: 1000 });
  results.speaking.interactions.contact = { speakingReason };
  if (speakingReason !== "Speaking / media") errors.push("Speaking contact context was not preselected");

  results.speaking.metadata = await page.evaluate(readMetadata);
  if (JSON.stringify(results.speaking.metadata) !== JSON.stringify(speakingMetadata)) errors.push(`Speaking metadata mismatch: ${JSON.stringify(results.speaking.metadata)}`);
  const reducedMotion = await page.evaluate(() => ({
    route: getComputedStyle(document.querySelector(".route-view")).animationName,
    appearance: getComputedStyle(document.querySelector(".appearance-sheet")).animationName,
    word: document.querySelector(".speaking-word")?.textContent,
  }));
  await page.waitForTimeout(2100);
  reducedMotion.wordAfterWait = await page.locator(".speaking-word").textContent();
  results.speaking.interactions.reducedMotion = reducedMotion;
  if (reducedMotion.route !== "none" || reducedMotion.appearance !== "none" || reducedMotion.word !== reducedMotion.wordAfterWait) errors.push("Reduced-motion behavior failed");
  await page.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await stubExternalFonts(page);
  await page.goto(`${appUrl}/speaking`, { waitUntil: "networkidle" });
  await page.locator(".appearance-option").nth(1).tap();
  const touchAppearance = await page.locator(".appearance-option").nth(1).getAttribute("aria-pressed") === "true";
  await page.locator(".topic-index button").nth(2).tap();
  const touchTopic = await page.locator(".topic-index button").nth(2).getAttribute("aria-pressed") === "true";
  results.speaking.interactions.touch = { touchAppearance, touchTopic };
  if (!touchAppearance || !touchTopic) errors.push("Speaking touch interactions failed");
  await context.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" });
  await stubExternalFonts(page);
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Speaking", exact: true }).click();
  await page.waitForURL("**/speaking");
  await page.waitForFunction(() => document.activeElement?.id === "speaking-main");
  const forwardUrl = page.url();
  const forwardTitle = await page.title();
  await page.goBack();
  await page.waitForURL(appUrl + "/");
  await page.waitForFunction((title) => document.title === title, homeMetadata.title);
  const backUrl = page.url();
  const restoredMetadata = await page.evaluate(readMetadata);
  await page.goForward();
  await page.waitForURL("**/speaking");
  const historyForwardUrl = page.url();
  results.routing = { forwardUrl, forwardTitle, backUrl, historyForwardUrl, restoredHomeTitle: restoredMetadata.title };
  if (!forwardUrl.endsWith("/speaking") || forwardTitle !== speakingMetadata.title || backUrl !== `${appUrl}/` || historyForwardUrl !== forwardUrl || restoredMetadata.title !== homeMetadata.title) errors.push("Client routing/back-forward behavior failed");
  await page.close();
}

{
  const assetPaths = ["/aisha-onola.jpg", "/aisha-onola.jpeg", "/Aisha-Onola-CV.pdf", "/og-image.png", "/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/robots.txt", "/sitemap.xml", "/assets/screenshots/stillcam-desktop.png", "/assets/screenshots/check-desktop.png", "/assets/screenshots/writing-desktop.png"];
  const context = await browser.newContext();
  for (const path of assetPaths) {
    const response = await context.request.get(`${appUrl}${path}`);
    results.assets[path] = response.status();
    if (!response.ok()) errors.push(`Asset failed: ${path} (${response.status()})`);
  }
  const sitemap = await (await context.request.get(`${appUrl}/sitemap.xml`)).text();
  results.assets.speakingInSitemap = sitemap.includes("https://aishaonola.me/speaking");
  if (!results.assets.speakingInSitemap) errors.push("Speaking route missing from sitemap");
  await context.close();
}

{
  const response = await fetch(`${appUrl}/speaking`, { headers: { "Sec-Fetch-Mode": "navigate" } });
  const html = await response.text();
  results.routing.directRoute = {
    status: response.status,
    appShell: html.includes('id="root"'),
    staticTitle: html.includes("<title>Speaking | Aisha Onola</title>"),
    staticCanonical: html.includes('<link rel="canonical" href="https://aishaonola.me/speaking"'),
    staticSocialMetadata: html.includes('property="og:url" content="https://aishaonola.me/speaking"') && html.includes('name="twitter:title" content="Speaking | Aisha Onola"'),
  };
  if (!response.ok || !results.routing.directRoute.appShell) errors.push("Direct /speaking app entry failed");
  if (!results.routing.directRoute.staticTitle || !results.routing.directRoute.staticCanonical || !results.routing.directRoute.staticSocialMetadata) errors.push("Direct /speaking static metadata failed");
}

await browser.close();
console.log(JSON.stringify({ ok: errors.length === 0, errors, results }, null, 2));
if (errors.length) process.exitCode = 1;
