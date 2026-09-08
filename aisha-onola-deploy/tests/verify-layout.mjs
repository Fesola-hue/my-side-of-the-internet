const port = process.env.CDP_PORT || "9223";
const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const tab = tabs.find((item) => item.type === "page" && item.url.includes("4189"));
if (!tab) throw new Error("Local review tab not found");

const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
let commandId = 0;
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++commandId;
    const receive = (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      ws.removeEventListener("message", receive);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
    ws.addEventListener("message", receive);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send("Page.reload", { ignoreCache: true });
await new Promise((resolve) => setTimeout(resolve, 1200));

const expression = `({
  viewport: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  bodyWidth: document.body.scrollWidth,
  aboutRect: (() => { const r = document.querySelector('#about').getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) }; })(),
  wrapRect: (() => { const e = document.querySelector('#about .wrap'); const r = e.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), cssWidth: getComputedStyle(e).width, cssMaxWidth: getComputedStyle(e).maxWidth }; })(),
  aboutGrid: (() => { const e = document.querySelector('.about-grid'); const r = e.getBoundingClientRect(); return { width: Math.round(r.width), columns: getComputedStyle(e).gridTemplateColumns, display: getComputedStyle(e).display, childWidth: getComputedStyle(e.firstElementChild).width, childMaxWidth: getComputedStyle(e.firstElementChild).maxWidth }; })(),
  overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
  sections: [...document.querySelectorAll('main > section')].map((section) => section.id),
  books: [...document.querySelectorAll('.book')].map((book) => ({
    width: Math.round(book.getBoundingClientRect().width),
    height: Math.round(book.getBoundingClientRect().height)
  })),
  hero: (() => {
    const image = document.querySelector('.hero-image');
    const ticker = document.querySelector('.ticker');
    return {
      imageFit: getComputedStyle(image).objectFit,
      imagePosition: getComputedStyle(image).objectPosition,
      imageFilter: getComputedStyle(image).filter,
      tickerHeight: Math.round(ticker.getBoundingClientRect().height)
    };
  })(),
  built: (() => {
    const section = document.querySelector('#built');
    return {
      height: Math.round(section.getBoundingClientRect().height),
      projectCount: section.querySelectorAll('.project').length,
      frameCount: section.querySelectorAll('.project-media').length,
      frames: [...section.querySelectorAll('.project-media')].map((frame) => {
        const rect = frame.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      })
    };
  })(),
  missingImages: [...document.images].filter((image) => !image.complete || !image.naturalWidth).map((image) => image.src),
  overflowElements: [...document.querySelectorAll('body *')].filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.right > innerWidth + 1 || rect.left < -1;
  }).slice(0, 12).map((element) => ({
    tag: element.tagName.toLowerCase(),
    className: typeof element.className === 'string' ? element.className : '',
    left: Math.round(element.getBoundingClientRect().left),
    right: Math.round(element.getBoundingClientRect().right)
  })),
  h1: document.querySelector('h1').textContent.trim(),
  headings: [...document.querySelectorAll('main h2')].map((heading) => heading.textContent.trim())
})`;

let failed = false;
for (const width of [360, 390, 430, 768, 1440]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: width < 600 ? 844 : 900,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: width < 600 ? 844 : 900
  });
  await send("Runtime.evaluate", {
    expression: "document.querySelectorAll('img').forEach((image) => image.loading = 'eager'); document.querySelector('#built').scrollIntoView(); new Promise((resolve) => setTimeout(resolve, 1200))",
    awaitPromise: true
  });
  const result = await send("Runtime.evaluate", { expression, returnByValue: true });
  const value = result.result.value;
  const mobile = width < 600;
  const framesFit = value.built.frames.every((frame) => frame.width <= width);
  const ok = value.overflow <= 0 && value.missingImages.length === 0 && value.sections.length === 6 && value.books.length === 4
    && value.hero.imageFilter === 'none' && value.hero.tickerHeight <= 32
    && value.built.projectCount === 4 && value.built.frameCount === 4 && framesFit
    && (!mobile || value.built.frames.every((frame) => frame.height < 500));
  failed ||= !ok;
  console.log(`${ok ? "PASS" : "FAIL"} ${width}px`, JSON.stringify(value));
}

ws.close();
if (failed) process.exitCode = 1;
