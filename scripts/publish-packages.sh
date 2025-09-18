#!/bin/bash

set -e

echo "🚀 Publishing to NPM Registry..."

# NPM 인증 설정
cat > ~/.npmrc << EOF
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
@snapkit-studio:registry=https://registry.npmjs.org/
EOF

echo "📋 NPM configuration:"
cat ~/.npmrc

# NPM 배포
npm config set access public
pnpm publish --filter @snapkit-studio/core --access public --no-git-checks
pnpm publish --filter @snapkit-studio/react --access public --no-git-checks
pnpm publish --filter @snapkit-studio/nextjs --access public --no-git-checks

echo "📦 Publishing to GitHub Packages..."

# GitHub Packages 인증 설정
cat > ~/.npmrc << EOF
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@snapkit-studio:registry=https://npm.pkg.github.com/
registry=https://npm.pkg.github.com/
EOF

echo "📋 GitHub Packages configuration:"
cat ~/.npmrc

# GitHub Packages 배포
pnpm publish --filter @snapkit-studio/core --access public --no-git-checks --registry https://npm.pkg.github.com
pnpm publish --filter @snapkit-studio/react --access public --no-git-checks --registry https://npm.pkg.github.com
pnpm publish --filter @snapkit-studio/nextjs --access public --no-git-checks --registry https://npm.pkg.github.com

echo "✅ Publishing completed successfully!"