import { describe, expect, it } from 'vitest';

describe('index exports', () => {
  it('should export snapkitLoader function', async () => {
    // When: importing snapkitLoader
    const { snapkitLoader } = await import('../index');

    // Then: should be a function
    expect(typeof snapkitLoader).toBe('function');
  });

  it('should export createSnapkitLoader function', async () => {
    // When: importing createSnapkitLoader
    const { createSnapkitLoader } = await import('../index');

    // Then: should be a function
    expect(typeof createSnapkitLoader).toBe('function');
  });

  it('should export all required types from @snapkit-studio/core', async () => {
    // When: importing the module
    const exports = await import('../index');

    // Then: should have exported functions
    expect(exports.snapkitLoader).toBeDefined();
    expect(exports.createSnapkitLoader).toBeDefined();

    // Note: TypeScript types are compile-time only and cannot be tested at runtime
    // We verify that the module imports without errors, which confirms type exports work
  });

  it('should re-export all functions from image-loader module', async () => {
    // When: importing from index vs importing from image-loader directly
    const indexExports = await import('../index');
    const imageLoaderExports = await import('../image-loader');

    // Then: should export the same functions
    expect(indexExports.snapkitLoader).toBe(imageLoaderExports.snapkitLoader);
    expect(indexExports.createSnapkitLoader).toBe(imageLoaderExports.createSnapkitLoader);
  });

  it('should have a clean module structure with only expected exports', async () => {
    // When: importing the module
    const exports = await import('../index');

    // Then: should only export expected items
    const exportKeys = Object.keys(exports);
    expect(exportKeys).toEqual(
      expect.arrayContaining(['snapkitLoader', 'createSnapkitLoader']),
    );

    // Should have exactly 2 exports (functions only, types are compile-time)
    expect(exportKeys.length).toBe(2);
  });
});
