/**
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getBestSupportedFormat,
  preloadFormatSupport,
} from '../format-detection';

describe('Format Detection Utils - Node Environment', () => {
  beforeEach(() => {
    // Ensure we're in a Node environment without browser globals
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getBestSupportedFormat function - Server Side', () => {
    it('Should return webp on server side', () => {
      // In Node environment, window should be undefined
      expect(typeof window).toBe('undefined');

      const result = getBestSupportedFormat();

      expect(result).toBe('webp');
    });
  });

  describe('preloadFormatSupport function - Server Side', () => {
    it('Should do nothing on server side', () => {
      // In Node environment, window should be undefined
      expect(typeof window).toBe('undefined');

      // Should not throw any errors
      expect(() => preloadFormatSupport()).not.toThrow();
    });
  });
});
