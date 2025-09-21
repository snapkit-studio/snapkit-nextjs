#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkWorkspaceRefs(packageJsonPath) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageName = packageJson.name;

  let hasWorkspaceRefs = false;

  // Check dependencies
  if (packageJson.dependencies) {
    for (const [dep, version] of Object.entries(packageJson.dependencies)) {
      if (version.startsWith('workspace:')) {
        console.error(`❌ Error in ${packageName}: dependency "${dep}" has workspace reference "${version}"`);
        hasWorkspaceRefs = true;
      }
    }
  }

  // Check peerDependencies
  if (packageJson.peerDependencies) {
    for (const [dep, version] of Object.entries(packageJson.peerDependencies)) {
      if (version.startsWith('workspace:')) {
        console.error(`❌ Error in ${packageName}: peerDependency "${dep}" has workspace reference "${version}"`);
        hasWorkspaceRefs = true;
      }
    }
  }

  // Check optionalDependencies
  if (packageJson.optionalDependencies) {
    for (const [dep, version] of Object.entries(packageJson.optionalDependencies)) {
      if (version.startsWith('workspace:')) {
        console.error(`❌ Error in ${packageName}: optionalDependency "${dep}" has workspace reference "${version}"`);
        hasWorkspaceRefs = true;
      }
    }
  }

  // devDependencies with workspace refs are OK (not published to npm)
  // But we can warn about them
  if (packageJson.devDependencies) {
    for (const [dep, version] of Object.entries(packageJson.devDependencies)) {
      if (version.startsWith('workspace:')) {
        console.log(`ℹ️  Info in ${packageName}: devDependency "${dep}" uses workspace reference (this is OK)`);
      }
    }
  }

  if (hasWorkspaceRefs) {
    console.error(`\n❌ Package ${packageName} has workspace references in production dependencies!`);
    console.error('These must be replaced with actual version numbers before publishing.');
    process.exit(1);
  } else {
    console.log(`✅ Package ${packageName} is ready for publishing (no workspace refs in production deps)`);
  }
}

// Get package.json path from command line or use current directory
const packageJsonPath = process.argv[2] || path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error(`❌ package.json not found at ${packageJsonPath}`);
  process.exit(1);
}

checkWorkspaceRefs(packageJsonPath);