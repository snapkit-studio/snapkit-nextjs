import { ComponentProps } from 'react';

// Image transformation options
export interface ImageTransforms {
  // Size adjustment
  width?: number;
  height?: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

  // Flipping
  flip?: boolean;
  flop?: boolean;

  // Visual effects
  blur?: number | boolean;
  grayscale?: boolean;

  // Color adjustment
  brightness?: number;
  hue?: number;
  lightness?: number;
  saturation?: number;
  negate?: boolean;
  normalize?: boolean;

  // Region extraction
  extract?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Background color
  background?: [number, number, number, number];

  // Others
  quality?: number;
  format?: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'auto';
  timeout?: number;
}

// Props compatible with Next.js Image component
export interface NextImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// Snapkit exclusive props
export interface SnapkitImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: string;
  alt: string;

  // Next.js compatible props
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | 'none';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';

  // Snapkit exclusive features
  organizationName?: string;
  baseUrl?: string;
  transforms?: ImageTransforms;
  optimizeFormat?: 'avif' | 'webp' | 'auto' | 'off';
}

// Source definition for Picture component
export interface PictureSource {
  media?: string;
  src: string;
  width: number;
  height: number;
  transforms?: ImageTransforms;
}

export interface SnapkitPictureProps
  extends Omit<ComponentProps<'img'>, 'src'> {
  sources: PictureSource[];
  src: string; // fallback image
  alt: string;
  organizationName?: string;
  baseUrl?: string;
  quality?: number;
  optimizeFormat?: 'avif' | 'webp' | 'auto' | 'off';
}

// Provider configuration
export interface SnapkitConfig {
  baseUrl?: string;
  organizationName?: string;
  defaultQuality?: number;
  defaultFormat?: 'avif' | 'webp' | 'auto';
  enableBlurPlaceholder?: boolean;
}

// Internal use types
export interface ProcessedImageUrl {
  src: string;
  srcSet?: string;
  sources?: {
    avif?: string;
    webp?: string;
    original?: string;
  };
}

// Next.js Image Loader types
export interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export type ImageLoader = (params: ImageLoaderParams) => string;

// Snapkit loader configuration types
export interface SnapkitLoaderOptions {
  baseUrl?: string;
  organizationName?: string;
  transforms?: ImageTransforms;
  optimizeFormat?: 'avif' | 'webp' | 'auto' | 'off';
}
