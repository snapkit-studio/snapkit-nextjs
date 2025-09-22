import { describe, expect, it } from 'vitest';

import {
  calculateSizeReduction,
  extractDimensionsFromUrl,
  formatBytes,
  isSnapkitUrl,
} from '../utils';

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('should handle decimal places', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });
});

describe('calculateSizeReduction', () => {
  it('should calculate size reduction percentage correctly', () => {
    expect(calculateSizeReduction(100, 50)).toBe(50);
    expect(calculateSizeReduction(1000, 250)).toBe(75);
    expect(calculateSizeReduction(100, 100)).toBe(0);
  });

  it('should handle edge cases', () => {
    expect(calculateSizeReduction(0, 50)).toBe(0);
    expect(calculateSizeReduction(100, 0)).toBe(100);
    expect(calculateSizeReduction(100, 150)).toBe(0);
  });
});

describe('isSnapkitUrl', () => {
  it('should identify Snapkit URLs correctly', () => {
    expect(isSnapkitUrl('https://cdn.snapkit.studio/image.jpg')).toBe(true);
    expect(isSnapkitUrl('https://images.snapkit-cdn.com/photo.png')).toBe(true);
    expect(isSnapkitUrl('https://example.com/image.jpg')).toBe(false);
  });

  it('should handle invalid URLs', () => {
    expect(isSnapkitUrl('not-a-url')).toBe(false);
    expect(isSnapkitUrl('')).toBe(false);
  });
});

describe('extractDimensionsFromUrl', () => {
  it('should extract dimensions from URL parameters', () => {
    const result1 = extractDimensionsFromUrl(
      'https://example.com/image.jpg?w=800&h=600',
    );
    expect(result1).toEqual({ width: 800, height: 600 });

    const result2 = extractDimensionsFromUrl(
      'https://example.com/image.jpg?width=1200&height=900',
    );
    expect(result2).toEqual({ width: 1200, height: 900 });
  });

  it('should return null when dimensions are not found', () => {
    expect(extractDimensionsFromUrl('https://example.com/image.jpg')).toBe(
      null,
    );
    expect(extractDimensionsFromUrl('https://example.com/image.jpg?q=80')).toBe(
      null,
    );
    expect(extractDimensionsFromUrl('not-a-url')).toBe(null);
  });

  it('should handle partial dimension parameters', () => {
    expect(
      extractDimensionsFromUrl('https://example.com/image.jpg?w=800'),
    ).toBe(null);
    expect(
      extractDimensionsFromUrl('https://example.com/image.jpg?h=600'),
    ).toBe(null);
  });
});
