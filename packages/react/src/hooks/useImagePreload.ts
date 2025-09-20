'use client';

import { useEffect } from 'react';
import { createPreloadHint } from '../utils';

interface UseImagePreloadProps {
  priority?: boolean;
  imageUrl: string;
  sizes?: string;
}

/**
 * Hook for handling priority image preloading with link hints
 */
export function useImagePreload({
  priority = false,
  imageUrl,
  sizes
}: UseImagePreloadProps) {
  // Next.js Image style: Priority loading with preload hints
  useEffect(() => {
    if (!priority || !imageUrl) return;

    // Create preload hint for priority images
    const cleanup = createPreloadHint(imageUrl, sizes);
    return cleanup;
  }, [priority, imageUrl, sizes]);
}