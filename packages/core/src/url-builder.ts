import { ImageTransforms } from "./types";

/**
 * Generate Snapkit image proxy URLs
 */
export class SnapkitUrlBuilder {
  private baseUrl: string;
  private organizationName: string;

  constructor(
    baseUrlOrOrganizationName?: string,
    organizationName?: string,
  ) {
    // Handle different parameter combinations
    if (typeof baseUrlOrOrganizationName === 'string' && organizationName === undefined) {
      // Single parameter case - check if it looks like a URL or organization name
      if (baseUrlOrOrganizationName.startsWith('http://') || baseUrlOrOrganizationName.startsWith('https://')) {
        // It's a baseUrl without organizationName
        this.baseUrl = baseUrlOrOrganizationName;
        this.organizationName = '';
      } else {
        // It's an organizationName (backward compatibility)
        this.organizationName = baseUrlOrOrganizationName;
        this.baseUrl = `https://${baseUrlOrOrganizationName}-cdn.snapkit.studio`;
      }
    } else {
      // Two parameter case or no parameters
      this.baseUrl = baseUrlOrOrganizationName || `https://${organizationName || ''}-cdn.snapkit.studio`;
      this.organizationName = organizationName || '';
    }
  }

  /**
   * Generate basic image URL
   */
  buildImageUrl(src: string, overrideOrganizationName?: string): string {
    // Return as-is if already complete URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }

    // Add slash if not starting with one
    const path = src.startsWith('/') ? src : `/${src}`;
    const orgName = overrideOrganizationName || this.organizationName;

    // Remove trailing slash from baseUrl to avoid double slashes
    const cleanBaseUrl = this.baseUrl.replace(/\/+$/, '');

    // Use the format expected by tests: /image/{org}/{path}
    return `${cleanBaseUrl}/image/${orgName}${path}`;
  }

  /**
   * Generate image URL with transformation parameters
   */
  buildTransformedUrl(
    src: string,
    transforms: ImageTransforms,
    overrideOrganizationName?: string,
  ): string {
    const baseUrl = this.buildImageUrl(src, overrideOrganizationName);
    const params = this.buildQueryParams(transforms);

    // Only add query params if there are any
    if (!params) {
      return baseUrl;
    }

    if (src.includes('?')) {
      return `${baseUrl}&${params}`;
    }

    return `${baseUrl}?${params}`;
  }

  /**
   * 
   */

  /**
   * Generate format-specific URLs (for picture tags)
   */
  buildFormatUrls(
    src: string,
    transforms: ImageTransforms,
    overrideOrganizationName?: string,
  ): { avif?: string; webp?: string; original: string } {
    const baseTransforms = { ...transforms };

    return {
      avif: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: 'avif' },
        overrideOrganizationName,
      ),
      webp: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: 'webp' },
        overrideOrganizationName,
      ),
      original: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: undefined },
        overrideOrganizationName,
      ),
    };
  }

  /**
   * Generate srcset string (for responsive images)
   */
  buildSrcSet(
    src: string,
    widths: number[],
    transforms: Omit<ImageTransforms, 'width'>,
    overrideOrganizationName?: string,
  ): string {
    return widths
      .map((width) => {
        const url = this.buildTransformedUrl(
          src,
          { ...transforms, width },
          overrideOrganizationName,
        );
        return `${url} ${width}w`;
      })
      .join(', ');
  }

  /**
   * Convert transformation parameters to query string
   */
  private buildQueryParams(transforms: ImageTransforms): string {
    const params = new URLSearchParams();

    // Size adjustment
    if (transforms.width) params.set('w', transforms.width.toString());
    if (transforms.height) params.set('h', transforms.height.toString());
    if (transforms.fit) params.set('fit', transforms.fit);

    // Flipping
    if (transforms.flip) params.set('flip', 'true');
    if (transforms.flop) params.set('flop', 'true');

    // Visual effects
    if (transforms.blur) {
      params.set(
        'blur',
        transforms.blur === true ? 'true' : transforms.blur.toString(),
      );
    }
    if (transforms.grayscale) params.set('grayscale', 'true');

    // Color adjustment
    if (transforms.brightness) params.set('brightness', transforms.brightness.toString());
    if (transforms.hue) params.set('hue', transforms.hue.toString());
    if (transforms.lightness) params.set('lightness', transforms.lightness.toString());
    if (transforms.saturation) params.set('saturation', transforms.saturation.toString());
    if (transforms.negate) params.set('negate', 'true');
    if (transforms.normalize) params.set('normalize', 'true');

    // Region extraction
    if (transforms.extract) {
      const { x, y, width, height } = transforms.extract;
      params.set('extract', `${x},${y},${width},${height}`);
    }

    // Background color
    if (transforms.background) {
      const [r, g, b, a] = transforms.background;
      params.set('background', `${r},${g},${b},${a}`);
    }

    // Format and quality - exclude 'auto' format from URL
    if (transforms.format && transforms.format !== 'auto') {
      params.set('format', transforms.format);
    }
    if (transforms.quality) {
      params.set('quality', transforms.quality.toString());
    }
    if (transforms.timeout) {
      params.set('timeout', transforms.timeout.toString());
    }

    return params.toString();
  }
}

// Default URL Builder instance
let defaultUrlBuilder: SnapkitUrlBuilder | null = null;

/**
 * Set the default URL builder instance
 * @param baseUrl - Base URL for the builder
 * @param organizationName - Organization name
 */
export function setDefaultUrlBuilder(
  baseUrl?: string,
  organizationName?: string,
): void {
  if (!baseUrl && !organizationName) {
    defaultUrlBuilder = null;
    return;
  }
  defaultUrlBuilder = new SnapkitUrlBuilder(baseUrl, organizationName);
}

/**
 * Get the default URL builder instance
 * @returns Default URL builder or creates a new one
 */
export function getDefaultUrlBuilder(): SnapkitUrlBuilder {
  if (!defaultUrlBuilder) {
    defaultUrlBuilder = new SnapkitUrlBuilder();
  }
  return defaultUrlBuilder;
}

/**
 * Helper function to build image URLs using the default builder
 * @param src - Source image path
 * @param transforms - Optional image transforms
 * @param options - Override options for baseUrl and organizationName
 * @returns Generated image URL
 */
export function buildImageUrl(
  src: string,
  transforms?: ImageTransforms,
  options?: { baseUrl?: string; organizationName?: string },
): string {
  let builder = getDefaultUrlBuilder();

  // If options are provided, create a temporary builder
  if (options && (options.baseUrl || options.organizationName)) {
    builder = new SnapkitUrlBuilder(options.baseUrl, options.organizationName);
  }

  if (transforms) {
    return builder.buildTransformedUrl(src, transforms);
  }

  return builder.buildImageUrl(src);
}
