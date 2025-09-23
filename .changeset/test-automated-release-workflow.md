---
"@snapkit-studio/core": patch
"@snapkit-studio/react": patch  
"@snapkit-studio/nextjs": patch
---

test: verify automated release workflow improvements

This changeset tests the complete automation of the release workflow including:
- Git tag creation and push
- GitHub release generation  
- NPM and GitHub Package Registry deployment
- Prerelease version filtering

All packages should be bumped to test the improved CI/CD pipeline.

