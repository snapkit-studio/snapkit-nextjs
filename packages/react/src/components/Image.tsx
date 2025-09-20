'use client';

import { SnapkitImageProps } from '@snapkit-studio/core';
import { forwardRef, useMemo } from 'react';
import {
  useImageOptimization,
  useImageLazyLoading,
  useImagePreload
} from '../hooks';
import {
  createContainerStyle,
  createImageStyle,
  createReservedSpace
} from '../utils';

/**
 * Optimized image component with automatic format detection, DPR-based srcset, and responsive loading
 *
 * Features:
 * - Automatic DPR-based srcset generation for crisp display on high-DPI devices (like Next.js Image)
 * - Responsive width-based srcset when sizes prop is provided
 * - Automatic format optimization (WebP, AVIF)
 * - Lazy loading with Intersection Observer
 * - Network-aware quality adjustment
 *
 * @example
 * ```tsx
 * // Basic usage with DPR-based srcset (1x, 2x, 3x)
 * <Image
 *   src="path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 * />
 *
 * // Responsive layout with width-based srcset
 * <Image
 *   src="path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 *
 * // Fill mode for container-based sizing
 * <Image
 *   src="path/to/image.jpg"
 *   alt="Description"
 *   fill={true}
 *   className="object-cover"
 * />
 * ```
 */
export const Image = forwardRef<HTMLImageElement, SnapkitImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill = false,
      sizes,
      quality,
      priority = false,
      loading,
      organizationName,
      baseUrl,
      transforms = {},
      optimizeFormat = 'auto',
      className,
      style,
      onLoad,
      onError,
      ...props
    },
    ref,
  ) => {

    // Check if src is a string URL
    const isUrlImageSource = typeof src === 'string';

    // Image optimization hook
    const {
      imageUrl,
      srcSet,
      imageSize
    } = useImageOptimization({
      src: src as string,
      width,
      height,
      fill,
      sizes,
      quality,
      organizationName,
      baseUrl,
      transforms,
      optimizeFormat
    });

    // Lazy loading hook
    const { isVisible, imgRef, shouldLoadEager } = useImageLazyLoading({
      priority,
      loading
    });


    // Preload hook for priority images
    useImagePreload({
      priority,
      imageUrl,
      sizes
    });

    // Create reserved space for layout stability
    const reservedSpace = useMemo(() =>
      createReservedSpace(fill, width, height),
      [fill, width, height]
    );

    // Style calculation with Next.js Image layout stability
    const imageStyle = useMemo(() =>
      createImageStyle(style, fill),
      [style, fill]
    );

    const containerStyle = useMemo(() =>
      createContainerStyle(fill, reservedSpace),
      [fill, reservedSpace]
    );



    // Combined ref handling
    const setRefs = (node: HTMLImageElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      // @ts-expect-error - imgRef is managed internally
      imgRef.current = node;
    };

    // Return basic image for non-string sources
    if (!isUrlImageSource) {
      return (
        <img
          ref={ref}
          src={src as string}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={className}
          style={style}
          loading={loading || 'lazy'}
          {...props}
        />
      );
    }

    // Main image content - Always render img element for IntersectionObserver to work
    const content = (
      <img
        ref={setRefs}
        src={isVisible ? imageUrl : undefined}
        data-src={imageUrl} // Store actual URL for lazy loading
        srcSet={isVisible ? (srcSet || undefined) : undefined}
        sizes={sizes}
        alt={alt}
        width={fill ? undefined : imageSize.width}
        height={fill ? undefined : imageSize.height}
        loading={loading || (shouldLoadEager ? 'eager' : 'lazy')}
        className={className}
        style={imageStyle}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );

    // Return with appropriate wrapper based on layout mode
    if (fill || reservedSpace) {
      return (
        <div style={containerStyle}>
          {content}
        </div>
      );
    }

    return content;
  },
);

Image.displayName = 'SnapkitImage';