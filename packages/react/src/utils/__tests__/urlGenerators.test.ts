import { describe, it, expect, vi } from 'vitest';
import {
  generateResponsiveSrcSet,
  generatePlaceholderUrl,
} from '../urlGenerators';
import type { ImageTransforms } from '@snapkit/core';

// Mock buildImageUrl
vi.mock('@snapkit/core', () => ({
  buildImageUrl: vi.fn((src: string, transforms: any, options: any) => {
    const params = new URLSearchParams();
    if (transforms.width) params.set('w', transforms.width.toString());
    if (transforms.height) params.set('h', transforms.height.toString());
    if (transforms.quality) params.set('q', transforms.quality.toString());
    if (transforms.format) params.set('f', transforms.format);
    if (transforms.blur) params.set('blur', transforms.blur.toString());

    const baseUrl = options.baseUrl || 'https://default.com';
    const org = options.organizationName ? `/${options.organizationName}` : '';
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return `${baseUrl}${org}/${src}${queryString}`;
  }),
}));

describe('urlGenerators', () => {
  describe('generateResponsiveSrcSet', () => {
    it('should generate responsive srcset for multiple widths', () => {
      const src = 'image.jpg';
      const widths = [400, 800, 1200];
      const finalTransforms: ImageTransforms = {
        quality: 85,
        format: 'webp',
      };
      const buildOptions = {
        baseUrl: 'https://cdn.example.com',
        organizationName: 'test-org',
      };

      const result = generateResponsiveSrcSet(src, widths, finalTransforms, buildOptions);

      expect(result).toBe(
        'https://cdn.example.com/test-org/image.jpg?w=400&q=85&f=webp 400w, ' +
        'https://cdn.example.com/test-org/image.jpg?w=800&q=85&f=webp 800w, ' +
        'https://cdn.example.com/test-org/image.jpg?w=1200&q=85&f=webp 1200w',
      );
    });

    it('should generate srcset without organization name', () => {
      const src = 'image.jpg';
      const widths = [400, 800];
      const finalTransforms: ImageTransforms = {
        quality: 90,
      };
      const buildOptions = {
        baseUrl: 'https://cdn.example.com',
        organizationName: '',
      };

      const result = generateResponsiveSrcSet(src, widths, finalTransforms, buildOptions);

      expect(result).toBe(
        'https://cdn.example.com/image.jpg?w=400&q=90 400w, ' +
        'https://cdn.example.com/image.jpg?w=800&q=90 800w',
      );
    });

    it('should handle empty widths array', () => {
      const src = 'image.jpg';
      const widths: number[] = [];
      const finalTransforms: ImageTransforms = { quality: 85 };
      const buildOptions = {
        baseUrl: 'https://cdn.example.com',
        organizationName: 'test-org',
      };

      const result = generateResponsiveSrcSet(src, widths, finalTransforms, buildOptions);

      expect(result).toBe('');
    });
  });

  describe('generatePlaceholderUrl', () => {
    it('should return custom blurDataURL when provided', () => {
      const src = 'image.jpg';
      const placeholderTransforms: ImageTransforms = {
        width: 40,
        blur: 20,
        quality: 20,
      };
      const buildOptions = {
        baseUrl: 'https://cdn.example.com',
        organizationName: 'test-org',
      };
      const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...';

      const result = generatePlaceholderUrl(src, placeholderTransforms, buildOptions, blurDataURL);

      expect(result).toBe(blurDataURL);
    });

    it('should generate placeholder URL when blurDataURL is not provided', () => {
      const src = 'image.jpg';
      const placeholderTransforms: ImageTransforms = {
        width: 40,
        blur: 20,
        quality: 20,
      };
      const buildOptions = {
        baseUrl: 'https://cdn.example.com',
        organizationName: 'test-org',
      };

      const result = generatePlaceholderUrl(src, placeholderTransforms, buildOptions);

      expect(result).toBe('https://cdn.example.com/test-org/image.jpg?w=40&q=20&blur=20');
    });

    it('should return undefined when blurDataURL is empty string', () => {
      const src = 'image.jpg';
      const placeholderTransforms: ImageTransforms = {
        width: 40,
        blur: 20,
        quality: 20,
      };
      const buildOptions = {
        baseUrl: 'https://cdn.example.com',
        organizationName: 'test-org',
      };

      const result = generatePlaceholderUrl(src, placeholderTransforms, buildOptions, '');

      expect(result).toBe('');
    });
  });
});
