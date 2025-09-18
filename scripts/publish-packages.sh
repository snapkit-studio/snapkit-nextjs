#!/bin/bash

set -e

echo "🚀 Publishing to NPM Registry..."
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
echo "registry=https://registry.npmjs.org/" >> ~/.npmrc

pnpm publish --filter @snapkit/react --access public --no-git-checks
pnpm publish --filter @snapkit/nextjs --access public --no-git-checks

echo "📦 Publishing to GitHub Packages..."
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > ~/.npmrc
echo "@snapkit:registry=https://npm.pkg.github.com/" >> ~/.npmrc
echo "registry=https://npm.pkg.github.com/" >> ~/.npmrc

pnpm publish --filter @snapkit/react --access public --no-git-checks --registry https://npm.pkg.github.com
pnpm publish --filter @snapkit/nextjs --access public --no-git-checks --registry https://npm.pkg.github.com

echo "✅ Publishing completed successfully!"