import { SnapkitUrlBuilder } from '@snapkit-studio/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSnapkitLoader, snapkitLoader } from '../image-loader';

// Mock @snapkit-studio/core module
vi.mock('@snapkit-studio/core', () => ({
  SnapkitUrlBuilder: vi.fn(),
}));

describe('Enhanced Error Handling', () => {
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

  describe('snapkitLoader validation', () => {
    it('should throw descriptive error for empty src', () => {
      expect(() => {
        snapkitLoader({ src: '', width: 800, quality: 85 });
      }).toThrow('Invalid image source: src must be a non-empty string. Received: ""');
    });

    it('should throw descriptive error for non-string src', () => {
      expect(() => {
        snapkitLoader({ src: null as any, width: 800, quality: 85 });
      }).toThrow('Invalid image source: src must be a non-empty string. Received: object');

      expect(() => {
        snapkitLoader({ src: 123 as any, width: 800, quality: 85 });
      }).toThrow('Invalid image source: src must be a non-empty string. Received: number');
    });

    it('should throw descriptive error for invalid width', () => {
      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: 0, quality: 85 });
      }).toThrow('Invalid width parameter: width must be a positive number. Received: 0 (type: number)');

      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: -100, quality: 85 });
      }).toThrow('Invalid width parameter: width must be a positive number. Received: -100 (type: number)');

      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: 'invalid' as any, quality: 85 });
      }).toThrow('Invalid width parameter: width must be a positive number. Received: invalid (type: string)');

      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: Infinity, quality: 85 });
      }).toThrow('Invalid width parameter: width must be a positive number. Received: Infinity (type: number)');
    });

    it('should throw descriptive error for invalid quality', () => {
      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: 800, quality: 0 });
      }).toThrow('Invalid quality parameter: quality must be a number between 1 and 100. Received: 0 (type: number)');

      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: 800, quality: 101 });
      }).toThrow('Invalid quality parameter: quality must be a number between 1 and 100. Received: 101 (type: number)');

      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: 800, quality: 'high' as any });
      }).toThrow('Invalid quality parameter: quality must be a number between 1 and 100. Received: high (type: string)');
    });

    it('should throw error when URL builder fails', () => {
      // Given: SnapkitUrlBuilder is mocked to throw an error
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockImplementation(() => {
        throw new Error('URL generation failed');
      });

      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: 800, quality: 85 });
      }).toThrow(
        'Failed to generate optimized URL: URL generation failed. Please check your organization name and image source path.'
      );
    });

    it('should wrap URL generation errors with context', () => {
      // Given: SnapkitUrlBuilder is mocked to throw an error
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockImplementation(() => {
        throw new Error('Network error');
      });

      expect(() => {
        snapkitLoader({ src: '/test.jpg', width: 800, quality: 85 });
      }).toThrow(
        'Failed to generate optimized URL: Network error. Please check your organization name and image source path.'
      );
    });
  });

  describe('createSnapkitLoader validation', () => {
    const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);

    beforeEach(() => {
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
    });

    it('should throw descriptive error for missing organization name', () => {
      expect(() => {
        createSnapkitLoader({ organizationName: undefined as any });
      }).toThrow('Invalid organization name: organizationName must be a non-empty string. Received: undefined. Please provide your Snapkit organization name from your dashboard.');

      expect(() => {
        createSnapkitLoader({ organizationName: null as any });
      }).toThrow('Invalid organization name: organizationName must be a non-empty string. Received: object. Please provide your Snapkit organization name from your dashboard.');

      expect(() => {
        createSnapkitLoader({ organizationName: '' });
      }).toThrow('Invalid organization name: organizationName must be a non-empty string. Received: "". Please provide your Snapkit organization name from your dashboard.');

      expect(() => {
        createSnapkitLoader({ organizationName: '   ' });
      }).toThrow('Invalid organization name: organizationName cannot be empty or whitespace only. Please provide your Snapkit organization name from your dashboard.');
    });

    it('should throw descriptive error for invalid options type', () => {
      expect(() => {
        createSnapkitLoader(null as any);
      }).toThrow('Invalid loader options: options must be an object. Received: null');

      expect(() => {
        createSnapkitLoader(undefined as any);
      }).toThrow('Invalid loader options: options must be an object. Received: undefined');

      expect(() => {
        createSnapkitLoader('string' as any);
      }).toThrow('Invalid loader options: options must be an object. Received: string');
    });

    it('should throw descriptive error for invalid unoptimizedFormat', () => {
      expect(() => {
        createSnapkitLoader({
          organizationName: 'test-org',
          unoptimizedFormat: 'invalid' as any,
        });
      }).toThrow('Invalid unoptimizedFormat option: must be a boolean value. Received: invalid (type: string)');

      expect(() => {
        createSnapkitLoader({
          organizationName: 'test-org',
          unoptimizedFormat: 1 as any,
        });
      }).toThrow('Invalid unoptimizedFormat option: must be a boolean value. Received: 1 (type: number)');
    });

    it('should wrap URL builder creation errors', () => {
      MockSnapkitUrlBuilder.mockImplementation(() => {
        throw new Error('Invalid organization configuration');
      });

      expect(() => {
        createSnapkitLoader({ organizationName: 'invalid-org' });
      }).toThrow('Failed to create URL builder: Invalid organization configuration. Please verify your organization name is correct.');
    });

    it('should handle runtime parameter validation in custom loader', () => {
      const customLoader = createSnapkitLoader({ organizationName: 'test-org' });

      expect(() => {
        customLoader({ src: '', width: 800, quality: 85 });
      }).toThrow('Invalid image source: src must be a non-empty string. Received: ""');

      expect(() => {
        customLoader({ src: '/test.jpg', width: 0, quality: 85 });
      }).toThrow('Invalid width parameter: width must be a positive number. Received: 0 (type: number)');

      expect(() => {
        customLoader({ src: '/test.jpg', width: 800, quality: 0 });
      }).toThrow('Invalid quality parameter: quality must be a number between 1 and 100. Received: 0 (type: number)');
    });

    it('should wrap URL generation errors in custom loader', () => {
      mockUrlBuilder.buildTransformedUrl.mockImplementation(() => {
        throw new Error('Transform error');
      });

      const customLoader = createSnapkitLoader({ organizationName: 'test-org' });

      expect(() => {
        customLoader({ src: '/test.jpg', width: 800, quality: 85 });
      }).toThrow('Failed to generate optimized URL: Transform error. Please check your organization name and image source path.');
    });
  });

  describe('Edge case error handling', () => {
    it('should handle special character organization names', () => {
      const MockSnapkitUrlBuilder = vi.mocked(SnapkitUrlBuilder);
      MockSnapkitUrlBuilder.mockImplementation(() => mockUrlBuilder as any);
      mockUrlBuilder.buildTransformedUrl.mockReturnValue('https://special.com/test.jpg');

      // Should not throw for valid special characters
      expect(() => {
        const loader = createSnapkitLoader({ organizationName: 'test-org-123' });
        loader({ src: '/test.jpg', width: 800 });
      }).not.toThrow();

      expect(() => {
        const loader = createSnapkitLoader({ organizationName: 'test_org' });
        loader({ src: '/test.jpg', width: 800 });
      }).not.toThrow();
    });

    it('should maintain error message consistency', () => {
      const expectedMessages = {
        invalidSrc: 'Invalid image source: src must be a non-empty string.',
        invalidWidth: 'Invalid width parameter: width must be a positive number.',
        invalidQuality: 'Invalid quality parameter: quality must be a number between 1 and 100.',
        urlGenerationFailed: 'Failed to generate optimized URL:',
      };

      // Test that error messages start with expected prefixes
      try {
        snapkitLoader({ src: '', width: 800 });
      } catch (error) {
        expect((error as Error).message).toContain(expectedMessages.invalidSrc);
      }

      try {
        snapkitLoader({ src: '/test.jpg', width: 0 });
      } catch (error) {
        expect((error as Error).message).toContain(expectedMessages.invalidWidth);
      }

      try {
        snapkitLoader({ src: '/test.jpg', width: 800, quality: 0 });
      } catch (error) {
        expect((error as Error).message).toContain(expectedMessages.invalidQuality);
      }
    });
  });
});