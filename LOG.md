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
