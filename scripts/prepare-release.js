#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Release Preparation Script
 *
 * This script prepares packages for npm publication by:
 * 1. Removing @repo/ dependencies completely during release
 * 2. Converting workspace:* to latest published versions
 * 3. Creating release-ready package.json files
 */

const PUBLISHABLE_PACKAGES = [
  {
    name: '@snapkit-studio/core',
    directory: 'packages/core'
  },
  {
    name: '@snapkit-studio/react',
    directory: 'packages/react'
  },
  {
    name: '@snapkit-studio/nextjs',
    directory: 'packages/nextjs'
  }
];

/**
 * Get the latest version of a package from its package.json
 */
function getLatestVersion(packageDirectory) {
  const packagePath = path.join(packageDirectory, 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageData = JSON.parse(packageContent);
  return packageData.version;
}

/**
 * Build workspace dependency mapping with latest versions
 */
function buildWorkspaceDependencyMapping() {
  const mapping = {};

  PUBLISHABLE_PACKAGES.forEach(pkg => {
    const version = getLatestVersion(pkg.directory);
    mapping[pkg.name] = `^${version}`;
    console.log(`📋 Mapped ${pkg.name} → ^${version}`);
  });

  return mapping;
}

/**
 * Read package.json from a directory
 */
function readPackageJson(packageDir) {
  const packagePath = path.join(packageDir, 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  return JSON.parse(packageContent);
}

/**
 * Write package.json to a directory
 */
function writePackageJson(packageDir, packageData, suffix = '') {
  const fileName = suffix ? `package${suffix}.json` : 'package.json';
  const packagePath = path.join(packageDir, fileName);
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
  console.log(`✅ Created ${packagePath}`);
}

/**
 * Remove @repo/ dependencies from dependency object
 */
function removeRepoDependencies(deps) {
  if (!deps) return deps;

  const cleaned = { ...deps };
  let removedCount = 0;

  Object.keys(cleaned).forEach(dep => {
    if (dep.startsWith('@repo/')) {
      delete cleaned[dep];
      removedCount++;
      console.log(`   🗑️  Removed @repo/ dependency: ${dep}`);
    }
  });

  return removedCount > 0 ? cleaned : deps;
}

/**
 * Transform workspace:* dependencies to latest versions
 */
function transformWorkspaceDependencies(deps, workspaceMapping) {
  if (!deps) return deps;

  const transformed = { ...deps };
  let transformedCount = 0;

  Object.keys(transformed).forEach(dep => {
    if (transformed[dep] === 'workspace:*' && workspaceMapping[dep]) {
      const newVersion = workspaceMapping[dep];
      transformed[dep] = newVersion;
      transformedCount++;
      console.log(`   📦 Transformed ${dep}: workspace:* → ${newVersion}`);
    }
  });

  return transformedCount > 0 ? transformed : deps;
}

/**
 * Transform package for release
 */
function transformPackageForRelease(packageData, workspaceMapping, packageInfo) {
  const transformed = { ...packageData };

  console.log(`\n🔄 Preparing ${packageInfo.name} for release...`);

  // 1. Remove @repo/ dependencies from all dependency types
  transformed.dependencies = removeRepoDependencies(transformed.dependencies);
  transformed.devDependencies = removeRepoDependencies(transformed.devDependencies);
  transformed.peerDependencies = removeRepoDependencies(transformed.peerDependencies);

  // 2. Transform workspace:* to latest versions
  transformed.dependencies = transformWorkspaceDependencies(transformed.dependencies, workspaceMapping);
  transformed.devDependencies = transformWorkspaceDependencies(transformed.devDependencies, workspaceMapping);
  transformed.peerDependencies = transformWorkspaceDependencies(transformed.peerDependencies, workspaceMapping);

  // 3. Clean up empty dependency objects
  if (transformed.dependencies && Object.keys(transformed.dependencies).length === 0) {
    delete transformed.dependencies;
  }
  if (transformed.devDependencies && Object.keys(transformed.devDependencies).length === 0) {
    delete transformed.devDependencies;
  }
  if (transformed.peerDependencies && Object.keys(transformed.peerDependencies).length === 0) {
    delete transformed.peerDependencies;
  }

  return transformed;
}

/**
 * Main function to prepare all packages for release
 */
function prepareRelease() {
  console.log('🚀 Preparing packages for release...\n');

  // Build workspace dependency mapping with latest versions
  console.log('📋 Building workspace dependency mapping...');
  const workspaceMapping = buildWorkspaceDependencyMapping();
  console.log('');

  // Process each publishable package
  PUBLISHABLE_PACKAGES.forEach(packageInfo => {
    try {
      // Read original package.json
      const originalPackage = readPackageJson(packageInfo.directory);

      // Transform for release
      const releasePackage = transformPackageForRelease(originalPackage, workspaceMapping, packageInfo);

      // Write release package.json
      writePackageJson(packageInfo.directory, releasePackage, '.release');

    } catch (error) {
      console.error(`❌ Error processing ${packageInfo.name}:`, error.message);
      process.exit(1);
    }
  });

  console.log('\n✅ All release packages prepared successfully!');
  console.log('\n📋 Release-ready files created:');
  PUBLISHABLE_PACKAGES.forEach(pkg => {
    console.log(`   - ${pkg.directory}/package.release.json`);
  });

  console.log('\n📋 Next steps:');
  console.log('1. Review the .release.json files');
  console.log('2. Test builds with release configurations');
  console.log('3. When ready, copy .release.json to package.json and publish');
  console.log('4. Restore original package.json files after publishing');
}

/**
 * Restore original package.json files (cleanup after release)
 */
function restoreOriginalPackages() {
  console.log('🔄 Restoring original package.json files...\n');

  PUBLISHABLE_PACKAGES.forEach(packageInfo => {
    const releaseFile = path.join(packageInfo.directory, 'package.release.json');

    // Remove release file if it exists
    if (fs.existsSync(releaseFile)) {
      fs.unlinkSync(releaseFile);
      console.log(`🗑️  Removed ${releaseFile}`);
    }
  });

  console.log('\n✅ Cleanup completed!');
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'prepare':
    case undefined:
      prepareRelease();
      break;
    case 'cleanup':
      restoreOriginalPackages();
      break;
    case 'help':
      console.log('Release Preparation Script');
      console.log('');
      console.log('Usage:');
      console.log('  node scripts/prepare-release.js [command]');
      console.log('');
      console.log('Commands:');
      console.log('  prepare   Prepare packages for release (default)');
      console.log('  cleanup   Remove .release.json files');
      console.log('  help      Show this help message');
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "node scripts/prepare-release.js help" for usage information');
      process.exit(1);
  }
}

module.exports = {
  prepareRelease,
  restoreOriginalPackages,
  transformPackageForRelease,
  buildWorkspaceDependencyMapping,
  PUBLISHABLE_PACKAGES
};