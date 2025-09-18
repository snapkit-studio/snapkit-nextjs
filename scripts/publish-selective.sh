#!/bin/bash

set -e

echo "🚀 Starting Git-based selective package publishing..."

# Detect changed packages using Git
echo "🔍 Detecting changed packages with Git..."
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

# Publish to GitHub Packages (optional)
if [ "$PUBLISH_GITHUB_PACKAGES" = "true" ]; then
  echo "📦 Publishing to GitHub Packages..."
  bash ./scripts/publish-github-packages.sh
else
  echo "📦 Skipping GitHub Packages publishing (set PUBLISH_GITHUB_PACKAGES=true to enable)"
fi

echo "🎉 Selective package publishing completed!"
echo "📦 Published packages: $CHANGED_PACKAGES"