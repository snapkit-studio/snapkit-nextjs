'use client';

import { useEffect, useRef, useState } from 'react';
import { createEnhancedLazyLoadObserver, shouldLoadEagerly } from '../utils';

interface UseImageLazyLoadingProps {
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

/**
 * Hook for handling image lazy loading with Intersection Observer
 */
export function useImageLazyLoading({
  priority = false,
  loading
}: UseImageLazyLoadingProps) {
  const shouldLoadEager = shouldLoadEagerly(priority, loading);
  const [isVisible, setIsVisible] = useState(shouldLoadEager);
  const imgRef = useRef<HTMLImageElement>(null);

  // Enhanced lazy loading setup
  useEffect(() => {
    if (shouldLoadEager || isVisible) return;

    const observer = createEnhancedLazyLoadObserver((entry) => {
      setIsVisible(true);
      observer?.unobserve(entry.target);
    });

    if (observer && imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer?.disconnect();
  }, [shouldLoadEager, isVisible]);

  return {
    isVisible,
    imgRef,
    shouldLoadEager
  };
}