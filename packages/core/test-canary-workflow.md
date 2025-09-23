# Test Canary Workflow

This file is created to test the canary workflow fix in test-external-nextjs.yml.

Changes made:
- Fixed canary version generation to read from package.json instead of package.release.json
- Should resolve 404 errors when publishing canary versions

Test date: 2025-01-22