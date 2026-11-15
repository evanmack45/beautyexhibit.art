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
- Official screenshots taken from github.io before any CNAME was set (1280×800 and 390×844): `shots/github-io-home-1280.png`, `shots/github-io-home-390.png`, `shots/github-io-submit-1280.png`, `shots/github-io-submit-390.png`. JPG copies sit next to them in `shots/` and also at `/workspace/github-io-home-1280.jpg`, `/workspace/github-io-home-390.jpg`, `/workspace/github-io-submit-1280.jpg`, `/workspace/github-io-submit-390.jpg`.
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
