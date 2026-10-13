import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const [catalog, schema] = await Promise.all([
  readFile(new URL("../catalog/products.json", import.meta.url), "utf8").then(JSON.parse),
  readFile(new URL("../schemas/product-manifest.schema.json", import.meta.url), "utf8").then(JSON.parse)
]);
assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
assert.equal(schema.properties.schemaVersion.const, 1);
assert.ok(schema.properties.source.properties.commit.type.includes("null"), "development manifests must support an unknown immutable commit");
assert.equal(schema.properties.maturity.enum.includes("released"), true);

const entries = new Map(catalog.products.map((product) => [product.productKey, product]));
const directories = await readdir(join(rootPath, "products"), { withFileTypes: true });
let checked = 0;
const allowedMaturity = schema.properties.maturity.enum;
const allowedRights = schema.properties.rights.properties.status.enum;
const allowedScan = schema.properties.security.properties.scanStatus.enum;
const keyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const commitPattern = /^[a-f0-9]{40}$/;
const repoPattern = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

function requireString(value, label, max = 2048) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.length > 0 && value.length <= max, `${label} must be non-empty and <= ${max} characters`);
}
function exactKeys(value, keys, label) {
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label} has missing or unexpected fields`);
}

for (const directory of directories.filter((entry) => entry.isDirectory())) {
  const manifestPath = join(rootPath, "products", directory.name, "product.manifest.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") continue;
    throw error;
  }
  checked += 1;
  exactKeys(manifest, schema.required, `${directory.name} manifest`);
  assert.equal(manifest.schemaVersion, 1);
  assert.match(manifest.productKey, keyPattern);
  assert.equal(directory.name, manifest.productKey, "workspace directory must match its canonical productKey");
  const planned = entries.get(manifest.productKey);
  assert.ok(planned, `manifest key ${manifest.productKey} must exist in the canonical catalogue`);
  assert.equal(manifest.name, planned.name);
  assert.equal(manifest.tier, planned.tier);
  assert.equal(manifest.kind, planned.kind);
  assert.ok(allowedMaturity.includes(manifest.maturity));
  exactKeys(manifest.source, ["repository", "commit"], "source");
  assert.match(manifest.source.repository, repoPattern);
  assert.ok(manifest.source.commit === null || commitPattern.test(manifest.source.commit), "source.commit must be null or a full immutable SHA");
  exactKeys(manifest.runtime, ["framework", "version"], "runtime");
  requireString(manifest.runtime.framework, "runtime.framework", 100);
  requireString(manifest.runtime.version, "runtime.version", 100);
  exactKeys(manifest.commands, ["build", "test", "lint", "typecheck"], "commands");
  for (const [name, command] of Object.entries(manifest.commands)) requireString(command, `commands.${name}`, 300);
  assert.equal(typeof manifest.compatibility, "object");
  assert.ok(manifest.compatibility !== null && !Array.isArray(manifest.compatibility));
  exactKeys(manifest.license, ["licenseType", "thirdPartyNotices"], "license");
  requireString(manifest.license.licenseType, "license.licenseType", 100);
  requireString(manifest.license.thirdPartyNotices, "license.thirdPartyNotices", 2048);
  exactKeys(manifest.rights, ["status", "evidenceReference"], "rights");
  assert.ok(allowedRights.includes(manifest.rights.status));
  assert.ok(manifest.rights.evidenceReference === null || typeof manifest.rights.evidenceReference === "string");
  exactKeys(manifest.security, ["dataClassification", "threatModel", "scanStatus"], "security");
  assert.ok(schema.properties.security.properties.dataClassification.enum.includes(manifest.security.dataClassification));
  requireString(manifest.security.threatModel, "security.threatModel", 2048);
  assert.ok(allowedScan.includes(manifest.security.scanStatus));

  if (manifest.maturity === "released") {
    assert.match(manifest.source.commit ?? "", commitPattern, "released products require an immutable source commit");
    assert.equal(manifest.rights.status, "verified", "released products require verified rights");
    assert.equal(manifest.security.scanStatus, "passed", "released products require a passed security scan");
  }
}
console.log(`Product manifest validation passed: ${checked} admitted workspace(s); release gates enforced.`);
