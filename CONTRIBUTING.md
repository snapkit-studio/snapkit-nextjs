# Contributing to Snapkit Studio

[![English](https://img.shields.io/badge/docs-English-blue)](./CONTRIBUTING.md) [![한국어](https://img.shields.io/badge/docs-한국어-blue)](./CONTRIBUTING-ko.md)

We love your input! We want to make contributing to Snapkit Studio monorepo as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/web.git
cd web

# Add upstream remote
git remote add upstream https://github.com/snapkit-studio/web.git
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Git Commit Template (Optional)

```bash
git config commit.template .gitmessage
```

## Project Structure

This is a monorepo containing multiple packages for the Snapkit image optimization ecosystem:

### Packages
- **`@snapkit-studio/core`**: Core image transformation and URL building utilities
- **`@snapkit-studio/nextjs`**: Next.js Image component integration with App Router support
- **`@snapkit-studio/react`**: React image components with automatic optimization

### Applications
- **`apps/nextjs-demo`**: Demo application showcasing Next.js integration
- **`apps/react-demo`**: Demo application showcasing React integration

### System Requirements
- Node.js >= 22.0.0
- pnpm >= 10.0.0
- Git >= 2.28.0

## Development Workflow

### Setting Up Your Local Environment

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build all packages**:
   ```bash
   pnpm build
   ```

3. **Run tests**:
   ```bash
   # All tests
   pnpm test

   # Specific package
   pnpm --filter @snapkit-studio/core test
   ```

4. **Start development**:
   ```bash
   # Start all dev servers
   pnpm dev

   # Start specific demo app
   pnpm --filter react-demo dev
   pnpm --filter nextjs-demo dev
   ```

5. **Run type checking**:
   ```bash
   pnpm check-types
   ```

6. **Run linting**:
   ```bash
   pnpm lint
   ```

### Workspace Protocol Guidelines

#### ⚠️ Important: Package Dependencies

When working with package dependencies in our monorepo, it's crucial to understand the difference between development and production dependencies:

1. **Development Dependencies (devDependencies)**
   - ✅ CAN use `workspace:*` protocol for internal packages
   - Example: `"@repo/eslint-config": "workspace:*"`
   - These are NOT included when the package is published to npm

2. **Production Dependencies (dependencies, peerDependencies, optionalDependencies)**
   - ❌ MUST NOT use `workspace:*` protocol
   - ✅ MUST use specific version numbers
   - Example: `"@snapkit-studio/core": "^1.6.0"` (NOT `"workspace:*"`)

#### Why This Matters

When packages are published to npm with `workspace:*` references in production dependencies, external users will encounter the error:
```
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

#### Automatic Validation

We have multiple layers of protection to prevent workspace protocol issues:

1. **Pre-commit Hook**: Validates package.json files before commit
2. **Build-time Check**: tsup validates during package build
3. **PR Checks**: GitHub Actions validates all packages
4. **Deployment Check**: Final validation before npm publish

#### How to Fix Workspace References

If you accidentally add a workspace reference to a production dependency:

```json
// ❌ Wrong
"dependencies": {
  "@snapkit-studio/core": "workspace:*"
}

// ✅ Correct
"dependencies": {
  "@snapkit-studio/core": "^1.6.0"
}
```

Run the validation script manually:
```bash
node scripts/check-workspace-refs.js packages/*/package.json
```

### Making Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for your changes if applicable

4. **Ensure all tests pass**:
   ```bash
   pnpm test
   pnpm check-types
   pnpm lint
   ```

### Committing Changes

We use [Conventional Commits](https://conventionalcommits.org/) for consistent commit messages and automated versioning.

#### Using Commitizen (Recommended)

```bash
# Interactive commit with guided prompts
pnpm commit
```

#### Manual Commit Format

```
type[optional scope]: description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```bash
feat: add image compression options
fix: resolve TypeScript compilation errors
docs: update README with new API examples
test: add unit tests for image transformation
```

**Breaking Changes:**
For breaking changes, add `BREAKING CHANGE:` in the commit body or use `!` after the type:

```bash
feat!: change default compression quality to 80
```

## Pull Request Process

1. **Update your fork**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Push your changes**:
   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request** on GitHub

4. **Fill out the PR template** completely

5. **Ensure CI passes** - All tests, linting, and type checking must pass

6. **Wait for review** - A maintainer will review your PR

### PR Requirements

- [ ] All tests pass
- [ ] Code follows our style guidelines
- [ ] Self-review of the code
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (unless intentional and documented)
- [ ] Conventional commit messages used

## Package-Specific Guidelines

### @snapkit-studio/core
- Core transformation logic for image optimization
- Browser compatibility utilities
- URL building and parameter management
- **Testing**: Focus on transformation accuracy and URL generation

### @snapkit-studio/nextjs
- Next.js Image component integration
- App Router and Pages Router support
- SSR/SSG compatibility
- **Testing**: Ensure both router types work correctly

### @snapkit-studio/react
- Pure React image components
- Framework-agnostic implementation
- Client-side optimization
- **Testing**: Browser compatibility and React version support

## Code Style Guidelines

### TypeScript

- Use TypeScript for all code
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use strict mode settings

### Formatting

- We use Prettier for code formatting
- Run `pnpm lint` to auto-fix formatting issues
- 2 spaces for indentation
- Trailing commas where valid
- Single quotes for strings

### Testing

- Write tests for new features and bug fixes
- Use descriptive test names
- Group related tests with `describe` blocks
- Use Vitest for testing

Example:
```typescript
describe('Image component', () => {
  it('should render with correct src attribute', () => {
    // Test implementation
  });

  it('should apply compression settings', () => {
    // Test implementation
  });
});
```

## Release Process

This project uses semantic versioning and automated releases:

1. **Conventional commits** determine version bumps automatically
2. **CI/CD pipeline** handles building and testing
3. **Semantic Release** creates releases and publishes to npm
4. **Changelog** is generated automatically

### Version Bumps

- `fix:` → patch release (1.0.0 → 1.0.1)
- `feat:` → minor release (1.0.0 → 1.1.0)
- `feat!:` or `BREAKING CHANGE:` → major release (1.0.0 → 2.0.0)

## Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and general discussion
- **Documentation**: Check the README and inline documentation

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Recognition

Contributors are automatically added to our README and releases. We appreciate all contributions, big and small!

---

Thank you for contributing to Snapkit Studio! 🚀