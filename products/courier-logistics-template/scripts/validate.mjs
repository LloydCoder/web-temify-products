import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = await readFile(join(root, "src/index.html"), "utf8");
const css = await readFile(join(root, "src/styles.css"), "utf8");
const js = await readFile(join(root, "src/app.js"), "utf8");
const manifest = JSON.parse(await readFile(join(root, "product.manifest.json"), "utf8"));

assert.equal(manifest.productKey, "courier-logistics-template");
assert.equal(manifest.maturity, "scaffolded", "a scaffold must not be presented as released");
assert.equal(manifest.source.commit, null, "unreleased workspace must not invent a source commit");
assert.equal(manifest.rights.status, "declared");
assert.equal(manifest.security.scanStatus, "not_started");
for (const token of ['<html lang="en">', '<main id="main">', 'id="tracking-form"', 'aria-live="polite"', 'Skip to content']) {
  assert.ok(html.includes(token), `HTML must include ${token}`);
}
for (const token of ['@media(max-width:720px)', 'prefers-reduced-motion', ':focus-visible']) {
  assert.ok(css.includes(token), `CSS must include ${token}`);
}
for (const token of ['WT-2048', 'WT-2050', 'textContent', 'addEventListener']) {
  assert.ok(js.includes(token), `JavaScript must include ${token}`);
}
assert.ok(!js.includes('fetch('), "demo tracking must not make network requests");
console.log("Courier/logistics template validation passed.");
