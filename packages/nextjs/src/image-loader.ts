import {
  SnapkitLoaderOptions,
  SnapkitUrlBuilder,
} from '@snapkit-studio/core';
import { ImageLoader } from 'next/image';

/**
 * Default Snapkit image loader for Next.js
 * Uses the global default URL builder configuration
 *
 * @param params - Image loader parameters from Next.js
 * @returns Optimized image URL
 * @throws {Error} When URL builder is not configured
 * @throws {Error} When invalid parameters are provided
 */
export const snapkitLoader: ImageLoader = ({ src, width, quality }): string => {
  // Validate input parameters
  if (!src || typeof src !== 'string') {
    throw new Error(
      'Invalid image source: src must be a non-empty string. ' +
      'Received: ' + (typeof src === 'string' ? `"${src}"` : typeof src)
    );
  }

  if (width !== undefined && (typeof width !== 'number' || width <= 0 || !isFinite(width))) {
    throw new Error(
      'Invalid width parameter: width must be a positive number. ' +
      'Received: ' + width + ' (type: ' + typeof width + ')'
    );
  }

  if (quality !== undefined && (typeof quality !== 'number' || quality < 1 || quality > 100 || !isFinite(quality))) {
    throw new Error(
      'Invalid quality parameter: quality must be a number between 1 and 100. ' +
      'Received: ' + quality + ' (type: ' + typeof quality + ')'
    );
  }

  const urlBuilder = new SnapkitUrlBuilder('your-org-name');

  try {
    return urlBuilder.buildTransformedUrl(src, {
      width,
      quality,
      format: 'auto',
    });
  } catch (error) {
    throw new Error(
      'Failed to generate optimized URL: ' +
      (error instanceof Error ? error.message : String(error)) +
      '. Please check your organization name and image source path.'
    );
  }
};

/**
 * Create a custom Snapkit image loader with specific configuration
 * Useful when you need different settings for different image components
 *
 * @param options - Snapkit loader configuration options
 * @returns Image loader function compatible with Next.js Image component
 * @throws {Error} When invalid configuration options are provided
 */
export function createSnapkitLoader(options: SnapkitLoaderOptions): ImageLoader {
  // Validate configuration options
  if (!options || typeof options !== 'object') {
    throw new Error(
      'Invalid loader options: options must be an object. ' +
      'Received: ' + (options === null ? 'null' : typeof options)
    );
  }

  if (!options.organizationName || typeof options.organizationName !== 'string') {
    throw new Error(
      'Invalid organization name: organizationName must be a non-empty string. ' +
      'Received: ' + (typeof options.organizationName === 'string' ? `"${options.organizationName}"` : typeof options.organizationName) +
      '. Please provide your Snapkit organization name from your dashboard.'
    );
  }

  if (options.organizationName.trim().length === 0) {
    throw new Error(
      'Invalid organization name: organizationName cannot be empty or whitespace only. ' +
      'Please provide your Snapkit organization name from your dashboard.'
    );
  }

  if (options.unoptimizedFormat !== undefined && typeof options.unoptimizedFormat !== 'boolean') {
    throw new Error(
      'Invalid unoptimizedFormat option: must be a boolean value. ' +
      'Received: ' + options.unoptimizedFormat + ' (type: ' + typeof options.unoptimizedFormat + ')'
    );
  }

  let urlBuilder: SnapkitUrlBuilder;
  try {
    urlBuilder = new SnapkitUrlBuilder(options.organizationName);
  } catch (error) {
    throw new Error(
      'Failed to create URL builder: ' +
      (error instanceof Error ? error.message : String(error)) +
      '. Please verify your organization name is correct.'
    );
  }

  return ({ src, width, quality }): string => {
    // Validate runtime parameters
    if (!src || typeof src !== 'string') {
      throw new Error(
        'Invalid image source: src must be a non-empty string. ' +
        'Received: ' + (typeof src === 'string' ? `"${src}"` : typeof src)
      );
    }

    if (width !== undefined && (typeof width !== 'number' || width <= 0 || !isFinite(width))) {
      throw new Error(
        'Invalid width parameter: width must be a positive number. ' +
        'Received: ' + width + ' (type: ' + typeof width + ')'
      );
    }

    if (quality !== undefined && (typeof quality !== 'number' || quality < 1 || quality > 100 || !isFinite(quality))) {
      throw new Error(
        'Invalid quality parameter: quality must be a number between 1 and 100. ' +
        'Received: ' + quality + ' (type: ' + typeof quality + ')'
      );
    }

    const format = options.unoptimizedFormat ? undefined : (options.transforms?.format ?? 'auto');

    const transforms = {
      ...options.transforms,
      width,
      quality,
      format,
    };

    try {
      return urlBuilder.buildTransformedUrl(src, transforms);
    } catch (error) {
      throw new Error(
        'Failed to generate optimized URL: ' +
        (error instanceof Error ? error.message : String(error)) +
        '. Please check your organization name and image source path.'
      );
    }
  };
}
