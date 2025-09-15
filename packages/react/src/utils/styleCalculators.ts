import type { CSSProperties } from 'react';

/**
 * Style calculation utilities for image components
 */

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
 * Creates container style for fill mode
 * @param fill - Whether the component is in fill mode
 * @returns Container style
 */
export function createContainerStyle(fill: boolean): CSSProperties {
  return fill
    ? {
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        height: '100%',
      }
    : {};
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
