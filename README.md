# Beauty Exhibit

A juried online exhibition at [beautyexhibit.art](https://beautyexhibit.art/).

The first open call is **Winter Light**. Entry is $5 and covers up to three works. The call opens November 20, 2026. Entries close December 15, 2026, at 11:59 PM CT. Results post by December 22, 2026.

This is a plain static site (HTML, CSS, and JavaScript). There is no build step.

The $5 payment button is a live Stripe Payment Link, set in `STRIPE_PAYMENT_LINK` in `js/config.js`. After payment, Stripe redirects to `/submit-w9q4/`, which is not linked from the rest of the site. The address artists use to send work is `SUBMIT_TARGET` in the same file.

This domain is listed for sale: [Afternic listing](https://www.afternic.com/domain/beautyexhibit.art).
