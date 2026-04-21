import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const e2eRoot = path.join(__dirname, "..");
const d = new Date();
const pad = (n) => String(n).padStart(2, "0");
const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
const outDir = path.join(e2eRoot, "informes-archivados", stamp);

const sources = ["playwright-report", "test-results"];

let copied = 0;
fs.mkdirSync(outDir, { recursive: true });

for (const dir of sources) {
  const src = path.join(e2eRoot, dir);
  if (!fs.existsSync(src)) {
    console.warn(`[archive-report] No existe ${dir}. Ejecuta antes: npm test`);
    continue;
  }
  fs.cpSync(src, path.join(outDir, dir), { recursive: true });
  copied++;
}

if (copied === 0) {
  process.exitCode = 1;
  console.error("[archive-report] No se copio nada. Corre los tests y reintenta.");
} else {
  console.log(`[archive-report] Copia guardada en:\n${outDir}`);
  const indexHtml = path.join(outDir, "playwright-report", "index.html");
  console.log("[archive-report] Abrir informe HTML en el navegador (Linux):");
  console.log(`  xdg-open "${indexHtml}"`);
}
