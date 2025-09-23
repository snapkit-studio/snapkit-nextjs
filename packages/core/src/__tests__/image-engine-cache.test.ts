import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SnapkitImageEngine } from '../image-engine';
import { ImageEngineCache } from '../image-engine-cache';
import type { SnapkitConfig } from '../types';

// Mock the SnapkitImageEngine
vi.mock('../image-engine', () => ({
  SnapkitImageEngine: vi.fn().mockImplementation((config) => ({
    config,
    id: Math.random(), // Each instance gets a unique ID for testing
  })),
}));

describe('ImageEngineCache', () => {
  const mockConfig: SnapkitConfig = {
    organizationName: 'test-org',
    defaultQuality: 80,
    defaultOptimizeFormat: 'auto',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear the cache
    ImageEngineCache.clearCache();
    // Reset time mocks
    vi.useRealTimers();
  });

  describe('getInstance', () => {
    it('Should create a new instance for the first request', () => {
      const engine = ImageEngineCache.getInstance(mockConfig);

      expect(engine).toBeDefined();
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);
      expect(SnapkitImageEngine).toHaveBeenCalledWith(mockConfig);
    });

    it('Should return cached instance for the same configuration', () => {
      const engine1 = ImageEngineCache.getInstance(mockConfig);
      const engine2 = ImageEngineCache.getInstance(mockConfig);

      expect(engine1).toBe(engine2);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);
    });

    it('Should create different instances for different configurations', () => {
      const config1 = { ...mockConfig, organizationName: 'org1' };
      const config2 = { ...mockConfig, organizationName: 'org2' };

      const engine1 = ImageEngineCache.getInstance(config1);
      const engine2 = ImageEngineCache.getInstance(config2);

      expect(engine1).not.toBe(engine2);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(2);
    });

    it('Should handle quality differences in cache key', () => {
      const config1 = { ...mockConfig, defaultQuality: 80 };
      const config2 = { ...mockConfig, defaultQuality: 90 };

      const engine1 = ImageEngineCache.getInstance(config1);
      const engine2 = ImageEngineCache.getInstance(config2);

      expect(engine1).not.toBe(engine2);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(2);
    });

    it('Should expire cached instances after TTL', () => {
      vi.useFakeTimers();
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      const engine1 = ImageEngineCache.getInstance(mockConfig);

      // Advance time by 4 minutes (within TTL)
      vi.setSystemTime(startTime + 4 * 60 * 1000);
      const engine2 = ImageEngineCache.getInstance(mockConfig);

      expect(engine1).toBe(engine2);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);

      // Advance time by 9 minutes and 1 second from last access (4 min + 5 min + 1 sec = beyond TTL)
      vi.setSystemTime(startTime + 9 * 60 * 1000 + 1000);
      const engine3 = ImageEngineCache.getInstance(mockConfig);

      expect(engine1).not.toBe(engine3);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(2);
    });

    it('Should update last access time when retrieving cached instance', () => {
      vi.useFakeTimers();
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      const engine1 = ImageEngineCache.getInstance(mockConfig);

      // Advance time by 4 minutes
      vi.setSystemTime(startTime + 4 * 60 * 1000);
      const engine2 = ImageEngineCache.getInstance(mockConfig);

      // Advance time by another 4 minutes (8 minutes from start)
      vi.setSystemTime(startTime + 8 * 60 * 1000);
      const engine3 = ImageEngineCache.getInstance(mockConfig);

      // Should still be the same instance since we accessed it at 4 minutes
      expect(engine1).toBe(engine3);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);
    });

    it('Should cleanup old entries when cache size exceeds maximum', () => {
      vi.useFakeTimers();
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      // Create 10 instances (MAX_CACHE_SIZE)
      for (let i = 0; i < 10; i++) {
        const config = { ...mockConfig, organizationName: `org${i}` };
        ImageEngineCache.getInstance(config);
        vi.setSystemTime(startTime + i * 1000); // Stagger creation times
      }

      expect(SnapkitImageEngine).toHaveBeenCalledTimes(10);

      // Create one more instance (should trigger cleanup)
      const newConfig = { ...mockConfig, organizationName: 'org10' };
      ImageEngineCache.getInstance(newConfig);

      expect(SnapkitImageEngine).toHaveBeenCalledTimes(11);

      // The cache size should not exceed maximum
      expect(ImageEngineCache.getCacheSize()).toBeLessThanOrEqual(10);
    });
  });

  describe('clearCache', () => {
    it('Should clear all cached instances', () => {
      const config1 = { ...mockConfig, organizationName: 'org1' };
      const config2 = { ...mockConfig, organizationName: 'org2' };

      ImageEngineCache.getInstance(config1);
      ImageEngineCache.getInstance(config2);

      expect(SnapkitImageEngine).toHaveBeenCalledTimes(2);

      ImageEngineCache.clearCache();

      // Getting the same configs should create new instances
      ImageEngineCache.getInstance(config1);
      ImageEngineCache.getInstance(config2);

      expect(SnapkitImageEngine).toHaveBeenCalledTimes(4);
    });
  });

  describe('getCacheSize', () => {
    it('Should return the current cache size', () => {
      expect(ImageEngineCache.getCacheSize()).toBe(0);

      ImageEngineCache.getInstance(mockConfig);
      expect(ImageEngineCache.getCacheSize()).toBe(1);

      const config2 = { ...mockConfig, organizationName: 'org2' };
      ImageEngineCache.getInstance(config2);
      expect(ImageEngineCache.getCacheSize()).toBe(2);

      ImageEngineCache.clearCache();
      expect(ImageEngineCache.getCacheSize()).toBe(0);
    });
  });

  describe('getCacheStats', () => {
    it('Should return cache statistics', () => {
      vi.useFakeTimers();
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      const config1 = { ...mockConfig, organizationName: 'org1' };
      const config2 = { ...mockConfig, organizationName: 'org2', defaultQuality: 90 };

      ImageEngineCache.getInstance(config1);

      // Advance time slightly
      vi.setSystemTime(startTime + 1000);
      ImageEngineCache.getInstance(config2);

      const stats = ImageEngineCache.getCacheStats();
      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(10);
      expect(stats.ttl).toBe(5 * 60 * 1000);
      expect(stats.entries).toHaveLength(2);

      // Check that entries have correct structure
      stats.entries.forEach(entry => {
        expect(entry).toHaveProperty('key');
        expect(entry).toHaveProperty('age');
        expect(entry.age).toBeGreaterThanOrEqual(0);
      });
    });

    it('Should show age of cache entries correctly', () => {
      vi.useFakeTimers();
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      ImageEngineCache.getInstance(mockConfig);

      // Advance time by 1 minute
      vi.setSystemTime(startTime + 60 * 1000);

      const stats = ImageEngineCache.getCacheStats();
      expect(stats.entries[0].age).toBe(60 * 1000);
    });
  });

  describe('Edge cases', () => {
    it('Should handle undefined optimize format in config', () => {
      const config = {
        organizationName: 'test-org',
        defaultQuality: 80,
        // defaultOptimizeFormat is optional
      } as SnapkitConfig;

      const engine = ImageEngineCache.getInstance(config);
      expect(engine).toBeDefined();
      expect(SnapkitImageEngine).toHaveBeenCalledWith(config);
    });

    it('Should handle rapid successive calls', () => {
      const promises = Array.from({ length: 10 }, () =>
        Promise.resolve(ImageEngineCache.getInstance(mockConfig))
      );

      return Promise.all(promises).then(engines => {
        // All should be the same instance
        const firstEngine = engines[0];
        engines.forEach(engine => {
          expect(engine).toBe(firstEngine);
        });

        // Should have only created one instance
        expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);
      });
    });

    it('Should create unique keys for different configs', () => {
      const configs = [
        { ...mockConfig, organizationName: 'org1' },
        { ...mockConfig, organizationName: 'org2' },
        { ...mockConfig, defaultQuality: 90 },
        { ...mockConfig, defaultOptimizeFormat: 'webp' as const },
      ];

      const engines = configs.map(config => ImageEngineCache.getInstance(config));

      // All engines should be different
      for (let i = 0; i < engines.length; i++) {
        for (let j = i + 1; j < engines.length; j++) {
          expect(engines[i]).not.toBe(engines[j]);
        }
      }

      expect(SnapkitImageEngine).toHaveBeenCalledTimes(configs.length);
    });

    it('Should handle cache with defaultFormat property', () => {
      const config = {
        organizationName: 'test-org',
        defaultQuality: 85,
        defaultFormat: 'webp',
      } as any; // Using any to test the actual implementation

      const engine = ImageEngineCache.getInstance(config);
      expect(engine).toBeDefined();

      // Should use the same cache key for consistency
      const sameConfig = {
        organizationName: 'test-org',
        defaultQuality: 85,
        defaultFormat: 'webp',
      } as any;

      const engine2 = ImageEngineCache.getInstance(sameConfig);
      expect(engine).toBe(engine2);
    });
  });
});