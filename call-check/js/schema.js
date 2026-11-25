/* Call Check schema. One owner of the field list and of normalize/parse.
   Runs in the browser and in Node. No network, no storage. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CallCheckSchema = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // The eight fields Scout collected. Do not add columns here without a new data pass.
  var FIELDS = [
    { key: "title", label: "Call" },
    { key: "organizer", label: "Organizer" },
    { key: "venue", label: "Venue" },
    { key: "entry_fee", label: "Entry fee" },
    { key: "jurors", label: "Jurors" },
    { key: "prize", label: "Prize" },
    { key: "deadline", label: "Deadline" },
    { key: "past_show_evidence", label: "Past results" }
  ];

  var NOT_FOUND = "not found";

  function isBlank(s) {
    return s == null || String(s).trim() === "";
  }

  function isNotFound(value) {
    if (isBlank(value)) return true;
    return String(value).trim().toLowerCase() === NOT_FOUND;
  }

  function asString(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return "";
  }

  function normalizeField(raw) {
    if (raw == null) return { value: NOT_FOUND, source: "" };
    if (typeof raw === "string" || typeof raw === "number") {
      var s = asString(raw);
      return isNotFound(s) ? { value: NOT_FOUND, source: "" } : { value: s, source: "" };
    }
    if (typeof raw === "object") {
      var value = asString(raw.value);
      var source = asString(raw.source).trim();
      if (isNotFound(value)) return { value: NOT_FOUND, source: source };
      return { value: value, source: source };
    }
    return { value: NOT_FOUND, source: "" };
  }

  function normalizeRecord(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return { ok: false, error: "record is not an object" };
    }
    var fields = {};
    for (var i = 0; i < FIELDS.length; i++) {
      var key = FIELDS[i].key;
      fields[key] = normalizeField(raw[key]);
    }
    return { ok: true, example: raw._example === true, fields: fields };
  }

  function extractList(doc) {
    if (Array.isArray(doc)) return { list: doc, meta: {} };
    if (doc && typeof doc === "object" && Array.isArray(doc.calls)) {
      var meta = doc.meta && typeof doc.meta === "object" ? doc.meta : {};
      return { list: doc.calls, meta: meta };
    }
    return { error: "document is not a list of calls, or an object with a calls array" };
  }

  function parseDocument(doc) {
    var extracted = extractList(doc);
    if (extracted.error) return { ok: false, error: extracted.error, records: [], skipped: 0, meta: {} };
    var records = [];
    var skipped = 0;
    for (var i = 0; i < extracted.list.length; i++) {
      var n = normalizeRecord(extracted.list[i]);
      if (n.ok) records.push(n);
      else skipped += 1;
    }
    return { ok: true, records: records, skipped: skipped, meta: extracted.meta };
  }

  function parseJsonText(text) {
    var doc;
    try { doc = JSON.parse(text); }
    catch (e) { return { ok: false, error: "the file is not valid JSON", records: [], skipped: 0, meta: {} }; }
    return parseDocument(doc);
  }

  return {
    FIELDS: FIELDS,
    NOT_FOUND: NOT_FOUND,
    isNotFound: isNotFound,
    normalizeField: normalizeField,
    normalizeRecord: normalizeRecord,
    parseDocument: parseDocument,
    parseJsonText: parseJsonText
  };
});
