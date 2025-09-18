#!/bin/bash

set -e

echo "🚀 Publishing to NPM Registry..."
NPM_CONFIG_REGISTRY=https://registry.npmjs.org NODE_AUTH_TOKEN=$NPM_TOKEN pnpm publish --filter @snapkit/react --access public --no-git-checks
NPM_CONFIG_REGISTRY=https://registry.npmjs.org NODE_AUTH_TOKEN=$NPM_TOKEN pnpm publish --filter @snapkit/nextjs --access public --no-git-checks

echo "📦 Publishing to GitHub Packages..."
NPM_CONFIG_REGISTRY=https://npm.pkg.github.com NODE_AUTH_TOKEN=$GITHUB_TOKEN pnpm publish --filter @snapkit/react --access public --no-git-checks
NPM_CONFIG_REGISTRY=https://npm.pkg.github.com NODE_AUTH_TOKEN=$GITHUB_TOKEN pnpm publish --filter @snapkit/nextjs --access public --no-git-checks

echo "✅ Publishing completed successfully!"