# Pull Request

## Important: PR Title Format

**Your PR title MUST follow Conventional Commits format:**

```
<type>[optional scope]: <description>
```

**Examples:**

- `feat(core): add utility functions for image optimization`
- `fix(react): resolve image loading issue in Safari`
- `docs: update installation guide`
- `feat!: change API response format` (breaking change)

**Common Types:**

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring without functionality changes
- `test:` - Adding or updating tests
- `chore:` - Build process, dependencies, or tooling changes
- `feat!:` or `fix!:` - Breaking changes (major version bump)

**Why this matters:** We use squash merge, so your PR title becomes the final commit message that GitHub Actions uses for automatic versioning and package-specific releases.

## Summary

<!-- Briefly describe what this PR accomplishes -->

-
-
-

## Type of Change

<!-- Mark the appropriate box with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style change (formatting, missing semi colons, etc; no code change)
- [ ] ♻️ Refactor (no functional changes, no api changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update
- [ ] 🔧 Build or CI change

## Changes Made

<!-- Describe the changes in detail -->

### Added

-

### Changed

-

### Removed

-

## Testing

<!-- Describe how you tested your changes -->

- [ ] All existing tests pass (`pnpm test`)
- [ ] Type checking passes (`pnpm check-types`)
- [ ] Linting passes (`pnpm lint`)
- [ ] New tests added for new functionality
- [ ] Manual testing completed

### Test Plan

<!-- Checklist of manual testing steps -->

- [ ]
- [ ]
- [ ]

## Breaking Changes

<!-- If this is a breaking change, describe what users need to know -->

<!-- Remove this section if not applicable -->

## Documentation

- [ ] Updated relevant documentation
- [ ] Added/updated code comments
- [ ] Updated README if needed

## Checklist

<!-- Ensure all requirements from CONTRIBUTING.md are met -->

- [ ] **PR title follows conventional commits format** (see format guide above)
- [ ] All tests pass (`pnpm test`)
- [ ] Type checking passes (`pnpm check-types`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Code follows our style guidelines
- [ ] Self-review of the code
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (unless intentional and documented)
- [ ] Conventional commit messages used in individual commits

## Screenshots (if applicable)

<!-- Add screenshots or GIFs to demonstrate visual changes -->

## Additional Notes

<!-- Any additional information or context for reviewers -->
