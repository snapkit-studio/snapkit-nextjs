// No 'use client' directive - this is a server component

import NextImage from 'next/image';
//
import { SnapkitUrlBuilder } from '@snapkit-studio/core';

import { createSnapkitLoader } from './image-loader';
import type { SnapkitImageProps } from './types';
import { calculateEnhancedStyle } from './utils';
import { parseEnvConfig } from './utils/env-config';

/**
 * Server Component version of Snapkit Image
 *
 * Server components use pre-computed URLs without loader function
 * Renders on the server with pre-computed URLs and srcSet
 * Wrap Next.js Image with picture element for proper srcSet support
 * Does not support client-side features like network adaptation or event handlers
 */
export function ServerImage({
  src,
  transforms,
  style,
  width,
  height,
  quality,
  // Filter out client-only props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  adjustQualityByNetwork: _adjustQualityByNetwork,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dprOptions: _dprOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  optimize: _optimize,
  ...props
}: SnapkitImageProps) {
  // Type guard for string sources
  const isUrlImageSource = typeof src === 'string';

  if (!width) {
    throw new Error('Width is required for ServerImage');
  }

  if (!isUrlImageSource) {
    // For static imports, use Next.js Image without Snapkit optimization
    return <NextImage {...props} src={src} style={style} />;
  }

  // Get environment configuration and create URL builder
  const envConfig = parseEnvConfig();
  const urlBuilder = new SnapkitUrlBuilder(envConfig.organizationName);
  const baseLoader = createSnapkitLoader();

  // Convert width/height to numbers if they are strings
  const numWidth = typeof width === 'string' ? parseInt(width, 10) : width;
  const numHeight = typeof height === 'string' ? parseInt(height, 10) : height;

  // Calculate enhanced styles if needed
  const enhancedStyle = calculateEnhancedStyle(numWidth, numHeight, style);

  // Determine quality value
  const qualityValue =
    typeof quality === 'number' ? quality : envConfig.defaultQuality;

  // Helper function to generate URLs efficiently
  const generateUrl = (srcUrl: string, multiplier: number) => {
    return baseLoader({
      src: srcUrl,
      width: numWidth * multiplier,
      quality: qualityValue,
    });
  };

  // Apply transforms if provided
  const baseImageUrl = transforms
    ? urlBuilder.buildTransformedUrl(src, transforms)
    : src;

  // Generate base 1x URL
  const url1x = generateUrl(baseImageUrl, 1);

  // Generate DPR-based srcSet for crisp display on high-DPI devices
  // Consistent with other Snapkit components (ClientImage, React Image)
  const dprValues = [1, 2, 3];

  // Generate srcSet dynamically
  const srcSetEntries = dprValues.map((dpr) => {
    const url = dpr === 1 ? url1x : generateUrl(baseImageUrl, dpr);
    return `${url} ${dpr}x`;
  });

  // Add 'block' class to ensure proper spacing with space-y-* utilities
  const pictureClassName = props.className
    ? `${props.className} block`
    : 'block';

  return (
    <picture className={pictureClassName}>
      <source
        srcSet={srcSetEntries.join(', ')}
        sizes={props.sizes || `(max-width: ${numWidth}px) 100vw, ${numWidth}px`}
      />
      <NextImage
        {...props}
        src={url1x}
        style={enhancedStyle}
        width={width}
        height={height}
        sizes={props.sizes || `(max-width: ${numWidth}px) 100vw, ${numWidth}px`}
        unoptimized // Since we already optimized the URL with Snapkit
      />
    </picture>
  );
}
