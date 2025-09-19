/**
 * Error handling utilities for Next.js Image style behavior
 */

/**
 * Next.js Image style error event handler
 * @param event - The error event
 * @param onError - Optional user-provided error handler
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void,
): void {
  // Next.js Image behavior: Call user handler but don't implement fallback
  // Users should handle fallbacks explicitly if needed
  onError?.(event);
}

/**
 * Checks if an error should maintain placeholder visibility (Next.js Image style)
 * @param hasError - Whether an error occurred
 * @param placeholder - Placeholder type
 * @param isLoaded - Whether image is loaded
 * @returns Whether to show placeholder during error
 */
export function shouldShowPlaceholderOnError(
  hasError: boolean,
  placeholder?: 'blur' | 'empty' | 'none',
  isLoaded?: boolean,
): boolean {
  // Next.js Image style: Keep placeholder visible during error states
  if (hasError && placeholder === 'blur' && !isLoaded) {
    return true;
  }
  return false;
}

/**
 * Creates error-aware image visibility state
 * @param isLoaded - Whether image is loaded successfully
 * @param hasError - Whether an error occurred
 * @param showBlurPlaceholder - Whether blur placeholder is shown
 * @returns Opacity value for main image
 */
export function getImageVisibility(
  isLoaded: boolean,
  hasError: boolean,
  showBlurPlaceholder: boolean,
): number {
  // Next.js Image style error handling:
  // - On error: Hide main image, keep placeholder if available
  // - On success: Show main image, fade out placeholder
  if (hasError) return 0;
  if (isLoaded) return 1;
  return showBlurPlaceholder ? 0 : 1;
}