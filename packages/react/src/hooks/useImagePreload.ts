'use client';

import { useEffect, useRef } from 'react';

import { createPreloadHint } from '../utils';

interface UseImagePreloadProps {
  priority?: boolean;
  imageUrl: string;
  sizes?: string;
}

/**
 * Hook for handling priority image preloading with link hints
 * Includes proper cleanup and memory leak prevention
 */
export function useImagePreload({
  priority = false,
  imageUrl,
  sizes,
}: UseImagePreloadProps) {
  const cleanupRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);

  // Next.js Image style: Priority loading with preload hints
  useEffect(() => {
    mountedRef.current = true;

    if (!priority || !imageUrl) return;

    try {
      // Create preload hint for priority images
      const cleanup = createPreloadHint(imageUrl, sizes);

      // Store cleanup function for potential early cleanup
      if (mountedRef.current) {
        cleanupRef.current = cleanup;
      } else {
        // If already unmounted, cleanup immediately
        cleanup();
      }

      return () => {
        mountedRef.current = false;
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    } catch (error) {
      console.warn('Failed to create preload hint:', error);
    }
  }, [priority, imageUrl, sizes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);
}
