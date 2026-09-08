import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("deploy-ready");
const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".pdf", "application/pdf"],
]);

http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const target = path.resolve(root, `.${pathname}`);
  if (!target.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(target);
    response.setHeader("Content-Type", types.get(path.extname(target)) ?? "application/octet-stream");
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4189, "127.0.0.1", () => console.log("serving 4189"));
