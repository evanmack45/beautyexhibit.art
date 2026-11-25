# Call Check

Static pages under `/call-check/`. The Winter Light site files outside this folder are left byte-intact.

## JSON schema

The loader in `js/schema.js` accepts either:

- A bare JSON array (this is what `/workspace/scout/callcheck-20.json` is).
- An object with a `calls` array, and an optional `meta` object.

Each record may have these eight fields, and no others are shown:

`title`, `organizer`, `venue`, `entry_fee`, `jurors`, `prize`, `deadline`, `past_show_evidence`

Each field should be `{ "value": "<string>", "source": "<url or empty>" }`. A missing field, a blank value, or the exact value `not found` (any case) is shown as **not found**. A bare string is treated as a value with no source. Unknown keys are ignored. A record with `"_example": true` is marked Example in the table.

A value that only starts with "not found" but continues, such as `not found (the call states ...)`, is shown as a sourced fact, not as the not-found label. Scout's file has one such cell.

## Phase 2

When the 20-call file should go live:

```
cp /workspace/scout/callcheck-20.json call-check/data/calls.json
node --test call-check/test/schema.test.mjs
node call-check/scripts/check-site.mjs
# re-check the source URLs, commit, push, then take fresh 1280 and 390 screenshots
```

Do not edit the Scout file to make it load. The tests already parse it unchanged (20 of 20).

## Local checks

```
node --test call-check/test/schema.test.mjs
node call-check/scripts/check-site.mjs
# with a local static server at $BASE:
node call-check/scripts/e2e-table.mjs "$BASE"
node call-check/scripts/probe.mjs "$BASE"
```
