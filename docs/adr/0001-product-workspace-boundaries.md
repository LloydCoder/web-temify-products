# ADR 0001: Product workspace and platform boundaries

- Status: accepted
- Decision date: 2026-10-13

## Context

Web-Temify needs a maintainable portfolio of independently testable digital products while sharing verified contracts and components where reuse is real. The catalogue is the canonical planned inventory; it must not imply that planned products exist or are sellable.

## Decision

- Use TypeScript with strict checking and Next.js App Router for new web applications unless a documented archetype exception is approved.
- Use pnpm workspaces and Turborepo when the repo contains enough independent packages to justify task orchestration. Do not add empty packages or fake product workspaces merely to satisfy a directory diagram.
- Treat catalog/products.json as the canonical inventory. Product manifests describe implementation maturity and release evidence.
- Keep marketplace commerce and vendor operations outside product source workspaces.
- Integrate with Tinlance Agent System only through approved contracts. Do not duplicate its identity, authorization, policy, approval, runtime, secrets or audit boundary inside products.
- Launch kits compose product packages by manifest; they must not copy and fork product source.
- Do not mark a product released without immutable source commit, verified rights and passed security scan.

## Consequences

The target tree is a staged architecture, not a checklist to satisfy with placeholder files. Each package needs an owner, contract, tests, evidence and a demonstrated consumer before it is promoted to shared infrastructure.
