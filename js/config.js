/* Beauty Exhibit — site config.
 *
 * CALL_OPEN is the one switch for the entry offer.
 * false: show “Call paused” and a waitlist mailto. Do not put the
 *   Stripe URL into the page.
 * true: restore the $5 pay button exactly as it works when a call is open.
 *
 * STRIPE_PAYMENT_LINK is the live $5 Stripe Payment Link (set Nov 15 2026).
 * After payment, Stripe redirects to /submit-w9q4/.
 * Do not put this URL in the HTML while CALL_OPEN is false.
 *
 * SUBMIT_TARGET is the address artists use to send work after paying.
 * Change that one line if the inbox ever moves.
 */
(function (root) {
  "use strict";

  var CALL_OPEN = false;

  // Live Stripe Payment Link ($5). Thanks/submit page on this site: /submit-w9q4/
  var STRIPE_PAYMENT_LINK = "https://buy.stripe.com/3cI8wH2TWbpD1qbe9V3oA04";
  var SUBMIT_TARGET = "mailto:winterlight@agentmail.to";
  var WAITLIST_SUBJECT = "Tell me when Beauty Exhibit opens a call";

  root.BE_CONFIG = {
    callOpen: CALL_OPEN,
    stripePaymentLink: STRIPE_PAYMENT_LINK,
    stripeIsPlaceholder: STRIPE_PAYMENT_LINK.indexOf("PLACEHOLDER") !== -1,
    submitTarget: SUBMIT_TARGET,
    submitEmail: "winterlight@agentmail.to",
    waitlistSubject: WAITLIST_SUBJECT,
    waitlistMailtoHref:
      "mailto:winterlight@agentmail.to?subject=" +
      encodeURIComponent(WAITLIST_SUBJECT),
    priceLabel: "$5",
    siteName: "Beauty Exhibit",
    siteUrl: "https://beautyexhibit.art/"
  };
})(window);
