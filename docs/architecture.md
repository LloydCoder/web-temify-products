# Product monorepo architecture

## Repository responsibilities

- `catalog/products.json`: canonical 43-entry planning inventory and tier order.
- `products/<approved-product-key>/`: product-specific source workspaces, created only after a canonical key is approved.
- `packages/*`: reusable foundations with explicit API/versioning and dependency policies.
- `schemas/`: versioned manifest, catalogue, kit, dependency, pricing and release-evidence schemas.
- `scripts/`: deterministic validation and packaging helpers.
- `docs/`: lifecycle, engineering, security, support and release policies.
- `.github/workflows/`: CI and release checks.

Do not copy independent products from their authoritative upstream repositories into this monorepo without an explicit migration decision. For an existing external source repository, record the canonical upstream, pinned commit and artifact provenance instead.

## Cross-repository contract

The marketplace consumes only versioned, reviewed release metadata and immutable artifacts. It must not read arbitrary source branches, run product code inside the marketplace process, trust client-supplied artifact URLs, or infer a release from a product name.

The marketplace remains the authority for publication, price, orders, payments, refunds, licenses, entitlements and downloads. Tinlance Agent System can prepare code changes and evidence within approved capability scopes, but cannot autonomously publish products, change prices, grant entitlements, refund customers or release funds.

## Build isolation

Product builds run in CI with least-privilege permissions, pinned dependencies where practical, no production secrets, constrained resource/time limits, and no network access unless the build explicitly requires allowlisted access. Untrusted archives and generated code must be scanned and unpacked defensively. Build artifacts are immutable and content-addressed.

## Monorepo maturity

The initial repository bootstrap validates inventory consistency only. It is not a product build pipeline and does not imply any of the 43 products has source code, passed tests, verified rights or a releasable artifact. Product-specific workspaces and release workflows are introduced incrementally and must pass their own gates.

## Enterprise architecture policy

New web products default to TypeScript with strict type checking and Next.js App Router unless a documented archetype exception is approved. Use pnpm workspaces; introduce Turborepo when real multi-package task dependencies justify caching and orchestration. Do not create empty packages to imitate a target tree.

The product source workspace does not own marketplace accounts, checkout, payments, vendor operations or customer licence workflows. Tinlance Agent System remains the governed execution boundary for agent identity, authorization, policy, approvals, runtime, tools, secrets, audit and evidence. Products integrate through approved contracts rather than cloning those controls.

Launch kits compose versioned product packages through manifests and compatibility tests; they must not copy and fork product source. Catalogue membership, a scaffolded site, or a green build is not release evidence. Public release requires an immutable source commit, verified rights, passed security review, test and accessibility evidence, dependency/licence review, SBOM and approval record.
