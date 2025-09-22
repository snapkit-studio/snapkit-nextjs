// Type definitions
export type { NetworkSpeed } from './responsive';
export type {
  ImageTransforms,
  NextImageProps,
  PictureSource,
  ProcessedImageUrl,
  SnapkitConfig,
  SnapkitEnvConfig,
  SnapkitImageProps,
} from './types';

// URL Builder
export { SnapkitUrlBuilder } from './url-builder';
export { UrlBuilderFactory } from './url-builder-factory';

// Format Detection
export {
  estimateFormatSupportFromUA,
  formatSupport,
  getBestSupportedFormat,
  getSupportedFormatsFromAcceptHeader,
  preloadFormatSupport,
  supportsImageFormat,
} from './format-detection';

// Responsive Utilities
export {
  adjustQualityForConnection,
  calculateImageSizes,
  calculateOptimalImageSize,
  createLazyLoadObserver,
  DEFAULT_BREAKPOINTS,
  detectNetworkSpeed,
  determineImagePriority,
  generateResponsiveWidths,
  getDeviceCharacteristics,
  parseImageSizes,
} from './responsive';

// DPR Detection Utilities
export {
  getDevicePixelRatio,
  getNetworkAwareDprLimit,
  getOptimalDprValues,
  shouldUse3xImages,
  supportsHighEfficiencyFormats,
} from './dpr-detection';
export type { DprDetectionOptions } from './dpr-detection';

// Transform Builder
export { SnapkitTransformBuilder } from './transform-builder';

// Image Engine
export { SnapkitImageEngine } from './image-engine';
export { ImageEngineCache } from './image-engine-cache';
export type {
  ImageEngineParams,
  ImageRenderData,
  ValidationResult,
} from './image-engine';

// Environment Configuration
export {
  detectEnvironment,
  environmentStrategies,
  getEnvConfig,
  getEnvironmentDebugInfo,
  mergeConfigWithEnv,
  universalStrategy,
  validateEnvConfig,
} from './env-config';
export type { EnvironmentStrategy } from './env-config';
