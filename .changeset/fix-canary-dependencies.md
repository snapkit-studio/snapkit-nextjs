---
"@snapkit-studio/core": patch
"@snapkit-studio/react": patch
"@snapkit-studio/nextjs": patch
---

Fix canary release dependency resolution

- Improve prepare-release script to handle canary versions correctly
- Ensure canary packages reference each other with exact versions
- Fix npm installation issues in test environments