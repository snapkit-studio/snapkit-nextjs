import { describe, expect, it } from 'vitest';

import { SnapkitTransformBuilder } from '../transform-builder';
import type { ImageTransforms } from '../types';

describe('SnapkitTransformBuilder', () => {
  const builder = new SnapkitTransformBuilder();

  describe('build', () => {
    it('Should build URL with single transform', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {
        width: 800,
      };

      const result = builder.build(src, transforms);

      expect(result).toBe('https://example.com/image.jpg?width=800');
    });

    it('Should build URL with multiple transforms', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {
        width: 800,
        height: 600,
        quality: 85,
      };

      const result = builder.build(src, transforms);

      expect(result).toContain('https://example.com/image.jpg?');
      expect(result).toContain('width=800');
      expect(result).toContain('height=600');
      expect(result).toContain('quality=85');

      // Verify all parameters are properly encoded
      const url = new URL(result);
      expect(url.searchParams.get('width')).toBe('800');
      expect(url.searchParams.get('height')).toBe('600');
      expect(url.searchParams.get('quality')).toBe('85');
    });

    it('Should handle string transform values', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {
        format: 'webp',
        fit: 'cover',
      };

      const result = builder.build(src, transforms);

      expect(result).toContain('format=webp');
      expect(result).toContain('fit=cover');
    });

    it('Should handle boolean transform values', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {
        flip: true,
        flop: false,
      };

      const result = builder.build(src, transforms);

      expect(result).toContain('flip=true');
      expect(result).toContain('flop=false');
    });

    it('Should handle empty transforms', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {};

      const result = builder.build(src, transforms);

      expect(result).toBe('https://example.com/image.jpg?');
    });

    it('Should handle URLs that already have query parameters', () => {
      const src = 'https://example.com/image.jpg?v=123';
      const transforms: ImageTransforms = {
        width: 800,
      };

      const result = builder.build(src, transforms);

      // Note: This implementation appends a new query string, which may not be ideal
      // but is how the current implementation works
      expect(result).toBe('https://example.com/image.jpg?v=123?width=800');
    });

    it('Should properly encode special characters in values', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {
        text: 'Hello World!',
        font: 'Open Sans',
      };

      const result = builder.build(src, transforms);

      expect(result).toContain('text=Hello+World%21');
      expect(result).toContain('font=Open+Sans');
    });

    it('Should handle numeric zero values', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {
        x: 0,
        y: 0,
        rotation: 0,
      };

      const result = builder.build(src, transforms);

      expect(result).toContain('x=0');
      expect(result).toContain('y=0');
      expect(result).toContain('rotation=0');
    });

    it('Should handle float values', () => {
      const src = 'https://example.com/image.jpg';
      const transforms: ImageTransforms = {
        dpr: 2.5,
        quality: 87.5,
      };

      const result = builder.build(src, transforms);

      expect(result).toContain('dpr=2.5');
      expect(result).toContain('quality=87.5');
    });

    it('Should handle array values by converting to string', () => {
      const src = 'https://example.com/image.jpg';
      const transforms = {
        colors: ['red', 'green', 'blue'],
      };

      const result = builder.build(src, transforms as ImageTransforms);

      // Arrays get converted to comma-separated string
      expect(result).toContain('colors=red%2Cgreen%2Cblue');
    });
  });
});
