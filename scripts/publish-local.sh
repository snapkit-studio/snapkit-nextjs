#!/bin/bash

set -e

echo "🔍 Checking NPM authentication..."
if ! npm whoami > /dev/null 2>&1; then
  echo "❌ Not logged in to NPM. Please run: npm login"
  exit 1
fi

echo "✅ Logged in as: $(npm whoami)"

echo "🏗️ Building packages..."
pnpm build

echo "🚀 Publishing to NPM Registry..."
echo "Publishing @snapkit-studio/core..."
pnpm publish --filter @snapkit-studio/core --access public

echo "Publishing @snapkit-studio/react..."
pnpm publish --filter @snapkit-studio/react --access public

echo "Publishing @snapkit-studio/nextjs..."
pnpm publish --filter @snapkit-studio/nextjs --access public

echo "✅ All packages published successfully!"
echo ""
echo "📦 Published packages:"
echo "- https://www.npmjs.com/package/@snapkit-studio/core"
echo "- https://www.npmjs.com/package/@snapkit-studio/react"
echo "- https://www.npmjs.com/package/@snapkit-studio/nextjs"