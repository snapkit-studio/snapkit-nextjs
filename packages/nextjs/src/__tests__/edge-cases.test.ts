import {
  getDefaultUrlBuilder,
  ImageLoaderParams,
  SnapkitLoaderOptions,
  SnapkitUrlBuilder,
} from '@snapkit/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSnapkitLoader, snapkitLoader } from '../image-loader';

// Mock @snapkit/core 모듈
vi.mock('@snapkit/core', () => ({
  getDefaultUrlBuilder: vi.fn(),
  SnapkitUrlBuilder: vi.fn(),
}));

describe('Edge Cases and Error Handling', () => {
  const mockUrlBuilder = {
    buildTransformedUrl: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('snapkitLoader edge cases', () => {
    it('should handle zero width parameter', () => {
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/zero-width.jpg');

      const params: ImageLoaderParams = {
        src: '/test.jpg',
        width: 0,
        quality: 80,
      };

      const result = snapkitLoader(params);

      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('/test.jpg', {
        width: 0,
        quality: 80,
        format: 'auto',
      });
      expect(result).toBe('https://example.com/zero-width.jpg');
    });

    it('should handle very large width parameter', () => {
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/large-width.jpg');

      const params: ImageLoaderParams = {
        src: '/test.jpg',
        width: 9999,
        quality: 100,
      };

      const result = snapkitLoader(params);

      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('/test.jpg', {
        width: 9999,
        quality: 100,
        format: 'auto',
      });
      expect(result).toBe('https://example.com/large-width.jpg');
    });

    it('should handle quality parameter edge values', () => {
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/edge-quality.jpg');

      // Test with quality 0
      snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: 0,
      });

      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('/test.jpg', {
        width: 400,
        quality: 0,
        format: 'auto',
      });

      // Test with quality 100
      snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: 100,
      });

      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('/test.jpg', {
        width: 400,
        quality: 100,
        format: 'auto',
      });
    });
  });

  describe('createSnapkitLoader edge cases', () => {
    const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);

    beforeEach(() => {
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
    });

    it('should handle empty string values in options', () => {
      const options: SnapkitLoaderOptions = {
        baseUrl: '',
        organizationName: '',
        optimizeFormat: 'auto',
      };

      const customLoader = createSnapkitLoader(options);

      expect(MockSnapkitUrlBuilder).toHaveBeenCalledWith('', '');
      expect(typeof customLoader).toBe('function');
    });

    it('should handle all possible optimizeFormat values', () => {
      const formats: Array<SnapkitLoaderOptions['optimizeFormat']> = [
        'auto', 'webp', 'avif', 'off', undefined,
      ];

      formats.forEach((format) => {
        mockUrlBuilder.buildTransformedUrl.mockReturnValue(`https://example.com/test-${format}.jpg`);

        const options: SnapkitLoaderOptions = {
          baseUrl: 'https://test.com',
          organizationName: 'test-org',
          optimizeFormat: format,
        };

        const customLoader = createSnapkitLoader(options);
        customLoader({
          src: '/test.jpg',
          width: 400,
          quality: 80,
        });

        const expectedFormat = format === 'off' ? undefined : (format || 'auto');

        expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
          '/test.jpg',
          {
            width: 400,
            quality: 80,
            format: expectedFormat,
          },
          'test-org',
        );

        vi.clearAllMocks();
        MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      });
    });

    it('should handle complex transform combinations', () => {
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://complex.com',
        organizationName: 'complex-org',
        transforms: {
          blur: 0,
          grayscale: false,
          brightness: 1,
          hue: 0,
          lightness: 0,
          saturation: 1,
          negate: false,
          normalize: false,
          quality: 50, // This should be overridden
          width: 200,   // This should be overridden
        },
        optimizeFormat: 'webp',
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://complex.com/complex.webp');

      const customLoader = createSnapkitLoader(options);
      const result = customLoader({
        src: '/complex.jpg',
        width: 800,  // Should override transforms.width
        quality: 90, // Should override transforms.quality
      });

      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/complex.jpg',
        {
          blur: 0,
          grayscale: false,
          brightness: 1,
          hue: 0,
          lightness: 0,
          saturation: 1,
          negate: false,
          normalize: false,
          width: 800,    // From loader params
          quality: 90,   // From loader params
          format: 'webp',
        },
        'complex-org',
      );

      expect(result).toBe('https://complex.com/complex.webp');
    });

    it('should handle undefined transforms spread operation', () => {
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://undefined-transforms.com',
        organizationName: 'test-org',
        transforms: undefined,
        optimizeFormat: 'auto',
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://undefined-transforms.com/result.jpg');

      const customLoader = createSnapkitLoader(options);
      const result = customLoader({
        src: '/test.jpg',
        width: 500,
      });

      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 500,
          quality: undefined,
          format: 'auto',
        },
        'test-org',
      );

      expect(result).toBe('https://undefined-transforms.com/result.jpg');
    });
  });

  describe('Type safety and parameter validation', () => {
    it('should work with ImageLoaderParams interface compliance', () => {
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://type-safe.com/result.jpg');

      // Test that our loader accepts exact ImageLoaderParams interface
      const validParams: ImageLoaderParams = {
        src: '/type-test.jpg',
        width: 600,
        quality: 85,
      };

      const result = snapkitLoader(validParams);
      expect(result).toBe('https://type-safe.com/result.jpg');

      // Test with minimal required params
      const minimalParams: ImageLoaderParams = {
        src: '/minimal.jpg',
        width: 300,
      };

      const minimalResult = snapkitLoader(minimalParams);
      expect(minimalResult).toBe('https://type-safe.com/result.jpg');
    });

    it('should maintain function signature compatibility', () => {
      // Test that createSnapkitLoader returns a function with correct signature
      const options: SnapkitLoaderOptions = {};
      const customLoader = createSnapkitLoader(options);

      // TypeScript will catch if this doesn't match ImageLoader type
      expect(typeof customLoader).toBe('function');
      expect(customLoader.length).toBe(1); // Should accept 1 parameter
    });
  });
});
