/**
 * Detect browser support for image formats
 */

// Format support cache (exported for test access)
export const formatSupport = new Map<string, boolean>();

/**
 * Check support for specific image format
 */
export function supportsImageFormat(format: string): boolean {
  if (typeof window === 'undefined') {
    // Server-side conservatively supports only basic formats
    return format === 'jpeg' || format === 'png';
  }

  // Return cached result if available
  if (formatSupport.has(format)) {
    const cachedResult = formatSupport.get(format);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
  }

  let supported = false;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Generate test image with transparent pixel
      ctx.clearRect(0, 0, 1, 1);

      // MIME types by format
      const mimeTypes: Record<string, string> = {
        webp: 'image/webp',
        avif: 'image/avif',
        jpeg: 'image/jpeg',
        png: 'image/png',
      };

      const mimeType = mimeTypes[format.toLowerCase()];
      if (mimeType) {
        const dataUrl = canvas.toDataURL(mimeType, 0.1);
        // If format is supported, corresponding format data URL is generated
        supported = dataUrl.startsWith(`data:${mimeType}`);
      }
    } else {
      // Conservative judgment if Canvas context cannot be obtained
      supported = format === 'jpeg' || format === 'png';
    }
  } catch {
    // Conservative judgment if Canvas cannot be used
    supported = format === 'jpeg' || format === 'png';
  }

  formatSupport.set(format, supported);
  return supported;
}

/**
 * Check supported formats based on Accept header
 */
export function getSupportedFormatsFromAcceptHeader(
  acceptHeader: string,
): string[] {
  const formats = [];

  if (acceptHeader.includes('image/avif')) {
    formats.push('avif');
  }
  if (acceptHeader.includes('image/webp')) {
    formats.push('webp');
  }
  if (acceptHeader.includes('image/jpeg') || acceptHeader.includes('image/*')) {
    formats.push('jpeg');
  }
  if (acceptHeader.includes('image/png') || acceptHeader.includes('image/*')) {
    formats.push('png');
  }

  return formats;
}

/**
 * Select optimal image format for browser
 */
export function getBestSupportedFormat(
  preferredFormat?: string,
): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') {
    // Safe default for server-side
    return 'jpeg';
  }

  // Check support for specific format if user requested it
  if (preferredFormat && preferredFormat !== 'auto') {
    if (supportsImageFormat(preferredFormat)) {
      return preferredFormat as 'avif' | 'webp' | 'jpeg';
    }
  }

  // Check latest formats sequentially
  if (supportsImageFormat('avif')) {
    return 'avif';
  }
  if (supportsImageFormat('webp')) {
    return 'webp';
  }

  return 'jpeg';
}

/**
 * Preload format support detection in browser environment
 */
export function preloadFormatSupport(): void {
  if (typeof window === 'undefined') return;

  // Pre-test frequently used formats
  ['avif', 'webp', 'jpeg', 'png'].forEach((format) => {
    // Test asynchronously to minimize impact on initial loading
    setTimeout(() => supportsImageFormat(format), 10);
  });
}

/**
 * Estimate rough format support based on User Agent (fallback)
 */
export function estimateFormatSupportFromUA(): {
  avif: boolean;
  webp: boolean;
} {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator?.userAgent) {
    return { avif: false, webp: false };
  }

  const ua = navigator.userAgent;

  // Chrome 85+ supports AVIF
  const chromeMatch = ua.match(/Chrome\/(\d+)/);
  const chromeVersion = chromeMatch ? parseInt(chromeMatch[1]) : 0;
  const supportsAvif = chromeVersion >= 85;

  // Chrome 23+, Firefox 65+, Safari 14+ support WebP
  const firefoxMatch = ua.match(/Firefox\/(\d+)/);
  const firefoxVersion = firefoxMatch ? parseInt(firefoxMatch[1]) : 0;

  const safariMatch = ua.match(/Version\/(\d+).*Safari/);
  const safariVersion = safariMatch ? parseInt(safariMatch[1]) : 0;

  const supportsWebp =
    chromeVersion >= 23 ||
    firefoxVersion >= 65 ||
    safariVersion >= 14 ||
    ua.includes('Edge/');

  return {
    avif: supportsAvif,
    webp: supportsWebp,
  };
}
