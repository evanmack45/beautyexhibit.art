import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const S = createRequire(import.meta.url)("../js/schema.js");
const placeholder = readFileSync(new URL("./fixtures/placeholder.json", import.meta.url), "utf8");
const live = readFileSync(new URL("../data/calls.json", import.meta.url), "utf8");
const scoutPath = "/workspace/scout/callcheck-20.json";

test("placeholder parses as two example rows, with a not-found cell", () => {
  const r = S.parseJsonText(placeholder);
  assert.equal(r.ok, true);
  assert.equal(r.records.length, 2);
  assert.ok(r.records.every(x => x.example));
  assert.equal(r.records[0].fields.title.value, "EXAMPLE Midwinter Print Fair");
  assert.equal(S.isNotFound(r.records[1].fields.jurors.value), true);
  assert.equal(r.records[1].fields.jurors.value, "not found");
  assert.equal(r.records[1].fields.jurors.source, "https://example.com/harbor");
});

test("Scout file loads unchanged: 20 records, eight fields, eight exact not-found cells, plus one longer 'not found (' sentence", () => {
  const r = S.parseJsonText(readFileSync(scoutPath, "utf8"));
  assert.equal(r.ok, true);
  assert.equal(r.records.length, 20);
  assert.ok(r.records.every(x => x.example === false));
  assert.equal(r.records[0].fields.title.value, "47th Annual Open Juried Show");
  assert.equal(r.records[0].fields.organizer.value, "Ridgewood Art Institute");
  let missing = 0;
  for (const rec of r.records) {
    for (const f of S.FIELDS) if (S.isNotFound(rec.fields[f.key].value)) missing++;
  }
  // Scout's notes counted 9 missing cells. One of those values is a longer sentence
  // that begins with "not found (", not the exact token. The loader treats only the
  // exact token as not found, and shows the longer sentence as a sourced fact.
  assert.equal(missing, 8);
  const openField = r.records[19].fields.past_show_evidence;
  assert.equal(S.isNotFound(openField.value), false);
  assert.match(openField.value, /^not found \(/);
  // unknown keys (none expected on first record besides the eight) are ignored, not fatal
  assert.equal(r.skipped, 0);
});

test("wrapper {calls: [...]} and missing/bare fields are tolerated", () => {
  const r = S.parseDocument({ meta: { note: "x" }, calls: [
    { title: "Bare title", organizer: { value: "Org", source: "https://example.com/a" } },
    { title: { value: "n/a" } }
  ]});
  assert.equal(r.ok, true);
  assert.equal(r.meta.note, "x");
  assert.equal(r.records[0].fields.title.value, "Bare title");
  assert.equal(r.records[0].fields.title.source, "");
  assert.equal(r.records[0].fields.organizer.source, "https://example.com/a");
  assert.equal(S.isNotFound(r.records[0].fields.jurors.value), true);
  assert.equal(r.records[1].fields.title.value, "n/a");
});

test("empty list, bad JSON, and non-list documents", () => {
  assert.equal(S.parseDocument([]).records.length, 0);
  assert.equal(S.parseJsonText("{").ok, false);
  assert.equal(S.parseDocument({ no: "calls" }).ok, false);
  assert.equal(S.parseDocument({ calls: [null, "x", { title: { value: "Ok", source: "https://example.com" } }] }).records.length, 1);
});

test("live data file is byte-identical to Scout's callcheck-20.json", () => {
  const scout = readFileSync(scoutPath);
  const data = readFileSync(new URL("../data/calls.json", import.meta.url));
  assert.equal(data.equals(scout), true);
});

test("field list is exactly the eight Scout keys, in order", () => {
  assert.deepEqual(S.FIELDS.map(f => f.key), [
    "title", "organizer", "venue", "entry_fee", "jurors", "prize", "deadline", "past_show_evidence"
  ]);
});
