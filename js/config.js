/* Beauty Exhibit — site config.
 *
 * STRIPE_PAYMENT_LINK is the live $5 Stripe Payment Link (set Nov 15 2026).
 * After payment, Stripe redirects to /submit-w9q4/.
 *
 * SUBMIT_TARGET is the address artists use to send work after paying.
 * Change that one line if the inbox ever moves.
 */
(function (root) {
  "use strict";

  var STRIPE_PAYMENT_LINK = "https://buy.stripe.com/3cI8wH2TWbpD1qbe9V3oA04";
  var SUBMIT_TARGET = "mailto:winterlight@agentmail.to";

  root.BE_CONFIG = {
    stripePaymentLink: STRIPE_PAYMENT_LINK,
    submitTarget: SUBMIT_TARGET,
    submitEmail: "winterlight@agentmail.to",
    priceLabel: "$5",
    siteName: "Beauty Exhibit",
    siteUrl: "https://beautyexhibit.art/"
  };
})(window);
