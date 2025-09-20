#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Publication Preparation Script
 *
 * This script prepares packages for npm publication by:
 * 1. Replacing workspace dependencies with actual published versions
 * 2. Removing workspace-only devDependencies
 * 3. Creating publication-ready package.json files
 * 4. Optionally testing builds with publication configs
 */

const PACKAGES_TO_PREPARE = [
  {
    name: '@snapkit-studio/core',
    directory: 'packages/core',
    version: '1.6.0'
  },
  {
    name: '@snapkit-studio/react',
    directory: 'packages/react',
    version: '1.6.2'
  },
  {
    name: '@snapkit-studio/nextjs',
    directory: 'packages/nextjs',
    version: '1.6.0'
  }
];

const WORKSPACE_DEPENDENCIES_TO_REPLACE = {
  '@snapkit-studio/core': '^1.6.0',
  '@snapkit-studio/react': '^1.6.2',
  '@snapkit-studio/nextjs': '^1.6.0'
};

// No longer removing workspace-only devDependencies since they won't be included in npm publish
// const WORKSPACE_ONLY_DEV_DEPENDENCIES = ['@repo/eslint-config'];

function readPackageJson(packageDir) {
  const packagePath = path.join(packageDir, 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  return JSON.parse(packageContent);
}

function writePackageJson(packageDir, packageData, suffix = '') {
  const fileName = suffix ? `package${suffix}.json` : 'package.json';
  const packagePath = path.join(packageDir, fileName);
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
  console.log(`✅ Created ${packagePath}`);
}

function transformDependencies(deps) {
  if (!deps) return deps;

  const transformed = { ...deps };

  // Replace workspace dependencies with published versions
  Object.keys(transformed).forEach(dep => {
    if (transformed[dep] === 'workspace:*' && WORKSPACE_DEPENDENCIES_TO_REPLACE[dep]) {
      transformed[dep] = WORKSPACE_DEPENDENCIES_TO_REPLACE[dep];
      console.log(`   📦 Replaced ${dep}: workspace:* → ${WORKSPACE_DEPENDENCIES_TO_REPLACE[dep]}`);
    }
  });

  return transformed;
}

// No longer needed since devDependencies aren't included in npm publish
// function removeWorkspaceOnlyDependencies(deps) { ... }

function transformPackageForPublication(packageData, packageInfo) {
  const transformed = { ...packageData };

  console.log(`\n🔄 Transforming ${packageInfo.name}...`);

  // Transform dependencies
  transformed.dependencies = transformDependencies(transformed.dependencies);

  // Transform devDependencies but keep @repo/eslint-config for development
  transformed.devDependencies = transformDependencies(transformed.devDependencies);
  // Don't remove @repo/eslint-config from devDependencies - it's needed for development
  // and won't be included in npm publish anyway

  // Handle peerDependencies
  if (transformed.peerDependencies) {
    // Remove workspace peer dependencies that are invalid for external users
    if (packageInfo.name === '@snapkit-studio/nextjs') {
      // For nextjs package, remove the workspace peer dependency on react package
      // since it should be a regular dependency for the Image component to work
      delete transformed.peerDependencies['@snapkit-studio/react'];
      console.log(`   🗑️  Removed invalid peer dependency: @snapkit-studio/react`);
    } else {
      // Transform any workspace peer dependencies
      transformed.peerDependencies = transformDependencies(transformed.peerDependencies);
    }
  }

  return transformed;
}

function createPublicationPackages() {
  console.log('🚀 Preparing packages for npm publication...\n');

  PACKAGES_TO_PREPARE.forEach(packageInfo => {
    try {
      // Read original package.json
      const originalPackage = readPackageJson(packageInfo.directory);

      // Transform for publication
      const publicationPackage = transformPackageForPublication(originalPackage, packageInfo);

      // Write publication package.json
      writePackageJson(packageInfo.directory, publicationPackage, '.publish');

    } catch (error) {
      console.error(`❌ Error processing ${packageInfo.name}:`, error.message);
      process.exit(1);
    }
  });

  console.log('\n✅ All publication packages created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the .publish.json files');
  console.log('2. Run: node scripts/test-publication.js to test builds');
  console.log('3. Run: node scripts/simulate-external-install.js to test installation');
  console.log('4. When ready: node scripts/publish-packages.js');
}

if (require.main === module) {
  createPublicationPackages();
}

module.exports = {
  createPublicationPackages,
  transformPackageForPublication,
  PACKAGES_TO_PREPARE,
  WORKSPACE_DEPENDENCIES_TO_REPLACE
};