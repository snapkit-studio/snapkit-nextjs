import { ImageTransforms } from './types';

/**
 * Generate Snapkit image proxy URLs
 */
export class SnapkitUrlBuilder {
  private baseUrl: string;
  private organizationName: string;

  constructor(
    baseUrl: string = 'https://image-proxy.snapkit.com',
    organizationName: string = '',
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.organizationName = organizationName;
  }

  /**
   * Generate basic image URL
   */
  buildImageUrl(src: string, organizationName?: string): string {
    const org = organizationName || this.organizationName;

    // Return as-is if already complete URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }

    // Add slash if not starting with one
    const path = src.startsWith('/') ? src : `/${src}`;

    return `${this.baseUrl}/image/${org}${path}`;
  }

  /**
   * Generate image URL with transformation parameters
   */
  buildTransformedUrl(
    src: string,
    transforms: ImageTransforms,
    organizationName?: string,
  ): string {
    const baseUrl = this.buildImageUrl(src, organizationName);
    const params = this.buildQueryParams(transforms);

    return params ? `${baseUrl}?${params}` : baseUrl;
  }

  /**
   * Generate format-specific URLs (for picture tags)
   */
  buildFormatUrls(
    src: string,
    transforms: ImageTransforms,
    organizationName?: string,
  ): { avif?: string; webp?: string; original: string } {
    const baseTransforms = { ...transforms };
    const org = organizationName || this.organizationName;

    return {
      avif: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: 'avif' },
        org,
      ),
      webp: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: 'webp' },
        org,
      ),
      original: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: undefined },
        org,
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
    organizationName?: string,
  ): string {
    return widths
      .map((width) => {
        const url = this.buildTransformedUrl(
          src,
          { ...transforms, width },
          organizationName,
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
    if (transforms.brightness)
      params.set('brightness', transforms.brightness.toString());
    if (transforms.hue) params.set('hue', transforms.hue.toString());
    if (transforms.lightness)
      params.set('lightness', transforms.lightness.toString());
    if (transforms.saturation)
      params.set('saturation', transforms.saturation.toString());
    if (transforms.negate) params.set('negate', 'true');
    if (transforms.normalize) params.set('normalize', 'true');

    // Region extraction
    if (transforms.extract) {
      const { x, y, width, height } = transforms.extract;
      params.set('extract', `${x},${y},${width},${height}`);
    }

    // Background color
    if (transforms.background) {
      params.set('background', transforms.background.join(','));
    }

    // Format and quality
    if (transforms.format && transforms.format !== 'auto') {
      params.set('format', transforms.format);
    }
    if (transforms.quality)
      params.set('quality', transforms.quality.toString());
    if (transforms.timeout)
      params.set('timeout', transforms.timeout.toString());

    return params.toString();
  }
}

/**
 * Default URL builder instance
 */
let defaultUrlBuilder: SnapkitUrlBuilder | null = null;

/**
 * Set default URL builder
 */
export function setDefaultUrlBuilder(
  baseUrl?: string,
  organizationName?: string,
) {
  defaultUrlBuilder = new SnapkitUrlBuilder(baseUrl, organizationName);
}

/**
 * Get default URL builder
 */
export function getDefaultUrlBuilder(): SnapkitUrlBuilder {
  if (!defaultUrlBuilder) {
    defaultUrlBuilder = new SnapkitUrlBuilder();
  }
  return defaultUrlBuilder;
}

/**
 * Helper function to generate image URLs
 */
export function buildImageUrl(
  src: string,
  transforms?: ImageTransforms,
  options?: { baseUrl?: string; organizationName?: string },
): string {
  const urlBuilder =
    options?.baseUrl || options?.organizationName
      ? new SnapkitUrlBuilder(options.baseUrl, options.organizationName)
      : getDefaultUrlBuilder();

  if (transforms && Object.keys(transforms).length > 0) {
    return urlBuilder.buildTransformedUrl(
      src,
      transforms,
      options?.organizationName,
    );
  }

  return urlBuilder.buildImageUrl(src, options?.organizationName);
}
