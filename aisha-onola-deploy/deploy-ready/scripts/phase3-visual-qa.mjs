import { chromium } from "playwright-core";

const appUrl = process.argv[2] || "http://127.0.0.1:5173";
const mode = process.argv[3] || "after";
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "msedge", headless: true });

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.route("https://fonts.googleapis.com/**", (route) => route.fulfill({ status: 200, contentType: "text/css", body: "" }));
  await page.goto(`${appUrl}/`, { waitUntil: "networkidle" });
  for (const section of await page.locator("main > section").all()) await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  const metrics = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    width: document.documentElement.scrollWidth,
    viewport: window.innerHeight,
    sections: Object.fromEntries([...document.querySelectorAll("main > section")].map((section) => [section.id, Math.round(section.getBoundingClientRect().height)])),
    overflowing: [...document.querySelectorAll("body *")].filter((element) => !element.closest(".ticker,.skills-ticker,#nav-links")).map((element) => ({ element, rect: element.getBoundingClientRect() })).filter(({ rect }) => rect.right > innerWidth + .5 || rect.left < -.5).slice(0, 8).map(({ element, rect }) => ({ tag: element.tagName, className: element.className, left: Math.round(rect.left), right: Math.round(rect.right) })),
    wideContainers: [...document.querySelectorAll("body *")].filter((element) => element.scrollWidth > element.clientWidth + 1).slice(0, 8).map((element) => ({ tag: element.tagName, className: element.className, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth })),
  }));
  console.log(`${viewport.name}: ${JSON.stringify(metrics)}`);
  await page.screenshot({ path: `artifacts/screenshots/phase3-${mode}-${viewport.name}.png`, fullPage: true });
  if (mode === "after" && viewport.name === "desktop") {
    await page.locator(".book-three").hover();
    await page.locator(".bookshelf-wrap").screenshot({ path: "artifacts/screenshots/phase3-bookshelf-selected.png" });
    await page.locator(".offscript-index button").nth(2).click();
    await page.locator(".offscript-explorer").screenshot({ path: "artifacts/screenshots/phase3-offscript-selected.png" });
    await page.locator(".project-index button").nth(1).click();
    await page.locator(".project-explorer").screenshot({ path: "artifacts/screenshots/phase3-project-selected.png" });
    await page.locator(".experience-index button").nth(1).click();
    await page.locator(".experience-explorer").screenshot({ path: "artifacts/screenshots/phase3-work-selected.png" });
    await page.locator(".personal-status button").click();
    await page.locator(".personal-status").screenshot({ path: "artifacts/screenshots/phase3-personal-status.png" });
  }
  if (mode === "after" && viewport.name === "mobile") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(".nav-toggle").click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: "artifacts/screenshots/phase3-mobile-navigation.png" });
  }
  await page.close();
}

await browser.close();
