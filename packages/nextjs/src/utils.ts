import { CSSProperties } from 'react';

/**
 * Calculate enhanced style for aspect ratio maintenance
 */
export function calculateEnhancedStyle(
  width: number | undefined,
  height: number | undefined,
  existingStyle?: CSSProperties,
): CSSProperties | undefined {
  const hasOnlyWidth = (width && !height) || (width && height);
  const hasOnlyHeight = height && !width;

  if (hasOnlyWidth || hasOnlyHeight) {
    return {
      ...(hasOnlyWidth && { height, width }),
      ...(hasOnlyHeight && { width: 'auto', height }),
      ...existingStyle,
    };
  }

  return existingStyle;
}
