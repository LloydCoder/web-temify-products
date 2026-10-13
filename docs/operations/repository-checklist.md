# Repository operations checklist

## Pull requests
- [ ] Scope is reviewable and independently revertible.
- [ ] Catalogue, manifests, schemas and documentation agree.
- [ ] Positive and negative tests cover new invariants.
- [ ] CI passes on the exact proposed head SHA.
- [ ] Rights and third-party assets are documented.
- [ ] No credentials or customer data are included.
- [ ] High-impact product risk and regulatory applicability are reviewed.
- [ ] Release status is not advanced without evidence.

## Release
- [ ] Immutable source commit and artifact digest recorded.
- [ ] Tests, security, licence, accessibility and SBOM evidence retained.
- [ ] Release notes, migration/rollback instructions and support owner documented.
- [ ] Required review and approval evidence attached.
- [ ] Rollback path tested.

This checklist is a control record template, not evidence that any individual release passed.
