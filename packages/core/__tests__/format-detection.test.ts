import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  estimateFormatSupportFromUA,
  formatSupport,
  getBestSupportedFormat,
  getSupportedFormatsFromAcceptHeader,
  preloadFormatSupport,
  supportsImageFormat,
} from '../src/format-detection';

// Canvas mocking
const mockToDataURL = vi.fn();
const mockGetContext = vi.fn(() => ({
  clearRect: vi.fn(),
}));

beforeEach(async () => {
  // DOM environment setup
  Object.defineProperty(global, 'document', {
    value: {
      createElement: vi.fn(() => ({
        width: 0,
        height: 0,
        getContext: mockGetContext,
        toDataURL: mockToDataURL,
      })),
    },
    writable: true,
  });

  // Default mocking setup
  mockGetContext.mockReturnValue({
    clearRect: vi.fn(),
  });
  mockToDataURL.mockReturnValue('data:image/webp;base64,test');

  // formatSupport cache initialization
  formatSupport.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Format Detection Utils', () => {
  describe('supportsImageFormat function', () => {
    it('Should return support for default formats on server side', () => {
      // Set window to undefined to simulate server environment
      const originalWindow = global.window;
      (global as any).window = undefined;

      expect(supportsImageFormat('webp')).toBe(false);
      expect(supportsImageFormat('jpeg')).toBe(true);
      expect(supportsImageFormat('png')).toBe(true);
      expect(supportsImageFormat('avif')).toBe(false);

      // window restoration
      global.window = originalWindow;
    });

    it('Should detect WebP support using Canvas', () => {
      mockToDataURL.mockReturnValue('data:image/webp;base64,test');

      const result = supportsImageFormat('webp');

      expect(mockGetContext).toHaveBeenCalledWith('2d');
      expect(mockToDataURL).toHaveBeenCalledWith('image/webp', 0.1);
      expect(result).toBe(true);
    });

    it('Should detect AVIF support using Canvas', () => {
      mockToDataURL.mockReturnValue('data:image/avif;base64,test');

      const result = supportsImageFormat('avif');

      expect(mockToDataURL).toHaveBeenCalledWith('image/avif', 0.1);
      expect(result).toBe(true);
    });

    it('Should return false for unsupported formats', () => {
      mockToDataURL.mockReturnValue('data:image/jpeg;base64,test'); // fallback to another format

      const result = supportsImageFormat('webp');

      expect(result).toBe(false);
    });

    it('Should return support for JPEG/PNG only when Canvas is unavailable', () => {
      // Clear cache first
      formatSupport.clear();
      mockGetContext.mockReturnValue(null as any);

      expect(supportsImageFormat('jpeg')).toBe(true);
      expect(supportsImageFormat('png')).toBe(true);
      expect(supportsImageFormat('webp')).toBe(false);
      expect(supportsImageFormat('avif')).toBe(false);
    });

    it('Should cache results', () => {
      mockToDataURL.mockReturnValue('data:image/webp;base64,test');

      // First call
      const result1 = supportsImageFormat('webp');
      // Second call
      const result2 = supportsImageFormat('webp');

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      // Canvas-related functions should be called only once
      expect(mockToDataURL).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSupportedFormatsFromAcceptHeader function', () => {
    it('Should correctly parse Accept header that supports AVIF', () => {
      const acceptHeader = 'image/avif,image/webp,image/jpeg,*/*;q=0.8';
      const result = getSupportedFormatsFromAcceptHeader(acceptHeader);

      expect(result).toContain('avif');
      expect(result).toContain('webp');
      expect(result).toContain('jpeg');
    });

    it('Should correctly parse Accept header that supports WebP', () => {
      const acceptHeader = 'image/webp,image/jpeg,image/png,*/*;q=0.8';
      const result = getSupportedFormatsFromAcceptHeader(acceptHeader);

      expect(result).toContain('webp');
      expect(result).toContain('jpeg');
      expect(result).toContain('png');
      expect(result).not.toContain('avif');
    });

    it('Should detect JPEG/PNG from Accept header containing image/*', () => {
      const acceptHeader = 'image/*,*/*;q=0.8';
      const result = getSupportedFormatsFromAcceptHeader(acceptHeader);

      expect(result).toContain('jpeg');
      expect(result).toContain('png');
    });

    it('Should return empty array for Accept header with no supported formats', () => {
      const acceptHeader = 'text/html,application/xml;q=0.9,*/*;q=0.8';
      const result = getSupportedFormatsFromAcceptHeader(acceptHeader);

      expect(result).toEqual([]);
    });
  });

  describe('getBestSupportedFormat function', () => {
    it('Should return JPEG on server side', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;

      const result = getBestSupportedFormat();

      expect(result).toBe('jpeg');

      global.window = originalWindow;
    });

    it('Should return AVIF when AVIF is supported', () => {
      // formatSupport 캐시를 먼저 정리
      const formatSupport = (supportsImageFormat as any).formatSupport;
      if (formatSupport) {
        formatSupport.clear();
      }

      mockToDataURL.mockImplementation((mimeType) => {
        if (mimeType === 'image/avif') return 'data:image/avif;base64,test';
        return 'data:image/jpeg;base64,test';
      });

      const result = getBestSupportedFormat();

      expect(result).toBe('avif');
    });

    it('Should return WebP when WebP is supported but AVIF is not', () => {
      // Clear formatSupport cache first
      const formatSupport = (supportsImageFormat as any).formatSupport;
      if (formatSupport) {
        formatSupport.clear();
      }

      mockToDataURL.mockImplementation((mimeType) => {
        if (mimeType === 'image/webp') return 'data:image/webp;base64,test';
        return 'data:image/jpeg;base64,test';
      });

      const result = getBestSupportedFormat();

      expect(result).toBe('webp');
    });

    it('Should return specific format when requested and supported', () => {
      mockToDataURL.mockReturnValue('data:image/webp;base64,test');

      const result = getBestSupportedFormat('webp');

      expect(result).toBe('webp');
    });

    it('Should return optimal format when specific format is requested but not supported', () => {
      // Clear formatSupport cache first
      const formatSupport = (supportsImageFormat as any).formatSupport;
      if (formatSupport) {
        formatSupport.clear();
      }

      mockToDataURL.mockImplementation((mimeType) => {
        if (mimeType === 'image/webp') return 'data:image/webp;base64,test';
        return 'data:image/jpeg;base64,test';
      });

      const result = getBestSupportedFormat('avif'); // Requested AVIF but not supported

      expect(result).toBe('webp'); // Fallback to WebP
    });
  });

  describe('preloadFormatSupport function', () => {
    it('Should do nothing on server side', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;

      expect(() => preloadFormatSupport()).not.toThrow();

      global.window = originalWindow;
    });

    it('Should pretest format support in browser', async () => {
      const originalSetTimeout = global.setTimeout;
      const mockSetTimeout = vi.fn((callback, delay) => {
        // 10 when called from preloadFormatSupport, 15 when called from test code
        expect([10, 15]).toContain(delay);
        callback(); // Execute immediately
        return 1;
      });
      global.setTimeout = mockSetTimeout as any;

      mockToDataURL.mockReturnValue('data:image/webp;base64,test');

      preloadFormatSupport();

      // Wait a bit for async execution
      await new Promise(resolve => originalSetTimeout(resolve, 15));
      expect(mockSetTimeout).toHaveBeenCalledTimes(4); // avif, webp, jpeg, png
      global.setTimeout = originalSetTimeout;
    });
  });

  describe('estimateFormatSupportFromUA function', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      global.navigator = originalNavigator;
    });

    it('Should return false on server side', () => {
      const originalWindow = global.window;
      const originalNavigator = global.navigator;
      (global as any).window = undefined;
      (global as any).navigator = undefined;

      const result = estimateFormatSupportFromUA();

      expect(result).toEqual({ avif: false, webp: false });

      // Restore
      global.window = originalWindow;
      global.navigator = originalNavigator;
    });

    it('Should return false when navigator.userAgent is unavailable', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result).toEqual({ avif: false, webp: false });
    });

    it('Should detect AVIF support in Chrome 85+', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(true);
      expect(result.webp).toBe(true);
    });

    it('Should not support AVIF in Chrome 84', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(true); // Chrome 23+ supports WebP
    });

    it('Should not support WebP in Chrome 22', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.36',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });

    it('Should detect WebP support in Firefox 65+', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false); // Not Chrome, so assumed no AVIF support
      expect(result.webp).toBe(true);
    });

    it('Should not support WebP in Firefox 64', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });

    it('Should detect WebP support in Safari 14+', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(true);
    });

    it('Should not support WebP in Safari 13', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });

    it('Should detect WebP support in Edge', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edge/91.0.864.59',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(true); // Chrome/91 supports AVIF
      expect(result.webp).toBe(true); // Including Edge
    });

    it('Should detect no support in old browsers', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 10.0; WOW64; Trident/7.0)',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });

    it('Should handle user agent without version info', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 Custom Browser',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });
  });
});
