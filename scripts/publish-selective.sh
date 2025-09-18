#!/bin/bash

set -e

echo "🚀 Starting Git-based selective package publishing..."

# Detect changed packages using Git
echo "🔍 Detecting changed packages with Git..."
CHANGED_PACKAGES=""
if command -v node >/dev/null 2>&1; then
  CHANGED_PACKAGES=$(node -e "
    const { getChangedPackages } = require('./scripts/update-versions.js');
    const packages = getChangedPackages();
    console.log(packages.join(' '));
  ")
fi

# If no changed packages detected, publish all packages
if [ -z "$CHANGED_PACKAGES" ]; then
  echo "📦 No changed packages detected or detection failed - publishing all packages"
  CHANGED_PACKAGES="core react nextjs"
fi

echo "📦 Packages to publish: $CHANGED_PACKAGES"

# Publish to NPM Registry
echo "🚀 Publishing to NPM Registry..."

# Configure NPM authentication
cat > ~/.npmrc << EOF
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
@snapkit-studio:registry=https://registry.npmjs.org/
EOF

echo "📋 NPM configuration:"
cat ~/.npmrc

npm config set access public

# Publish only changed packages
for package in $CHANGED_PACKAGES; do
  echo "📤 Publishing @snapkit-studio/$package..."
  if pnpm publish --filter "@snapkit-studio/$package" --access public --no-git-checks; then
    echo "✅ @snapkit-studio/$package NPM publishing successful"
  else
    echo "⚠️ @snapkit-studio/$package NPM publishing failed (already exists or error)"
  fi
done

# Publish to GitHub Packages
echo "📦 Publishing to GitHub Packages..."

# Configure GitHub Packages authentication
cat > ~/.npmrc << EOF
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@snapkit-studio:registry=https://npm.pkg.github.com/
registry=https://npm.pkg.github.com/
EOF

echo "📋 GitHub Packages configuration:"
cat ~/.npmrc

# Publish changed packages to GitHub Packages only
for package in $CHANGED_PACKAGES; do
  echo "📤 Publishing @snapkit-studio/$package to GitHub Packages..."
  if pnpm publish --filter "@snapkit-studio/$package" --access public --no-git-checks --registry https://npm.pkg.github.com; then
    echo "✅ @snapkit-studio/$package GitHub Packages publishing successful"
  else
    echo "⚠️ @snapkit-studio/$package GitHub Packages publishing failed (already exists or error)"
  fi
done

echo "🎉 Selective package publishing completed!"
echo "📦 Published packages: $CHANGED_PACKAGES"