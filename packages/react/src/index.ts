// Main components
export { Image } from './components/Image';
export { ClientImage } from './components/ClientImage';
export { ServerImage } from './components/ServerImage';
export {
  ImageErrorBoundary,
  withImageErrorBoundary,
} from './components/ImageErrorBoundary';

// Hooks
export { useImageConfig } from './hooks';

// Re-export core types that are commonly used in React components
export type {
  ImageTransforms,
  NextImageProps,
  SnapkitConfig,
  SnapkitImageProps,
} from '@snapkit-studio/core';

// Re-export core utilities for demo and advanced usage
export {
  getDevicePixelRatio,
  getOptimalDprValues,
  detectNetworkSpeed,
} from '@snapkit-studio/core';

// Utils for advanced usage
export { createPreloadHint } from './utils/loadingOptimization';
export { requiresClientFeatures, isUrlImageSource } from './types';
