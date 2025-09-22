'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  DprDetectionOptions,
  ImageEngineCache,
  ImageEngineParams,
  ImageRenderData,
  SnapkitConfig,
} from '@snapkit-studio/core';

import { mergeConfigWithEnv } from '../utils/env-config';

interface UseUnifiedImageEngineProps extends Omit<ImageEngineParams, 'src'> {
  src: string;
  // React-specific options
  organizationName?: string;
  baseUrl?: string;
  defaultQuality?: number;
  defaultFormat?: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'auto';
}

/**
 * Custom hook to track hydration state for consistent SSR/client rendering
 */
function useHydrationState() {
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    hasHydratedRef.current = true;
  }, []);

  return hasHydratedRef.current;
}

/**
 * Create hydration-safe DPR options that ensure consistent server/client rendering
 */
function createHydrationSafeDprOptions(
  originalOptions: DprDetectionOptions | undefined,
  hasHydrated: boolean,
): DprDetectionOptions {
  // During initial render (before hydration), force auto-detection off
  // to ensure server and client generate the same srcSet
  if (!hasHydrated) {
    return {
      ...originalOptions,
      autoDetect: false, // Force standard DPR set during hydration
    };
  }

  // After hydration, allow full client-side optimization
  return originalOptions || {};
}

/**
 * React hook that uses the unified SnapkitImageEngine
 * Provides the same functionality as useImageConfig but with consistent core logic
 * Includes hydration-safe DPR detection to prevent SSR/client mismatches
 */
export function useUnifiedImageEngine(
  props: UseUnifiedImageEngineProps,
): ImageRenderData {
  // Track hydration state to ensure consistent DPR detection
  const hasHydrated = useHydrationState();
  // Merge environment config with props
  const config = useMemo((): SnapkitConfig => {
    try {
      return mergeConfigWithEnv({
        organizationName: props.organizationName,
        defaultQuality: props.defaultQuality,
        defaultFormat: props.defaultFormat,
      });
    } catch (error) {
      throw new Error(
        'Failed to merge configuration with environment: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }, [props.organizationName, props.defaultQuality, props.defaultFormat]);

  // Get cached image engine instance to prevent recreation
  const imageEngine = useMemo(() => {
    try {
      return ImageEngineCache.getInstance(config);
    } catch (error) {
      throw new Error(
        'Failed to create Snapkit image engine: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }, [config]);

  // Generate image data using the unified engine
  const imageData = useMemo((): ImageRenderData => {
    // Create hydration-safe DPR options
    const safeDprOptions = createHydrationSafeDprOptions(
      props.dprOptions,
      hasHydrated,
    );

    const engineParams: ImageEngineParams = {
      src: props.src,
      width: props.width,
      height: props.height,
      fill: props.fill,
      sizes: props.sizes,
      quality: props.quality,
      transforms: props.transforms,
      adjustQualityByNetwork: props.adjustQualityByNetwork,
      dprOptions: safeDprOptions,
    };

    try {
      return imageEngine.generateImageData(engineParams);
    } catch (error) {
      throw new Error(
        'Failed to generate image data: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }, [
    imageEngine,
    props.src,
    props.width,
    props.height,
    props.fill,
    props.sizes,
    props.quality,
    props.transforms,
    props.adjustQualityByNetwork,
    props.dprOptions,
    hasHydrated,
  ]);

  return imageData;
}

/**
 * Backward compatibility hook - same interface as the old useImageConfig
 */
export function useImageConfig(props: UseUnifiedImageEngineProps) {
  const imageData = useUnifiedImageEngine(props);

  // Return data in the same format as the old hook for compatibility
  return {
    imageUrl: imageData.url,
    srcSet: imageData.srcSet,
    imageSize: imageData.size,
    finalTransforms: imageData.transforms,
    adjustedQuality: imageData.adjustedQuality,
    // Legacy properties for backward compatibility
    urlBuilder: undefined, // Deprecated - engine handles URL building internally
    config: undefined, // Deprecated - configuration is managed internally
  };
}
