#!/bin/bash

set -e

echo "📦 Publishing to GitHub Packages only..."

# Get changed packages
CHANGED_PACKAGES=""
if command -v node >/dev/null 2>&1; then
  CHANGED_PACKAGES=$(node -e "
    const { getChangedPackages } = require('./scripts/update-versions.js');
    const packages = getChangedPackages('HEAD^', true); // silent mode
    console.log(packages.join(' '));
  ")
fi

# If no changed packages detected, publish all packages
if [ -z "$CHANGED_PACKAGES" ]; then
  echo "📦 No changed packages detected or detection failed - publishing all packages"
  CHANGED_PACKAGES="core react nextjs"
fi

echo "📦 Packages to publish to GitHub Packages: $CHANGED_PACKAGES"

# Check if GITHUB_TOKEN is available
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN not set, cannot publish to GitHub Packages"
  exit 1
fi

echo "✅ GITHUB_TOKEN is available"

# Configure GitHub Packages authentication
echo "📋 Configuring GitHub Packages authentication..."

# Create temporary .npmrc for GitHub Packages
cat > ~/.npmrc << EOF
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@snapkit-studio:registry=https://npm.pkg.github.com/
registry=https://npm.pkg.github.com/
EOF

echo "📋 GitHub Packages configuration created"

# Test authentication
echo "🔍 Testing GitHub Packages authentication..."
if npm whoami --registry https://npm.pkg.github.com 2>/dev/null; then
  echo "✅ GitHub Packages authentication successful"
  CURRENT_USER=$(npm whoami --registry https://npm.pkg.github.com 2>/dev/null)
  echo "📋 Authenticated as: $CURRENT_USER"
else
  echo "❌ GitHub Packages authentication failed"
  echo "📋 Current .npmrc contents:"
  cat ~/.npmrc | sed 's/ghp_[a-zA-Z0-9]*/[REDACTED]/g'
  echo "🔍 Attempting alternative authentication check..."

  # Try a different approach - check if we can access GitHub API
  if curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user > /dev/null 2>&1; then
    echo "✅ GitHub API access works, continuing with publish attempt"
  else
    echo "❌ GitHub API access also failed"
    exit 1
  fi
fi

# Publish changed packages to GitHub Packages
for package in $CHANGED_PACKAGES; do
  echo "📤 Publishing @snapkit-studio/$package to GitHub Packages..."

  # Check if package exists locally
  if [ ! -d "packages/$package" ]; then
    echo "⚠️ Package directory packages/$package not found, skipping"
    continue
  fi

  # Build the package first
  echo "🏗️ Building @snapkit-studio/$package..."
  if pnpm build --filter "@snapkit-studio/$package"; then
    echo "✅ Build successful for @snapkit-studio/$package"
  else
    echo "❌ Build failed for @snapkit-studio/$package, skipping publish"
    continue
  fi

  # Check current version
  CURRENT_VERSION=$(node -p "require('./packages/$package/package.json').version")
  echo "📋 Current version: @snapkit-studio/$package@$CURRENT_VERSION"

  # Publish to GitHub Packages
  echo "📤 Attempting to publish @snapkit-studio/$package@$CURRENT_VERSION to GitHub Packages..."
  if pnpm publish --filter "@snapkit-studio/$package" --access public --no-git-checks --registry https://npm.pkg.github.com; then
    echo "✅ @snapkit-studio/$package GitHub Packages publishing successful"
  else
    echo "⚠️ @snapkit-studio/$package GitHub Packages publishing failed"
    echo "🔍 Checking if package already exists on GitHub Packages..."
    if npm view "@snapkit-studio/$package@$CURRENT_VERSION" --registry https://npm.pkg.github.com version 2>/dev/null; then
      echo "📦 Package @snapkit-studio/$package@$CURRENT_VERSION already exists on GitHub Packages"
    else
      echo "❌ Publishing failed for unknown reason - check GitHub Packages access"
    fi
  fi
done

echo "🎉 GitHub Packages publishing completed!"
echo "📦 Processed packages: $CHANGED_PACKAGES"