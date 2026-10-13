import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { assertRegistryLock, getProductByKey, getRegistrySummary, listProducts } from "../src/index.mjs";

const registry = JSON.parse(await readFile(new URL("../../../catalog/registry-lock.json", import.meta.url), "utf8"));

test("validates canonical inventory and reports honest maturity", () => {
  assert.equal(assertRegistryLock(registry), registry);
  const summary = getRegistrySummary(registry);
  assert.equal(summary.total, 43);
  assert.equal(summary.standalone, 39);
  assert.equal(summary.launchKits, 4);
  assert.equal(summary.admittedStandaloneWorkspaces, 1);
  assert.equal(summary.manifestsPresent, 5);
  assert.equal(summary.released, 0);
});

test("queries planned products without implying they are implemented", () => {
  assert.equal(getProductByKey(registry, "courier-logistics-template").maturity, "scaffolded");
  assert.equal(getProductByKey(registry, "loan-lending-template").sourcePath, null);
  assert.equal(listProducts(registry, { kind: "launch-kit" }).length, 4);
  assert.equal(listProducts(registry, { query: "courier" }).length, 1);
});

test("rejects duplicate keys and release claims without evidence", () => {
  const duplicate = structuredClone(registry);
  duplicate.entries[1].productKey = duplicate.entries[0].productKey;
  assert.throws(() => assertRegistryLock(duplicate), /Duplicate product key/);
  const unsupportedRelease = structuredClone(registry);
  unsupportedRelease.entries[0].maturity = "released";
  assert.throws(() => assertRegistryLock(unsupportedRelease), /no recorded release evidence/);
});
