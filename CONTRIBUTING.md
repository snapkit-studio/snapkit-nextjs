# Contributing to @snapkit/nextjs

[![English](https://img.shields.io/badge/docs-English-blue)](./CONTRIBUTING.md) [![한국어](https://img.shields.io/badge/docs-한국어-blue)](./CONTRIBUTING-ko.md)

We love your input! We want to make contributing to @snapkit/nextjs as easy and transparent as possible, whether it's:

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
git clone https://github.com/YOUR_USERNAME/snapkit-nextjs.git
cd snapkit-nextjs

# Add upstream remote
git remote add upstream https://github.com/snapkit/snapkit-nextjs.git
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Git Commit Template (Optional)

```bash
git config commit.template .gitmessage
```

## Development Workflow

### Setting Up Your Local Environment

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run tests**:
   ```bash
   pnpm test
   ```

3. **Start development**:
   ```bash
   pnpm dev
   ```

4. **Run type checking**:
   ```bash
   pnpm check-types
   ```

5. **Run linting**:
   ```bash
   pnpm lint
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

Thank you for contributing to @snapkit/nextjs! 🚀