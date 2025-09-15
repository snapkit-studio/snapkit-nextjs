/**
 * Placeholder handling utilities
 */

export type PlaceholderType = 'blur' | 'empty' | string;

/**
 * Determines if blur placeholder should be shown
 * @param placeholder - Placeholder type
 * @param isLoaded - Whether the main image is loaded
 * @param hasError - Whether there was an error loading the image
 * @returns Boolean indicating if blur placeholder should be shown
 */
export function shouldShowBlurPlaceholder(
  placeholder: PlaceholderType,
  isLoaded: boolean,
  hasError: boolean,
): boolean {
  return placeholder === 'blur' && !isLoaded && !hasError;
}

/**
 * Determines placeholder URL based on configuration
 * @param placeholder - Placeholder type
 * @param blurDataURL - Custom blur data URL
 * @param generatedPlaceholderUrl - Generated placeholder URL
 * @returns Placeholder URL or undefined
 */
export function getPlaceholderUrl(
  placeholder: PlaceholderType,
  blurDataURL?: string,
  generatedPlaceholderUrl?: string,
): string | undefined {
  if (blurDataURL !== undefined) {
    return blurDataURL;
  }

  if (placeholder === 'blur' && generatedPlaceholderUrl) {
    return generatedPlaceholderUrl;
  }

  return undefined;
}
