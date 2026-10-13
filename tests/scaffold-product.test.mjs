import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generator = resolve(repositoryRoot, "scripts/scaffold-product.mjs");

test("scaffolder emits a strict Next.js workspace and conservative release manifest", async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), "web-temify-scaffold-"));
  try {
    await mkdir(resolve(temporary, "products"));
    const result = spawnSync(process.execPath, [generator, "--key", "example-product", "--name", "R&D <script>", "--tier", "Tier 1"], { cwd: temporary, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const workspace = resolve(temporary, "products/example-product");
    const [page, tsconfig, manifest, packageJson] = await Promise.all([
      readFile(resolve(workspace, "src/app/page.tsx"), "utf8"),
      readFile(resolve(workspace, "tsconfig.json"), "utf8").then(JSON.parse),
      readFile(resolve(workspace, "product.manifest.json"), "utf8").then(JSON.parse),
      readFile(resolve(workspace, "package.json"), "utf8").then(JSON.parse)
    ]);
    assert.match(page, /R&amp;D &lt;script&gt;/);
    assert.equal(tsconfig.compilerOptions.strict, true);
    assert.equal(packageJson.dependencies.next, "16.4.0");
    assert.equal(manifest.maturity, "scaffolded");
    assert.equal(manifest.rights.status, "unverified");
    assert.equal(manifest.security.scanStatus, "not_started");
    assert.equal(manifest.source.commit, null);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("scaffolder refuses overwrites and launch-kit misuse", async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), "web-temify-scaffold-"));
  try {
    await mkdir(resolve(temporary, "products"), { recursive: true });
    await mkdir(resolve(temporary, "products/existing"));
    const overwrite = spawnSync(process.execPath, [generator, "--key", "existing", "--name", "Existing Product"], { cwd: temporary, encoding: "utf8" });
    assert.notEqual(overwrite.status, 0);
    assert.match(overwrite.stderr, /Refusing to overwrite/);
    const kit = spawnSync(process.execPath, [generator, "--key", "some-kit", "--name", "Some Kit", "--kind", "launch-kit"], { cwd: temporary, encoding: "utf8" });
    assert.notEqual(kit.status, 0);
    assert.match(kit.stderr, /Launch kits must use a kit manifest/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
