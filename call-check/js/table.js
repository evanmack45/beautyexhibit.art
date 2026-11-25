/* Renders the Call Check table from data/calls.json. Same-origin fetch only. */
(function () {
  "use strict";
  var S = window.CallCheckSchema;
  var mount = document.getElementById("cc-table");
  var status = document.getElementById("cc-status");
  if (!mount || !S) return;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function hostLabel(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); }
    catch (e) { return "source"; }
  }

  function fieldCell(field) {
    if (S.isNotFound(field.value)) {
      return '<span class="cc-not-found">not found</span>' + sourceLink(field.source);
    }
    return '<span class="cc-value">' + escapeHtml(field.value) + "</span>" + sourceLink(field.source);
  }

  function sourceLink(source) {
    if (!source) return '<span class="cc-source cc-not-found">source not found</span>';
    var href = source;
    if (!/^https?:\/\//i.test(href)) return '<span class="cc-source">' + escapeHtml(source) + "</span>";
    return '<a class="cc-source" href="' + escapeHtml(href) + '">' + escapeHtml(hostLabel(href)) + "</a>";
  }

  function render(result) {
    mount.innerHTML = "";
    if (!result.ok) {
      status.className = "cc-status is-error";
      status.textContent = "The call list could not be read. " + result.error + ".";
      return;
    }
    if (result.records.length === 0) {
      status.className = "cc-status";
      status.textContent = result.skipped ? "No readable rows in the file." : "";
      mount.innerHTML = '<p class="cc-empty">No calls are listed yet.</p>';
      return;
    }
    var examples = result.records.filter(function (r) { return r.example; }).length;
    var parts = [result.records.length + (result.records.length === 1 ? " call" : " calls") + " listed"];
    if (examples) parts.push(examples + (examples === 1 ? " example row" : " example rows") + ", not real calls");
    if (result.skipped) parts.push(result.skipped + " unreadable row" + (result.skipped === 1 ? "" : "s") + " omitted");
    status.className = "cc-status";
    status.textContent = parts.join(". ") + ".";

    if (examples === result.records.length) {
      var note = document.createElement("p");
      note.className = "cc-note";
      note.id = "cc-example-banner";
      note.textContent = "These rows are examples, so you can see how the table works. They are not real calls. They will be replaced by a sourced list.";
      mount.appendChild(note);
    }

    var wrap = document.createElement("div");
    wrap.className = "cc-table-wrap";
    var table = document.createElement("table");
    table.className = "cc-table";
    table.setAttribute("aria-describedby", "cc-status");
    var thead = "<thead><tr>";
    for (var i = 0; i < S.FIELDS.length; i++) thead += "<th scope='col'>" + escapeHtml(S.FIELDS[i].label) + "</th>";
    thead += "</tr></thead>";
    var body = "<tbody>";
    for (var r = 0; r < result.records.length; r++) {
      var rec = result.records[r];
      body += "<tr>";
      for (var c = 0; c < S.FIELDS.length; c++) {
        var key = S.FIELDS[c].key;
        var cell = fieldCell(rec.fields[key]);
        if (c === 0 && rec.example) cell += ' <span class="cc-badge">Example</span>';
        body += "<td>" + cell + "</td>";
      }
      body += "</tr>";
    }
    body += "</tbody>";
    table.innerHTML = thead + body;
    wrap.appendChild(table);
    mount.appendChild(wrap);
  }

  var DATA_URL = new URL("data/calls.json", window.location.href).href;

  fetch(DATA_URL, { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("the list file could not be loaded");
      return res.text();
    })
    .then(function (text) { render(S.parseJsonText(text)); })
    .catch(function (err) {
      render({ ok: false, error: err && err.message ? err.message : "the list file could not be loaded", records: [] });
    });
})();
