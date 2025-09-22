/**
 * Utility functions for responsive image processing
 */

// Default responsive breakpoints
export const DEFAULT_BREAKPOINTS = [
  { width: 640, name: 'sm' },
  { width: 768, name: 'md' },
  { width: 1024, name: 'lg' },
  { width: 1280, name: 'xl' },
  { width: 1536, name: '2xl' },
] as const;

// Network Information API type definition
interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  saveData?: boolean;
}

// Calculate image size considering Device Pixel Ratio
export function calculateImageSizes(
  baseWidth: number,
  baseHeight?: number,
  devicePixelRatio: number = 1,
): { width: number; height?: number } {
  return {
    width: Math.round(baseWidth * devicePixelRatio),
    height:
      baseHeight !== undefined
        ? Math.round(baseHeight * devicePixelRatio)
        : undefined,
  };
}

/**
 * Extract actual rendering sizes from sizes attribute value
 *
 * @example
 * ```
 * parseImageSizes('(max-width: 768px) 100vw, 50vw')
 * // [188, 384, 512, 640, 960]
 * ```
 */
export function parseImageSizes(sizes: string): number[] {
  const sizeMatches = sizes.match(/(\d+)px|(\d+)vw/g) || [];
  const parsedSizes: number[] = [];

  // Calculate expected sizes by screen width (simple estimation)
  const viewportWidths = [375, 768, 1024, 1280, 1920]; // mobile, tablet, desktop

  sizeMatches.forEach((size) => {
    if (size.endsWith('px')) {
      const pixels = parseInt(size);
      parsedSizes.push(pixels);
    } else if (size.endsWith('vw')) {
      const vw = parseInt(size);
      viewportWidths.forEach((viewport) => {
        const calculatedSize = Math.round((viewport * vw) / 100);
        if (!parsedSizes.includes(calculatedSize)) {
          parsedSizes.push(calculatedSize);
        }
      });
    }
  });

  // Remove duplicates and sort
  return [...new Set(parsedSizes)].sort((a, b) => a - b);
}

/**
 * Generate basic responsive widths
 *
 * @example
 * ```
 * generateResponsiveWidths(1200)
 * // [200, 300, 400, 600, 800, 1200, 2400]
 * ```
 */
export function generateResponsiveWidths(
  baseWidth: number,
  options?: {
    multipliers?: number[];
    minWidth?: number;
    maxWidth?: number;
  },
): number[] {
  const {
    multipliers = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
    minWidth = 200,
    maxWidth = 3840,
  } = options || {};

  const widths = multipliers
    .map((multiplier) => Math.round(baseWidth * multiplier))
    .filter((width) => width >= minWidth && width <= maxWidth)
    .filter((width, index, arr) => arr.indexOf(width) === index) // Remove duplicates
    .sort((a, b) => a - b);

  return widths;
}

/**
 * Calculate optimal image size based on container size
 */
export function calculateOptimalImageSize(
  containerWidth: number,
  containerHeight?: number,
  devicePixelRatio: number = 1,
): { width: number; height?: number } {
  // Actual required size considering DPR
  const optimalWidth = Math.ceil(containerWidth * devicePixelRatio);
  const optimalHeight = containerHeight
    ? Math.ceil(containerHeight * devicePixelRatio)
    : undefined;

  // Limit oversized images (memory and performance consideration)
  const maxWidth = 3840; // 4K level
  const maxHeight = 2160;

  return {
    width: Math.min(optimalWidth, maxWidth),
    height: optimalHeight ? Math.min(optimalHeight, maxHeight) : undefined,
  };
}

/**
 * Determine image loading priority
 */
export function determineImagePriority(
  element: HTMLElement | null,
  userPriority?: boolean,
): boolean {
  if (userPriority !== undefined) {
    return userPriority;
  }

  if (!element || typeof window === 'undefined') {
    return false;
  }

  // Images in viewport have high priority
  const rect = element.getBoundingClientRect();
  const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

  // Or images near page top (but not above viewport)
  const isNearTop = rect.top >= 0 && rect.top < window.innerHeight * 1.5;

  return isInViewport || isNearTop;
}

/**
 * Lazy loading using Intersection Observer
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    },
  );
}

/**
 * Detect current device characteristics
 */
export function getDeviceCharacteristics() {
  if (typeof window === 'undefined') {
    return {
      devicePixelRatio: 1,
      viewportWidth: 1920,
      viewportHeight: 1080,
      isMobile: false,
      isTouch: false,
      connectionType: 'unknown',
      dataLimit: undefined,
    };
  }

  const connection =
    typeof navigator !== 'undefined'
      ? (navigator as unknown as { connection?: NetworkInformation })
          ?.connection ||
        (navigator as unknown as { mozConnection?: NetworkInformation })
          ?.mozConnection
      : undefined;

  return {
    devicePixelRatio: window.devicePixelRatio || 1,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    isMobile: window.innerWidth <= 768,
    isTouch: 'ontouchstart' in window,
    connectionType: connection?.effectiveType || 'unknown',
    dataLimit: connection?.saveData,
  };
}

/**
 * Adjust image quality based on network conditions
 */
export function adjustQualityForConnection(
  baseQuality: number = 85,
  connectionType?: string,
): number {
  if (typeof window === 'undefined') {
    return baseQuality;
  }

  const connection =
    typeof navigator !== 'undefined'
      ? (navigator as unknown as { connection?: NetworkInformation })
          ?.connection
      : undefined;
  const effectiveType = connectionType || connection?.effectiveType;
  const saveData = connection?.saveData === true;

  if (saveData) {
    return Math.max(40, baseQuality - 30);
  }

  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return Math.max(30, baseQuality - 40);
    case '3g':
      return Math.max(50, baseQuality - 20);
    case '4g':
    default:
      return baseQuality;
  }
}

/**
 * Network speed types
 */
export type NetworkSpeed = 'fast' | 'slow' | 'offline';

/**
 * Detect current network speed
 *
 * ref: https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
 * This feature is not Baseline because it does not work in some of the most widely-used browsers.
 */
export function detectNetworkSpeed(): NetworkSpeed {
  if (typeof navigator === 'undefined') {
    return 'fast';
  }

  // Check if offline
  if (!navigator.onLine) {
    return 'offline';
  }

  // Check Network Information API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection = (navigator as any).connection;
  if (connection) {
    // Check save data mode
    if (connection.saveData) {
      return 'slow';
    }

    // Check effective type
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'slow';
    }
  }

  return 'fast';
}
