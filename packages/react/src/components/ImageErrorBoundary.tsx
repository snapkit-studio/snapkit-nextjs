'use client';

import React, { Component, ReactNode } from 'react';

/**
 * Props for the ImageErrorBoundary component
 */
interface ImageErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * State for the ImageErrorBoundary component
 */
interface ImageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Default fallback component for image loading errors
 */
function DefaultImagePlaceholder({ error }: { error?: Error }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        padding: '1rem',
        borderRadius: '0.375rem',
        minHeight: '200px',
      }}
      role="img"
      aria-label="Image failed to load"
    >
      <div style={{ textAlign: 'center' }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: '0 auto 0.5rem' }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          {error?.message || 'Failed to load image'}
        </p>
      </div>
    </div>
  );
}

/**
 * Error boundary component for handling image loading errors gracefully
 * Provides fallback UI when image components fail to render
 *
 * @example
 * ```tsx
 * <ImageErrorBoundary>
 *   <Image src="/image.jpg" alt="Image" />
 * </ImageErrorBoundary>
 * ```
 */
export class ImageErrorBoundary extends Component<
  ImageErrorBoundaryProps,
  ImageErrorBoundaryState
> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    // Using try-catch to handle environments without process object
    try {
      if (
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
      ) {
        console.error('ImageErrorBoundary caught an error:', error, errorInfo);
      }
    } catch {
      // Silently ignore if process is not available
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback or default placeholder
      return (
        this.props.fallback || (
          <DefaultImagePlaceholder error={this.state.error} />
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version for functional components
 * Provides error boundary functionality for image components
 */
export function withImageErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void,
) {
  return React.forwardRef<Element, T>((props, ref) => (
    <ImageErrorBoundary fallback={fallback} onError={onError}>
      <Component {...(props as T)} ref={ref} />
    </ImageErrorBoundary>
  ));
}
