import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const inventory = JSON.parse(await readFile(new URL("../catalog/products.json", import.meta.url), "utf8"));
assert.equal(inventory.schemaVersion, 1, "unsupported catalogue schema version");
assert.equal(inventory.catalogueStatus, "planned-not-release-evidence");
assert.deepEqual(inventory.policy.order, ["Tier 1", "Tier 4", "Tier 5", "Tier 2", "Tier 3"]);
assert.equal(inventory.products.length, 43, "expected 39 standalone products and 4 launch kits");
assert.equal(inventory.products.filter((p) => p.kind === "standalone").length, 39);
assert.equal(inventory.products.filter((p) => p.kind === "launch-kit").length, 4);
assert.equal(new Set(inventory.products.map((p) => p.name)).size, 43, "duplicate product names found");
assert.ok(inventory.products.every((p) => typeof p.productKey === "string"), "every product requires a canonical productKey");
assert.equal(new Set(inventory.products.map((p) => p.productKey)).size, 43, "duplicate product keys found");
for (const product of inventory.products) {
  assert.match(product.productKey, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `invalid productKey for ${product.name}`);
}
assert.deepEqual(
  inventory.products.map((p) => p.sequence),
  Array.from({ length: 43 }, (_, index) => index + 1),
  "sequence must be contiguous and stable within this inventory revision"
);

const expectedCounts = new Map([["Tier 1", 6], ["Tier 4", 4], ["Tier 5", 6], ["Tier 2", 12], ["Tier 3", 15]]);
for (const [tier, expected] of expectedCounts) {
  assert.equal(inventory.products.filter((p) => p.tier === tier).length, expected, `unexpected item count for ${tier}`);
}
for (const product of inventory.products) {
  assert.equal(product.status, "planned", `${product.name} must not be treated as shipped without release evidence`);
  assert.equal(product.implementationEvidence, null);
  assert.equal(product.rightsEvidence, null);
  assert.equal(product.latestRelease, null);
}
console.log("Catalogue validation passed: 43 planned entries, unique canonical keys, no product represented as shipped.");
