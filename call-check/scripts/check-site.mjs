// Static rules for Call Check and the Winter Light freeze. Run from repo root:
//   node call-check/scripts/check-site.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const repo = new URL("../../", import.meta.url).pathname;
const cc = join(repo, "call-check");
const S = createRequire(import.meta.url)("../js/schema.js");
const walk = d => readdirSync(d).flatMap(f => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(cc).filter(f => !f.includes("/test/") && !f.includes("/scripts/"));
const textFiles = files.filter(f => /\.(html|js|css|json)$/.test(f));
const html = textFiles.filter(f => f.endsWith(".html"));
const js = textFiles.filter(f => f.endsWith(".js"));
const read = f => readFileSync(f, "utf8");
const fails = [];
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails.push(m); };

const FROZEN = {
  "index.html": "43b317a4255283b60a731a449e320efd04e5a9d22672ad9dd13e48836cb784c6",
  "rules.html": "d454df30a2d24d3dcd486447e86bfaa04380446a7851b5b2e19dbf3ea99cfa61",
  "faq.html": "e68722e524aee3c307b886a8fd277af7319822ca266bcb5fe8b4b91dba98327c",
  "submit-w9q4/index.html": "c621c5a8b183c472d1ab8925d52279e446f3bb39dcf114e187e3eaf0bc2ba108",
  "js/config.js": "6cb2084042775ad0e6e9cdce2c7d5a1f8f2eead874a97fa7556703d461ed4f37",
  "js/app.js": "6543e5bf7b7deb2c884b55b9400416aa9799aeb819f63bf5326d9d6b701eaf44",
  "css/site.css": "c155a51ce7fb741cf7ee1b1b18eb1c0a65d21a41869788956233e1b5ba33f0b6",
  "img/winter-light.svg": "28e3372534a45a78211b0faadce485dc918e46e3cc26fb5a32ca42c374acea3a",
  "CNAME": "c1d520f856aea274b6a5151fb687f197f228f2a7be94d04ddaeab9849de111fb",
  "robots.txt": "daafec71c71549c10c065c0819acd54803c463fbb6966ff0e4cde1302a6207b6",
  "favicon.svg": "52babdab8b4fe3bc6723914c8e529648dab63eed26b2d91d74b4a29b4926203d",
  "404.html": "e49c1f121420d35b07b757a1c7f2707ad4f1514d8c52483efe52f4804807bb91"
};
for (const [f, want] of Object.entries(FROZEN)) {
  const got = createHash("sha256").update(readFileSync(join(repo, f))).digest("hex");
  ok(got === want, "Winter Light file unchanged: " + f);
}

const ADDR = "winterlight@agentmail.to";
const mailtos = html.flatMap(f => [...read(f).matchAll(/mailto:([^"?]*)/g)].map(m => [relative(cc, f), decodeURIComponent(m[1])]));
ok(mailtos.length >= 1 && mailtos.every(([, a]) => a === ADDR), `every addressed mailto goes to ${ADDR} (${mailtos.length} found)`);
ok(html.some(f => /data-callcheck-mailto/.test(read(f))), "table page has a send-a-call mailto");
ok(html.some(f => /data-callcheck-reply/.test(read(f))), "reply page has a right-of-reply mailto");
ok(html.every(f => !/<form[\s>]/i.test(read(f))), "no <form> on Call Check pages");
ok(js.every(f => !/\bXMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie|WebSocket/.test(read(f))), "no XHR/beacon/storage/cookie/websocket in Call Check JS");
ok(!js.some(f => /fetch\s*\(\s*['"]https?:/.test(read(f))), "no fetch to an absolute http(s) URL (same-origin data file only)");
const third = html.flatMap(f => [...read(f).matchAll(/<(script|img|iframe)[^>]+(src|href)="(https?:)?\/\/[^"]+"/g)]);
const thirdCss = html.flatMap(f => [...read(f).matchAll(/<link[^>]+rel="stylesheet"[^>]+href="(https?:)?\/\/[^"]+"/g)]);
ok(third.length + thirdCss.length === 0, "no third-party script, iframe, image or stylesheet");

const chrome = [...html, ...js].map(read).join("\n").toLowerCase();
for (const w of ["stripe", "buy.stripe", "checkout", "buy now", "add to cart", "paypal", "pay now", "pay button"]) {
  ok(!chrome.includes(w), `no "${w}" in Call Check html/js`);
}
// Verdict labels in our chrome, not in a discussion of what we refuse to do, are banned.
// The allowed phrase is a clear refusal ("we do not" / "no ratings and no verdicts").
function bannedVerdict(label) {
  const re = new RegExp("\\b" + label + "\\b", "gi");
  const hits = [];
  for (const f of html) {
    const plain = read(f).replace(/<[^>]+>/g, " ");
    let m; const r = new RegExp(".{0,40}\\b" + label + "\\b.{0,40}", "gi");
    while ((m = r.exec(plain))) {
      const snippet = m[0].toLowerCase();
      const allowed = /do not|does not|no ratings and no verdicts|not a rating|not publish ratings or verdicts/.test(snippet);
      if (!allowed) hits.push(relative(cc, f) + ": " + m[0].replace(/\s+/g, " "));
    }
  }
  return hits;
}
for (const w of ["scam", "red flag", "mismatch", "safe", "grade", "grades"]) {
  const hits = bannedVerdict(w.replace(" ", "\\s+"));
  ok(hits.length === 0, `no verdict label "${w}" in chrome` + (hits.length ? " :: " + hits.join(" | ") : ""));
}

ok(html.every(f => /This domain is for sale/.test(read(f))), "every Call Check page has the for-sale footer");
ok(html.every(f => /afternic\.com\/domain\/beautyexhibit\.art/.test(read(f))), "for-sale link points at the Afternic listing");
ok(html.every(f => /Winter Light/.test(read(f)) && /href="\.\.\/"/.test(read(f))), "every Call Check page links back to Winter Light");
ok(!textFiles.some(f => /[—–]/.test(read(f))), "no em or en dashes in Call Check files");
ok(!html.some(f => /\b(delve|crucial|pivotal|showcase|testament|vibrant|foster|landscape|leverage|utilize|seamless|robust|empower)\b/i.test(read(f).replace(/<[^>]+>/g, " "))), "no banned AI vocabulary");

const scoutBytes = readFileSync("/workspace/scout/callcheck-20.json");
const liveBytes = readFileSync(join(cc, "data/calls.json"));
ok(Buffer.compare(scoutBytes, liveBytes) === 0, "live data/calls.json is byte-identical to /workspace/scout/callcheck-20.json");
const data = S.parseJsonText(liveBytes.toString("utf8"));
ok(data.ok && data.records.length === 20 && data.skipped === 0 && data.records.every(r => !r.example), "live table data is 20 sourced rows, no example flags");
ok(data.records[0].fields.title.value === "47th Annual Open Juried Show", "first live row is the Ridgewood call");
const fixture = S.parseJsonText(read(join(cc, "test/fixtures/placeholder.json")));
ok(fixture.ok && fixture.records.length === 2 && fixture.records.every(r => r.example), "placeholder fixture still parses as two example rows");

console.log(fails.length ? `\n${fails.length} FAILED` : "\nall checks passed");
process.exit(fails.length ? 1 : 0);
