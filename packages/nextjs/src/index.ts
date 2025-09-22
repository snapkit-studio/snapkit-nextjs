// Next.js Image Loader for Snapkit
export { createSnapkitLoader, snapkitLoader } from './image-loader';

// Next.js Image Component - Smart wrapper that auto-selects server/client
export { Image } from './Image';

// Export individual components for advanced usage
export { ServerImage } from './ServerImage';
export { ClientImage } from './ClientImage';

// Export types
export type { SnapkitImageProps } from './types';
export { requiresClientFeatures, forceServerRendering } from './types';
