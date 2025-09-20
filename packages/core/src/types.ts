import { ComponentProps } from 'react';

// Image transformation options
export interface ImageTransforms {
  // Size adjustment
  width?: number;
  height?: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

  // Device Pixel Ratio for high-DPI displays
  dpr?: number;

  // Flipping
  flip?: boolean;
  flop?: boolean;

  // Visual effects
  blur?: number | boolean;
  grayscale?: boolean;

  // Region extraction (percentage-based: 0-100)
  extract?: {
    /** Starting x-coordinate as percentage (0-100) */
    x: number;
    /** Starting y-coordinate as percentage (0-100) */
    y: number;
    /** Width of extracted region as percentage (0-100) */
    width: number;
    /** Height of extracted region as percentage (0-100) */
    height: number;
  };

  // Others
  quality?: number;
  format?: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'auto';
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
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';

  // Snapkit exclusive features
  organizationName?: string;
  baseUrl?: string;
  transforms?: ImageTransforms;
  optimizeFormat?: 'avif' | 'webp' | 'auto';
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
  defaultFormat?: 'avif' | 'webp' | 'auto' | 'off';
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

// Snapkit loader configuration types
export interface SnapkitLoaderOptions {
  organizationName?: string;
  transforms?: ImageTransforms;
  unoptimizedFormat?: boolean;
}
