import {
  SnapkitLoaderOptions,
  SnapkitUrlBuilder,
} from '@snapkit-studio/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSnapkitLoader, snapkitLoader } from '../image-loader';

// Mock @snapkit-studio/core module
vi.mock('@snapkit-studio/core', () => ({
  SnapkitUrlBuilder: vi.fn(),
}));

describe('Edge Cases and Error Handling', () => {
  const mockUrlBuilder = {
    buildTransformedUrl: vi.fn(),
  };

  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('snapkitLoader edge cases', () => {
    it('should handle zero width parameter', () => {
      const params = {
        src: '/test.jpg',
        width: 0,
        quality: 80,
      };

      // When & Then: should throw error for invalid width
      expect(() => snapkitLoader(params)).toThrow(
        'Invalid width parameter: width must be a positive number. Received: 0 (type: number)'
      );
    });

    it('should handle very large width parameter', () => {
      // Given: SnapkitUrlBuilder is mocked
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/large-width.jpg');

      const params = {
        src: '/test.jpg',
        width: 9999,
        quality: 100,
      };

      // When: snapkitLoader is called with large width
      const result = snapkitLoader(params);

      // Then: should handle large width normally
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('/test.jpg', {
        width: 9999,
        quality: 100,
        format: 'auto',
      });
      expect(result).toBe('https://example.com/large-width.jpg');
    });

    it('should handle quality parameter edge values', () => {
      // Test with quality 0 - should throw error
      expect(() => snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: 0,
      })).toThrow('Invalid quality parameter: quality must be a number between 1 and 100. Received: 0 (type: number)');

      // Test with quality 101 - should throw error
      expect(() => snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: 101,
      })).toThrow('Invalid quality parameter: quality must be a number between 1 and 100. Received: 101 (type: number)');

      // Given: SnapkitUrlBuilder is mocked for valid quality tests
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/edge-quality.jpg');

      // Test with quality 1 - should work
      const result1 = snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: 1,
      });
      expect(result1).toBe('https://example.com/edge-quality.jpg');

      // Test with quality 100 - should work
      const result100 = snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: 100,
      });
      expect(result100).toBe('https://example.com/edge-quality.jpg');
    });

    it('should handle invalid image source', () => {
      // Test with empty string src
      expect(() => snapkitLoader({
        src: '',
        width: 400,
        quality: 80,
      })).toThrow('Invalid image source: src must be a non-empty string. Received: ""');

      // Test with null src
      expect(() => snapkitLoader({
        src: null as any,
        width: 400,
        quality: 80,
      })).toThrow('Invalid image source: src must be a non-empty string. Received: object');

      // Test with undefined src
      expect(() => snapkitLoader({
        src: undefined as any,
        width: 400,
        quality: 80,
      })).toThrow('Invalid image source: src must be a non-empty string. Received: undefined');
    });
  });

  describe('createSnapkitLoader edge cases', () => {
    const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);

    beforeEach(() => {
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
    });

    it('should handle empty string values in options', () => {
      const options: SnapkitLoaderOptions = {
        organizationName: '',
      };

      // When & Then: should throw error for empty organization name
      expect(() => createSnapkitLoader(options)).toThrow(
        'Invalid organization name: organizationName must be a non-empty string. Received: "". Please provide your Snapkit organization name from your dashboard.'
      );
    });

    it('should handle complex transform combinations', () => {
      const options: SnapkitLoaderOptions = {
        organizationName: 'complex-org',
        transforms: {
          blur: 0,
          grayscale: false,
          quality: 50, // This should be overridden
          width: 200,   // This should be overridden
          format: 'webp',
        },
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
          width: 800,    // From loader params
          quality: 90,   // From loader params
          format: 'webp',
        }
      );

      expect(result).toBe('https://complex.com/complex.webp');
    });

    it('should handle undefined transforms spread operation', () => {
      const options: SnapkitLoaderOptions = {
        organizationName: 'test-org',
        // transforms is undefined
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://test.com/undefined-transforms.jpg');

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
        }
      );

      expect(result).toBe('https://test.com/undefined-transforms.jpg');
    });

    it('should handle null options', () => {
      // When & Then: should throw error for null options
      expect(() => createSnapkitLoader(null as any)).toThrow(
        'Invalid loader options: options must be an object. Received: null'
      );
    });

    it('should handle undefined options', () => {
      // When & Then: should throw error for undefined options
      expect(() => createSnapkitLoader(undefined as any)).toThrow(
        'Invalid loader options: options must be an object. Received: undefined'
      );
    });

    it('should handle invalid unoptimizedFormat option', () => {
      const options = {
        organizationName: 'test-org',
        unoptimizedFormat: 'invalid' as any,
      };

      // When & Then: should throw error for invalid unoptimizedFormat
      expect(() => createSnapkitLoader(options)).toThrow(
        'Invalid unoptimizedFormat option: must be a boolean value. Received: invalid (type: string)'
      );
    });
  });

  describe('Type safety and parameter validation', () => {
    it('should maintain function signature compatibility', () => {
      expect(() => createSnapkitLoader({
        organizationName: undefined as any,
      })).toThrow('Invalid organization name: organizationName must be a non-empty string.');
    });

    it('should handle NaN and Infinity values', () => {
      // Test with NaN width
      expect(() => snapkitLoader({
        src: '/test.jpg',
        width: NaN,
        quality: 80,
      })).toThrow('Invalid width parameter: width must be a positive number.');

      // Test with Infinity width
      expect(() => snapkitLoader({
        src: '/test.jpg',
        width: Infinity,
        quality: 80,
      })).toThrow('Invalid width parameter: width must be a positive number.');

      // Test with NaN quality
      expect(() => snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: NaN,
      })).toThrow('Invalid quality parameter: quality must be a number between 1 and 100.');

      // Test with Infinity quality
      expect(() => snapkitLoader({
        src: '/test.jpg',
        width: 400,
        quality: Infinity,
      })).toThrow('Invalid quality parameter: quality must be a number between 1 and 100.');
    });
  });
});