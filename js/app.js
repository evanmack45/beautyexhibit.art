/* Beauty Exhibit — apply config to pay, waitlist, and mail links. */
(function () {
  "use strict";

  var c = window.BE_CONFIG;
  if (!c) return;

  var open = !!c.callOpen;

  document.querySelectorAll("[data-call-open-only]").forEach(function (el) {
    el.hidden = !open;
  });
  document.querySelectorAll("[data-call-closed-only]").forEach(function (el) {
    el.hidden = open;
  });

  if (open) {
    document.querySelectorAll("[data-pay]").forEach(function (el) {
      el.setAttribute("href", c.stripePaymentLink);
    });
  } else {
    document.querySelectorAll("[data-pay]").forEach(function (el) {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
    });
  }

  document.querySelectorAll("[data-waitlist-mailto]").forEach(function (el) {
    el.setAttribute("href", c.waitlistMailtoHref);
  });

  document.querySelectorAll("[data-submit-mail]").forEach(function (el) {
    var href = c.submitTarget;
    if (href.indexOf("mailto:") === 0 && href.indexOf("?") === -1) {
      href += "?subject=" + encodeURIComponent("Winter Light entry");
    }
    el.setAttribute("href", href);
  });

  document.querySelectorAll("[data-submit-email]").forEach(function (el) {
    el.textContent = c.submitEmail;
  });
})();
