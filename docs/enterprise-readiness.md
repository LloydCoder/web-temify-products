# Enterprise readiness and release gates

This repository is the product source workspace, not the Web-Temify marketplace runtime. The marketplace owns accounts, catalogue presentation, checkout, orders, vendor operations and customer-facing licence workflows. Tinlance Agent System remains the governed execution boundary for agent identity, authorization, policy, approvals, runtime, tools, secrets, audit and evidence.

## Non-negotiable release rule

Catalogue membership and a green scaffold build are not release evidence. A product must not be marketed as production-ready until its immutable source commit, automated test evidence, security assessment, rights evidence, third-party notices, accessibility evidence, supported runtime, release artifact and accountable approval are recorded.

## Current implementation boundary

The canonical catalogue tracks 43 planned entries (39 standalone products and four launch kits). Only workspaces with committed source and manifests are admitted. Do not generate empty packages solely to imitate the target directory tree. Shared packages are added only after demonstrated reuse and an explicit public contract.

## Required gates

1. Inventory integrity: stable unique product keys, exact 39/4 counts, tier ordering and no planned entry represented as shipped.
2. Manifest integrity: workspace directory, manifest, catalogue and product metadata agree.
3. Schema integrity: schemas are parseable and versioned; production adoption must use a standards-compliant JSON Schema 2020-12 validator and positive/negative fixtures.
4. Engineering quality: reproducible install, lint, typecheck, unit/integration/e2e tests as applicable, accessibility checks and production build.
5. Supply chain: dependency and licence review, secret scanning, SAST, dependency updates, SBOM and artifact provenance.
6. Rights and safety: rights evidence, third-party notices, product-specific threat model, privacy review and any jurisdiction-specific legal review.
7. Release integrity: immutable commit, traceable artifact, release notes, rollback instructions and approval evidence.

Financial services, crypto, identity, healthcare, pharmacy, crowdfunding, tokens/ICO, exchange, and other regulated or high-impact products require separate threat modelling, legal/jurisdiction review and domain-specific controls. A template is not a compliant financial, medical, identity or regulated transaction system.

This document describes target policy, not a claim that all gates or all 43 products are implemented. Track evidence in pull requests and CI; never infer production readiness from directory presence alone.
