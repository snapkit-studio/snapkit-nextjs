'use client';

import {
  SnapkitImageProps,
  adjustQualityForConnection,
  buildImageUrl,
  calculateOptimalImageSize,
  createLazyLoadObserver,
  generateResponsiveWidths,
  getDeviceCharacteristics,
} from '@snapkit/core';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useSnapkitConfig } from '../providers/SnapkitProvider';
import {
  addSizeToTransforms,
  createBuildOptions,
  createContainerStyle,
  createFinalTransforms,
  createImageStyle,
  createMainImageStyle,
  createPlaceholderStyle,
  createPlaceholderTransforms,
  generateResponsiveSrcSet,
  getPlaceholderUrl,
  mergeConfiguration,
  shouldShowBlurPlaceholder,
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
    const [isVisible, setIsVisible] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Merge configuration values
    const { finalOrganizationName, finalBaseUrl, finalQuality } = mergeConfiguration(
      { organizationName, baseUrl, quality },
      config,
    );

    // Adjust quality based on network conditions
    const adjustedQuality = adjustQualityForConnection(finalQuality);

    // Device characteristics
    const deviceInfo = getDeviceCharacteristics();

    // Configure image transformation options
    const baseTransforms = createFinalTransforms(
      transforms,
      adjustedQuality,
      optimizeFormat,
      config.defaultFormat,
    );

    // Detect container size in fill mode
    const [containerSize, setContainerSize] = useState<{
      width: number;
      height?: number;
    } | null>(null);

    useEffect(() => {
      if (!fill || !containerRef.current) return;

      const updateSize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setContainerSize({
            width: rect.width,
            height: rect.height > 0 ? rect.height : undefined,
          });
        }
      };

      updateSize();

      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }, [fill]);

    // Calculate actual image size
    const imageSize =
      fill && containerSize
        ? calculateOptimalImageSize(
            containerSize.width,
            containerSize.height,
            deviceInfo.devicePixelRatio,
          )
        : { width, height };

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

    // Lazy loading setup
    useEffect(() => {
      if (priority || isVisible) return;

      const observer = createLazyLoadObserver((entry) => {
        setIsVisible(true);
        observer?.unobserve(entry.target);
      });

      if (observer && imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer?.disconnect();
    }, [priority, isVisible]);

    // Load event handler
    const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
      setIsLoaded(true);
      onLoad?.(event);
    };

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
      setHasError(true);
      onError?.(event);
    };

    // Style calculation
    const imageStyle = createImageStyle(style, fill);
    const containerStyle = createContainerStyle(fill);

    // blur placeholder handling
    const showBlurPlaceholder = shouldShowBlurPlaceholder(placeholder, isLoaded, hasError);
    const placeholderTransforms = createPlaceholderTransforms(finalTransforms);
    const generatedPlaceholderUrl = buildImageUrl(src, placeholderTransforms, buildOptions);
    const placeholderUrl = getPlaceholderUrl(placeholder, blurDataURL, generatedPlaceholderUrl);

    const content = (
      <>
        {showBlurPlaceholder && placeholderUrl && (
          <img
            src={placeholderUrl}
            alt=""
            style={createPlaceholderStyle(imageStyle, isLoaded)}
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
          loading={loading || (priority ? 'eager' : 'lazy')}
          className={className}
          style={createMainImageStyle(imageStyle, isLoaded, showBlurPlaceholder)}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </>
    );

    return fill ? (
      <div ref={containerRef} style={containerStyle}>
        {content}
      </div>
    ) : (
      content
    );
  },
);

Image.displayName = 'SnapkitImage';
