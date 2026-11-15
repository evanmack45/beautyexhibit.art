/* Beauty Exhibit — apply config to pay and mail links. */
(function () {
  "use strict";

  var c = window.BE_CONFIG;
  if (!c) return;

  document.querySelectorAll("[data-pay]").forEach(function (el) {
    el.setAttribute("href", c.stripePaymentLink);
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
