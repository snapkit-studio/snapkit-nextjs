import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SnapkitConfig } from '../types';
import { SnapkitUrlBuilder } from '../url-builder';
import { UrlBuilderFactory } from '../url-builder-factory';

// Mock the SnapkitUrlBuilder
vi.mock('../url-builder', () => ({
  SnapkitUrlBuilder: vi.fn().mockImplementation((organizationName) => ({
    organizationName,
    id: Math.random(), // Each instance gets a unique ID for testing
  })),
}));

describe('UrlBuilderFactory', () => {
  const mockConfig: SnapkitConfig = {
    organizationName: 'test-org',
    defaultQuality: 80,
    defaultFormat: 'auto',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear the cache before each test
    UrlBuilderFactory.clearCache();
  });

  describe('getInstance', () => {
    it('Should create a new instance for the first request', () => {
      const builder = UrlBuilderFactory.getInstance(mockConfig);

      expect(builder).toBeDefined();
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(1);
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith('test-org');
    });

    it('Should return cached instance for the same organization', () => {
      const builder1 = UrlBuilderFactory.getInstance(mockConfig);
      const builder2 = UrlBuilderFactory.getInstance(mockConfig);

      expect(builder1).toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(1);
    });

    it('Should return same instance even with different quality/format', () => {
      const config1 = { ...mockConfig, defaultQuality: 80 };
      const config2 = { ...mockConfig, defaultQuality: 90 };
      const config3 = { ...mockConfig, defaultFormat: 'webp' as const };

      const builder1 = UrlBuilderFactory.getInstance(config1);
      const builder2 = UrlBuilderFactory.getInstance(config2);
      const builder3 = UrlBuilderFactory.getInstance(config3);

      // All should be the same instance since only organizationName matters
      expect(builder1).toBe(builder2);
      expect(builder2).toBe(builder3);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(1);
    });

    it('Should create different instances for different organizations', () => {
      const config1 = { ...mockConfig, organizationName: 'org1' };
      const config2 = { ...mockConfig, organizationName: 'org2' };

      const builder1 = UrlBuilderFactory.getInstance(config1);
      const builder2 = UrlBuilderFactory.getInstance(config2);

      expect(builder1).not.toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith('org1');
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith('org2');
    });

    it('Should handle multiple organizations concurrently', () => {
      const configs = [
        { ...mockConfig, organizationName: 'org1' },
        { ...mockConfig, organizationName: 'org2' },
        { ...mockConfig, organizationName: 'org3' },
      ];

      const builders = configs.map(config => UrlBuilderFactory.getInstance(config));

      // All should be different instances
      expect(new Set(builders).size).toBe(3);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(3);
    });
  });

  describe('clearCache', () => {
    it('Should clear all cached instances', () => {
      const config1 = { ...mockConfig, organizationName: 'org1' };
      const config2 = { ...mockConfig, organizationName: 'org2' };

      UrlBuilderFactory.getInstance(config1);
      UrlBuilderFactory.getInstance(config2);

      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);

      UrlBuilderFactory.clearCache();

      expect(UrlBuilderFactory.getCacheSize()).toBe(0);

      // Getting the same configs should create new instances
      UrlBuilderFactory.getInstance(config1);
      UrlBuilderFactory.getInstance(config2);

      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(4);
    });

    it('Should allow reusing after cache clear', () => {
      const builder1 = UrlBuilderFactory.getInstance(mockConfig);

      UrlBuilderFactory.clearCache();

      const builder2 = UrlBuilderFactory.getInstance(mockConfig);

      expect(builder1).not.toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCacheSize', () => {
    it('Should return 0 when cache is empty', () => {
      expect(UrlBuilderFactory.getCacheSize()).toBe(0);
    });

    it('Should return correct cache size', () => {
      UrlBuilderFactory.getInstance(mockConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);

      const config2 = { ...mockConfig, organizationName: 'org2' };
      UrlBuilderFactory.getInstance(config2);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);

      const config3 = { ...mockConfig, organizationName: 'org3' };
      UrlBuilderFactory.getInstance(config3);
      expect(UrlBuilderFactory.getCacheSize()).toBe(3);
    });

    it('Should not increase size for duplicate organizations', () => {
      UrlBuilderFactory.getInstance(mockConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);

      // Same organization, different quality
      const sameOrgConfig = { ...mockConfig, defaultQuality: 95 };
      UrlBuilderFactory.getInstance(sameOrgConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);
    });

    it('Should decrease after cache clear', () => {
      UrlBuilderFactory.getInstance(mockConfig);
      const config2 = { ...mockConfig, organizationName: 'org2' };
      UrlBuilderFactory.getInstance(config2);

      expect(UrlBuilderFactory.getCacheSize()).toBe(2);

      UrlBuilderFactory.clearCache();

      expect(UrlBuilderFactory.getCacheSize()).toBe(0);
    });
  });

  describe('createKey', () => {
    it('Should use only organizationName for cache key', () => {
      // This is tested indirectly through getInstance behavior
      const config1 = {
        organizationName: 'test-org',
        defaultQuality: 80,
        defaultFormat: 'webp' as const,
      };
      const config2 = {
        organizationName: 'test-org',
        defaultQuality: 90,
        defaultFormat: 'avif' as const,
      };

      const builder1 = UrlBuilderFactory.getInstance(config1);
      const builder2 = UrlBuilderFactory.getInstance(config2);

      // Should be the same instance despite different quality/format
      expect(builder1).toBe(builder2);
    });
  });

  describe('Edge cases', () => {
    it('Should handle rapid successive calls for same organization', () => {
      const promises = Array.from({ length: 10 }, () =>
        Promise.resolve(UrlBuilderFactory.getInstance(mockConfig))
      );

      return Promise.all(promises).then(builders => {
        // All should be the same instance
        const firstBuilder = builders[0];
        builders.forEach(builder => {
          expect(builder).toBe(firstBuilder);
        });

        // Should have only created one instance
        expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(1);
      });
    });

    it('Should handle empty organization name', () => {
      const config = {
        organizationName: '',
        defaultQuality: 80,
        defaultFormat: 'auto' as const,
      };

      const builder = UrlBuilderFactory.getInstance(config);
      expect(builder).toBeDefined();
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith('');
    });

    it('Should handle special characters in organization name', () => {
      const config = {
        organizationName: 'org-with-special_chars.123',
        defaultQuality: 80,
        defaultFormat: 'auto' as const,
      };

      const builder = UrlBuilderFactory.getInstance(config);
      expect(builder).toBeDefined();
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith('org-with-special_chars.123');
    });

    it('Should handle undefined quality and format gracefully', () => {
      const config = {
        organizationName: 'test-org',
      } as SnapkitConfig;

      const builder = UrlBuilderFactory.getInstance(config);
      expect(builder).toBeDefined();
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith('test-org');
    });

    it('Should maintain separate caches for case-sensitive organization names', () => {
      const config1 = { ...mockConfig, organizationName: 'TestOrg' };
      const config2 = { ...mockConfig, organizationName: 'testorg' };

      const builder1 = UrlBuilderFactory.getInstance(config1);
      const builder2 = UrlBuilderFactory.getInstance(config2);

      expect(builder1).not.toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
    });
  });
});