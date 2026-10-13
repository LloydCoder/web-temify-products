# Product lifecycle and release gates

## Source-of-truth boundary

This repository is the canonical source workspace and inventory for Web-Temify products. The marketplace repository owns public listings, customer accounts, checkout, orders, payments, refunds, entitlements, downloads, seller operations and customer-facing authorization. This repository owns product source, build/test definitions, product manifests, release artifacts and product-specific engineering evidence.

A catalogue row is planning metadata, not proof of an implementation. Do not expose a product as available for sale unless the release manifest links to an immutable source commit and artifact digest, the required checks pass, licensing/rights evidence is approved, security scanning passes, compatibility metadata is present, and a reviewer approves publication.

## Agreed build sequence

1. Tier 1: six standalone products.
2. Tier 4: four launch kits.
3. Tier 5: six standalone products.
4. Tier 2: twelve standalone products.
5. Tier 3: fifteen standalone products.

The canonical inventory contains 39 standalone products plus 4 launch kits. The 18 proposed additional candidates are out of scope until all core 43 entries have been implemented and validated.

## Product maturity states

- `planned`: intent only; no implementation claim.
- `scaffolded`: workspace exists but release criteria are not met.
- `in_development`: active implementation with CI evidence.
- `verification`: functional implementation exists; security, rights, compatibility and quality gates are still being evaluated.
- `release_candidate`: all automated gates pass; manual release approval remains.
- `released`: immutable artifact and source commit are recorded; rights and quality approvals are evidenced.
- `withdrawn`: removed from sale; historical release evidence is retained.

A state transition must be evidence-backed and reviewed. No script may promote a product to `released` based only on a successful build.

## Required product manifest at implementation time

Each product workspace must eventually include:
- immutable product key approved through catalogue governance;
- product name, tier, kind, owner/maintainer and support contact;
- source repository and exact commit;
- runtime/framework and supported version matrix;
- build, test, lint, typecheck and security-check commands;
- SBOM and dependency/license scan outputs;
- artifact digest (SHA-256), version, release timestamp and provenance;
- third-party asset/source attribution and rights declaration;
- compatibility matrix, known limitations and migration/upgrade notes;
- install, configure, operate, update and uninstall documentation;
- threat model, data-flow notes and secure defaults;
- evidence URLs/IDs for CI, review and release approval.

## Security-specific review

Crypto, financial, health, identity, pharmacy, crowdfunding, token/ICO, exchange and other high-impact products require separate jurisdiction, legal, threat-model and security review before release. Their presence in the catalogue does not authorize a launch or imply regulatory compliance. No real customer funds, real credentials, medical decisions or regulated transactions may be used in demo fixtures.


## Canonical product keys and first admitted workspace

The canonical inventory now assigns a unique `productKey` to every planned entry. Keys are lowercase kebab-case, stable across title copy edits, never recycled, and changed only through a reviewed migration. CI rejects missing or duplicate keys. The first admitted workspace is `courier-logistics-template` (Tier 1, sequence 1); its `scaffolded` maturity is explicit and must not be treated as release evidence. Development manifests may use a null source commit; a `released` manifest must bind to an immutable 40-character source commit, verified rights and a passed security scan.
