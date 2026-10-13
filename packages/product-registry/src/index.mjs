const MATURITIES = new Set(["planned", "scaffolded", "in_development", "verification", "release_candidate", "released", "withdrawn"]);
const KINDS = new Set(["standalone", "launch-kit"]);

export function assertRegistryLock(registry) {
  if (!registry || typeof registry !== "object" || registry.schemaVersion !== 1) throw new TypeError("Unsupported registry lock schema version.");
  if (!Array.isArray(registry.entries) || !registry.counts || typeof registry.counts !== "object") throw new TypeError("Registry lock is missing entries or counts.");
  if (registry.counts.total !== registry.entries.length) throw new Error("Registry total count does not match entries.");
  const keys = new Set();
  const sequences = new Set();
  for (const entry of registry.entries) {
    if (!entry || typeof entry.productKey !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.productKey)) throw new TypeError("Registry entry has an invalid product key.");
    if (keys.has(entry.productKey)) throw new Error(`Duplicate product key: ${entry.productKey}`);
    keys.add(entry.productKey);
    if (!Number.isInteger(entry.sequence) || entry.sequence < 1 || sequences.has(entry.sequence)) throw new Error(`Invalid or duplicate sequence for ${entry.productKey}`);
    sequences.add(entry.sequence);
    if (!KINDS.has(entry.kind) || !MATURITIES.has(entry.maturity)) throw new TypeError(`Invalid kind or maturity for ${entry.productKey}`);
    if (entry.kind === "launch-kit" && entry.sourcePath !== null) throw new Error(`Launch kit ${entry.productKey} must compose products, not own a source workspace.`);
    if (entry.sourcePath !== null && entry.manifestPath === null) throw new Error(`Workspace ${entry.productKey} has no manifest path.`);
    if (entry.maturity === "released" && entry.releaseEvidence !== "available") throw new Error(`Released product ${entry.productKey} has no recorded release evidence.`);
  }
  const standalone = registry.entries.filter((entry) => entry.kind === "standalone").length;
  const launchKits = registry.entries.filter((entry) => entry.kind === "launch-kit").length;
  const admitted = registry.entries.filter((entry) => entry.kind === "standalone" && entry.sourcePath !== null).length;
  const manifests = registry.entries.filter((entry) => entry.manifestPath !== null).length;
  const released = registry.entries.filter((entry) => entry.maturity === "released").length;
  if (registry.counts.standalone !== standalone || registry.counts.launchKits !== launchKits || registry.counts.admittedStandaloneWorkspaces !== admitted || registry.counts.manifestsPresent !== manifests || registry.counts.released !== released) {
    throw new Error("Registry summary counts do not match registry entries.");
  }
  return registry;
}

export function listProducts(registry, filters = {}) {
  assertRegistryLock(registry);
  const query = typeof filters.query === "string" ? filters.query.trim().toLowerCase() : "";
  return registry.entries.filter((entry) =>
    (filters.kind === undefined || entry.kind === filters.kind) &&
    (filters.tier === undefined || entry.tier === filters.tier) &&
    (filters.maturity === undefined || entry.maturity === filters.maturity) &&
    (!query || entry.productKey.includes(query) || entry.name.toLowerCase().includes(query))
  );
}

export function getProductByKey(registry, productKey) {
  assertRegistryLock(registry);
  return registry.entries.find((entry) => entry.productKey === productKey);
}

export function getRegistrySummary(registry) {
  assertRegistryLock(registry);
  return Object.freeze({ ...registry.counts });
}
