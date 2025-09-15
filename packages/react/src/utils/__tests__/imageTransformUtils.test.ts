import { describe, it, expect, vi } from 'vitest';
import {
  createFinalTransforms,
  addSizeToTransforms,
  createPlaceholderTransforms,
} from '../imageTransformUtils';
import type { ImageTransforms } from '@snapkit/core';

// Mock getBestSupportedFormat
vi.mock('@snapkit/core', async () => {
  const actual = await vi.importActual('@snapkit/core');
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
        brightness: 120,
      };

      const result = createFinalTransforms(baseTransforms, 90, 'auto');

      expect(result).toEqual({
        width: 800,
        height: 600,
        blur: 10,
        brightness: 120,
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

  describe('createPlaceholderTransforms', () => {
    it('should create placeholder transforms with default values', () => {
      const baseTransforms: ImageTransforms = {
        quality: 85,
        format: 'webp',
      };

      const result = createPlaceholderTransforms(baseTransforms);

      expect(result).toEqual({
        quality: 20,
        format: 'webp',
        width: 40,
        blur: 20,
      });
    });

    it('should create placeholder transforms with custom values', () => {
      const baseTransforms: ImageTransforms = {
        quality: 85,
        format: 'webp',
      };

      const result = createPlaceholderTransforms(baseTransforms, 60, 30, 30);

      expect(result).toEqual({
        quality: 30,
        format: 'webp',
        width: 60,
        blur: 30,
      });
    });

    it('should override base transforms with placeholder specific values', () => {
      const baseTransforms: ImageTransforms = {
        width: 800,
        height: 600,
        quality: 85,
        blur: 5,
      };

      const result = createPlaceholderTransforms(baseTransforms, 50, 25, 25);

      expect(result).toEqual({
        width: 50,
        height: 600,
        quality: 25,
        blur: 25,
      });
    });
  });
});
