import { readFileSync } from "node:fs";
const target = process.argv[2] || "./app/index.html";
const html = readFileSync(new URL(target, import.meta.url), "utf8");
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m, i = 0, ok = 0, fail = 0;
while ((m = re.exec(html))) {
  i++;
  const code = m[1];
  if (!code.trim()) { ok++; continue; }
  try { new Function(code); ok++; }
  catch (e) {
    console.error(`script #${i}: FAIL -> ${e.message}`); fail++;
    const lm = /<anonymous>:(\d+)/.exec(e.stack || "");
    if (lm) { const ln = +lm[1]; const lines = code.split("\n"); console.error("   >> " + (lines[ln - 1] || "").trim()); }
  }
}
console.log(`${target}: ${i} inline scripts · ${ok} ok · ${fail} fail`);
process.exit(fail ? 1 : 0);
