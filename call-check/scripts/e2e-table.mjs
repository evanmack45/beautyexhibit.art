// Browser tests of the Call Check table. Usage: node call-check/scripts/e2e-table.mjs <baseUrl>
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const { chromium } = createRequire("/workspace/repos/austin-council-tracker/node_modules/")("playwright-core");
const base = process.argv[2].replace(/\/$/, "");
const b = await chromium.launch({ headless: true });
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };

async function open(path, hook) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  if (hook) await hook(ctx);
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", e => errs.push(String(e)));
  const res = await p.goto(base + path, { waitUntil: "networkidle" });
  return { ctx, p, res, errs };
}

{
  const { ctx, p, res, errs } = await open("/call-check/");
  ok(res.ok(), "GET /call-check/ " + res.status());
  await p.waitForSelector(".cc-table, .cc-empty, .is-error");
  ok(await p.locator("#cc-example-banner").count() === 0, "live data: no example banner");
  ok((await p.locator(".cc-badge").count()) === 0, "live data: no Example badges");
  ok(await p.getByText("47th Annual Open Juried Show", { exact: false }).count() > 0, "first live row is the Ridgewood call");
  ok((await p.locator(".cc-table tbody tr").count()) === 20, "live data: 20 rows");
  ok(/20 calls listed/.test(await p.textContent("#cc-status")), "status says 20 calls listed");
  ok(await p.locator("td .cc-not-found").count() >= 1, "at least one not-found cell");
  ok(await p.locator('a.cc-source[href^="https://www.ridgewoodartinstitute.org/"]').count() >= 1, "source links include the Ridgewood pages");
  const href = await p.getAttribute("[data-callcheck-mailto]", "href");
  ok(href && href.startsWith("mailto:winterlight@agentmail.to?") && decodeURIComponent(href).includes("Call Check: please review this call"), "send-a-call mailto is correct");
  ok(errs.length === 0, "no page errors " + JSON.stringify(errs));
  await p.setViewportSize({ width: 390, height: 844 });
  const over = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  ok(over, "no page-level horizontal scroll at 390px (table may scroll inside its wrap)");
  await ctx.close();
}

{
  const fixture = readFileSync(new URL("../test/fixtures/placeholder.json", import.meta.url));
  const { ctx, p } = await open("/call-check/", async ctx => {
    await ctx.route("**/call-check/data/calls.json", route => route.fulfill({ status: 200, contentType: "application/json", body: fixture }));
  });
  await p.waitForSelector(".cc-table");
  ok(await p.locator("#cc-example-banner").count() === 1, "fixture: example banner is shown");
  ok((await p.locator(".cc-badge").count()) === 2, "fixture: two Example badges");
  ok(await p.getByText("EXAMPLE Midwinter Print Fair", { exact: false }).count() > 0, "fixture title is visible");
  await ctx.close();
}

{
  const { ctx, p } = await open("/call-check/", async ctx => {
    await ctx.route("**/call-check/data/calls.json", route => route.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
  });
  await p.waitForSelector(".cc-empty");
  ok(await p.getByText("No calls are listed yet.").count() === 1, "empty array shows the empty state");
  await ctx.close();
}

{
  const { ctx, p } = await open("/call-check/", async ctx => {
    await ctx.route("**/call-check/data/calls.json", route => route.fulfill({ status: 200, contentType: "application/json", body: "{" }));
  });
  await p.waitForSelector(".is-error");
  ok(/could not be read/.test(await p.textContent("#cc-status")), "invalid JSON shows an error, not a crash");
  await ctx.close();
}

for (const path of ["/call-check/rubric.html", "/call-check/method.html", "/call-check/reply.html", "/"]) {
  const { ctx, p, res } = await open(path);
  ok(res.ok(), "GET " + path + " " + res.status());
  if (path === "/") ok(await p.getByRole("heading", { name: "Winter Light" }).count() > 0, "home still shows Winter Light");
  if (path === "/call-check/reply.html") {
    const href = await p.getAttribute("[data-callcheck-reply]", "href");
    ok(href && decodeURIComponent(href).includes("Call Check: right of reply"), "reply mailto subject is distinct");
  }
  await ctx.close();
}

await b.close();
process.exit(fail ? 1 : 0);
