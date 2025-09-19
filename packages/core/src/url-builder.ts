import { ImageTransforms } from "./types";

/**
 * Generate Snapkit image proxy URLs
 */
export class SnapkitUrlBuilder {
  private baseUrl: string;

  constructor(
    organizationName: string = '',
  ) {
    this.baseUrl = `https://${organizationName}-cdn.snapkit.studio`;
  }

  /**
   * Generate basic image URL
   */
  buildImageUrl(src: string): string {
    // Return as-is if already complete URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }

    // Add slash if not starting with one
    const path = src.startsWith('/') ? src : `/${src}`;

    return `${this.baseUrl}${path}`;
  }

  /**
   * Generate image URL with transformation parameters
   */
  buildTransformedUrl(
    src: string,
    transforms: ImageTransforms,
  ): string {
    const baseUrl = this.buildImageUrl(src);
    const params = this.buildQueryParams(transforms);

    if(src.includes('?')) {
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
  ): { avif?: string; webp?: string; original: string } {
    const baseTransforms = { ...transforms };

    return {
      avif: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: 'avif' },
      ),
      webp: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: 'webp' },
      ),
      original: this.buildTransformedUrl(
        src,
        { ...baseTransforms, format: undefined },
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
  ): string {
    return widths
      .map((width) => {
        const url = this.buildTransformedUrl(
          src,
          { ...transforms, width },
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

    // Region extraction
    if (transforms.extract) {
      const { x, y, width, height } = transforms.extract;
      params.set('extract', `${x},${y},${width},${height}`);
    }

    // Format and quality
    if (transforms.format) {
      params.set('format', transforms.format);
    }
    if (transforms.quality)
      params.set('quality', transforms.quality.toString());

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
  organizationName?: string,
) {
  defaultUrlBuilder = new SnapkitUrlBuilder(organizationName);
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
  options?: { baseUrl?: string },
): string {
  const urlBuilder =
    options?.baseUrl
      ? new SnapkitUrlBuilder(options.baseUrl)
      : getDefaultUrlBuilder();

  if (transforms && Object.keys(transforms).length > 0) {
    return urlBuilder.buildTransformedUrl(
      src,
      transforms,
    );
  }

  return urlBuilder.buildImageUrl(src);
}
