#!/bin/bash

set -e

echo "🚀 Local Package Publishing"
echo "============================"

# Parse command line arguments
PACKAGE=""
VERSION=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --package=*)
      PACKAGE="${1#*=}"
      shift
      ;;
    --version=*)
      VERSION="${1#*=}"
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 --package=PACKAGE_NAME --version=VERSION [OPTIONS]"
      echo "Options:"
      echo "  --package=NAME      Package name (core, react, nextjs)"
      echo "  --version=X.Y.Z     Version to publish"
      echo "  --dry-run           Run without making changes"
      echo "  -h, --help          Show this help"
      echo ""
      echo "Examples:"
      echo "  $0 --package=core --version=1.0.1"
      echo "  $0 --package=react --version=2.1.0 --dry-run"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Validate required arguments
if [ -z "$PACKAGE" ] || [ -z "$VERSION" ]; then
  echo "❌ Both --package and --version are required"
  echo "Use --help for usage information"
  exit 1
fi

# Validate package name
if [[ ! "$PACKAGE" =~ ^(core|react|nextjs)$ ]]; then
  echo "❌ Invalid package name: $PACKAGE"
  echo "Valid packages: core, react, nextjs"
  exit 1
fi

if [ "$DRY_RUN" = true ]; then
  echo "🔍 DRY RUN MODE - No actual changes will be made"
fi

echo "📦 Package: @snapkit-studio/$PACKAGE"
echo "🏷️ Version: $VERSION"

# Check if we're in the right directory
if [ ! -d "packages/$PACKAGE" ]; then
  echo "❌ Package directory packages/$PACKAGE not found"
  exit 1
fi

# Check NPM authentication
echo ""
echo "🔍 Checking NPM authentication..."
if ! npm whoami > /dev/null 2>&1; then
  echo "❌ Not logged in to NPM. Please run: npm login"
  exit 1
fi

echo "✅ Logged in as: $(npm whoami)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if [ "$DRY_RUN" = false ]; then
  pnpm install --frozen-lockfile
else
  echo "🔍 [DRY RUN] Would run: pnpm install --frozen-lockfile"
fi

# Run tests
echo ""
echo "🧪 Running tests for @snapkit-studio/$PACKAGE..."
if [ "$DRY_RUN" = false ]; then
  pnpm --filter "@snapkit-studio/$PACKAGE" lint
  pnpm --filter "@snapkit-studio/$PACKAGE" check-types
  pnpm --filter "@snapkit-studio/$PACKAGE" test
else
  echo "🔍 [DRY RUN] Would run tests for @snapkit-studio/$PACKAGE"
fi

# Build package
echo ""
echo "🏗️ Building @snapkit-studio/$PACKAGE..."
if [ "$DRY_RUN" = false ]; then
  pnpm --filter "@snapkit-studio/$PACKAGE" build
else
  echo "🔍 [DRY RUN] Would build @snapkit-studio/$PACKAGE"
fi

# Update version
echo ""
echo "📝 Updating package version..."
if [ "$DRY_RUN" = false ]; then
  cd "packages/$PACKAGE"
  npm version "$VERSION" --no-git-tag-version
  cd ../..
else
  echo "🔍 [DRY RUN] Would update version to $VERSION"
fi

# Check if version already exists on NPM
echo ""
echo "🔍 Checking if version exists on NPM..."
if npm view "@snapkit-studio/$PACKAGE@$VERSION" version &>/dev/null; then
  echo "❌ Version $VERSION already exists on NPM for @snapkit-studio/$PACKAGE"
  exit 1
fi

echo "✅ Version $VERSION is available for publishing"

# Publish to NPM
echo ""
echo "📤 Publishing to NPM..."
if [ "$DRY_RUN" = false ]; then
  cd "packages/$PACKAGE"
  npm publish --access public
  cd ../..
else
  echo "🔍 [DRY RUN] Would publish @snapkit-studio/$PACKAGE@$VERSION"
fi

# Create git commit and tag
echo ""
echo "📋 Creating git commit and tag..."
if [ "$DRY_RUN" = false ]; then
  git add "packages/$PACKAGE/package.json"
  git commit -m "chore($PACKAGE): release v$VERSION [skip ci]"
  git tag "$PACKAGE-v$VERSION" -m "Release @snapkit-studio/$PACKAGE@$VERSION"

  echo "✅ Created commit and tag: $PACKAGE-v$VERSION"
  echo ""
  echo "📋 Next steps:"
  echo "- Push changes: git push origin main"
  echo "- Push tag: git push origin $PACKAGE-v$VERSION"
else
  echo "🔍 [DRY RUN] Would create:"
  echo "  - Commit: chore($PACKAGE): release v$VERSION [skip ci]"
  echo "  - Tag: $PACKAGE-v$VERSION"
fi

echo ""
echo "🎉 Local publishing complete!"
if [ "$DRY_RUN" = false ]; then
  echo "📦 Published: https://www.npmjs.com/package/@snapkit-studio/$PACKAGE/v/$VERSION"
else
  echo "🔍 This was a dry run - no actual changes were made"
fi