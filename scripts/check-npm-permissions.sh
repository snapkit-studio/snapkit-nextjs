#!/bin/bash

set -e

echo "🔍 NPM Token Permission Checker"
echo "================================"

# Check if NPM_TOKEN is available
if [ -z "$NPM_TOKEN" ]; then
  echo "❌ NPM_TOKEN not set"
  exit 1
fi

echo "✅ NPM_TOKEN is available"

# Configure NPM authentication
cat > ~/.npmrc << EOF
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
@snapkit-studio:registry=https://registry.npmjs.org/
EOF

echo ""
echo "📋 Authentication Check"
echo "----------------------"

# Check authentication
if npm whoami --registry https://registry.npmjs.org; then
  CURRENT_USER=$(npm whoami --registry https://registry.npmjs.org)
  echo "✅ Authenticated as: $CURRENT_USER"
else
  echo "❌ Authentication failed"
  exit 1
fi

echo ""
echo "📋 Organization Access Check"
echo "----------------------------"

# Check if user has access to @snapkit-studio organization
if npm access list packages @snapkit-studio 2>/dev/null; then
  echo "✅ Has access to @snapkit-studio organization"
  echo "📦 Existing packages in organization:"
  npm access list packages @snapkit-studio
else
  echo "⚠️ No access to @snapkit-studio organization or no packages exist"
fi

echo ""
echo "📋 Individual Package Check"
echo "---------------------------"

# Check each package individually
PACKAGES="core react nextjs"

for package in $PACKAGES; do
  echo "🔍 Checking @snapkit-studio/$package..."

  if npm view "@snapkit-studio/$package" version 2>/dev/null; then
    LATEST_VERSION=$(npm view "@snapkit-studio/$package" version)
    echo "  📦 Latest version: $LATEST_VERSION"

    # Check if user can publish to this package
    if npm access list collaborators "@snapkit-studio/$package" 2>/dev/null | grep -q "$CURRENT_USER"; then
      echo "  ✅ Has publish access"
    else
      echo "  ⚠️ No publish access or unable to check"
    fi
  else
    echo "  📝 Package does not exist on NPM"
  fi
  echo ""
done

echo ""
echo "📋 Token Type Detection"
echo "----------------------"

# Try to determine token type based on capabilities
if npm token list 2>/dev/null | grep -q "read-write"; then
  echo "✅ Token appears to be a user token with read-write access"
elif npm token list 2>/dev/null; then
  echo "⚠️ Token is valid but may have limited permissions"
else
  echo "🔍 Unable to determine token type (this is normal for some token types)"
fi

echo ""
echo "📋 Summary"
echo "----------"
echo "User: $CURRENT_USER"
echo "Organization: @snapkit-studio"
echo "Packages to check: $PACKAGES"
echo ""
echo "💡 If publishing fails, consider:"
echo "   1. Ensure NPM token has publish permissions"
echo "   2. Check if user is added to @snapkit-studio organization"
echo "   3. Verify packages exist and user has collaborator access"
echo "   4. Consider using granular access tokens with specific permissions"