import { SnapkitImageProps } from '@snapkit-studio/core';

// Type definitions for better type safety
export type LoadingStrategy = 'lazy' | 'eager';
export type ImageFormat = 'avif' | 'webp' | 'auto' | undefined;

// Server component specific props (excludes client-only features)
export interface ServerImageProps
  extends Omit<
    SnapkitImageProps,
    | 'priority'
    | 'adjustQualityByNetwork'
    | 'dprOptions'
    | 'onLoad'
    | 'onError'
    | 'placeholder'
    | 'blurDataURL'
  > {
  // Server-specific optimizations
  precomputedSrcSet?: boolean;
  staticOptimization?: boolean;
}

// Client component specific props
// Using type alias instead of empty interface extending
export type ClientImageProps = SnapkitImageProps;

// Image size configuration
export interface ImageSize {
  width?: number;
  height?: number;
}

// Image configuration for internal use
export interface ImageConfig {
  size: ImageSize;
  quality: number;
  style: React.CSSProperties | undefined;
  reservedSpace: React.CSSProperties | null | undefined;
}

// SrcSet data structure
export interface SrcSetData {
  entries: string;
  baseUrl: string;
}

// Type guards for runtime validation
export function isValidImageSource(src: unknown): src is string {
  return typeof src === 'string' && src.length > 0;
}

export function isValidDimension(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && Number.isFinite(value);
}

export function isValidQuality(value: unknown): value is number {
  return typeof value === 'number' && value >= 1 && value <= 100;
}
