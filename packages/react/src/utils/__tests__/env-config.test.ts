import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mergeConfigWithEnv } from '../env-config';

describe('env-config utilities', () => {
  const originalProcessEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.env
    process.env = { ...originalProcessEnv };
  });

  afterEach(() => {
    process.env = originalProcessEnv;
  });

  describe('mergeConfigWithEnv', () => {
    it('should prioritize props over environment variables', () => {
      process.env.SNAPKIT_ORGANIZATION_NAME = 'env-org';
      process.env.SNAPKIT_DEFAULT_QUALITY = '75';
      process.env.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT = 'webp';

      const propsConfig = {
        organizationName: 'props-org',
        defaultQuality: 90,
        defaultFormat: 'avif' as const,
      };

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        organizationName: 'props-org',
        defaultQuality: 90,
        defaultFormat: 'avif',
      });
    });

    it('should fall back to environment variables when props are not provided', () => {
      process.env.SNAPKIT_ORGANIZATION_NAME = 'env-org';
      process.env.SNAPKIT_DEFAULT_QUALITY = '75';
      process.env.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT = 'webp';

      const propsConfig = {};

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        organizationName: 'env-org',
        defaultQuality: 75,
        defaultFormat: 'webp',
      });
    });

    it('should use default values when neither props nor env are provided', () => {
      delete process.env.SNAPKIT_ORGANIZATION_NAME;
      delete process.env.SNAPKIT_DEFAULT_QUALITY;
      delete process.env.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;

      const propsConfig = {};

      expect(() => mergeConfigWithEnv(propsConfig)).toThrow(
        'SNAPKIT_ORGANIZATION_NAME is not set. Image optimization may not work correctly.',
      );
    });

    it('should merge partial props with environment defaults', () => {
      process.env.SNAPKIT_ORGANIZATION_NAME = 'env-org';
      process.env.SNAPKIT_DEFAULT_QUALITY = '75';
      process.env.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT = 'webp';

      const propsConfig = {
        defaultQuality: 90,
      };

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        organizationName: 'env-org',
        defaultQuality: 90,
        defaultFormat: 'webp',
      });
    });

    it('should use built-in defaults when no config is provided', () => {
      process.env.SNAPKIT_ORGANIZATION_NAME = 'test-org';
      delete process.env.SNAPKIT_DEFAULT_QUALITY;
      delete process.env.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;

      const propsConfig = {};

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        organizationName: 'test-org',
        defaultQuality: 85,
        defaultFormat: 'auto',
      });
    });
  });
});
