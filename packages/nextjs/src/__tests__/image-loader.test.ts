import { SnapkitUrlBuilder } from '@snapkit-studio/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSnapkitLoader, snapkitLoader } from '../image-loader';

// Local type definition for image loader parameters (Next.js ImageLoader params)
interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

// Mock utils/env-config module
vi.mock('../utils/env-config', () => ({
  parseEnvConfig: vi.fn(() => ({
    organizationName: 'test-org',
    defaultQuality: 85,
    defaultFormat: 'auto',
  })),
  validateEnvConfig: vi.fn(() => ({
    isValid: true,
    errors: [],
    warnings: [],
  })),
}));

// Mock @snapkit-studio/core module
vi.mock('@snapkit-studio/core', () => ({
  SnapkitUrlBuilder: vi.fn(),
  environmentStrategies: [
    { name: 'nextjs-only', getEnvVar: vi.fn() },
    { name: 'universal', getEnvVar: vi.fn() },
  ],
  SnapkitImageEngine: vi.fn().mockImplementation(() => ({
    createNextJsLoader: vi
      .fn()
      .mockReturnValue(
        vi.fn().mockReturnValue('https://mocked-url.com/test.jpg'),
      ),
  })),
  getEnvConfig: vi.fn(() => ({
    SNAPKIT_ORGANIZATION_NAME:
      process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME,
    SNAPKIT_DEFAULT_QUALITY: process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY
      ? parseInt(process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY)
      : undefined,
    SNAPKIT_DEFAULT_OPTIMIZE_FORMAT:
      process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT,
  })),
  validateEnvConfig: vi.fn(() => ({
    isValid: true,
    errors: [],
    warnings: [],
  })),
  mergeConfigWithEnv: vi.fn(),
}));

describe('image-loader', () => {
  const mockUrlBuilder = {
    buildTransformedUrl: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up NEXT_PUBLIC environment variables for testing
    process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME = 'test-org';
    process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY = '80';
    process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT = 'auto';
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Clean up environment variables
    delete process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME;
    delete process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY;
    delete process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
  });

  describe('snapkitLoader', () => {
    it('should call buildTransformedUrl with correct parameters using hardcoded organization', () => {
      // Given: SnapkitUrlBuilder is mocked
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://example.com/optimized-image.jpg',
      );

      const params: ImageLoaderParams = {
        src: '/test-image.jpg',
        width: 800,
        quality: 85,
      };

      // When: snapkitLoader is called
      const result = snapkitLoader(params);

      // Then: SnapkitUrlBuilder should be created with hardcoded organization name
      expect(MockSnapkitUrlBuilder).toHaveBeenCalledWith('your-org-name');

      // And: buildTransformedUrl should be called with correct parameters
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test-image.jpg',
        {
          width: 800,
          quality: 85,
          format: 'auto',
        },
      );

      expect(result).toBe('https://example.com/optimized-image.jpg');
    });

    it('should work with minimal parameters (no quality)', () => {
      // Given: SnapkitUrlBuilder is mocked
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://example.com/minimal-image.jpg',
      );

      const params: ImageLoaderParams = {
        src: '/minimal-image.jpg',
        width: 400,
      };

      // When: snapkitLoader is called without quality
      const result = snapkitLoader(params);

      // Then: buildTransformedUrl should be called with undefined quality
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/minimal-image.jpg',
        {
          width: 400,
          quality: undefined,
          format: 'auto',
        },
      );

      expect(result).toBe('https://example.com/minimal-image.jpg');
    });

    it('should handle different image source formats', () => {
      // Given: SnapkitUrlBuilder is mocked
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://example.com/absolute-image.jpg',
      );

      const params: ImageLoaderParams = {
        src: 'https://external.com/image.jpg',
        width: 1200,
        quality: 95,
      };

      // When: snapkitLoader is called with absolute URL
      const result = snapkitLoader(params);

      // Then: should pass through the absolute URL
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        'https://external.com/image.jpg',
        {
          width: 1200,
          quality: 95,
          format: 'auto',
        },
      );

      expect(result).toBe('https://example.com/absolute-image.jpg');
    });

    it('should throw error when URL builder fails', () => {
      // Given: SnapkitUrlBuilder is mocked to throw an error
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockImplementation(() => {
        throw new Error('URL builder failed');
      });

      const params: ImageLoaderParams = {
        src: '/test-image.jpg',
        width: 800,
        quality: 85,
      };

      // When & Then: snapkitLoader should throw error
      expect(() => snapkitLoader(params)).toThrow(
        'Failed to generate optimized URL: URL builder failed. Please check your organization name and image source path.',
      );
    });
  });

  describe('createSnapkitLoader', () => {
    const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);

    beforeEach(() => {
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
    });

    it('should create a custom loader with basic options', () => {
      // Given: basic options

      // When: createSnapkitLoader is called
      const customLoader = createSnapkitLoader();

      // Then: SnapkitUrlBuilder should be instantiated with correct parameters
      expect(MockSnapkitUrlBuilder).toHaveBeenCalledWith('test-org');

      // And: should return a function
      expect(typeof customLoader).toBe('function');
    });

    it('should create loader that handles optimizeFormat "off"', () => {
      // Given: options with unoptimizedFormat set to true

      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://custom.example.com/no-format.jpg',
      );

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader();
      const result = customLoader({
        src: '/test.jpg',
        width: 600,
        quality: 80,
      });

      // Then: format should be undefined (unoptimized)
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 600,
          quality: 80,
          format: undefined,
        },
      );

      expect(result).toBe('https://custom.example.com/no-format.jpg');
    });

    it('should create loader that uses default "auto" format when optimizeFormat is not specified', () => {
      // Given: options without unoptimizedFormat

      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://custom.example.com/auto-format.jpg',
      );

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader();
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
      );

      expect(result).toBe('https://custom.example.com/auto-format.jpg');
    });

    it('should create loader that applies optimizeFormat when specified', () => {
      // Given: options with custom transforms

      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://custom.example.com/webp-format.jpg',
      );

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader();
      const result = customLoader({
        src: '/test.jpg',
        width: 600,
        quality: 80,
      });

      // Then: format should be webp
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          width: 600,
          quality: 80,
          format: 'webp',
        },
      );

      expect(result).toBe('https://custom.example.com/webp-format.jpg');
    });

    it('should create loader that merges custom transforms with loader parameters', () => {
      // Given: options with multiple transforms

      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://custom.example.com/complex.jpg',
      );

      // When: custom loader is created and called
      const customLoader = createSnapkitLoader();
      const result = customLoader({
        src: '/test.jpg',
        width: 800,
        quality: 90,
      });

      // Then: should merge all transforms with loader parameters taking precedence for width/quality
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          format: 'avif',
          blur: 5,
          grayscale: true,
          fit: 'cover',
          width: 800,
          quality: 90,
        },
      );

      expect(result).toBe('https://custom.example.com/complex.jpg');
    });

    it('should create loader that handles undefined organizationName', () => {
      // Given: invalid options

      // When & Then: should throw error
      expect(() => createSnapkitLoader()).toThrow(
        'Invalid organization name: organizationName must be a non-empty string.',
      );
    });

    it('should override transforms width and quality with loader parameters', () => {
      // Given: options with pre-set width and quality in transforms

      mockUrlBuilder.buildTransformedUrl.mockReturnValue(
        'https://custom.example.com/override.jpg',
      );

      // When: custom loader is created and called with different width/quality
      const customLoader = createSnapkitLoader();
      const result = customLoader({
        src: '/test.jpg',
        width: 1000,
        quality: 95,
      });

      // Then: loader parameters should override transform values
      expect(mockUrlBuilder.buildTransformedUrl).toHaveBeenCalledWith(
        '/test.jpg',
        {
          blur: 3,
          format: 'auto',
          width: 1000,
          quality: 95,
        },
      );

      expect(result).toBe('https://custom.example.com/override.jpg');
    });
  });
});
