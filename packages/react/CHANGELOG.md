# @snapkit-studio/react

## 1.7.3

### Patch Changes

- 3e7e59b: Fix canary release dependency resolution
  - Improve prepare-release script to handle canary versions correctly
  - Ensure canary packages reference each other with exact versions
  - Fix npm installation issues in test environments

- 531635d: Test canary release process
- Updated dependencies [3e7e59b]
- Updated dependencies [531635d]
  - @snapkit-studio/core@1.9.2

## 1.7.2

### Patch Changes

- ad0579e: feat(react): add enhanced image loading optimization for React components
  - Improve loading performance for React image components
  - Add better error handling for failed image loads
  - Optimize re-render performance for dynamic image sources
  - Test individual package release workflow

  This changeset tests selective package updating in the automated release workflow.

## 1.7.1

### Patch Changes

- 471cffd: test: verify automated release workflow improvements

  This changeset tests the complete automation of the release workflow including:
  - Git tag creation and push
  - GitHub release generation
  - NPM and GitHub Package Registry deployment
  - Prerelease version filtering

  All packages should be bumped to test the improved CI/CD pipeline.

- Updated dependencies [471cffd]
  - @snapkit-studio/core@1.9.1

## 1.7.0

### Patch Changes

- fix(ci): improve GitHub Package Registry publishing to skip prerelease versions
  - Add version filtering to only publish stable releases to GitHub Package Registry
  - Skip prerelease versions (canary, alpha, beta) with clear logging messages
  - Prevent 409 Conflict errors when attempting to republish existing prerelease versions
  - Improve deployment logging with version information and skip reasons

- Updated dependencies
  - @snapkit-studio/core@1.9.0
