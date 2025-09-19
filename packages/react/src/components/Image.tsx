'use client';

import {
    SnapkitImageProps,
    adjustQualityForConnection,
    buildImageUrl,
    createLazyLoadObserver,
    generateResponsiveWidths,
} from '@snapkit-studio/core';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useSnapkitConfig } from '../providers/SnapkitProvider';
import {
    addSizeToTransforms,
    createBuildOptions,
    createContainerStyle,
    createEnhancedLazyLoadObserver,
    createFinalTransforms,
    createImageStyle,
    createPlaceholderStyle,
    createPlaceholderTransforms,
    createPreloadHint,
    createReservedSpace,
    generateResponsiveSrcSet,
    getImageVisibility,
    getPlaceholderUrl,
    handleImageError,
    mergeConfiguration,
    shouldLoadEagerly,
    shouldShowBlurPlaceholder,
    shouldShowPlaceholderOnError,
} from '../utils';

/**
 * Optimized image component with automatic format detection and responsive loading
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Image
 *   src="path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 * />
 *
 * // With organization and custom transforms
 * <Image
 *   src="path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   organizationName="my-org"
 *   quality={90}
 *   transforms={{ blur: 20 }}
 *   priority={true}
 * />
 *
 * // Fill mode with responsive sizes
 * <Image
 *   src="path/to/image.jpg"
 *   alt="Description"
 *   fill={true}
 *   sizes="(max-width: 768px) 100vw, 50vw"
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
      placeholder = 'empty',
      blurDataURL,
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
    const config = useSnapkitConfig();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    // Next.js Image style: Determine eager loading
    const shouldLoadEager = shouldLoadEagerly(priority, loading);
    const [isVisible, setIsVisible] = useState(shouldLoadEager);
    const imgRef = useRef<HTMLImageElement>(null);

    // Merge configuration values
    const { finalOrganizationName, finalBaseUrl, finalQuality } = mergeConfiguration(
      { organizationName, baseUrl, quality },
      config,
    );

    // Adjust quality based on network conditions
    const adjustedQuality = adjustQualityForConnection(finalQuality);

    // Next.js Image style: Create reserved space for layout stability
    const reservedSpace = useMemo(() =>
      createReservedSpace(fill, width, height),
      [fill, width, height]
    );

    // Configure image transformation options
    const baseTransforms = createFinalTransforms(
      transforms,
      adjustedQuality,
      optimizeFormat,
      config.defaultFormat,
    );

    // Next.js Image style: Simplified fill mode without ResizeObserver
    // For fill mode, we rely on CSS positioning instead of dynamic size detection
    const imageSize = useMemo(() => {
      if (fill) {
        // In fill mode, use reasonable defaults for optimization
        // The actual display size is handled by CSS
        return {
          width: 1200, // Default optimization width for fill mode
          height: undefined,
        };
      }
      return { width, height };
    }, [fill, width, height]);

    // Add size information to final transformation settings
    const finalTransforms = addSizeToTransforms(baseTransforms, imageSize, transforms);

    // Create build options
    const buildOptions = createBuildOptions(finalOrganizationName, finalBaseUrl);

    // URL builder is automatically used inside buildImageUrl

    // Main image URL
    const imageUrl = buildImageUrl(src, finalTransforms, buildOptions);

    // Generate srcset (responsive)
    let srcSet = '';
    if (sizes && imageSize.width && !fill) {
      const responsiveWidths = generateResponsiveWidths(imageSize.width);
      srcSet = generateResponsiveSrcSet(src, responsiveWidths, finalTransforms, buildOptions);
    }

    // Next.js Image style: Priority loading with preload hints
    useEffect(() => {
      if (!priority || !imageUrl) return;

      // Create preload hint for priority images
      const cleanup = createPreloadHint(imageUrl, sizes);
      return cleanup;
    }, [priority, imageUrl, sizes]);

    // Enhanced lazy loading setup
    useEffect(() => {
      if (shouldLoadEager || isVisible) return;

      const observer = createEnhancedLazyLoadObserver((entry) => {
        setIsVisible(true);
        observer?.unobserve(entry.target);
      });

      if (observer && imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer?.disconnect();
    }, [shouldLoadEager, isVisible]);

    // Load event handler
    const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
      setIsLoaded(true);
      onLoad?.(event);
    };

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
      setHasError(true);
      handleImageError(event, onError);
    };

    // Style calculation with Next.js Image layout stability
    const imageStyle = createImageStyle(style, fill);
    const containerStyle = createContainerStyle(fill, reservedSpace);

    // Next.js Image style blur placeholder handling
    const showBlurPlaceholder = shouldShowBlurPlaceholder(placeholder, isLoaded, hasError);
    const showPlaceholderOnError = shouldShowPlaceholderOnError(hasError, placeholder, isLoaded);
    const placeholderTransforms = createPlaceholderTransforms(finalTransforms);
    const generatedPlaceholderUrl = buildImageUrl(src, placeholderTransforms, buildOptions);
    const placeholderUrl = getPlaceholderUrl(placeholder, blurDataURL, generatedPlaceholderUrl);

    // Next.js Image style image visibility
    const imageOpacity = getImageVisibility(isLoaded, hasError, showBlurPlaceholder);

    const content = (
      <>
        {(showBlurPlaceholder || showPlaceholderOnError) && placeholderUrl && (
          <img
            src={placeholderUrl}
            alt=""
            style={createPlaceholderStyle(imageStyle, isLoaded && !hasError)}
            aria-hidden="true"
          />
        )}
        <img
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            // @ts-expect-error - imgRef is managed internally
            imgRef.current = node;
          }}
          src={isVisible ? imageUrl : undefined}
          srcSet={isVisible && srcSet ? srcSet : undefined}
          sizes={sizes}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          loading={loading || (shouldLoadEager ? 'eager' : 'lazy')}
          className={className}
          style={{
            ...imageStyle,
            opacity: imageOpacity,
            transition: showBlurPlaceholder ? 'opacity 0.3s ease' : undefined,
          }}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </>
    );

    return fill ? (
      <div style={containerStyle}>
        {content}
      </div>
    ) : reservedSpace ? (
      <div style={containerStyle}>
        {content}
      </div>
    ) : (
      content
    );
  },
);

Image.displayName = 'SnapkitImage';
