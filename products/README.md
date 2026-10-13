# Product workspaces

This directory starts intentionally empty. Add a product workspace only when:
1. the canonical catalogue entry is selected by the agreed tier order;
2. its product key and source-of-truth repository are approved;
3. the workspace has a maintainable build/test contract;
4. rights, compatibility and risk classification are documented;
5. no credentials, customer data or production secrets are embedded in fixtures;
6. CI can build and test the product in an isolated environment.

Do not create placeholder applications solely to make the repository appear complete. The goal is verified product quality, not directory count.
