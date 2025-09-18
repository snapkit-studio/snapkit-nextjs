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

# Check if NPM_TOKEN is available
if [ -z "$NPM_TOKEN" ]; then
  echo "❌ NPM_TOKEN not set, cannot publish to NPM Registry"
  exit 1
fi

echo "✅ NPM_TOKEN is available"

# Configure NPM authentication
echo "📋 Configuring NPM authentication..."
cat > ~/.npmrc << EOF
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
@snapkit-studio:registry=https://registry.npmjs.org/
EOF

echo "📋 NPM configuration created"

npm config set access public

# Publish only changed packages
for package in $CHANGED_PACKAGES; do
  echo "📤 Publishing @snapkit-studio/$package..."

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

  # Check if this version already exists on NPM
  echo "🔍 Checking if @snapkit-studio/$package@$CURRENT_VERSION already exists..."
  if npm view "@snapkit-studio/$package@$CURRENT_VERSION" version &>/dev/null; then
    echo "📦 Package @snapkit-studio/$package@$CURRENT_VERSION already exists on NPM, skipping..."
    continue
  fi

  # Verify NPM authentication
  echo "🔐 Verifying NPM authentication..."
  if ! npm whoami &>/dev/null; then
    echo "❌ NPM authentication failed. Please check NPM_TOKEN"
    continue
  fi

  echo "✅ NPM authentication verified as: $(npm whoami)"

  # Attempt to publish
  echo "📤 Attempting to publish @snapkit-studio/$package@$CURRENT_VERSION to NPM..."
  if pnpm publish --filter "@snapkit-studio/$package" --access public --no-git-checks --registry https://registry.npmjs.org; then
    echo "✅ @snapkit-studio/$package NPM publishing successful"
  else
    PUBLISH_EXIT_CODE=$?
    echo "⚠️ @snapkit-studio/$package NPM publishing failed with exit code: $PUBLISH_EXIT_CODE"

    # More detailed error checking
    echo "🔍 Checking package details..."
    echo "  - Package name: @snapkit-studio/$package"
    echo "  - Version: $CURRENT_VERSION"
    echo "  - Registry: https://registry.npmjs.org"
    echo "  - User: $(npm whoami 2>/dev/null || echo 'not authenticated')"

    # Check organization membership
    echo "🏢 Checking organization membership..."
    if npm access ls-packages @snapkit-studio 2>/dev/null | grep -q "@snapkit-studio/$package"; then
      echo "✅ User has access to @snapkit-studio organization"
    else
      echo "❌ User may not have access to @snapkit-studio organization"
      echo "💡 Please ensure NPM_TOKEN has publish access to @snapkit-studio organization"
    fi
  fi
done

# Publish to GitHub Packages (optional)
if [ "$PUBLISH_GITHUB_PACKAGES" = "true" ]; then
  echo "📦 Publishing to GitHub Packages..."
  if bash ./scripts/publish-github-packages.sh; then
    echo "✅ GitHub Packages publishing completed successfully"
  else
    echo "⚠️ GitHub Packages publishing failed, but continuing..."
  fi
else
  echo "📦 Skipping GitHub Packages publishing (set PUBLISH_GITHUB_PACKAGES=true to enable)"
fi

echo "🎉 Selective package publishing completed!"
echo "📦 Published packages: $CHANGED_PACKAGES"