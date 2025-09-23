/**
 * Browser compatibility detection for image formats
 */

export interface BrowserInfo {
  name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';
  version: number;
  platform: 'desktop' | 'ios' | 'android' | 'unknown';
  iosVersion?: { major: number; minor: number };
}

export interface FormatSupport {
  avif: boolean;
  webp: boolean;
}

/**
 * Parse User Agent to extract browser information
 */
export function parseBrowserInfo(userAgent: string): BrowserInfo {
  const ua = userAgent;

  // iOS version detection
  const iosMatch = ua.match(/OS (\d+)_(\d+)/);
  const iosVersion = iosMatch
    ? {
        major: parseInt(iosMatch[1]),
        minor: parseInt(iosMatch[2]),
      }
    : undefined;

  // Platform detection
  let platform: BrowserInfo['platform'] = 'unknown';
  if (iosMatch) {
    platform = 'ios';
  } else if (ua.includes('Android')) {
    platform = 'android';
  } else if (
    ua.includes('Windows') ||
    ua.includes('Macintosh') ||
    ua.includes('Linux')
  ) {
    platform = 'desktop';
  }

  // Browser detection and version extraction
  const chromeMatch = ua.match(/Chrome\/(\d+)/);
  const iosChromeMatch = ua.match(/CriOS\/(\d+)/);
  const firefoxMatch = ua.match(/Firefox\/(\d+)/);
  const edgeMatch = ua.match(/Edg\/(\d+)/);
  const legacyEdgeMatch = ua.match(/Edge\/(\d+)/);
  const safariMatch = ua.match(/Version\/(\d+).*Safari/);

  // Edge detection should come before Chrome since Edge also contains Chrome in UA
  if (edgeMatch || legacyEdgeMatch) {
    return {
      name: 'edge',
      version: edgeMatch
        ? parseInt(edgeMatch[1])
        : legacyEdgeMatch
          ? parseInt(legacyEdgeMatch[1])
          : 0,
      platform,
      iosVersion,
    };
  } else if (chromeMatch || iosChromeMatch) {
    return {
      name: 'chrome',
      version: chromeMatch
        ? parseInt(chromeMatch[1])
        : parseInt(iosChromeMatch![1]),
      platform,
      iosVersion,
    };
  } else if (firefoxMatch) {
    return {
      name: 'firefox',
      version: parseInt(firefoxMatch[1]),
      platform,
      iosVersion,
    };
  } else if (safariMatch || platform === 'ios') {
    return {
      name: 'safari',
      version: safariMatch ? parseInt(safariMatch[1]) : 0,
      platform,
      iosVersion,
    };
  }

  return {
    name: 'unknown',
    version: 0,
    platform,
    iosVersion,
  };
}

/**
 * Check AVIF support based on browser info
 */
export function checkAvifSupport(browserInfo: BrowserInfo): boolean {
  // iOS 16.0-16.3 has AVIF issues, disable for all browsers on these versions
  if (browserInfo.iosVersion) {
    const { major, minor } = browserInfo.iosVersion;
    if (major === 16 && minor >= 0 && minor <= 3) {
      return false;
    }
  }

  switch (browserInfo.name) {
    case 'chrome':
      return browserInfo.version >= 85;

    case 'firefox':
      return browserInfo.version >= 93;

    case 'edge':
      // Edge is Chromium-based, same support as Chrome
      return browserInfo.version >= 91;

    case 'safari':
      // Safari on iOS/macOS 16.4+ supports AVIF fully
      if (browserInfo.iosVersion) {
        const { major, minor } = browserInfo.iosVersion;
        return major > 16 || (major === 16 && minor >= 4);
      }
      // For macOS Safari, assume same version requirement as iOS
      return false;

    default:
      return false;
  }
}

/**
 * Check WebP support based on browser info
 */
export function checkWebpSupport(browserInfo: BrowserInfo): boolean {
  switch (browserInfo.name) {
    case 'chrome':
      return browserInfo.version >= 23;

    case 'firefox':
      return browserInfo.version >= 65;

    case 'edge':
      return browserInfo.version >= 14 || browserInfo.version === 0; // Legacy Edge detection

    case 'safari':
      // Safari on iOS 14+ supports WebP
      if (browserInfo.iosVersion) {
        return browserInfo.iosVersion.major >= 14;
      }
      // Safari on macOS 14+ supports WebP
      return browserInfo.version >= 14;

    default:
      return false;
  }
}

/**
 * Get format support for given User Agent
 */
export function getFormatSupportFromUA(userAgent: string): FormatSupport {
  const browserInfo = parseBrowserInfo(userAgent);

  return {
    avif: checkAvifSupport(browserInfo),
    webp: checkWebpSupport(browserInfo),
  };
}

/**
 * Estimate rough format support based on User Agent (main entry point)
 */
export function estimateFormatSupportFromUA(): FormatSupport {
  // Check if we're in a browser environment with a valid navigator
  const isValidBrowser =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator?.userAgent;

  if (!isValidBrowser) {
    return { avif: false, webp: false };
  }

  return getFormatSupportFromUA(navigator.userAgent);
}
