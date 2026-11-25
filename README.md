# Beauty Exhibit

A juried online exhibition at [beautyexhibit.art](https://beautyexhibit.art/).

The first open call is **Winter Light**, organized by Beauty Exhibit. Entry is $5 and covers up to three works when a call is open. There are no other fees. The call is paused. We are not taking entries or payments right now. Entries close December 15, 2026, at 11:59 PM CT. Results post by December 22, 2026. Contact: winterlight@agentmail.to. There is no named juror.

This is a plain static site (HTML, CSS, and JavaScript). There is no build step.

`CALL_OPEN` in `js/config.js` is the switch for the home-page and rules offer. While it is `false`, the site shows “Call paused” and a waitlist mailto to `winterlight@agentmail.to`. The Stripe URL is not put in the HTML. Set `CALL_OPEN` to `true` only when a call is actually open and the money rule is met (product tested end to end, named fulfillment owner). The $5 Payment Link itself is `STRIPE_PAYMENT_LINK` in the same file. After payment, Stripe redirects to `/submit-w9q4/`, which is not linked from the rest of the site.

This domain is listed for sale: [Afternic listing](https://www.afternic.com/domain/beautyexhibit.art).
