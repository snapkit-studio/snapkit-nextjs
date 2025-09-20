'use client';

import {
  SnapkitUrlBuilder,
  adjustQualityForConnection,
  generateResponsiveWidths
} from '@snapkit-studio/core';
import { useMemo } from 'react';
import {
  addSizeToTransforms,
  createFinalTransforms,
  mergeConfiguration
} from '../utils';
import { useSnapkitConfig } from '../providers/SnapkitProvider';

interface UseImageOptimizationProps {
  src: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  organizationName?: string;
  baseUrl?: string;
  transforms?: Record<string, any>;
  optimizeFormat?: 'auto' | 'webp' | 'avif' | 'off';
}

/**
 * Hook for handling image optimization logic including URL generation and srcset creation
 */
export function useImageOptimization({
  src,
  width,
  height,
  fill = false,
  sizes,
  quality,
  organizationName,
  baseUrl,
  transforms = {},
  optimizeFormat = 'auto'
}: UseImageOptimizationProps) {
  const config = useSnapkitConfig();

  // Merge configuration values
  const { finalOrganizationName, finalQuality } = useMemo(() =>
    mergeConfiguration(
      { organizationName, baseUrl, quality },
      config
    ), [organizationName, baseUrl, quality, config]
  );

  // Adjust quality based on network conditions
  const adjustedQuality = useMemo(() =>
    adjustQualityForConnection(finalQuality),
    [finalQuality]
  );

  // Calculate image size based on fill mode
  const imageSize = useMemo(() => {
    if (fill) {
      return {
        width: 1200, // Default optimization width for fill mode
        height: undefined
      };
    }
    return { width, height };
  }, [fill, width, height]);

  // Configure image transformation options
  const baseTransforms = useMemo(() =>
    createFinalTransforms(
      transforms,
      adjustedQuality,
      optimizeFormat,
      config.defaultFormat
    ),
    [transforms, adjustedQuality, optimizeFormat, config.defaultFormat]
  );

  // Add size information to final transformation settings
  const finalTransforms = useMemo(() =>
    addSizeToTransforms(baseTransforms, imageSize, transforms),
    [baseTransforms, imageSize, transforms]
  );

  // Create SnapkitUrlBuilder instance
  const urlBuilder = useMemo(() =>
    new SnapkitUrlBuilder(finalOrganizationName),
    [finalOrganizationName]
  );

  // Main image URL
  const imageUrl = useMemo(() =>
    urlBuilder.buildTransformedUrl(src, finalTransforms),
    [urlBuilder, src, finalTransforms]
  );

  // Generate srcset based on props and context
  const srcSet = useMemo(() => {
    if (!imageSize.width || fill) return '';

    if (sizes) {
      // When sizes prop is provided, use responsive width-based srcset
      const responsiveWidths = generateResponsiveWidths(imageSize.width);
      return urlBuilder.buildSrcSet(src, responsiveWidths, finalTransforms);
    } else {
      // Use DPR-based srcset for crisp display on high-DPI devices
      return urlBuilder.buildDprSrcSet(
        src,
        imageSize.width,
        imageSize.height,
        finalTransforms,
        [1, 2, 3] // Standard DPR values
      );
    }
  }, [imageSize.width, fill, sizes, src, urlBuilder, finalTransforms, imageSize.height]);

  return {
    imageUrl,
    srcSet,
    imageSize,
    finalTransforms,
    urlBuilder,
    adjustedQuality
  };
}