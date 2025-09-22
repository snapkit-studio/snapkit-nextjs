'use client';

import NextImage, { ImageLoader } from 'next/image';
import { ImageTransforms, SnapkitUrlBuilder } from '@snapkit-studio/core';

import { createSnapkitLoader } from './image-loader';
import type { SnapkitImageProps } from './types';
import { calculateEnhancedStyle } from './utils';
import { parseEnvConfig } from './utils/env-config';

/**
 * Creates a custom loader that applies transforms and network-based quality adjustment
 * Integrates transform logic with the loader for consistent URL generation
 */
function createTransformLoader(
  transforms: ImageTransforms | undefined,
  adjustQualityByNetwork?: boolean,
): ImageLoader {
  const envConfig = parseEnvConfig();
  const urlBuilder = new SnapkitUrlBuilder(envConfig.organizationName);
  const baseLoader = createSnapkitLoader();

  return ({ src, width, quality }) => {
    // Apply transforms if provided
    const processedSrc = transforms
      ? urlBuilder.buildTransformedUrl(src, transforms)
      : src;

    // Apply optimization with network-based quality adjustment
    return baseLoader({
      src: processedSrc,
      width,
      quality,
      // Pass network adjustment flag to the base loader if needed
      ...(adjustQualityByNetwork && { adjustQualityByNetwork }),
    });
  };
}

/**
 * Client Component version of Snapkit Image
 * Supports client-side features like event handlers and network adaptation
 * Renders with dynamic optimization based on device and network conditions
 */
export function ClientImage({
  src,
  transforms,
  style,
  adjustQualityByNetwork,
  onLoad,
  onError,
  ...props
}: SnapkitImageProps) {
  // Create loader with transforms and network quality adjustment
  const loader = createTransformLoader(transforms, adjustQualityByNetwork);

  const isUrlImageSource = typeof src === 'string';

  if (!isUrlImageSource) {
    // For static imports, use Next.js Image without Snapkit optimization
    return (
      <NextImage
        {...props}
        src={src}
        style={style}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  // Safe type conversion with validation
  const numWidth = props.width
    ? typeof props.width === 'number'
      ? props.width
      : parseInt(String(props.width), 10)
    : undefined;

  const numHeight = props.height
    ? typeof props.height === 'number'
      ? props.height
      : parseInt(String(props.height), 10)
    : undefined;

  const enhancedStyle = calculateEnhancedStyle(numWidth, numHeight, style);

  // The loader handles both transforms and optimization
  // No need to pre-transform the src, loader will handle it
  return (
    <NextImage
      {...props}
      className={props.className}
      src={src}
      loader={loader}
      style={enhancedStyle}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
