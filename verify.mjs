import { readFileSync } from "node:fs";
const html = readFileSync(new URL("./app/index.html", import.meta.url), "utf8");
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m, i = 0, ok = 0, fail = 0;
while ((m = re.exec(html))) {
  i++;
  const code = m[1];
  try { new Function(code); console.log(`script #${i}: OK (${code.length} chars)`); ok++; }
  catch (e) { console.error(`script #${i}: FAIL -> ${e.message}`); fail++;
    // show context line
    const lm = /<anonymous>:(\d+)/.exec(e.stack||"");
    if (lm) { const ln = +lm[1]; const lines = code.split("\n"); console.error("   >> "+ (lines[ln-1]||"").trim()); }
  }
}
console.log(`\n${i} inline scripts · ${ok} ok · ${fail} fail`);
process.exit(fail ? 1 : 0);
