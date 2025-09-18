import {
  getDefaultUrlBuilder,
  ImageLoader,
  ImageLoaderParams,
  SnapkitLoaderOptions,
  SnapkitUrlBuilder,
} from '@snapkit-studio/core';

/**
 * Default Snapkit image loader for Next.js
 * Uses the global default URL builder configuration
 */
export const snapkitLoader: ImageLoader = ({ src, width, quality }: ImageLoaderParams): string => {
  const urlBuilder = getDefaultUrlBuilder();

  if (!urlBuilder) {
    throw new Error('Snapkit URL builder not configured. Please call setDefaultUrlBuilder() first.');
  }

  return urlBuilder.buildTransformedUrl(src, {
    width,
    quality,
    format: 'auto',
  });
};

/**
 * Create a custom Snapkit image loader with specific configuration
 * Useful when you need different settings for different image components
 */
export function createSnapkitLoader(options: SnapkitLoaderOptions): ImageLoader {
  const urlBuilder = new SnapkitUrlBuilder(options.baseUrl, options.organizationName);

  return ({ src, width, quality }: ImageLoaderParams): string => {
    const format = options.optimizeFormat === 'off'
      ? undefined
      : (options.optimizeFormat || 'auto');

    const transforms = {
      ...options.transforms,
      width,
      quality,
      format,
    };

    return urlBuilder.buildTransformedUrl(src, transforms, options.organizationName);
  };
}
