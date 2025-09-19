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
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = imageUrl;

  if (sizes) {
    link.setAttribute('imagesizes', sizes);
  }

  document.head.appendChild(link);

  // Return cleanup function
  return () => {
    if (document.head.contains(link)) {
      document.head.removeChild(link);
    }
  };
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
  if (!('IntersectionObserver' in window)) {
    return null;
  }

  // Next.js Image style: Start loading 200px before entering viewport
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '200px',
    threshold: 0,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
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