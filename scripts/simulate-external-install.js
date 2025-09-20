#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

/**
 * External Installation Simulation Script
 *
 * This script simulates how the packages would behave when installed
 * by external users outside the monorepo by:
 * 1. Creating a temporary directory outside the monorepo
 * 2. Creating a test project with the publication-ready packages
 * 3. Testing installation and basic usage
 */

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

function createTestProject(testDir) {
  // Get absolute paths for local packages
  const projectRoot = path.resolve(__dirname, '..');

  // Create package.json for test project
  const testPackageJson = {
    name: "snapkit-external-test",
    version: "1.0.0",
    description: "Test external installation of Snapkit packages",
    scripts: {
      "build": "tsc --noEmit",
      "test": "node test.js"
    },
    dependencies: {
      "@snapkit-studio/core": `file:${path.join(projectRoot, 'packages/core')}`,
      "@snapkit-studio/react": `file:${path.join(projectRoot, 'packages/react')}`,
      "@snapkit-studio/nextjs": `file:${path.join(projectRoot, 'packages/nextjs')}`,
      "react": "^18.0.0",
      "react-dom": "^18.0.0",
      "next": "^13.0.0"
    },
    devDependencies: {
      "@types/react": "^18.0.0",
      "@types/react-dom": "^18.0.0",
      "@types/node": "^20.0.0",
      "typescript": "^5.0.0"
    }
  };

  fs.writeFileSync(
    path.join(testDir, 'package.json'),
    JSON.stringify(testPackageJson, null, 2)
  );

  // Create TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      lib: ["DOM", "ES2020"],
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      jsx: "react-jsx"
    },
    include: ["*.ts", "*.tsx"]
  };

  fs.writeFileSync(
    path.join(testDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
}

function createTestFiles(testDir) {
  // Test core functionality
  const coreTest = `
import { SnapkitUrlBuilder, ImageTransforms } from '@snapkit-studio/core';

// Test SnapkitUrlBuilder
const builder = new SnapkitUrlBuilder('test-org');
const transforms: ImageTransforms = { width: 800, quality: 85, format: 'webp' };
const url = builder.buildTransformedUrl('/test.jpg', transforms);

console.log('✅ Core package test passed:', url);
`;

  fs.writeFileSync(path.join(testDir, 'test-core.ts'), coreTest);

  // Test React functionality
  const reactTest = `
import React from 'react';
import { SnapkitProvider, useSnapkitConfig, Image } from '@snapkit-studio/react';

// Test provider and hook
function TestComponent() {
  const config = useSnapkitConfig();

  return (
    <Image
      src="/test.jpg"
      alt="Test"
      width={800}
      height={600}
    />
  );
}

function App() {
  return (
    <SnapkitProvider organizationName="test-org">
      <TestComponent />
    </SnapkitProvider>
  );
}

console.log('✅ React package test passed');
`;

  fs.writeFileSync(path.join(testDir, 'test-react.tsx'), reactTest);

  // Test Next.js functionality
  const nextjsTest = `
import { snapkitLoader, createSnapkitLoader, Image } from '@snapkit-studio/nextjs';
import type { SnapkitLoaderOptions } from '@snapkit-studio/nextjs';

// Test default loader
const defaultUrl = snapkitLoader({
  src: '/test.jpg',
  width: 800,
  quality: 85
});

// Test custom loader
const options: SnapkitLoaderOptions = {
  organizationName: 'test-org',
  transforms: { format: 'webp' }
};

const customLoader = createSnapkitLoader(options);
const customUrl = customLoader({
  src: '/test.jpg',
  width: 800,
  quality: 85
});

console.log('✅ Next.js package test passed:', { defaultUrl, customUrl });
`;

  fs.writeFileSync(path.join(testDir, 'test-nextjs.ts'), nextjsTest);

  // Main test runner - use CommonJS for compatibility
  const mainTest = `
// Test imports in CommonJS
const { SnapkitUrlBuilder } = require('@snapkit-studio/core');
const { snapkitLoader, createSnapkitLoader } = require('@snapkit-studio/nextjs');

// Test core package
const builder = new SnapkitUrlBuilder('test-org');
const transforms = { width: 800, quality: 85, format: 'webp' };
const url = builder.buildTransformedUrl('/test.jpg', transforms);
console.log('✅ Core package test passed:', url);

// Test Next.js package
const defaultUrl = snapkitLoader({
  src: '/test.jpg',
  width: 800,
  quality: 85
});
console.log('✅ Next.js package test passed:', defaultUrl);

// Test custom loader
const customLoader = createSnapkitLoader({
  organizationName: 'test-org',
  transforms: { format: 'webp' }
});
const customUrl = customLoader({
  src: '/test.jpg',
  width: 800,
  quality: 85
});
console.log('✅ Custom loader test passed:', customUrl);

console.log('🚀 All external installation tests completed!');
`;

  fs.writeFileSync(path.join(testDir, 'test.js'), mainTest);
}

function buildPackagesForTesting() {
  console.log('🔧 Building packages with publication configuration...');

  const packages = ['core', 'react', 'nextjs'];

  packages.forEach(pkg => {
    const projectRoot = path.resolve(__dirname, '..');
    const packageDir = path.join(projectRoot, 'packages', pkg);
    const publishPath = path.join(packageDir, 'package.publish.json');
    const originalPath = path.join(packageDir, 'package.json');
    const backupPath = path.join(packageDir, 'package.json.build-backup');

    if (!fs.existsSync(publishPath)) {
      console.error(`❌ Publication package not found: ${publishPath}`);
      console.error('   Run: node scripts/prepare-publication.js first');
      process.exit(1);
    }

    // Backup and replace
    fs.copyFileSync(originalPath, backupPath);
    fs.copyFileSync(publishPath, originalPath);

    try {
      execCommand('pnpm build', packageDir, `Building ${pkg} with publication config`);
    } finally {
      // Restore
      fs.copyFileSync(backupPath, originalPath);
      fs.unlinkSync(backupPath);
    }
  });
}

function simulateExternalInstallation() {
  console.log('🧪 Simulating external package installation...\n');

  // Create temporary directory
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapkit-external-test-'));
  console.log(`📁 Created test directory: ${testDir}`);

  try {
    // Step 1: Build packages with publication configuration
    buildPackagesForTesting();

    // Verify builds
    const projectRoot = path.resolve(__dirname, '..');
    ['core', 'react', 'nextjs'].forEach(pkg => {
      const distPath = path.join(projectRoot, 'packages', pkg, 'dist');
      if (!fs.existsSync(distPath)) {
        throw new Error(`Build failed: dist folder not found for ${pkg}`);
      }
      console.log(`✅ Verified dist folder for ${pkg}`);
    });

    // Step 2: Create test project
    console.log('\n📦 Creating test project...');
    createTestProject(testDir);
    createTestFiles(testDir);

    // Log the generated package.json for debugging
    const generatedPkgJson = JSON.parse(fs.readFileSync(path.join(testDir, 'package.json'), 'utf8'));
    console.log('📄 Generated package.json dependencies:');
    Object.entries(generatedPkgJson.dependencies).forEach(([name, path]) => {
      if (name.startsWith('@snapkit-studio')) {
        console.log(`  ${name}: ${path}`);
      }
    });

    // Step 3: Install dependencies
    console.log('\n📥 Installing dependencies in test project...');
    execCommand('npm install', testDir, 'Installing external dependencies');

    // Step 4: Test TypeScript compilation
    console.log('\n🔍 Testing TypeScript compilation...');
    execCommand('npm run build', testDir, 'Type checking external installation');

    // Step 5: Test basic functionality
    console.log('\n🧪 Testing basic functionality...');
    execCommand('npm test', testDir, 'Running functionality tests');

    console.log('\n✅ External installation simulation successful!');
    console.log(`📋 Test project available at: ${testDir}`);
    console.log('🗑️  Clean up with: rm -rf ' + testDir);

  } catch (error) {
    console.error('\n❌ External installation simulation failed:', error.message);
    console.error(`🗑️  Clean up test directory: rm -rf ${testDir}`);
    process.exit(1);
  }
}

if (require.main === module) {
  simulateExternalInstallation();
}

module.exports = {
  simulateExternalInstallation
};