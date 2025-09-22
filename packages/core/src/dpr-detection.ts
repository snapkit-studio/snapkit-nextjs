/**
 * Device Pixel Ratio (DPR) detection and optimization utilities
 */

/**
 * DPR detection options
 */
export interface DprDetectionOptions {
  /** Maximum DPR to use (default: 3) */
  maxDpr?: number;
  /** Enable auto-detection of device DPR (default: true) */
  autoDetect?: boolean;
  /** Force specific DPR value for testing */
  forceDpr?: number;
  /** Custom DPR values to use */
  customDprs?: number[];
}

/**
 * Get current device pixel ratio
 * Returns 1 in SSR/Node.js environments
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') {
    return 1; // SSR fallback
  }

  return window.devicePixelRatio || 1;
}

/**
 * Determine optimal DPR values based on device capabilities
 *
 * @param options - DPR detection options
 * @returns Array of DPR values to use for srcSet generation
 */
export function getOptimalDprValues(
  options: DprDetectionOptions = {},
): number[] {
  const { maxDpr = 3, autoDetect = true, forceDpr, customDprs } = options;

  // If forceDpr is set (for testing), use only that value
  if (forceDpr !== undefined && forceDpr > 0) {
    return [forceDpr];
  }

  // If custom DPRs provided, use them (filtered by maxDpr)
  if (customDprs && customDprs.length > 0) {
    return customDprs
      .filter((dpr) => dpr > 0 && dpr <= maxDpr)
      .sort((a, b) => a - b);
  }

  // If auto-detection is disabled, use standard set
  if (!autoDetect) {
    return getStandardDprSet(maxDpr);
  }

  // Auto-detect based on device pixel ratio
  const deviceDpr = getDevicePixelRatio();

  // Smart DPR selection based on actual device DPR
  if (deviceDpr <= 1) {
    // Standard displays: only 1x needed
    return [1];
  } else if (deviceDpr <= 1.5) {
    // Some desktop with scaling: 1x and 1.5x
    return [1, 1.5];
  } else if (deviceDpr <= 2) {
    // Retina displays: 1x and 2x
    return [1, 2];
  } else if (deviceDpr <= 2.5) {
    // High-DPI mobile: 1x, 2x
    // Skip 3x as it's rarely beneficial for 2.5x devices
    return [1, 2];
  } else {
    // Ultra high-DPI (3x+ devices like iPhone Pro)
    // Cap at maxDpr to prevent excessive image sizes
    const dprs = [1, 2];
    if (maxDpr >= 3 && deviceDpr >= 2.75) {
      // Only include 3x for devices that truly benefit
      dprs.push(3);
    }
    return dprs;
  }
}

/**
 * Get standard DPR set based on max DPR limit
 */
function getStandardDprSet(maxDpr: number): number[] {
  const standardSet = [1];

  if (maxDpr >= 2) {
    standardSet.push(2);
  }

  if (maxDpr >= 3) {
    standardSet.push(3);
  }

  return standardSet;
}

/**
 * Check if browser supports high-efficiency image formats
 * This can influence whether we need higher DPR images
 */
export function supportsHighEfficiencyFormats(): {
  avif: boolean;
  webp: boolean;
} {
  if (typeof window === 'undefined') {
    // SSR: assume modern format support
    return { avif: false, webp: true };
  }

  // Simple feature detection using canvas
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;

  const supportsWebP = canvas.toDataURL
    ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5
    : false;

  const supportsAvif = canvas.toDataURL
    ? canvas.toDataURL('image/avif').indexOf('image/avif') === 5
    : false;

  return {
    avif: supportsAvif,
    webp: supportsWebP,
  };
}

/**
 * Get recommended DPR limit based on network conditions
 * Useful for data-saving modes
 */
export function getNetworkAwareDprLimit(): number {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return 3; // Default to max if we can't detect
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection = (navigator as any).connection;

  // Check for data saver mode
  if (connection.saveData) {
    return 1; // Only use 1x images in data saver mode
  }

  // Adjust based on connection type
  const effectiveType = connection.effectiveType;
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return 1;
    case '3g':
      return 2;
    case '4g':
    default:
      return 3;
  }
}

/**
 * Determine if we should use 3x images based on comprehensive analysis
 */
export function shouldUse3xImages(options: DprDetectionOptions = {}): boolean {
  const deviceDpr = getDevicePixelRatio();

  // Never use 3x if device doesn't support it
  if (deviceDpr < 2.75) {
    return false;
  }

  // Check network constraints
  const networkLimit = getNetworkAwareDprLimit();
  if (networkLimit < 3) {
    return false;
  }

  // Check max DPR setting
  const maxDpr = options.maxDpr ?? 3;
  if (maxDpr < 3) {
    return false;
  }

  // Check if high-efficiency formats are supported
  // If AVIF/WebP is supported, we might skip 3x as compression is better
  const formats = supportsHighEfficiencyFormats();
  if (formats.avif) {
    // With AVIF, 2x is often sufficient even for 3x displays
    return false;
  }

  return true;
}
