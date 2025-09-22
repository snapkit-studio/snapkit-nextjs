'use client';

import { forwardRef, useEffect, useMemo, useState } from 'react';
//
import { SnapkitImageProps } from '@snapkit-studio/core';

import { useImageConfig, useImageLazyLoading, useImagePreload } from '../hooks';
import {
  createContainerStyle,
  createImageStyle,
  createReservedSpace,
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
 * - Multi-environment support (Vite, CRA, Next.js, Node.js)
 *
 * Environment Variables:
 * - Vite: VITE_SNAPKIT_ORGANIZATION_NAME
 * - Create React App: REACT_APP_SNAPKIT_ORGANIZATION_NAME
 * - Next.js: NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME
 * - Node.js: SNAPKIT_ORGANIZATION_NAME
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
/**
 * Client Component version of Snapkit Image
 *
 * Supports client-side features like:
 * - Event handlers (onLoad, onError)
 * - Network adaptation (adjustQualityByNetwork)
 * - Priority preloading
 * - IntersectionObserver-based lazy loading
 * - Dynamic quality adjustment
 */
export const ClientImage = forwardRef<HTMLImageElement, SnapkitImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill = false,
      sizes,
      priority = false,
      loading,
      transforms = {},
      dprOptions,
      adjustQualityByNetwork = true,
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

    // Provider-less image optimization hook
    const { imageUrl, srcSet, imageSize } = useImageConfig({
      src,
      width,
      height,
      fill,
      sizes,
      transforms,
      dprOptions,
      adjustQualityByNetwork,
    });

    // Client-side hydration state to avoid hydration mismatch
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    // Lazy loading hook
    const { isVisible, imgRef, shouldLoadEager } = useImageLazyLoading({
      priority,
      loading,
    });

    // Preload hook for priority images
    useImagePreload({
      priority,
      imageUrl,
      sizes,
    });

    // Consolidate all style calculations into a single useMemo for better performance
    const { reservedSpace, imageStyle, containerStyle } = useMemo(() => {
      const reserved = createReservedSpace(fill, width, height);
      const imgStyle = createImageStyle(style, fill);
      const containerStyles = createContainerStyle(fill, reserved);

      return {
        reservedSpace: reserved,
        imageStyle: imgStyle,
        containerStyle: containerStyles,
      };
    }, [fill, width, height, style]);

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

    // For hydration consistency, always render the same attributes on server and client
    // On the server and during initial client render, only show for priority/eager images
    // After hydration, allow lazy loading to work normally
    const shouldRenderSrcSet =
      priority || shouldLoadEager || (hasMounted && isVisible);

    // Main image content - Always render img element for IntersectionObserver to work
    const content = (
      <img
        ref={setRefs}
        src={shouldRenderSrcSet ? imageUrl : undefined}
        data-src={imageUrl} // Store actual URL for lazy loading
        srcSet={shouldRenderSrcSet ? srcSet || undefined : undefined}
        sizes={sizes}
        alt={alt}
        width={fill ? undefined : imageSize.width}
        height={fill ? undefined : imageSize.height}
        loading={loading || (shouldLoadEager ? 'eager' : 'lazy')}
        className={className}
        style={imageStyle}
        onLoad={onLoad}
        onError={onError}
        // ARIA attributes for better accessibility
        role="img"
        aria-busy={!shouldRenderSrcSet ? 'true' : 'false'}
        aria-label={shouldRenderSrcSet ? alt : `Loading: ${alt}`}
        {...props}
      />
    );

    // Return with appropriate wrapper based on layout mode
    if (fill || reservedSpace) {
      return <div style={containerStyle}>{content}</div>;
    }

    return content;
  },
);

ClientImage.displayName = 'SnapkitClientImage';
