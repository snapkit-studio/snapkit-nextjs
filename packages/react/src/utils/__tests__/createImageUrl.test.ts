import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createImageUrl } from '../createImageUrl';

// Mock @snapkit-studio/core
const mockBuildTransformedUrl = vi.fn();
vi.mock('@snapkit-studio/core', () => ({
  SnapkitUrlBuilder: vi.fn().mockImplementation(() => ({
    buildTransformedUrl: mockBuildTransformedUrl,
  })),
  getBestSupportedFormat: vi.fn(() => 'webp'),
}));

describe('createImageUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBuildTransformedUrl.mockReturnValue(
      'https://demo-cdn.snapkit.studio/test-image.jpg?w=400',
    );
  });

  it('should create image URL with basic options', () => {
    const result = createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
      width: 400,
      quality: 85,
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      width: 400,
      quality: 85,
      format: undefined,
    });
    expect(result).toBe('https://demo-cdn.snapkit.studio/test-image.jpg?w=400');
  });

  it('should include height when provided', () => {
    createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
      width: 400,
      height: 300,
      quality: 90,
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      width: 400,
      height: 300,
      quality: 90,
      format: undefined,
    });
  });

  it('should use auto format and call getBestSupportedFormat', () => {
    createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
      width: 400,
      defaultFormat: 'auto',
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      width: 400,
      quality: undefined,
      format: 'webp', // mocked return value
    });
  });

  it('should use specific format when provided', () => {
    createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
      width: 400,
      defaultFormat: 'avif',
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      width: 400,
      quality: undefined,
      format: 'avif',
    });
  });

  it('should merge custom transforms with sizing options', () => {
    createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
      width: 400,
      height: 300,
      quality: 85,
      transforms: {
        blur: 5,
        grayscale: true,
        fit: 'cover',
      },
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      blur: 5,
      grayscale: true,
      fit: 'cover',
      width: 400,
      height: 300,
      quality: 85,
      format: undefined,
    });
  });

  it('should override transform options with sizing options', () => {
    createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
      width: 500, // This should override transforms.width
      quality: 90, // This should override transforms.quality
      transforms: {
        width: 300, // Should be overridden
        quality: 70, // Should be overridden
        blur: 3,
      },
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      width: 500, // Overridden value
      quality: 90, // Overridden value
      blur: 3,
      format: undefined,
    });
  });

  it('should handle undefined transforms', () => {
    createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
      width: 400,
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      width: 400,
      quality: undefined,
      format: undefined,
    });
  });

  it('should handle empty options except organizationName', () => {
    createImageUrl('/test-image.jpg', {
      organizationName: 'demo',
    });

    expect(mockBuildTransformedUrl).toHaveBeenCalledWith('/test-image.jpg', {
      width: undefined,
      height: undefined,
      quality: undefined,
      format: undefined,
    });
  });
});
