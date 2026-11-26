# Beauty Exhibit — build log

Times are America/Chicago (CST, UTC-6).

## 2026-11-15

### Plan
Read `/workspace/dash/domains/briefs/beautyexhibit-art.md` (overrides earlier notes) and the sharethislife.com log for GitHub Pages steps. Building a plain static site (HTML/CSS/JS, no build step, no frameworks, no trackers, no external fonts or CDNs) at `/workspace/sites/beautyexhibit.art/`.

### Offer, as specified in the brief
- First open call: Winter Light. Opens November 20, 2026. Entries close December 15, 2026, at 11:59 PM CT. Results post by December 22, 2026.
- Entry is $5 for up to three works. Live Stripe Payment Link: `https://buy.stripe.com/3cI8wH2TWbpD1qbe9V3oA04`, which redirects to `/submit-w9q4/`.
- `/submit-w9q4/` is noindex, nofollow, has no og:url, is left out of any sitemap, and is not linked from the rest of the site. Artists email work to `winterlight@agentmail.to` (from `SUBMIT_TARGET` in `js/config.js`). JPG/PNG, longest side at most 3,000 pixels, plus name, Stripe checkout email, title, medium, year, and a one-line statement.
- Prize: a permanent exhibit page for accepted work; one featured solo page. No cash prizes, and the copy does not hint at any.
- Jury: a published 1–5 rubric (fit to the theme, craft, originality, presentation). Bots pre-screen; the show’s director makes the final picks. The site does not name a person and does not claim a jury panel or credentials. The site promises to publish the acceptance rate when the exhibition opens.
- Refunds: full if the artist asks before judging starts (after the December 15 close); none after judging has started. Artists keep all rights; we only display with credit.
- No sample art. One original abstract “winter light” graphic (site-made), captioned as a site graphic, not an entry.
- No unsourced comparisons to other calls’ fees. The “cheapest serious call” angle was not used.
- Footer: “This domain is for sale” → `https://www.afternic.com/domain/beautyexhibit.art` (curl returned HTTP 200).

### Hosting plan
No `CLOUDFLARE_API_TOKEN`. Hosting is GitHub Pages from a new public repo `evanmack45/beautyexhibit.art`, `main` branch, site root. Order of operations for DNS safety: push and enable Pages with no custom domain; confirm `https://evanmack45.github.io/beautyexhibit.art/` loads; take screenshots from github.io (or a local server) before setting a CNAME; only then add the `CNAME` file and set `cname=beautyexhibit.art` via the Pages API. DNS itself is left for someone else. No other repo or site will be touched.

### Sale-page link
Checked `https://www.afternic.com/domain/beautyexhibit.art` with curl: HTTP 200. The footer uses that URL.

### What shipped
- Home, rules and rubric, FAQ, `/submit-w9q4/` (post-payment instructions), 404, robots.txt (disallows `/submit-w9q4/`), favicon (SVG + ICO), apple-touch-icon, Open Graph image and tags. No sitemap. `/submit-w9q4/` has `<meta name="robots" content="noindex, nofollow">`, no `og:url`, and is not linked from the rest of the site.
- One original abstract “winter light” graphic at `img/winter-light.svg`, captioned “A site graphic, not an exhibition entry.”
- Pay buttons read `STRIPE_PAYMENT_LINK` in `js/config.js` (also set as the href in the HTML so the button works without JavaScript). The submit address is `SUBMIT_TARGET` / `winterlight@agentmail.to` in the same file.
- Footer: “This domain is for sale” → the Afternic URL above.
- DNS was not changed.

### Local test (Chrome headless, `python3 -m http.server` on 127.0.0.1:8766)
- Home, rules, FAQ, submit, and 404 all returned HTTP 200. CSS, JS, and the graphic also returned 200.
- Viewed 1280×800 and 390×844 screenshots. Tightened the hero (graphic first, shorter crop) so the $5 button is on screen at 1280×800 and at 390×844. Lede no longer leaves a one-word orphan.
- `/submit-w9q4/` shows the mailto address and the required list (name, Stripe checkout email, title, medium, year, one-line statement, JPG/PNG with longest side at most 3,000 pixels).
- Screenshots saved under `shots/` (gitignored).

### Stripe check (before deploy)
- `https://buy.stripe.com/3cI8wH2TWbpD1qbe9V3oA04` returned HTTP 200. A rendered checkout shot will be taken and logged with the github.io results. No payment was made.

### Hosting results (still 2026-11-15, America/Chicago)
- Public repo: https://github.com/evanmack45/beautyexhibit.art (main). No other repo or site was touched. DNS was not changed.
- Pages was enabled from `main` `/` with no custom domain first. Status became `built`. `https://evanmack45.github.io/beautyexhibit.art/` returned **HTTP 200** (no redirect). CSS, JS, favicon, rules, FAQ, `/submit-w9q4/`, 404.html, robots.txt, the winter-light graphic, and og.png all returned 200. There is no sitemap (that path serves the custom 404). Live `js/config.js` has the Stripe Payment Link and the mailto submit target.
- Official screenshots taken from github.io before any CNAME was set (1280×800 and 390×844): `shots/github-io-home-1280.png`, `shots/github-io-home-390.png`, `shots/github-io-submit-1280.png`, `shots/github-io-submit-390.png`. JPG copies sit next to them in `shots/` and also at `/workspace/sites/beautyexhibit.art/shots/github-io-home-1280.jpg`, `/workspace/sites/beautyexhibit.art/shots/github-io-home-390.jpg`, `/workspace/sites/beautyexhibit.art/shots/github-io-submit-1280.jpg`, `/workspace/sites/beautyexhibit.art/shots/github-io-submit-390.jpg`.
- Stripe checkout (curl HTTP 200; rendered with Chrome, no payment made): live mode, ETM Industries, “Winter Light juried online show entry (up to 3 artworks)”, **$5.00**, no Test mode banner. Proof: `shots/stripe-checkout-1280.png`.

- Then `CNAME` (contents: `beautyexhibit.art`) was committed and pushed, and the Pages API was updated with `cname=beautyexhibit.art`. A PUT that also sent `https_enforced: false` returned HTTP 404 “The certificate does not exist yet” — expected, there is no cert until DNS exists. A subsequent GET showed the cname already set and HTTPS not enforced:

```json
{"url":"https://api.github.com/repos/evanmack45/beautyexhibit.art/pages","status":"building","cname":"beautyexhibit.art","custom_404":true,"html_url":"http://beautyexhibit.art/","build_type":"legacy","source":{"branch":"main","path":"/"},"public":true,"protected_domain_state":"unverified","pending_domain_unverified_at":null,"https_enforced":false}
```

- After the CNAME was set, `https://evanmack45.github.io/beautyexhibit.art/` still returned HTTP 200 (cached; `max-age=600`). The apex will not resolve until DNS is pointed at GitHub Pages. Expected.
- `https_enforced` is false on the custom domain until DNS and the Pages certificate are in place. Do not flip that on until DNS is done.
- Account-level Pages domain verification: there is no REST API for it. The TXT record `_github-pages-challenge-evanmack45.beautyexhibit.art` has to be created from GitHub profile Settings → Pages → Add a domain (the UI), not from `gh api`. Not done in this pass.
- DNS records GitHub Pages will need, when someone else is ready to move nameservers (same set as sharethislife.com, confirmed against GitHub docs, “Managing a custom domain” and “Securing your GitHub Pages site with HTTPS”):
  - Apex A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - Apex AAAA: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - CNAME `www` → `evanmack45.github.io`

- 2026-11-15 7:36 AM CT: github.io checklist passed; CNAME is set; DNS was not changed. Next: Dash points DNS; then verify the domain, wait for the cert, enforce HTTPS, and take live-domain shots.

## 2026-11-15 7:40 AM CT (Mason)
Viewed home 1280/390 and submit 390 shots: fine. TXT d0951ba6fcb9b66efc168fc6c26bb2 is official: copied from github.com/settings/pages_verified_domains/beautyexhibit.art at 7:27 AM CT (pending, not yet verified). Sent Dash the full DNS set.

## 2026-11-15 7:40 AM CT
Per Dash: call is open now. Replaced "Call opens November 20, 2026" with "Open now" on home, rules, meta and README.


## 2026-11-15 08:11 AM CST (Mason, go-live routine)
Clicked Verify once at https://github.com/settings/pages_verified_domains/beautyexhibit.art (signed in as evanmack45). GitHub still says: "We were unable to verify ownership of beautyexhibit.art. We couldn't find the TXT record. Note that DNS changes can take up to 24 hours." Public DNS (Google + Cloudflare DoH) still has A x4, AAAA x4, www CNAME to evanmack45.github.io, and TXT _github-pages-challenge-evanmack45 = d0951ba6fcb9b66efc168fc6c26bb2. Pages API: protected_domain_state unverified, https_certificate null, https_enforced false. Before 11:00 AM CT stop time; no messages sent. Will retry next run.

## 2026-11-15 08:44 AM CST (Mason, go-live routine)
Clicked Verify once at https://github.com/settings/pages_verified_domains/beautyexhibit.art (signed in as evanmack45). GitHub still says: "We were unable to verify ownership of beautyexhibit.art. We couldn't find the TXT record. Note that DNS changes can take up to 24 hours." Public DNS (Google + Cloudflare DoH) still has A x4, AAAA x4, www CNAME to evanmack45.github.io, and TXT _github-pages-challenge-evanmack45 = d0951ba6fcb9b66efc168fc6c26bb2. Pages API after the click: protected_domain_state unverified, https_certificate null, https_enforced false. Before 11:00 AM CT stop time; no messages sent. Will retry next run.

## 2026-11-15 9:05 AM CT
Per Barker (call-board requirements): added organizer line (Beauty Exhibit; bot pre-screen + show director, no named juror per Dash brief), "no other fees", results/notification date Dec 22 with email to every entrant, no-sales/no-commission terms, public contact winterlight@agentmail.to on home, rules, FAQ. Did NOT add a named juror (brief forbids) or a Dec 20 live date (brief says results by Dec 22).

## 2026-11-15 9:00 AM CT
Dash: keep winterlight@agentmail.to (no forwarding), no named juror, keep Dec 22 promise. Posting on hold; finish HTTPS and stop.


## 2026-11-15 9:13 AM CST (Mason, go-live routine)
Clicked Verify once at https://github.com/settings/pages_verified_domains/beautyexhibit.art (signed in as evanmack45). Success: GitHub redirected to /settings/pages with banner "Successfully verified beautyexhibit.art". Verified domains list now shows sharethislife.com and beautyexhibit.art as Verified. Pages API: protected_domain_state verified, https_certificate null, https_enforced false. Under the 60-minute wait before remove-and-re-add CNAME to trigger the cert. No messages sent. Next: wait for an approved certificate, then enforce HTTPS.


## 2026-11-24 7:10 PM CT (Dash, HTTPS repair)

The public problem was not a dead deploy. DNS is still correct (apex A + AAAA to GitHub Pages, www CNAME to evanmack45.github.io, GoDaddy nameservers, domain verified). Hitting GitHub IPs directly, HTTP returns 200 and serves the Winter Light site (last-modified 2026-11-15 15:00:36 GMT). HTTPS fails certificate verification: GitHub still presents the `*.github.io` cert, and the Pages API shows `https_certificate: null`, `https_enforced: false`. From the box's egress proxy the same HTTPS failure is often reported as HTTP 500 from Pingora, which is how this was first described. The certificate was never issued after the Nov 15 verification; the planned remove-and-re-add of the custom domain did not run.

Before retriggering the cert, the live $5 pay button and “Open now” copy were turned off. Winter Light was already parked (no named juror; money rule: no charges until an end-to-end test and a named fulfillment owner). `CALL_OPEN` in `js/config.js` is `false`. The site now shows “Call paused” and a waitlist mailto to winterlight@agentmail.to. The Stripe URL is not in the HTML. Next: push this change, remove and re-add the Pages custom domain, wait for an approved certificate, enforce HTTPS, and verify https://beautyexhibit.art returns 200 with a valid cert.


## 2026-11-24 7:16 PM CT (Dash, HTTPS repair complete)

Removed and re-added the Pages custom domain (GitHub wrote `Delete CNAME` / `Create CNAME` on main, then fast-forwarded locally). Pages API: `https_certificate.state=approved` for `beautyexhibit.art` and `www.beautyexhibit.art`, expires 2027-02-22. Then set `https_enforced=true`.

Verified against GitHub Pages `185.199.108.153`:
- `https://beautyexhibit.art/` → **HTTP 200**, valid Let's Encrypt cert, CN=beautyexhibit.art, SAN includes www.
- `http://beautyexhibit.art/` → **301** to https://beautyexhibit.art/
- `https://www.beautyexhibit.art/` → **301** then **200** at the apex.
- rules.html, faq.html, css, js, graphic, `/submit-w9q4/`: 200. Unknown path: custom 404.

Rendered in headless Chrome at 1280×800 and 390×844 (shots in `/workspace/dash/domains/evidence-2026-11-24/`). The page shows “Call paused” and “Tell me when a call opens.” After JS, the $5 pay button stays hidden and has no Stripe href. `CALL_OPEN` remains false.

## 2026-11-24 8:40 PM CT (Mason, Call Check phase 1)

Added a free Call Check section at `/call-check/` (rubric, table from JSON, method, right of reply, mailto). Winter Light pages were left byte-intact. Their SHA-256 values still match the freeze recorded at 8:29 PM CT. No nav link was added on the Winter Light pages, so those files did not change. Call Check links back to `/`.

HTTPS was already in place: Pages API shows `https_certificate.state=approved` (expires 2027-02-22), `https_enforced=true`, `protected_domain_state=verified`. `curl -sI https://beautyexhibit.art/` returned HTTP 200 with a Let's Encrypt cert, CN=beautyexhibit.art. No Pages setting was changed.

The table ships with two clearly marked EXAMPLE rows in `call-check/data/calls.json`. The loader was tested against `/workspace/scout/callcheck-20.json` (already on disk as of 8:27 PM CT) and loads all 20 records unchanged. Phase 2 is a file copy, then a source re-check and new screenshots. No payment button. Mailto uses the existing inbox `winterlight@agentmail.to` with the subject "Call Check: please review this call". Full log: `/workspace/mason/callcheck-build.md`.

## 2026-11-24 8:45 PM CT (Mason, Call Check phase 2)

Plugged in `/workspace/scout/callcheck-20.json` as `call-check/data/calls.json`. The two files are byte-identical (sha256 038d17a820243357a2d2c53e4fcf96dd09d39e46771974689ffbe6398d73dd6f). The table now lists 20 sourced calls, with no example rows. Winter Light pages remain byte-intact. No payment button. No Stripe changes.

Source re-check (2026-11-24, curl with a browser user-agent, follow redirects): 46 unique source URLs. 44 returned HTTP 200 on the first pass. Two culturalelab.com URLs timed out on the first pass (curl 000, 0 bytes after 25s) and returned HTTP 200 on an immediate IPv4 retry (100-artists 61,051 bytes; published-books 332,034 bytes). No URL was changed. Scout's file was not edited.

Full log: `/workspace/mason/callcheck-build.md`.

## 2026-11-24 9:02 PM CT (Mason, Call Check nav link)

Dash accepted Call Check and asked for a Call Check link in the Winter Light nav.

Blast-radius first, proved by running a diff against `cc09771`: the only HTML change on Winter Light pages is one added line, `<a href="/call-check/">Call Check</a>`, on every page that already had `.site-nav`:

- index.html
- rules.html
- faq.html
- 404.html
- submit-w9q4/index.html

Nothing was deleted. CSS, JS (`CALL_OPEN` still false), images, CNAME, robots.txt, favicon, and every Call Check file were byte-identical to `cc09771`. No `buy.stripe.com` URL was added to any HTML. The href is root-absolute (`/call-check/`) so the custom 404 still points at the right place from a deep unknown path.

`call-check/scripts/check-site.mjs` freeze hashes were updated for those five HTML files only. The other freeze hashes are unchanged.

Commit `da5c88b2c39e450b79a8537a810d44b57a2bea9a`, pushed to `main`. Pages build: built da5c88b. HTTPS remains enforced, certificate CN=beautyexhibit.art (SAN includes www), expires 2027-02-22.

Live checks, 9:02 PM America/Chicago, 24 Nov 2026 (curl, then Playwright):

- `https://beautyexhibit.art/` 200, GitHub.com, body byte-identical to local index.html, nav link present
- `https://beautyexhibit.art/rules.html` 200, hash match, link present
- `https://beautyexhibit.art/faq.html` 200, hash match, link present
- `https://beautyexhibit.art/submit-w9q4/` 200, hash match, link present
- `https://beautyexhibit.art/404-test-nav-missing` 404 with the custom page, hash match, link present
- `https://beautyexhibit.art/call-check/` 200, hash match (Call Check files unchanged)
- Playwright: clicking "Call Check" on the home nav goes to `https://beautyexhibit.art/call-check/` with HTTP 200 and title "Call Check | Beauty Exhibit"
- No horizontal overflow at 1280 or 390
- `CALL_OPEN` is still false. After JS, the `[data-pay]` button has no href and `aria-disabled="true"`. There is still no Stripe URL in the HTML.

Pre-existing (not introduced by this nav change; `css/site.css` and `js/app.js` were not modified): `.cta-row { display: flex; }` overrides the `[hidden]` attribute on the "Enter for $5" row, so that row remains visible under the paused box. The button does not go to Stripe. Left untouched because this change was required to stay nav-only.

Screenshots of the live home page, viewed:

- `/workspace/mason/beautyexhibit-nav-1280.jpg`
- `/workspace/mason/beautyexhibit-nav-390.jpg`

Both show the new "Call Check" item in the existing site nav, next to FAQ, in the same style. No messages sent.

## 2026-11-24 9:07 PM CT (Mason, hide the paused pay row)

Fixed the pre-existing money-rule bug: `.cta-row { display: flex; }` in `css/site.css` was overriding the `[hidden]` attribute, so the "Enter for $5" row stayed visible on the home page while `CALL_OPEN` is false.

Change: one rule added to `css/site.css`, nothing else in that file or in any HTML/JS:

```
[hidden] {
  display: none !important;
}
```

The global rule was used instead of `.cta-row[hidden]` so any other `[hidden]` element is also protected (the rules page wrap is a `<p hidden>`, already `display: none` before this change). Call Check pages load `site.css` but have no `[hidden]` elements.

Blast-radius, proved by running, against boxes measured on the live site before the fix: with `CALL_OPEN` still false, the $5 row is `display: none` and has a 0×0 box; the wordmark, nav, Call Check link, h1, and paused box did not move; FAQ and Call Check header/h1 did not move; the rules waitlist row did not move. The only expected layout change is the theme section moving up into the space the $5 row used to occupy.

Freeze hash for `css/site.css` only was updated to `f3e1ef8ddc28c27bcd3066d58c6bac98aaba38bc941b3f3a13dde4d34365b2db`. `node call-check/scripts/check-site.mjs` passed.

Commit `5c99d2908228ce068113e1863ee69849ad1400d0`, pushed to `main`. Pages build: built 5c99d29. Live `css/site.css` is byte-identical to the local file and contains the new rule.

Live checks, 9:07 PM America/Chicago, 24 Nov 2026, at 1280 and 390:

- `https://beautyexhibit.art/` 200, `CALL_OPEN=false`, $5 row not visible, no Stripe URL, pay control has no href, paused box still visible, Call Check nav still present, no horizontal overflow
- At 1280, wordmark, nav, Call Check link, h1, and paused box match the pre-fix live boxes
- `https://beautyexhibit.art/call-check/` 200, title unchanged, 20 calls listed, no `[hidden]` elements, h1 unmoved

Screenshots of the live home page, viewed:

- `/workspace/mason/beautyexhibit-payhidden-1280.jpg`
- `/workspace/mason/beautyexhibit-payhidden-390.jpg`

Both show the paused box and the waitlist button, and do not show "Enter for $5". No messages sent.

## 2026-11-25, Ansel: slop fix (Dash item, audit of 11/25)

Removed the "Open call · 2026" chip and every other `.kicker` label (rules, FAQ, submit, four Call Check pages, and the CSS rule). Put the hero painting (`/workspace/ansel/art/winter-light-hero.png`) on the first screen as `<picture>` (WebP + JPG, 800 and 1280 wide, width/height set). Square crop at 390 (358 px, 42% of the 844 fold), 3.4:1 at desktop. Caption: "AI-generated image made for this site. Not an exhibition entry or a real artist's work." Alt describes the room, chair, dresser, vase and light band.

First screen is now art, "Winter Light", "A juried online exhibition. The call is paused.", and the paused box with the waitlist button. The $5 fee sentence left the lede and the box. It stays in the Entry row below the box, so no fact was dropped. The paused box markup, `data-` attributes, waitlist mailto and the hidden pay row are unchanged. `CALL_OPEN` is still false and the live HTML has no Stripe URL. Small text raised to 12 px and header/footer links given 24 px targets. `og.png` (said "An open call") replaced by `og.jpg`, a text-free crop of the painting. The four pages with og tags point at it. `winter-light.svg` stays in the repo, unused on the page, because its freeze hash is checked.

Freeze hashes updated in `call-check/scripts/check-site.mjs` for index, rules, faq, submit, 404 and `css/site.css` (final css hash `4398c2e7f25c6a9b38c85d7fe864e99fe6f91d9a7c2971c7f485e871b99b8521`). `node call-check/scripts/check-site.mjs` passed. Call Check e2e on live (`e2e-table.mjs`, real 20 rows, first row Ridgewood) passed.

Commits: 082e8db (art and kickers), ee4b0e4 (12 px text, tap targets), 3f8de10 (nowrap header). Pages built 3f8de10, live css byte-identical. Gate at 390 and 1280: PASS, no P0. Output: `/workspace/ansel/slop-fix/gate-after`. No messages sent.

## 2026-11-25, Ansel: four-section home and one-line nav (Dash, due Thu 11/26 noon CT)

Cut the "The theme" section from the home page so it has four sections: hero, If a work is accepted, How work is chosen, and Eligibility. The medium rule ("any medium that can be shown as a still image") and the theme meaning ("winter light, not only winter as a season or a setting") already live on rules.html and faq.html, so no fact was dropped. Every date promise and the paused / pay / waitlist state is unchanged.

Shortened the Winter Light nav label "Rules & rubric" to "Rules" on index, rules, FAQ, 404, and submit. Shortened the Call Check nav label "Right of reply" to "Reply" (the reply page heading stays "Right of reply"). Tightened header and nav gap, set nowrap on the header wrap and the nav, and slightly reduced nav size and wordmark tracking under 430px so the bar stays one line from 320 to 430 and at 1280. Checked locally at 320, 360, 390, 430, and 1280 on home and Call Check: one row of links, no page overflow.

Freeze hashes updated for index, rules, faq, submit, 404, and css/site.css. `node call-check/scripts/check-site.mjs` passed. No messages sent.

Live checks, 8:26 PM America/Chicago, 25 Nov 2026: Pages built 22dde7e. `https://beautyexhibit.art/` 200, live css byte-identical, no "The theme" on the home page, nav labels are Rules / FAQ / Call Check. slopcheck after2: fold 60 / 60, total 250, prose 199, 2.6 screens, 0 ban-list, 0 em dashes, 0 Vale, 0 impeccable findings. Gate PASS, no P0, output `/workspace/ansel/slop-fix/gate-after2`. The 390 fold shot shows a one-line nav and four sections. Call Check nav is one line at 390 (and at 320). No messages sent.

## 2026-11-26, Ansel: Call Check og:image (Compass row 4)

Added `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` to `call-check/index.html`. `og:title`, `og:description`, and `og:url` were already present and were left as they were (they match the page title and description). The image is the existing painting crop at `https://beautyexhibit.art/img/og.jpg`. No other copy or price change. Call Check HTML is not in the Winter Light freeze list. `node call-check/scripts/check-site.mjs` passed. No messages sent.

Live checks, 1:32 PM America/Chicago, 26 Nov 2026: Pages built 1214eeb. `https://beautyexhibit.art/call-check/` 200. `curl -s https://beautyexhibit.art/call-check/ | grep og:image` returns `<meta property="og:image" content="https://beautyexhibit.art/img/og.jpg">`. That image URL returns 200. No messages sent.

## 2026-11-26 (CT) Compass rows (Mason)
- BE-1: PASS. Removed the stale robots.txt comment about there being no sitemap and DNS not being pointed. Live robots.txt has no stale comment. Winter Light freeze hash for robots.txt updated. `CALL_OPEN` stays false. Commit `c334b17`.
- BE-2: PASS. Added sitemap.xml with the homepage and /call-check/, and a Sitemap line in robots.txt. Live HEAD of /sitemap.xml is 200; robots.txt names it. Same commit `c334b17`. No Winter Light or Call Check HTML was edited.
- BE-3: SKIP (Dash with Evan, Search Console Domain property).
- BE-4: SKIP (Ansel's lane; already live in `1214eeb`).
