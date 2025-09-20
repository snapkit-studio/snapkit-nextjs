import type { ImageTransforms } from '@snapkit-studio/core';
import { getBestSupportedFormat } from '@snapkit-studio/core';

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

