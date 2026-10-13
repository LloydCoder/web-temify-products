# Supply-chain security baseline

## Workflow policy

- Set minimum permissions at workflow/job level; use read-only permissions unless a job requires writes.
- Set persist-credentials to false for checkout jobs that do not push commits.
- Pin third-party GitHub Actions to verified full-length commit SHAs. Version tags are mutable and are not immutable dependencies.
- Avoid executing untrusted pull-request code with repository secrets or write permissions.
- Use timeouts and concurrency cancellation to bound resource use.
- Keep release and publishing credentials out of ordinary CI.

## Required controls before public releases

- Secret-value scanning, not only secret-like filename detection.
- Dependency vulnerability scanning and reviewed lockfile changes.
- SAST and secure coding checks appropriate to each runtime.
- Licence policy and third-party notice generation.
- SBOM and build provenance attached to the exact release artifact.
- Release attestations and retained test/security evidence.

A missing scanner, unconfigured repository policy, unavailable check, or failed scan is not a pass. Record unknowns explicitly. Do not mark security status passed without evidence from applicable checks and review.
