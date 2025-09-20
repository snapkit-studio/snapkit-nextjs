import type { ImageTransforms } from '@snapkit-studio/core';
import { describe, expect, it, vi } from 'vitest';
import {
  addSizeToTransforms,
  createFinalTransforms,
} from '../imageTransformUtils';

// Mock getBestSupportedFormat
vi.mock('@snapkit-studio/core', async () => {
  const actual = await vi.importActual('@snapkit-studio/core');
  return {
    ...actual,
    getBestSupportedFormat: vi.fn((defaultFormat?: string) => {
      if (defaultFormat === 'webp') return 'webp';
      return 'avif';
    }),
  };
});

describe('imageTransformUtils', () => {
  describe('createFinalTransforms', () => {
    it('should create final transforms with auto format optimization', () => {
      const baseTransforms: ImageTransforms = {
        width: 800,
        height: 600,
      };

      const result = createFinalTransforms(baseTransforms, 85, 'auto', 'webp');

      expect(result).toEqual({
        width: 800,
        height: 600,
        quality: 85,
        format: 'webp',
      });
    });

    it('should create final transforms with specific format', () => {
      const baseTransforms: ImageTransforms = {
        width: 800,
        height: 600,
      };

      const result = createFinalTransforms(baseTransforms, 85, 'webp');

      expect(result).toEqual({
        width: 800,
        height: 600,
        quality: 85,
        format: 'webp',
      });
    });

    it('should create final transforms with format off', () => {
      const baseTransforms: ImageTransforms = {
        width: 800,
        height: 600,
      };

      const result = createFinalTransforms(baseTransforms, 85, 'off');

      expect(result).toEqual({
        width: 800,
        height: 600,
        quality: 85,
        format: undefined,
      });
    });

    it('should merge existing transforms', () => {
      const baseTransforms: ImageTransforms = {
        width: 800,
        height: 600,
        blur: 10,
      };

      const result = createFinalTransforms(baseTransforms, 90, 'auto');

      expect(result).toEqual({
        width: 800,
        height: 600,
        blur: 10,
        quality: 90,
        format: 'avif',
      });
    });
  });

  describe('addSizeToTransforms', () => {
    it('should add width and height to transforms', () => {
      const transforms: ImageTransforms = {
        quality: 85,
        format: 'webp',
      };
      const imageSize = { width: 800, height: 600 };
      const originalTransforms: ImageTransforms = {};

      const result = addSizeToTransforms(transforms, imageSize, originalTransforms);

      expect(result).toEqual({
        quality: 85,
        format: 'webp',
        width: 800,
        height: 600,
      });
    });

    it('should add only width when height is not provided', () => {
      const transforms: ImageTransforms = {
        quality: 85,
      };
      const imageSize = { width: 800 };
      const originalTransforms: ImageTransforms = {};

      const result = addSizeToTransforms(transforms, imageSize, originalTransforms);

      expect(result).toEqual({
        quality: 85,
        width: 800,
      });
    });

    it('should not add height when fit is specified in original transforms', () => {
      const transforms: ImageTransforms = {
        quality: 85,
      };
      const imageSize = { width: 800, height: 600 };
      const originalTransforms: ImageTransforms = { fit: 'cover' };

      const result = addSizeToTransforms(transforms, imageSize, originalTransforms);

      expect(result).toEqual({
        quality: 85,
        width: 800,
      });
    });

    it('should not modify original transforms object', () => {
      const transforms: ImageTransforms = {
        quality: 85,
      };
      const imageSize = { width: 800, height: 600 };
      const originalTransforms: ImageTransforms = {};

      addSizeToTransforms(transforms, imageSize, originalTransforms);

      expect(transforms).toEqual({ quality: 85 });
    });
  });

});
