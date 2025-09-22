import { describe, expect, it } from 'vitest';

import { SnapkitImageEngine } from '../image-engine';
import { SnapkitConfig } from '../types';

describe('Integration Tests', () => {
  const config: SnapkitConfig = {
    organizationName: 'test-org',
    defaultQuality: 80,
    defaultFormat: 'auto',
  };

  describe('Cross-framework consistency', () => {
    it('should generate identical URLs for same parameters across frameworks', () => {
      const engine = new SnapkitImageEngine(config);

      // Next.js-style usage through loader (height not supported in Next.js loader)
      const nextjsLoader = engine.createNextJsLoader();
      const nextjsUrl = nextjsLoader({
        src: 'test.jpg',
        width: 800,
        quality: 85,
      });

      // React-style usage without height for fair comparison
      const reactDataNoHeight = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        quality: 85,
        adjustQualityByNetwork: false,
      });

      // URLs should be identical for same parameters
      expect(reactDataNoHeight.url).toBe(nextjsUrl);
    });

    it('should handle environment-specific features consistently', () => {
      const engine = new SnapkitImageEngine(config);

      // Test srcSet generation consistency
      const imageData = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        height: 600,
      });

      expect(imageData.srcSet).toBeDefined();
      expect(imageData.srcSet.length).toBeGreaterThan(0);
      expect(imageData.url).toContain('test.jpg');
    });

    it('should maintain API compatibility', () => {
      const engine = new SnapkitImageEngine(config);

      // Test that all expected methods exist
      expect(typeof engine.generateImageData).toBe('function');
      expect(typeof engine.createNextJsLoader).toBe('function');
      expect(typeof engine.validateParams).toBe('function');
      expect(typeof engine.getConfig).toBe('function');
      expect(typeof engine.getUrlBuilder).toBe('function');
    });
  });

  describe('Configuration consistency', () => {
    it('should apply same defaults across different usage patterns', () => {
      const engine = new SnapkitImageEngine(config);

      const data1 = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
      });

      const data2 = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        transforms: {},
      });

      // Should generate same output for equivalent inputs
      expect(data1.transforms.format).toBe(data2.transforms.format);
      expect(data1.transforms.quality).toBe(data2.transforms.quality);
    });

    it('should handle edge cases consistently', () => {
      const engine = new SnapkitImageEngine(config);

      // Fill mode
      const fillData = engine.generateImageData({
        src: 'test.jpg',
        fill: true,
      });

      expect(fillData.size.width).toBe(1920);
      expect(fillData.size.height).toBeUndefined();
      expect(fillData.srcSet).toBeDefined();

      // With sizes
      const sizesData = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        sizes: '(max-width: 768px) 100vw, 50vw',
      });

      expect(sizesData.srcSet).toBeDefined();
      expect(sizesData.srcSet).toContain('w'); // Width descriptors
    });
  });

  describe('Error handling consistency', () => {
    it('should throw consistent errors for invalid config', () => {
      expect(() => {
        new SnapkitImageEngine({ organizationName: '' } as any);
      }).toThrow('organizationName is required');
    });

    it('should validate parameters consistently', () => {
      const engine = new SnapkitImageEngine(config);

      const invalidParams = {
        src: '',
        width: -100,
        quality: 150,
      };

      const result = engine.validateParams(invalidParams);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(3);
    });

    it('should handle generateImageData errors consistently', () => {
      const engine = new SnapkitImageEngine(config);

      expect(() => {
        engine.generateImageData({
          src: '',
          width: -100,
        });
      }).toThrow('Invalid parameters');
    });
  });
});
