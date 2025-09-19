import type { CSSProperties } from 'react';

/**
 * Style calculation utilities for image components
 */

export interface ReservedSpace {
  width?: number;
  height?: number;
}

/**
 * Creates image style for fill mode or regular mode
 * @param baseStyle - Base style from props
 * @param fill - Whether the image is in fill mode
 * @returns Calculated image style
 */
export function createImageStyle(
  baseStyle?: CSSProperties,
  fill = false,
): CSSProperties {
  return {
    ...baseStyle,
    ...(fill && {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }),
  };
}

/**
 * Creates container style for fill mode or with reserved space (Next.js Image style)
 * @param fill - Whether the component is in fill mode
 * @param reservedSpace - Reserved space for layout stability
 * @returns Container style
 */
export function createContainerStyle(
  fill: boolean,
  reservedSpace?: ReservedSpace | null,
): CSSProperties {
  if (fill) {
    return {
      position: 'relative',
      display: 'inline-block',
      width: '100%',
      height: '100%',
    };
  }

  // Next.js Image style: reserve space immediately to prevent layout shift
  if (reservedSpace && (reservedSpace.width || reservedSpace.height)) {
    return {
      display: 'inline-block',
      width: reservedSpace.width ? `${reservedSpace.width}px` : 'auto',
      height: reservedSpace.height ? `${reservedSpace.height}px` : 'auto',
      overflow: 'hidden',
    };
  }

  return {};
}

/**
 * Creates placeholder image style
 * @param imageStyle - Base image style
 * @param isLoaded - Whether the main image is loaded
 * @param blurAmount - Blur amount in pixels (default: 20)
 * @returns Placeholder style
 */
export function createPlaceholderStyle(
  imageStyle: CSSProperties,
  isLoaded: boolean,
  blurAmount = 20,
): CSSProperties {
  return {
    ...imageStyle,
    filter: `blur(${blurAmount}px)`,
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 0 : 1,
  };
}

/**
 * Creates main image style with loading states
 * @param imageStyle - Base image style
 * @param isLoaded - Whether the image is loaded
 * @param showBlurPlaceholder - Whether to show blur placeholder
 * @returns Main image style
 */
export function createMainImageStyle(
  imageStyle: CSSProperties,
  isLoaded: boolean,
  showBlurPlaceholder: boolean,
): CSSProperties {
  return {
    ...imageStyle,
    opacity: isLoaded ? 1 : showBlurPlaceholder ? 0 : 1,
    transition: showBlurPlaceholder ? 'opacity 0.3s ease' : undefined,
  };
}

/**
 * Creates reserved space for layout stability (Next.js Image style)
 * @param fill - Whether the image is in fill mode
 * @param width - Image width
 * @param height - Image height
 * @returns Reserved space configuration
 */
export function createReservedSpace(
  fill: boolean,
  width?: number,
  height?: number,
): ReservedSpace | null {
  if (fill) return null;

  // Only reserve space if we have dimensions
  if (width || height) {
    return { width, height };
  }

  return null;
}
