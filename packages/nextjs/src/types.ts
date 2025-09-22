import type { ImageTransforms } from '@snapkit-studio/core';
import type { ImageProps } from 'next/image';

/**
 * Snapkit Image Props extending Next.js Image Props
 */
export interface SnapkitImageProps extends Omit<ImageProps, 'loader'> {
  /**
   * Image transforms to apply
   */
  transforms?: ImageTransforms;

  /**
   * Optimization mode hint
   * - 'auto': Automatically choose based on props (default)
   * - 'server': Force server-side rendering
   * - 'client': Force client-side rendering
   */
  optimize?: 'auto' | 'server' | 'client';

  /**
   * Enable network-based quality adjustment (client-only feature)
   */
  adjustQualityByNetwork?: boolean;

  /**
   * DPR (Device Pixel Ratio) options (client-only feature)
   */
  dprOptions?: {
    maxDpr?: number;
    qualityStep?: number;
  };

  /**
   * Event handlers (client-only features)
   */
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

/**
 * Check if props require client-side features
 */
export function requiresClientFeatures(props: SnapkitImageProps): boolean {
  return !!(
    props.onLoad ||
    props.onError ||
    props.adjustQualityByNetwork ||
    props.dprOptions ||
    props.optimize === 'client' ||
    (!props.width && typeof props.src === 'string') // No width for URL images requires client
  );
}

/**
 * Check if props should force server-side rendering
 */
export function forceServerRendering(props: SnapkitImageProps): boolean {
  return props.optimize === 'server';
}
