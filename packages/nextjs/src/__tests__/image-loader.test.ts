import {
  getDefaultUrlBuilder,
  ImageLoaderParams,
  SnapkitLoaderOptions,
  SnapkitUrlBuilder,
} from '@snapkit/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSnapkitLoader, snapkitLoader } from '../image-loader';

// Mock @snapkit/core 모듈
vi.mock('@snapkit/core', () => ({
  getDefaultUrlBuilder: vi.fn(),
  setDefaultUrlBuilder: vi.fn(),
  SnapkitUrlBuilder: vi.fn(),
}));

describe('image-loader', () => {
  const mockUrlBuilder = {
    buildTransformedUrl: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('snapkitLoader', () => {
    it('should throw error when default URL builder is not configured', () => {
      // Given: getDefaultUrlBuilder returns null
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(null as any);

      const params: ImageLoaderParams = {
        src: '/test-image.jpg',
        width: 800,
        quality: 85,
      };

      // When & Then: snapkitLoader should throw error
      expect(() => snapkitLoader(params)).toThrow(
        'Snapkit URL builder not configured. Please call setDefaultUrlBuilder() first.',
      );
    });

    it('should call buildTransformedUrl with correct parameters when URL builder is configured', () => {
      // Given: getDefaultUrlBuilder returns a mock URL builder
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/optimized-image.jpg');

      const params: ImageLoaderParams = {
        src: '/test-image.jpg',
        width: 800,
        quality: 85,
      };

      // When: snapkitLoader is called
      const result = snapkitLoader(params);

      // Then: buildTransformedUrl should be called with correct parameters
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
        width: 800,
        quality: 85,
        format: 'auto',
      });

      expect(result).toBe('https://example.com/optimized-image.jpg');
    });

    it('should work with minimal parameters (no quality)', () => {
      // Given: getDefaultUrlBuilder returns a mock URL builder
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/minimal-image.jpg');

      const params: ImageLoaderParams = {
        src: '/minimal-image.jpg',
        width: 400,
      };

      // When: snapkitLoader is called without quality
      const result = snapkitLoader(params);

      // Then: buildTransformedUrl should be called with undefined quality
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('/minimal-image.jpg', {
        width: 400,
        quality: undefined,
        format: 'auto',
      });

      expect(result).toBe('https://example.com/minimal-image.jpg');
    });

    it('should handle different image source formats', () => {
      // Given: getDefaultUrlBuilder returns a mock URL builder
      vi.mocked(getDefaultUrlBuilder).mockReturnValue(mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://example.com/absolute-image.jpg');

      const params: ImageLoaderParams = {
        src: 'https://external.com/image.jpg',
        width: 1200,
        quality: 95,
      };

      // When: snapkitLoader is called with absolute URL
      const result = snapkitLoader(params);

      // Then: should pass through the absolute URL
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith('https://external.com/image.jpg', {
        width: 1200,
        quality: 95,
        format: 'auto',
      });

      expect(result).toBe('https://example.com/absolute-image.jpg');
    });
  });

  describe('createSnapkitLoader', () => {
    const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);

    beforeEach(() => {
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
    });

    it('should create a custom loader with basic options', () => {
      // Given: basic options
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://custom.example.com',
        organizationName: 'test-org',
      };

      // When: createSnapkitLoader is called
      const customLoader = createSnapkitLoader(options);

      // Then: SnapkitUrlBuilder should be instantiated with correct parameters
      expect(MockSnapkitUrlBuilder).toHaveBeenCalledWith(
        'https://custom.example.com',
        'test-org',
      );

      // And: should return a function
      expect(typeof customLoader).toBe('function');
    });

    it('should create loader that handles optimizeFormat "off"', () => {
      // Given: options with optimizeFormat set to "off"
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://custom.example.com',
        organizationName: 'test-org',
        optimizeFormat: 'off',
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://custom.example.com/no-format.jpg');

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader(options);
      const result = customLoader({
        src: '/test.jpg',
        width: 600,
        quality: 80,
      });

      // Then: format should be undefined (not "off")
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 600,
          quality: 80,
          format: undefined,
        },
        'test-org',
      );

      expect(result).toBe('https://custom.example.com/no-format.jpg');
    });

    it('should create loader that uses default "auto" format when optimizeFormat is not specified', () => {
      // Given: options without optimizeFormat
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://custom.example.com',
        organizationName: 'test-org',
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://custom.example.com/auto-format.jpg');

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader(options);
      const result = customLoader({
        src: '/test.jpg',
        width: 600,
        quality: 80,
      });

      // Then: format should default to "auto"
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 600,
          quality: 80,
          format: 'auto',
        },
        'test-org',
      );

      expect(result).toBe('https://custom.example.com/auto-format.jpg');
    });

    it('should create loader that applies optimizeFormat when specified', () => {
      // Given: options with specific optimizeFormat
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://custom.example.com',
        organizationName: 'test-org',
        optimizeFormat: 'webp',
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://custom.example.com/webp-format.webp');

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader(options);
      const result = customLoader({
        src: '/test.jpg',
        width: 600,
        quality: 80,
      });

      // Then: format should be "webp"
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 600,
          quality: 80,
          format: 'webp',
        },
        'test-org',
      );

      expect(result).toBe('https://custom.example.com/webp-format.webp');
    });

    it('should create loader that merges custom transforms with loader parameters', () => {
      // Given: options with custom transforms
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://custom.example.com',
        organizationName: 'test-org',
        transforms: {
          blur: 5,
          grayscale: true,
          fit: 'cover',
        },
        optimizeFormat: 'avif',
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://custom.example.com/transformed.avif');

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader(options);
      const result = customLoader({
        src: '/test.jpg',
        width: 800,
        quality: 90,
      });

      // Then: transforms should be merged correctly
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          blur: 5,
          grayscale: true,
          fit: 'cover',
          width: 800,
          quality: 90,
          format: 'avif',
        },
        'test-org',
      );

      expect(result).toBe('https://custom.example.com/transformed.avif');
    });

    it('should create loader that handles undefined baseUrl and organizationName', () => {
      // Given: minimal options
      const options: SnapkitLoaderOptions = {};

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://default.example.com/minimal.jpg');

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader(options);

      // Then: SnapkitUrlBuilder should be called with undefined values
      expect(MockSnapkitUrlBuilder).toHaveBeenCalledWith(undefined, undefined);

      // And: should work when called
      const result = customLoader({
        src: '/test.jpg',
        width: 400,
      });

      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 400,
          quality: undefined,
          format: 'auto',
        },
        undefined,
      );

      expect(result).toBe('https://default.example.com/minimal.jpg');
    });

    it('should override transforms width and quality with loader parameters', () => {
      // Given: options with transforms that include width and quality
      const options: SnapkitLoaderOptions = {
        baseUrl: 'https://custom.example.com',
        organizationName: 'test-org',
        transforms: {
          width: 500,     // This should be overridden
          quality: 70,    // This should be overridden
          blur: 3,
        },
      };

      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://custom.example.com/overridden.jpg');

      // When: custom loader is created and called with different width/quality
      const customLoader = createSnapkitLoader(options);
      const result = customLoader({
        src: '/test.jpg',
        width: 1000,    // Should override transforms.width
        quality: 95,    // Should override transforms.quality
      });

      // Then: loader parameters should take precedence
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 1000,    // From loader params, not transforms
          quality: 95,    // From loader params, not transforms
          blur: 3,        // From transforms
          format: 'auto',
        },
        'test-org',
      );

      expect(result).toBe('https://custom.example.com/overridden.jpg');
    });
  });
});
