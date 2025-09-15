import type { ImageTransforms } from '@snapkit/core';
import { getBestSupportedFormat } from '@snapkit/core';

/**
 * Image transformation utilities
 */

export type OptimizeFormat = 'avif' | 'webp' | 'auto' | 'off';

/**
 * Creates final image transforms with format optimization
 * @param baseTransforms - Base image transforms
 * @param adjustedQuality - Quality adjusted for network conditions
 * @param optimizeFormat - Format optimization setting
 * @param defaultFormat - Default format from config
 * @returns Final image transforms
 */
export function createFinalTransforms(
  baseTransforms: ImageTransforms,
  adjustedQuality: number,
  optimizeFormat: OptimizeFormat,
  defaultFormat?: string,
): ImageTransforms {
  return {
    ...baseTransforms,
    quality: adjustedQuality,
    format:
      optimizeFormat === 'auto'
        ? getBestSupportedFormat(defaultFormat)
        : optimizeFormat === 'off'
          ? undefined
          : optimizeFormat,
  };
}

/**
 * Adds size information to transforms
 * @param transforms - Base transforms object
 * @param imageSize - Image size information
 * @param originalTransforms - Original transforms to check for fit property
 * @returns Updated transforms with size information
 */
export function addSizeToTransforms(
  transforms: ImageTransforms,
  imageSize: { width?: number; height?: number },
  originalTransforms: ImageTransforms,
): ImageTransforms {
  const updatedTransforms = { ...transforms };

  if (imageSize.width) {
    updatedTransforms.width = imageSize.width;
  }
  if (imageSize.height && !originalTransforms.fit) {
    updatedTransforms.height = imageSize.height;
  }

  return updatedTransforms;
}

/**
 * Creates placeholder transforms for blur placeholder
 * @param baseTransforms - Base transforms
 * @param width - Placeholder width (default: 40)
 * @param blur - Blur intensity (default: 20)
 * @param quality - Placeholder quality (default: 20)
 * @returns Placeholder transforms
 */
export function createPlaceholderTransforms(
  baseTransforms: ImageTransforms,
  width = 40,
  blur = 20,
  quality = 20,
): ImageTransforms {
  return {
    ...baseTransforms,
    width,
    blur,
    quality,
  };
}
