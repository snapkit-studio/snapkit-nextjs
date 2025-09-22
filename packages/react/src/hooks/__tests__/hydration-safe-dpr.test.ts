/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useUnifiedImageEngine } from '../useUnifiedImageEngine';

// Mock the core package
vi.mock('@snapkit-studio/core', () => ({
  ImageEngineCache: {
    getInstance: vi.fn(() => ({
      generateImageData: vi.fn(({ dprOptions }) => ({
        url: 'https://test.com/image.jpg',
        srcSet: dprOptions?.autoDetect === false
          ? 'standard-srcset' // Server-like behavior
          : 'optimized-srcset', // Client-like behavior
        size: { width: 800, height: 600 },
        transforms: {},
        adjustedQuality: 80,
      })),
    })),
  },
}));

vi.mock('../../utils/env-config', () => ({
  mergeConfigWithEnv: vi.fn(() => ({
    organizationName: 'test-org',
    defaultQuality: 80,
    defaultFormat: 'auto',
  })),
}));

describe('Hydration-safe DPR detection', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    width: 800,
    height: 600,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use standard DPR set during initial render (before hydration)', () => {
    const { result } = renderHook(() => useUnifiedImageEngine(defaultProps));

    // During initial render, should use server-compatible srcSet
    expect(result.current.srcSet).toBe('standard-srcset');
  });

  it('should switch to optimized DPR after hydration completes', async () => {
    const { result, rerender } = renderHook(() => useUnifiedImageEngine(defaultProps));

    // Initial render (before hydration)
    expect(result.current.srcSet).toBe('standard-srcset');

    // Simulate useEffect completion (hydration complete)
    await vi.waitFor(() => {
      rerender();
    });

    // After hydration, should use client-optimized srcSet
    expect(result.current.srcSet).toBe('optimized-srcset');
  });

  it('should preserve custom DPR options after hydration', async () => {
    const customDprOptions = {
      maxDpr: 2,
      customDprs: [1, 2],
    };

    const propsWithDpr = {
      ...defaultProps,
      dprOptions: customDprOptions,
    };

    const { result, rerender } = renderHook(() => useUnifiedImageEngine(propsWithDpr));

    // Initial render should disable auto-detection but preserve custom options
    expect(result.current.srcSet).toBe('standard-srcset');

    // After hydration, custom options should be restored
    await vi.waitFor(() => {
      rerender();
    });

    expect(result.current.srcSet).toBe('optimized-srcset');
  });

  it('should handle undefined dprOptions gracefully', () => {
    const { result } = renderHook(() => useUnifiedImageEngine({
      ...defaultProps,
      dprOptions: undefined,
    }));

    // Should not throw error with undefined dprOptions
    expect(result.current.srcSet).toBe('standard-srcset');
  });
});