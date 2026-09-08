import { writeFile } from "node:fs/promises";

const tabs = await (await fetch("http://127.0.0.1:9223/json/list")).json();
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

async function capture(name, width, height, selector) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false, screenWidth: width, screenHeight: height });
  await send("Runtime.evaluate", { expression: selector ? `document.querySelector('${selector}').scrollIntoView()` : "window.scrollTo(0, 0)" });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await writeFile(name, Buffer.from(shot.data, "base64"));
}

await send("Page.reload", { ignoreCache: true });
await new Promise((resolve) => setTimeout(resolve, 1200));
await capture("deploy-ready/assets/screenshots/aishaonola-redesign.png", 1440, 1000);
await capture("review-mobile-hero.png", 390, 844);
await capture("review-mobile-writing.png", 390, 844, "#writing");
await capture("review-mobile-built.png", 390, 844, "#built");
await capture("review-mobile-check.png", 390, 844, ".project-check");
await capture("review-mobile-writing-space.png", 390, 844, ".project-writing-space");
await capture("review-built-desktop-top.png", 1440, 900, "#built");
await capture("review-built-desktop-bottom.png", 1440, 900, ".project-writing-space");
ws.close();
