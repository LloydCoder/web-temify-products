import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const catalogPath = resolve(root, "catalog/products.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const productDirectories = new Set((await readdir(resolve(root, "products"), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory()).map((entry) => entry.name));

assert.equal(catalog.products.length, 43, "registry requires exactly 43 core catalogue entries");
assert.equal(catalog.products.filter((entry) => entry.kind === "standalone").length, 39);
assert.equal(catalog.products.filter((entry) => entry.kind === "launch-kit").length, 4);
assert.equal(new Set(catalog.products.map((entry) => entry.productKey)).size, 43);

const entries = [];
for (const product of catalog.products) {
  const key = product.productKey;
  assert.match(key, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  const entry = {
    sequence: product.sequence,
    productKey: key,
    name: product.name,
    tier: product.tier,
    kind: product.kind,
    catalogueStatus: product.status,
    maturity: "planned",
    manifestPath: null,
    sourcePath: null,
    releaseEvidence: "not_available"
  };

  if (product.kind === "standalone") {
    const manifestPath = resolve(root, "products", key, "product.manifest.json");
    if (productDirectories.has(key)) {
      try {
        const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
        assert.equal(manifest.productKey, key, `workspace manifest key mismatch: ${key}`);
        assert.equal(manifest.name, product.name, `workspace manifest name mismatch: ${key}`);
        entry.maturity = manifest.maturity;
        entry.manifestPath = `products/${key}/product.manifest.json`;
        entry.sourcePath = `products/${key}`;
      } catch (error) {
        if (error?.code === "ENOENT") throw new Error(`Workspace ${key} exists but has no product.manifest.json`);
        throw error;
      }
    }
  } else {
    const manifestRelativePath = `kits/manifests/${key}.json`;
    try {
      const manifest = JSON.parse(await readFile(resolve(root, manifestRelativePath), "utf8"));
      assert.equal(manifest.kitKey, key, `launch-kit manifest key mismatch: ${key}`);
      assert.equal(manifest.name, product.name, `launch-kit manifest name mismatch: ${key}`);
      entry.maturity = manifest.maturity;
      entry.manifestPath = manifestRelativePath;
    } catch (error) {
      if (error?.code === "ENOENT") {
        entry.manifestPath = null;
      } else {
        throw error;
      }
    }
  }
  entries.push(entry);
}

const lock = {
  schemaVersion: 1,
  generatedFrom: "catalog/products.json",
  catalogueStatus: catalog.catalogueStatus,
  counts: {
    total: entries.length,
    standalone: entries.filter((entry) => entry.kind === "standalone").length,
    launchKits: entries.filter((entry) => entry.kind === "launch-kit").length,
    admittedStandaloneWorkspaces: entries.filter((entry) => entry.kind === "standalone" && entry.sourcePath !== null).length,
    manifestsPresent: entries.filter((entry) => entry.manifestPath !== null).length,
    released: entries.filter((entry) => entry.maturity === "released").length
  },
  entries
};
const serialized = JSON.stringify(lock, null, 2) + "\n";
const lockPath = resolve(root, "catalog/registry-lock.json");
if (checkOnly) {
  const current = await readFile(lockPath, "utf8");
  assert.equal(current, serialized, "registry lock is stale; run pnpm registry:generate and review the diff");
  console.log(`Registry lock is current: ${lock.counts.total} catalogue entries, ${lock.counts.admittedStandaloneWorkspaces} admitted standalone workspace(s), ${lock.counts.manifestsPresent} manifests.`);
} else {
  await writeFile(lockPath, serialized);
  console.log(`Generated registry lock: ${lock.counts.total} catalogue entries, ${lock.counts.admittedStandaloneWorkspaces} admitted standalone workspace(s), ${lock.counts.manifestsPresent} manifests.`);
}
