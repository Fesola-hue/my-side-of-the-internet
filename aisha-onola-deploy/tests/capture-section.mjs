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

await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false, screenWidth: 1440, screenHeight: 900 });
await send("Page.reload", { ignoreCache: true });
await new Promise((resolve) => setTimeout(resolve, 900));
const rectResult = await send("Runtime.evaluate", {
  expression: `(() => { const r = document.querySelector('#built').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`,
  returnByValue: true
});
const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, clip: { ...rectResult.result.value, scale: 1 } });
await writeFile("review-built-desktop-full.png", Buffer.from(shot.data, "base64"));
ws.close();
