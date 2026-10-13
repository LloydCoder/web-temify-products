# Contributing

## Before opening a pull request

1. Keep changes scoped and independently reviewable.
2. Preserve stable catalogue keys; key changes require an explicit migration.
3. Update manifests, schemas, docs and tests together.
4. Run the same checks as CI: pnpm install --frozen-lockfile, pnpm catalog:validate, pnpm products:check, node --test tests/*.test.mjs.
5. Do not commit secrets, generated credentials, customer data or assets without rights evidence.
6. Do not advance product maturity without required evidence and approval.
7. Do not add empty shared packages. Add shared code only when reuse is demonstrated and a contract/test owner exists.

## Pull request policy

All required checks must pass on the exact proposed head. Security-sensitive, schema, catalogue and release-gate changes require owner review. Publishing, changing prices, granting entitlements and other marketplace financial operations are outside this repository's scope.
