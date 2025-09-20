// Main components
export { Image } from './components/Image';

// Provider
export { SnapkitProvider, useSnapkitConfig } from './providers/SnapkitProvider';

// Hooks
export { useImageLazyLoading } from './hooks/useImageLazyLoading';
export { useImageOptimization } from './hooks/useImageOptimization';
export { useImagePreload } from './hooks/useImagePreload';
export { useNetworkSpeed } from './hooks/useNetworkSpeed';

// Re-export core types that are commonly used in React components
export type {
    ImageTransforms,
    NextImageProps,
    SnapkitConfig,
    SnapkitImageProps
} from '@snapkit-studio/core';

// Utils for advanced usage
export { createEnhancedLazyLoadObserver, createPreloadHint, shouldLoadEagerly } from './utils/loadingOptimization';

