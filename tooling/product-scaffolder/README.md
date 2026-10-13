# Product scaffolder

Run from the repository root:

`node scripts/scaffold-product.mjs --key example-product --name "Example Product" --tier "Tier 1" --kind standalone`

The generator refuses to overwrite an existing workspace and emits a Next.js App Router + TypeScript strict scaffold with a product manifest. It deliberately marks rights unverified, security not started and maturity scaffolded. It does not create a release candidate or imply production readiness.

After generating a product, review the output, update pnpm-lock.yaml with the approved workspace dependency graph, add the product to the canonical catalogue through review, and extend CI to test it. Launch kits must use the separate composition-manifest workflow.
