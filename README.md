# Web-Temify Products

The dedicated source workspace and canonical planning inventory for Web-Temify's digital products and launch kits.

## Current status

The initial catalogue contains **43 planned entries**: 39 standalone products and 4 launch kits. All entries remain `planned`. This repository bootstrap does not mean any product has been implemented, built, security-tested, rights-verified or released.

The 18 additional product candidates are intentionally excluded until the core 43 are completed and validated.

## Canonical files
- `catalog/products.json`: canonical inventory and agreed tier order.
- `docs/product-lifecycle.md`: product maturity, release evidence and review gates.
- `docs/architecture.md`: repository boundaries and marketplace/Tinlance contracts.
- `products/`: product workspaces admitted only after their source and release contracts are approved.
- `scripts/validate-catalog.mjs`: deterministic inventory validation.

## Required checks
- Node.js 22+
- `node scripts/validate-catalog.mjs`
- `pnpm install --frozen-lockfile`
- `pnpm catalog:validate`

## Repository boundaries

The marketplace application lives in [LloydCoder/web-temify](https://github.com/LloydCoder/web-temify). It owns public listings, accounts, checkout, orders, payments, refunds, entitlements, licenses, downloads and seller operations. This repository owns product source, manifests, build/test contracts, release artifacts and product-specific engineering evidence.

A product becomes eligible for marketplace publication only after immutable artifact and source evidence, verified rights, compatibility metadata, required security scans, passing product CI and explicit release approval are recorded.
