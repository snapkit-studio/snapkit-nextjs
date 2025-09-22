import { SnapkitImageProps } from '@snapkit-studio/core';

/**
 * Check if props require client-side features
 * Used to determine whether to render ClientImage or ServerImage
 */
export function requiresClientFeatures(props: SnapkitImageProps): boolean {
  return !!(
    props.onLoad ||
    props.onError ||
    props.adjustQualityByNetwork ||
    props.priority || // Priority preloading requires client-side <link> injection
    props.dprOptions?.autoDetect // Auto DPR detection requires browser
  );
}

/**
 * Type guard to check if the src is a string URL
 */
export function isUrlImageSource(src: unknown): src is string {
  return typeof src === 'string';
}
