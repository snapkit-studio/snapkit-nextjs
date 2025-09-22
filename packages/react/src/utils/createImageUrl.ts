import {
  getBestSupportedFormat,
  ImageTransforms,
  SnapkitUrlBuilder,
} from '@snapkit-studio/core';

export interface CreateImageUrlOptions {
  organizationName: string;
  baseUrl?: string;
  width?: number;
  height?: number;
  quality?: number;
  transforms?: ImageTransforms;
  defaultFormat?: 'avif' | 'webp' | 'auto';
}

/**
 * Create optimized image URL using Snapkit URL builder
 */
export function createImageUrl(
  src: string,
  options: CreateImageUrlOptions,
): string {
  const urlBuilder = new SnapkitUrlBuilder(options.organizationName);

  // Determine optimal format
  const format =
    options.defaultFormat === 'auto'
      ? getBestSupportedFormat()
      : options.defaultFormat;

  // Combine transforms with sizing options
  const transforms: ImageTransforms = {
    ...options.transforms,
    width: options.width,
    height: options.height,
    quality: options.quality,
    format,
  };

  return urlBuilder.buildTransformedUrl(src, transforms);
}
