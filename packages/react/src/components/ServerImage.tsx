// No 'use client' directive - this is a server component

import { forwardRef, useMemo } from 'react';

import { createImageUrl } from '../utils/createImageUrl';
import { mergeConfigWithEnv } from '../utils/env-config';
import {
  createImageStyle,
  createReservedSpace,
} from '../utils/styleCalculators';
import type {
  ImageConfig,
  ImageFormat,
  LoadingStrategy,
  ServerImageProps,
  SrcSetData,
} from './types';
import { isValidDimension, isValidQuality } from './types';
import { WrapperDiv } from './WrapperDiv';

/**
 * Server Component version of Snapkit Image for React
 *
 * Renders on the server with pre-computed URLs and srcSet
 * Does not support client-side features like:
 * - Event handlers (onLoad, onError)
 * - Network adaptation (adjustQualityByNetwork)
 * - Priority preloading with link tags
 * - IntersectionObserver-based lazy loading
 *
 * Uses native HTML features instead:
 * - Picture element for responsive images
 * - Native loading="lazy" attribute
 * - Pre-computed srcSet for DPR support
 */

// Constants for better memory efficiency
const EMPTY_TRANSFORMS = Object.freeze({});
const DEFAULT_DPR_VALUES = Object.freeze([1, 2, 3]);

export const ServerImage = forwardRef<HTMLImageElement, ServerImageProps>(
  (props, ref) => {
    const {
      src,
      alt = '',
      width,
      height,
      fill = false,
      sizes,
      quality,
      loading = 'lazy',
      transforms = EMPTY_TRANSFORMS,
      className,
      style,
      ...restProps
    } = props;

    // Filter out any remaining props
    const safeProps = restProps;

    // Get environment configuration with memoization - must be called unconditionally
    const config = useMemo(() => mergeConfigWithEnv({}), []);

    // Calculate all image configuration with memoization - must be called unconditionally
    const imageConfig: ImageConfig = useMemo(
      () => ({
        size: {
          width: width || (fill ? undefined : 0),
          height: height || (fill ? undefined : 0),
        },
        quality: typeof quality === 'number' ? quality : config.defaultQuality,
        style: createImageStyle(style, fill),
        reservedSpace: createReservedSpace(fill, width, height),
      }),
      [width, height, fill, quality, config.defaultQuality, style],
    );

    // Helper function to generate URLs with memoization - must be called unconditionally
    const generateUrl = useMemo(
      () => (multiplier: number) => {
        const urlWidth = imageConfig.size.width
          ? imageConfig.size.width * multiplier
          : undefined;

        return createImageUrl(src as string, {
          organizationName: config.organizationName,
          width: urlWidth,
          quality: imageConfig.quality,
          transforms: {
            ...(transforms || EMPTY_TRANSFORMS),
            width: urlWidth,
          },
          defaultFormat: config.defaultFormat as ImageFormat,
        });
      },
      [
        src,
        config.organizationName,
        config.defaultFormat,
        imageConfig.size.width,
        imageConfig.quality,
        transforms,
      ],
    );

    // Generate srcSet data with memoization - must be called unconditionally
    const srcSetData: SrcSetData = useMemo(() => {
      const isUrlImageSource = typeof src === 'string' && src.length > 0;
      if (!isUrlImageSource) {
        return {
          entries: '',
          baseUrl: src as string,
        };
      }

      const urls = DEFAULT_DPR_VALUES.map((dpr) => ({
        url: generateUrl(dpr),
        dpr,
      }));

      return {
        entries: urls.map(({ url, dpr }) => `${url} ${dpr}x`).join(', '),
        baseUrl: urls[0].url,
      };
    }, [src, generateUrl]);

    // Early validation after all hooks
    if (!src) {
      console.warn('ServerImage: src prop is required');
      return null;
    }

    // Type guard for string sources
    const isUrlImageSource = typeof src === 'string' && src.length > 0;

    // Validate dimensions
    if (width && !isValidDimension(width)) {
      console.warn('ServerImage: width must be a positive number');
    }
    if (height && !isValidDimension(height)) {
      console.warn('ServerImage: height must be a positive number');
    }
    if (quality && !isValidQuality(quality)) {
      console.warn('ServerImage: quality must be between 1 and 100');
    }

    // For non-string sources, return a basic img element
    if (!isUrlImageSource) {
      return (
        <img
          ref={ref}
          src={src as string}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={className}
          style={style}
          loading={loading || 'lazy'}
          {...safeProps}
        />
      );
    }

    // Add 'block' class to ensure proper spacing with space-y-* utilities
    const pictureClassName = className ? `${className} block` : 'block';

    // Main image element
    const imgElement = (
      <img
        ref={ref}
        src={srcSetData.baseUrl}
        srcSet={srcSetData.entries}
        sizes={sizes}
        alt={alt}
        width={fill ? undefined : imageConfig.size.width}
        height={fill ? undefined : imageConfig.size.height}
        loading={(loading || 'lazy') as LoadingStrategy}
        className={className}
        style={imageConfig.style}
        // ARIA attributes for accessibility
        role="img"
        aria-label={alt}
        {...safeProps}
      />
    );

    // For better browser compatibility and srcSet support, wrap in picture element
    // when we have responsive images
    const shouldUsePicture = sizes || DEFAULT_DPR_VALUES.length > 1;

    if (shouldUsePicture) {
      const pictureElement = (
        <picture className={pictureClassName}>
          <source
            srcSet={srcSetData.entries}
            sizes={
              sizes ||
              `(max-width: ${imageConfig.size.width}px) 100vw, ${imageConfig.size.width}px`
            }
          />
          {imgElement}
        </picture>
      );

      // Return with wrapper if needed
      if (fill || imageConfig.reservedSpace) {
        return (
          <WrapperDiv fill={fill} reservedSpace={imageConfig.reservedSpace}>
            {pictureElement}
          </WrapperDiv>
        );
      }

      return pictureElement;
    }

    // Return with wrapper if needed (no picture element)
    if (fill || imageConfig.reservedSpace) {
      return (
        <WrapperDiv fill={fill} reservedSpace={imageConfig.reservedSpace}>
          {imgElement}
        </WrapperDiv>
      );
    }

    return imgElement;
  },
);

ServerImage.displayName = 'SnapkitServerImage';
