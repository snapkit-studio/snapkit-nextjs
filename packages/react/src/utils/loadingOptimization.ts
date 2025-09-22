/**
 * Loading optimization utilities for Next.js Image style behavior
 */

/**
 * Creates a preload link element for priority images (Next.js Image style)
 * @param imageUrl - URL of the image to preload
 * @param sizes - Sizes attribute for responsive images
 * @returns Cleanup function
 */
export function createPreloadHint(
  imageUrl: string,
  sizes?: string,
): () => void {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return () => {}; // No-op for SSR
  }

  try {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;

    if (sizes) {
      link.setAttribute('imagesizes', sizes);
    }

    // Add unique identifier for easier cleanup
    link.setAttribute('data-preload-hint', imageUrl);

    document.head.appendChild(link);

    // Return cleanup function with safety checks
    return () => {
      try {
        if (document.head && document.head.contains(link)) {
          document.head.removeChild(link);
        }
      } catch (error) {
        // Silently handle cleanup errors (e.g., already removed)
        console.debug('Cleanup error for preload hint:', error);
      }
    };
  } catch (error) {
    console.warn('Failed to create preload hint:', error);
    return () => {}; // Return no-op cleanup function
  }
}

/**
 * Creates lazy load observer with Next.js Image style configuration
 * @param callback - Callback when image enters viewport
 * @param options - Intersection observer options
 * @returns Intersection observer instance
 */
export function createEnhancedLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
): IntersectionObserver | null {
  // Check for browser environment and IntersectionObserver support
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  try {
    // Next.js Image style: Start loading 200px before entering viewport
    const defaultOptions: IntersectionObserverInit = {
      rootMargin: '200px',
      threshold: 0,
      ...options,
    };

    // Create observer with wrapped callback for safety
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          try {
            callback(entry);
            // Auto-unobserve after callback to prevent memory leaks
            obs.unobserve(entry.target);
          } catch (error) {
            console.error('Error in lazy load callback:', error);
            // Still unobserve to prevent further errors
            try {
              obs.unobserve(entry.target);
            } catch {
              // Ignore unobserve errors
            }
          }
        }
      });
    }, defaultOptions);

    return observer;
  } catch (error) {
    console.warn('Failed to create IntersectionObserver:', error);
    return null;
  }
}

/**
 * Determines if image should be loaded eagerly (Next.js Image style)
 * @param priority - Priority flag from props
 * @param loading - Loading attribute from props
 * @returns Whether to load eagerly
 */
export function shouldLoadEagerly(
  priority?: boolean,
  loading?: 'lazy' | 'eager',
): boolean {
  if (priority) return true;
  if (loading === 'eager') return true;
  return false;
}
