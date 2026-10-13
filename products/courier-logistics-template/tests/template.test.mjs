import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFile(join(root, path), "utf8");

test("template provides semantic, accessible page structure", async () => {
  const html = await read("src/index.html");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /<nav id="primary-navigation" aria-label="Main navigation">/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<a class="skip-link" href="#main">/);
});

test("shipment tracking is an explicitly local demo with fixed records", async () => {
  const html = await read("src/index.html");
  const js = await read("src/app.js");
  assert.match(html, /demo records only/i);
  assert.match(js, /"WT-2048"/);
  assert.match(js, /"WT-2050"/);
  assert.match(js, /textContent/);
  assert.doesNotMatch(js, /fetch\s*\(/);
  assert.doesNotMatch(js, /innerHTML/);
});

test("responsive styles include small-screen, focus and reduced-motion handling", async () => {
  const css = await read("src/styles.css");
  assert.match(css, /@media\(max-width:430px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("build output is reproducible from source assets", async () => {
  const manifest = JSON.parse(await read("product.manifest.json"));
  assert.equal(manifest.maturity, "scaffolded");
  assert.equal(manifest.source.commit, null);
});
