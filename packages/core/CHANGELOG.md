# @snapkit-studio/core

## 1.9.1

### Patch Changes

- 471cffd: test: verify automated release workflow improvements

  This changeset tests the complete automation of the release workflow including:
  - Git tag creation and push
  - GitHub release generation
  - NPM and GitHub Package Registry deployment
  - Prerelease version filtering

  All packages should be bumped to test the improved CI/CD pipeline.

## 1.9.0

### Patch Changes

- fix(ci): improve GitHub Package Registry publishing to skip prerelease versions
  - Add version filtering to only publish stable releases to GitHub Package Registry
  - Skip prerelease versions (canary, alpha, beta) with clear logging messages
  - Prevent 409 Conflict errors when attempting to republish existing prerelease versions
  - Improve deployment logging with version information and skip reasons
