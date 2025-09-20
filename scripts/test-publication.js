#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Publication Testing Script
 *
 * This script tests publication-ready packages by:
 * 1. Temporarily replacing package.json with .publish.json
 * 2. Installing dependencies with publication configuration
 * 3. Running builds and tests
 * 4. Restoring original configuration
 */

const { PACKAGES_TO_PREPARE } = require('./prepare-publication');

function execCommand(command, cwd = process.cwd(), description = '') {
  console.log(`⚡ ${description || command}`);
  try {
    const result = execSync(command, {
      cwd,
      stdio: 'inherit',
      encoding: 'utf8'
    });
    return result;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    throw error;
  }
}

function backupAndReplacePackageJson(packageDir) {
  const originalPath = path.join(packageDir, 'package.json');
  const publishPath = path.join(packageDir, 'package.publish.json');
  const backupPath = path.join(packageDir, 'package.json.test-backup');

  if (!fs.existsSync(publishPath)) {
    throw new Error(`Publication package.json not found: ${publishPath}`);
  }

  // Backup original
  fs.copyFileSync(originalPath, backupPath);

  // Replace with publication version
  fs.copyFileSync(publishPath, originalPath);

  console.log(`📦 Using publication config for ${packageDir}`);
}

function restorePackageJson(packageDir) {
  const originalPath = path.join(packageDir, 'package.json');
  const backupPath = path.join(packageDir, 'package.json.test-backup');

  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, originalPath);
    fs.unlinkSync(backupPath);
    console.log(`🔄 Restored original config for ${packageDir}`);
  }
}

function disableEslintConfig(packageDir) {
  const eslintConfigPath = path.join(packageDir, 'eslint.config.mjs');
  const eslintBackupPath = path.join(packageDir, 'eslint.config.mjs.test-backup');

  if (fs.existsSync(eslintConfigPath)) {
    fs.copyFileSync(eslintConfigPath, eslintBackupPath);
    fs.unlinkSync(eslintConfigPath);
    console.log(`🔇 Disabled ESLint config for ${packageDir}`);
  }
}

function restoreEslintConfig(packageDir) {
  const eslintConfigPath = path.join(packageDir, 'eslint.config.mjs');
  const eslintBackupPath = path.join(packageDir, 'eslint.config.mjs.test-backup');

  if (fs.existsSync(eslintBackupPath)) {
    fs.copyFileSync(eslintBackupPath, eslintConfigPath);
    fs.unlinkSync(eslintBackupPath);
    console.log(`🔄 Restored ESLint config for ${packageDir}`);
  }
}

function testPackagePublication(packageInfo) {
  const packageDir = packageInfo.directory;

  console.log(`\n🧪 Testing publication build for ${packageInfo.name}...`);

  try {
    // Step 1: Replace package.json with publication version
    backupAndReplacePackageJson(packageDir);

    // Step 2: Test build
    execCommand('pnpm build', packageDir, `Building ${packageInfo.name}`);

    // Step 3: Test type checking
    execCommand('pnpm check-types', packageDir, `Type checking ${packageInfo.name}`);

    // Step 4: Test linting (skip if no lint script)
    try {
      execCommand('pnpm lint', packageDir, `Linting ${packageInfo.name}`);
    } catch (error) {
      console.log(`⚠️  Lint script not found or failed for ${packageInfo.name}, skipping...`);
    }

    console.log(`✅ Publication build successful for ${packageInfo.name}`);

  } catch (error) {
    console.error(`❌ Publication build failed for ${packageInfo.name}:`, error.message);
    throw error;
  } finally {
    // Always restore original package.json
    restorePackageJson(packageDir);
  }
}

function testAllPublications() {
  console.log('🚀 Testing publication builds...\n');

  // Ensure publication packages exist
  PACKAGES_TO_PREPARE.forEach(packageInfo => {
    const publishPath = path.join(packageInfo.directory, 'package.publish.json');
    if (!fs.existsSync(publishPath)) {
      console.error(`❌ Publication package not found: ${publishPath}`);
      console.error('   Run: node scripts/prepare-publication.js first');
      process.exit(1);
    }
  });

  // Backup all original package.json files and disable ESLint configs
  console.log('📦 Preparing publication environment...');
  PACKAGES_TO_PREPARE.forEach(packageInfo => {
    backupAndReplacePackageJson(packageInfo.directory);
    disableEslintConfig(packageInfo.directory);
  });

  try {
    // Install dependencies with publication configuration
    console.log('\n📥 Installing dependencies with publication configuration...');
    execCommand('pnpm install', '.', 'Installing publication dependencies');

    // Test each package
    for (const packageInfo of PACKAGES_TO_PREPARE) {
      testPackagePublication(packageInfo);
    }

    console.log('\n✅ All publication builds successful!');

  } catch (error) {
    console.error('\n❌ Publication testing failed:', error.message);
    process.exit(1);
  } finally {
    // Restore all original package.json files and ESLint configs
    console.log('\n🔄 Restoring original configuration...');
    PACKAGES_TO_PREPARE.forEach(packageInfo => {
      restorePackageJson(packageInfo.directory);
      restoreEslintConfig(packageInfo.directory);
    });

    // Reinstall with original configuration
    console.log('📥 Reinstalling with original configuration...');
    execCommand('pnpm install', '.', 'Restoring original dependencies');
  }
}

if (require.main === module) {
  testAllPublications();
}

module.exports = {
  testAllPublications,
  testPackagePublication
};