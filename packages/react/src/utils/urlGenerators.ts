import { buildImageUrl } from '@snapkit/core';
import type { ImageTransforms } from '@snapkit/core';

/**
 * URL generation utilities for image components
 */

export interface BuildOptions {
  baseUrl?: string;
  organizationName: string;
}

/**
 * Generates responsive srcset string
 * @param src - Image source
 * @param widths - Array of widths to generate
 * @param finalTransforms - Base transforms
 * @param buildOptions - URL build options
 * @returns Srcset string
 */
export function generateResponsiveSrcSet(
  src: string,
  widths: number[],
  finalTransforms: ImageTransforms,
  buildOptions: BuildOptions,
): string {
  return widths
    .map((w) => {
      const url = buildImageUrl(
        src,
        { ...finalTransforms, width: w },
        buildOptions,
      );
      return `${url} ${w}w`;
    })
    .join(', ');
}

/**
 * Generates placeholder image URL
 * @param src - Original image source
 * @param placeholderTransforms - Placeholder transforms
 * @param buildOptions - URL build options
 * @param blurDataURL - Custom blur data URL
 * @returns Placeholder URL or undefined
 */
export function generatePlaceholderUrl(
  src: string,
  placeholderTransforms: ImageTransforms,
  buildOptions: BuildOptions,
  blurDataURL?: string,
): string | undefined {
  if (blurDataURL !== undefined) {
    return blurDataURL;
  }
  return buildImageUrl(src, placeholderTransforms, buildOptions);
}
