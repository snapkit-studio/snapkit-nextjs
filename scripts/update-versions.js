#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getChangedPackages(since = 'HEAD^') {
  console.log('🔍 Detecting changed packages with Git...');
  return getChangedPackagesFromGit(since);
}

function getChangedPackagesFromGit(since = 'HEAD^') {
  try {
    const changedFiles = execSync(`git diff --name-only ${since}`, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);

    const packageDirs = new Set();

    changedFiles.forEach(file => {
      if (file.startsWith('packages/')) {
        const packageName = file.split('/')[1];
        if (packageName) {
          packageDirs.add(packageName);
        }
      }
    });

    // Check for root level changes
    const hasRootChanges = changedFiles.some(file =>
      !file.startsWith('packages/') &&
      !file.startsWith('apps/') &&
      !file.startsWith('.github/') &&
      !file.startsWith('.git') &&
      !file.includes('CHANGELOG') &&
      !file.includes('README')
    );

    if (hasRootChanges) {
      console.log('🔄 Root level changes detected - updating all packages');
      return getAllPackages();
    }

    return Array.from(packageDirs);
  } catch (error) {
    console.error('❌ Git diff execution failed:', error.message);
    return [];
  }
}

function getAllPackages() {
  const packagesDir = path.join(process.cwd(), 'packages');
  if (!fs.existsSync(packagesDir)) return [];

  return fs.readdirSync(packagesDir)
    .filter(dir => {
      const packageJsonPath = path.join(packagesDir, dir, 'package.json');
      return fs.existsSync(packageJsonPath);
    });
}

function updatePackageVersion(packageName, newVersion) {
  const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`⚠️ Package not found: ${packageName}`);
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const oldVersion = packageJson.version;

    packageJson.version = newVersion;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ ${packageName}: ${oldVersion} → ${newVersion}`);
    return true;
  } catch (error) {
    console.error(`❌ ${packageName} version update failed:`, error.message);
    return false;
  }
}

function updateWorkspaceDependencies(packageNames, newVersion) {
  const allPackagePaths = getAllPackages().map(name =>
    path.join(process.cwd(), 'packages', name, 'package.json')
  );

  allPackagePaths.forEach(packagePath => {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      let updated = false;

      ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
        if (packageJson[depType]) {
          packageNames.forEach(changedPackage => {
            const depKey = `@snapkit-studio/${changedPackage}`;
            if (packageJson[depType][depKey] === 'workspace:*') {
              // Keep workspace: dependencies as-is
              return;
            }
            if (packageJson[depType][depKey]) {
              packageJson[depType][depKey] = `^${newVersion}`;
              updated = true;
            }
          });
        }
      });

      if (updated) {
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log(`🔗 Dependencies updated: ${path.basename(path.dirname(packagePath))}`);
      }
    } catch (error) {
      console.error(`❌ Dependencies update failed ${packagePath}:`, error.message);
    }
  });
}

function main() {
  const args = process.argv.slice(2);
  const newVersion = args[0];
  const since = args[1] || 'HEAD^';

  if (!newVersion) {
    console.error('❌ Usage: node update-versions.js <new-version> [since-commit]');
    process.exit(1);
  }

  console.log(`🚀 Starting version update: ${newVersion}`);

  const changedPackages = getChangedPackages(since);

  if (changedPackages.length === 0) {
    console.log('📝 No changed packages found.');
    return;
  }

  console.log(`\n📦 Packages to update (${changedPackages.length}):`);
  changedPackages.forEach(pkg => console.log(`  - @snapkit-studio/${pkg}`));

  // Update individual package versions
  let updatedCount = 0;
  changedPackages.forEach(packageName => {
    if (updatePackageVersion(packageName, newVersion)) {
      updatedCount++;
    }
  });

  // Update dependencies
  if (updatedCount > 0) {
    console.log('\n🔗 Updating workspace dependencies...');
    updateWorkspaceDependencies(changedPackages, newVersion);
  }

  console.log(`\n✨ Completed! ${updatedCount} packages version updated`);
}

if (require.main === module) {
  main();
}

module.exports = {
  getChangedPackages,
  updatePackageVersion,
  updateWorkspaceDependencies
};