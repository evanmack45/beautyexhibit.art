// Adversarial probes. Usage: node call-check/scripts/probe.mjs <baseUrl>
import { createRequire } from "node:module";
const { chromium } = createRequire("/workspace/repos/austin-council-tracker/node_modules/")("playwright-core");
const base = process.argv[2].replace(/\/$/, "");
const b = await chromium.launch({ headless: true });
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };

const evil = {
  title: { value: '<img src=x onerror=alert(1)> EXAMPLE xss', source: "javascript:alert(2)" },
  organizer: { value: "A & B <org>", source: "https://example.com/a?q=1&r=2" },
  venue: { value: "not found", source: "" },
  entry_fee: { value: "USD 1", source: "https://example.com/fee" },
  jurors: { value: "not found", source: "https://example.com/j" },
  prize: { value: "not found", source: "https://example.com/p" },
  deadline: { value: "2027-01-01", source: "https://example.com/d" },
  past_show_evidence: { value: "not found", source: "https://example.com/past" }
};

const ctx = await b.newContext();
let dialogs = 0; ctx.on("page", p => p.on("dialog", d => { dialogs++; d.dismiss(); }));
await ctx.route("**/call-check/data/calls.json", route => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify([{ _example: true, ...evil }])
}));
const p = await ctx.newPage();
await p.goto(base + "/call-check/", { waitUntil: "networkidle" });
await p.waitForSelector(".cc-table, .is-error");
ok(dialogs === 0, "no alert dialogs from a crafted value");
ok(await p.locator("img[src=x]").count() === 0, "no injected image node");
ok(await p.getByText("<img src=x onerror=alert(1)> EXAMPLE xss", { exact: false }).count() === 1, "HTML in a value stays visible as text");
ok(await p.getByText("A & B <org>", { exact: true }).count() === 1, "ampersand and brackets in a value stay literal");
const badHref = await p.locator('a.cc-source[href^="javascript:"]').count();
ok(badHref === 0, "javascript: source is not rendered as a link");
const good = await p.locator('a.cc-source[href="https://example.com/a?q=1&r=2"]').count();
ok(good === 1, "https source with a query string stays a link");
ok(await p.locator("#cc-example-banner").count() === 1, "example banner still shown");

for (const path of ["/call-check/", "/call-check/rubric.html", "/call-check/method.html", "/call-check/reply.html"]) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + path, { waitUntil: "networkidle" });
  const over = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  ok(over[0] <= over[1] + 1, path + " no page overflow at 390px " + over);
  await page.close();
}
await ctx.close(); await b.close(); process.exit(fail ? 1 : 0);
