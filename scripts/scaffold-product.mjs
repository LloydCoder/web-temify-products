import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i += 1) {
  if (!args[i].startsWith("--")) throw new Error(`Unexpected argument: ${args[i]}`);
  const key = args[i].slice(2);
  const value = args[i + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
  options[key] = value;
  i += 1;
}

const { key, name, tier = "Tier 1", kind = "standalone" } = options;
if (!key || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) throw new Error("Provide --key as lowercase kebab-case.");
if (!name || name.trim().length < 2 || name.length > 180) throw new Error("Provide --name between 2 and 180 characters.");
if (!["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"].includes(tier)) throw new Error("Unsupported --tier.");
if (!["standalone", "launch-kit"].includes(kind)) throw new Error("Unsupported --kind.");
if (kind !== "standalone") throw new Error("Launch kits must use a kit manifest and composition workflow, not a standalone app scaffold.");

const escapeJsx = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const root = resolve(process.cwd(), "products", key);
const files = new Map([
  ["package.json", JSON.stringify({
    name: `@web-temify/${key}`, version: "0.1.0", private: true,
    scripts: { dev: "next dev", build: "next build", start: "next start", lint: "eslint .", typecheck: "tsc --noEmit", test: "node --test tests/*.test.mjs" },
    dependencies: { next: "16.4.0", react: "^19.2.0", "react-dom": "^19.2.0" },
    devDependencies: { "@types/node": "^22.0.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0", eslint: "^9.0.0", "eslint-config-next": "16.4.0", typescript: "^5.9.0" }
  }, null, 2) + "\n"],
  ["tsconfig.json", JSON.stringify({ compilerOptions: { target: "ES2022", lib: ["dom", "dom.iterable", "esnext"], allowJs: false, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, plugins: [{ name: "next" }], paths: { "@/*": ["./src/*"] } }, include: ["next-env.d.ts", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "src/**/*.ts", "src/**/*.tsx"], exclude: ["node_modules"] }, null, 2) + "\n"],
  ["next.config.ts", "import type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  poweredByHeader: false,\n};\n\nexport default nextConfig;\n"],
  ["eslint.config.mjs", "import { defineConfig, globalIgnores } from \"eslint/config\";\nimport nextVitals from \"eslint-config-next/core-web-vitals\";\nimport nextTs from \"eslint-config-next/typescript\";\n\nexport default defineConfig([\n  ...nextVitals,\n  ...nextTs,\n  globalIgnores([\".next/**\", \"out/**\", \"build/**\", \"next-env.d.ts\"]),\n]);\n"],
  ["src/app/layout.tsx", `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: ${JSON.stringify(name)},
  description: "A Web-Temify product scaffold. Replace this copy before release.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`],
  ["src/app/page.tsx", `export default function HomePage() {
  return (
    <main>
      <p className="eyebrow">Web-Temify · ${key}</p>
      <h1>${escapeJsx(name)}</h1>
      <p>This is a development scaffold, not a released product.</p>
    </main>
  );
}
`],
  ["src/app/globals.css", ":root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #f7f8fa; color: #17202a; }\n* { box-sizing: border-box; }\nbody { margin: 0; }\nmain { max-width: 70rem; margin: 0 auto; padding: clamp(2rem, 7vw, 7rem) 1.5rem; }\nh1 { max-width: 18ch; font-size: clamp(2.5rem, 7vw, 5rem); line-height: 1.04; letter-spacing: -.04em; }\np { max-width: 65ch; line-height: 1.7; }\n.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; font-weight: 700; }\n"],
  ["src/app/not-found.tsx", "export default function NotFound() { return <main><h1>Not found</h1><p>The requested page does not exist.</p></main>; }\n"],
  ["src/app/error.tsx", "\"use client\";\n\nimport { useEffect } from \"react\";\n\nexport default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {\n  useEffect(() => { console.error(error); }, [error]);\n  return <main><h1>Something went wrong</h1><p>We could not complete this request.</p><button onClick={() => reset()}>Try again</button></main>;\n}\n"],
  ["tests/scaffold.test.mjs", "import test from \"node:test\";\nimport assert from \"node:assert/strict\";\nimport { readFile } from \"node:fs/promises\";\n\ntest(\"product scaffold page is present\", async () => {\n  const page = await readFile(new URL(\"../src/app/page.tsx\", import.meta.url), \"utf8\");\n  assert.match(page, /development scaffold/);\n});\n"],
  ["README.md", "# " + name + "\n\n**Maturity: scaffolded — not a released product.**\n\n## Development\n\n- Install workspace dependencies from the repository root with pnpm.\n- Run pnpm --filter @web-temify/" + key + " dev for local development.\n- Run pnpm --filter @web-temify/" + key + " lint, typecheck, test and build before proposing changes.\n\n## Release blockers\n\nThe product manifest is deliberately unverified. Before release, replace placeholder copy and UI, complete product-specific features, verify rights and third-party notices, run security and accessibility testing, document privacy/data handling, attach immutable source and build evidence, and obtain required approvals. Never change maturity to released to make a dashboard appear complete.\n"],
  [".env.example", "# Add only documented, non-secret variable names here. Never commit credentials.\n"],
  ["product.manifest.json", JSON.stringify({
    schemaVersion: 1, productKey: key, name, tier, kind: "standalone", maturity: "scaffolded",
    source: { repository: "https://github.com/LloydCoder/web-temify-products", commit: null },
    runtime: { framework: "Next.js App Router", version: "16.4.0" },
    commands: { build: "pnpm build", test: "pnpm test", lint: "pnpm lint", typecheck: "pnpm typecheck" },
    compatibility: { node: ">=22.0.0", packageManager: "pnpm@10.18.0" },
    license: { licenseType: "pending-approval", thirdPartyNotices: "Pending product-specific rights and dependency review." },
    rights: { status: "unverified", evidenceReference: null },
    security: { dataClassification: "public", threatModel: "Product-specific threat model is required before release.", scanStatus: "not_started" }
  }, null, 2) + "\n"]
]);

try {
  await mkdir(root, { recursive: false });
} catch (error) {
  if (error?.code === "EEXIST") throw new Error(`Refusing to overwrite existing workspace: products/${key}`);
  throw error;
}
try {
  for (const [relativePath, content] of files) {
    const destination = resolve(root, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, content, { flag: "wx" });
  }
  console.log(`Created scaffolded workspace products/${key}. Update the pnpm lockfile and review all generated files before admitting it.`);
} catch (error) {
  console.error(`Scaffolding failed after creating products/${key}. Inspect and remove the partial directory before retrying.`);
  throw error;
}
