import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    DEFAULT_BREAKPOINTS,
    adjustQualityForConnection,
    calculateImageSizes,
    calculateOptimalImageSize,
    createLazyLoadObserver,
    determineImagePriority,
    generateResponsiveWidths,
    getDeviceCharacteristics,
    parseImageSizes,
} from '../responsive';

describe('Default Breakpoints Constants', () => {
  it('Should return correct breakpoint array', () => {
    expect(DEFAULT_BREAKPOINTS).toEqual([
      { width: 640, name: 'sm' },
      { width: 768, name: 'md' },
      { width: 1024, name: 'lg' },
      { width: 1280, name: 'xl' },
      { width: 1536, name: '2xl' },
    ]);
  });
});

describe('calculateImageSizes function', () => {
  describe('Basic operation', () => {
    it('Should calculate image size with default DPR 1', () => {
      const result = calculateImageSizes(800, 600);

      expect(result).toEqual({
        width: 800,
        height: 600,
      });
    });

    it('Should work without height', () => {
      const result = calculateImageSizes(800);

      expect(result).toEqual({
        width: 800,
        height: undefined,
      });
    });

    it('Should adjust size considering DPR', () => {
      const result = calculateImageSizes(800, 600, 2);

      expect(result).toEqual({
        width: 1600,
        height: 1200,
      });
    });

    it('Should round up for decimal DPR', () => {
      const result = calculateImageSizes(800, 600, 1.5);

      expect(result).toEqual({
        width: 1200,
        height: 900,
      });
    });
  });

  describe('Edge cases', () => {
    it('Should handle 0 size', () => {
      const result = calculateImageSizes(0, 0, 2);

      expect(result).toEqual({
        width: 0,
        height: 0,
      });
    });

    it('Should handle very small size', () => {
      const result = calculateImageSizes(1, 1, 2.7);

      expect(result).toEqual({
        width: 3,
        height: 3,
      });
    });
  });
});

describe('parseImageSizes function', () => {
  describe('Pixel unit parsing', () => {
    it('Should parse single pixel size', () => {
      const result = parseImageSizes('800px');

      expect(result).toEqual([800]);
    });

    it('Should parse multiple pixel sizes', () => {
      const result = parseImageSizes('400px 800px 1200px');

      expect(result).toEqual([400, 800, 1200]);
    });
  });

  describe('Viewport unit parsing', () => {
    it('Should calculate single vw size for multiple viewports', () => {
      const result = parseImageSizes('50vw');

      // 50vw for [375, 768, 1024, 1280, 1920] viewports
      expect(result).toContain(188); // 375 * 0.5
      expect(result).toContain(384); // 768 * 0.5
      expect(result).toContain(512); // 1024 * 0.5
      expect(result).toContain(640); // 1280 * 0.5
      expect(result).toContain(960); // 1920 * 0.5
    });

    it('Should handle multiple vw sizes', () => {
      const result = parseImageSizes('25vw 50vw');

      expect(result.length).toBeGreaterThan(5); // at least 10 (2 * 5 viewports)
      expect(result).toContain(94);  // 375 * 0.25
      expect(result).toContain(480); // 960 (1920 * 0.5)
    });
  });

  describe('Mixed unit parsing', () => {
    it('Should parse pixels and vw together', () => {
      const result = parseImageSizes('400px 50vw');

      expect(result).toContain(400);
      expect(result).toContain(188); // 375 * 0.5
      expect(result).toContain(384); // 768 * 0.5
    });
  });

  describe('Deduplication and sorting', () => {
    it('Should remove duplicate sizes', () => {
      const result = parseImageSizes('400px 400px 800px');

      expect(result).toEqual([400, 800]);
    });

    it('Should sort results in ascending order', () => {
      const result = parseImageSizes('800px 400px 1200px');

      expect(result).toEqual([400, 800, 1200]);
    });
  });

  describe('Edge cases', () => {
    it('Should return empty array when no matching sizes', () => {
      const result = parseImageSizes('invalid input');

      expect(result).toEqual([]);
    });

    it('Should handle empty string', () => {
      const result = parseImageSizes('');

      expect(result).toEqual([]);
    });
  });
});

describe('generateResponsiveWidths function', () => {
  describe('Basic operation', () => {
    it('Should generate widths with default multipliers', () => {
      const result = generateResponsiveWidths(800);

      // Default multipliers: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]
      expect(result).toContain(200);  // 800 * 0.25
      expect(result).toContain(400);  // 800 * 0.5
      expect(result).toContain(600);  // 800 * 0.75
      expect(result).toContain(800);  // 800 * 1
      expect(result).toContain(1000); // 800 * 1.25
      expect(result).toContain(1200); // 800 * 1.5
      expect(result).toContain(1600); // 800 * 2
    });

    it('Should sort results in ascending order', () => {
      const result = generateResponsiveWidths(800);

      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
      }
    });
  });

  describe('Custom options', () => {
    it('Should use custom multipliers', () => {
      const result = generateResponsiveWidths(800, {
        multipliers: [0.5, 1, 2],
      });

      expect(result).toEqual([400, 800, 1600]);
    });

    it('Should apply min/max width limits', () => {
      const result = generateResponsiveWidths(800, {
        multipliers: [0.1, 0.5, 1, 2, 5],
        minWidth: 300,
        maxWidth: 1500,
      });

      // 80 (0.1 * 800)and 4000 (5 * 800)should be excluded
      expect(result).not.toContain(80);
      expect(result).not.toContain(4000);
      expect(result).toContain(400);  // 0.5 * 800
      expect(result).toContain(800);  // 1 * 800
      // 1600 (2 * 800)exceeds maxWidth 1500 so excluded
      expect(result).not.toContain(1600);
    });
  });

  describe('Deduplication', () => {
    it('Should remove duplicate widths', () => {
      const result = generateResponsiveWidths(400, {
        multipliers: [0.5, 1, 1, 2], // 1is duplicated
      });

      expect(result).toEqual([200, 400, 800]);
    });
  });

  describe('Edge cases', () => {
    it('Should handle empty multipliers array', () => {
      const result = generateResponsiveWidths(800, {
        multipliers: [],
      });

      expect(result).toEqual([]);
    });

    it('Should handle 0 base width', () => {
      const result = generateResponsiveWidths(0);

      expect(result).toEqual([]);
    });
  });
});

describe('calculateOptimalImageSize function', () => {
  describe('Basic operation', () => {
    it('Should calculate optimal size considering container size and DPR', () => {
      const result = calculateOptimalImageSize(800, 600, 2);

      expect(result).toEqual({
        width: 1600,
        height: 1200,
      });
    });

    it('Should work without height', () => {
      const result = calculateOptimalImageSize(800, undefined, 1.5);

      expect(result).toEqual({
        width: 1200,
        height: undefined,
      });
    });
  });

  describe('Maximum size limits', () => {
    it('Should limit width to 4K level', () => {
      const result = calculateOptimalImageSize(5000, 3000, 2);

      expect(result.width).toBe(3840); // maxWidth
      expect(result.height).toBe(2160); // maxHeight
    });

    it('When only height limit is needed', () => {
      const result = calculateOptimalImageSize(1000, 3000, 2);

      expect(result.width).toBe(2000);
      expect(result.height).toBe(2160); // limited to maxHeight
    });

    it('When only width limit is needed', () => {
      const result = calculateOptimalImageSize(3000, 1000, 2);

      expect(result.width).toBe(3840); // limited to maxWidth
      expect(result.height).toBe(2000);
    });
  });

  describe('Decimal handling', () => {
    it('Should round up to integer', () => {
      const result = calculateOptimalImageSize(333, 250, 1.5);

      expect(result.width).toBe(500);  // Math.ceil(333 * 1.5) = 500
      expect(result.height).toBe(375); // Math.ceil(250 * 1.5) = 375
    });
  });
});

describe('determineImagePriority function', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Window mocking
    Object.defineProperty(global, 'window', {
      value: {
        innerHeight: 1000,
      },
      writable: true,
    });

    // Mock HTMLElement
    mockElement = {
      getBoundingClientRect: vi.fn(() => ({
        top: 500,
        bottom: 800,
        left: 0,
        right: 100,
        width: 100,
        height: 300,
      })),
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('User priority setting', () => {
    it('Should return true when user sets to true', () => {
      const result = determineImagePriority(mockElement, true);

      expect(result).toBe(true);
    });

    it('Should return false when user sets to false', () => {
      const result = determineImagePriority(mockElement, false);

      expect(result).toBe(false);
    });
  });

  describe('Automatic priority determination', () => {
    it('Elements within viewport should have high priority', () => {
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 200,
        bottom: 500,
        left: 0,
        right: 100,
        width: 100,
        height: 300,
        x: 0,
        y: 200,
        toJSON: () => ({}),
      })) as any;

      const result = determineImagePriority(mockElement);

      expect(result).toBe(true);
    });

    it('Elements just below viewport should also have high priority', () => {
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 1200, // below viewport(1000) but within 1.5x
        bottom: 1400,
        left: 0,
        right: 100,
        width: 100,
        height: 200,
        x: 0,
        y: 1200,
        toJSON: () => ({}),
      })) as any;

      const result = determineImagePriority(mockElement);

      expect(result).toBe(true);
    });

    it('Elements too far below should have low priority', () => {
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 2000, // exceeds 1.5x of viewport
        bottom: 2200,
        left: 0,
        right: 100,
        width: 100,
        height: 200,
        x: 0,
        y: 2000,
        toJSON: () => ({}),
      })) as any;

      const result = determineImagePriority(mockElement);

      expect(result).toBe(false);
    });

    it('Elements above viewport should also have low priority', () => {
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: -500,
        bottom: -200,
        left: 0,
        right: 100,
        width: 100,
        height: 300,
        x: 0,
        y: -500,
        toJSON: () => ({}),
      })) as any;

      const result = determineImagePriority(mockElement);

      expect(result).toBe(false);
    });
  });

  describe('Server-side rendering', () => {
    it('Should return false when window is unavailable', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;

      const result = determineImagePriority(mockElement);

      expect(result).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('Null element handling', () => {
    it('Should return false when element is null', () => {
      const result = determineImagePriority(null);

      expect(result).toBe(false);
    });
  });
});

describe('createLazyLoadObserver function', () => {
  let mockCallback: (entry: IntersectionObserverEntry) => void;
  let mockIntersectionObserver: any;

  beforeEach(() => {
    mockCallback = vi.fn();
    mockIntersectionObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn((callback, options) => {
      // Store callback (for manual invocation in tests)
      (mockIntersectionObserver as any).callback = callback;
      (mockIntersectionObserver as any).options = options;
      return mockIntersectionObserver;
    }) as any;

    // Set up window environment (including IntersectionObserver)
    Object.defineProperty(global, 'window', {
      value: {
        IntersectionObserver: global.IntersectionObserver,
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic operation', () => {
    it('Should create and return IntersectionObserver', () => {
      const observer = createLazyLoadObserver(mockCallback);

      expect(observer).toBe(mockIntersectionObserver);
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          rootMargin: '50px',
          threshold: 0.1,
        },
      );
    });

    it('Should use custom options', () => {
      const customOptions = {
        rootMargin: '100px',
        threshold: 0.5,
        root: document.body,
      };

      createLazyLoadObserver(mockCallback, customOptions);

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          rootMargin: '100px',
          threshold: 0.5,
          root: document.body,
        },
      );
    });

    it('Should call callback on intersection', () => {
      const observer = createLazyLoadObserver(mockCallback);

      // Simulate intersection state
      const mockEntry = {
        isIntersecting: true,
        target: document.createElement('div'),
      };

      // Manually call IntersectionObserver callback
      (observer as any).callback([mockEntry]);

      expect(mockCallback).toHaveBeenCalledWith(mockEntry);
    });

    it('Should not call callback when not intersecting', () => {
      const observer = createLazyLoadObserver(mockCallback);

      const mockEntry = {
        isIntersecting: false,
        target: document.createElement('div'),
      };

      (observer as any).callback([mockEntry]);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('Server-side rendering', () => {
    it('Should return null when window is unavailable', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;

      const observer = createLazyLoadObserver(mockCallback);

      expect(observer).toBeNull();

      // Restore window
      global.window = originalWindow;
    });

    it('Should return null when IntersectionObserver is not supported', () => {
      Object.defineProperty(global, 'window', {
        value: {}, // window without IntersectionObserver
        writable: true,
      });

      const observer = createLazyLoadObserver(mockCallback);

      expect(observer).toBeNull();
    });
  });
});

describe('getDeviceCharacteristics function', () => {
  const originalNavigator = global.navigator;
  const originalWindow = global.window;

  afterEach(() => {
    global.navigator = originalNavigator;
    global.window = originalWindow;
    vi.clearAllMocks();
  });

  describe('Server-side rendering', () => {
    it('Should return default values when window is unavailable', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;

      const result = getDeviceCharacteristics();

      expect(result).toEqual({
        devicePixelRatio: 1,
        viewportWidth: 1920,
        viewportHeight: 1080,
        isMobile: false,
        isTouch: false,
        connectionType: 'unknown',
        dataLimit: undefined,
      });

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Client side', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', {
        value: {
          devicePixelRatio: 2,
          innerWidth: 375,
          innerHeight: 812,
          ontouchstart: {},
        },
        writable: true,
      });

      Object.defineProperty(global, 'navigator', {
        value: {
          connection: {
            effectiveType: '4g',
            saveData: false,
          },
        },
        writable: true,
      });
    });

    it('Should correctly detect device characteristics', () => {
      const result = getDeviceCharacteristics();

      expect(result).toEqual({
        devicePixelRatio: 2,
        viewportWidth: 375,
        viewportHeight: 812,
        isMobile: true,
        isTouch: true,
        connectionType: '4g',
        dataLimit: false,
      });
    });

    it('Should detect desktop environment', () => {
      Object.defineProperty(global, 'window', {
        value: {
          devicePixelRatio: 1,
          innerWidth: 1920,
          innerHeight: 1080,
          // no ontouchstart
        },
        writable: true,
      });

      const result = getDeviceCharacteristics();

      expect(result.isMobile).toBe(false);
      expect(result.isTouch).toBe(false);
    });

    it('Should use mozConnection as fallback', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          mozConnection: {
            effectiveType: '3g',
            saveData: true,
          },
        },
        writable: true,
      });

      const result = getDeviceCharacteristics();

      expect(result.connectionType).toBe('3g');
      expect(result.dataLimit).toBe(true);
    });

    it('Should return unknown when connection info is unavailable', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      const result = getDeviceCharacteristics();

      expect(result.connectionType).toBe('unknown');
      expect(result.dataLimit).toBeUndefined();
    });
  });
});

describe('adjustQualityForConnection function', () => {
  const originalNavigator = global.navigator;
  const originalWindow = global.window;

  afterEach(() => {
    global.navigator = originalNavigator;
    global.window = originalWindow;
  });

  describe('Server-side rendering', () => {
    it('Should return default quality when window is unavailable', () => {
      const originalWindow = global.window;
      (global as any).window = undefined;

      const result = adjustQualityForConnection(85);

      expect(result).toBe(85);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Data Saver mode', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', { value: {}, writable: true });
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: {
            saveData: true,
            effectiveType: '4g',
          },
        },
        writable: true,
      });
    });

    it('Should significantly reduce quality when Data Saver is enabled', () => {
      const result = adjustQualityForConnection(85);

      expect(result).toBe(55); // 85 - 30
    });

    it('Quality should not go below 40', () => {
      const result = adjustQualityForConnection(50);

      expect(result).toBe(40);
    });
  });

  describe('Quality adjustment by connection type', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', { value: {}, writable: true });
    });

    it('Should significantly reduce quality on slow-2g connection', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: 'slow-2g' },
        },
        writable: true,
      });

      const result = adjustQualityForConnection(85);

      expect(result).toBe(45); // 85 - 40
    });

    it('Should significantly reduce quality on 2g connection', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: '2g' },
        },
        writable: true,
      });

      const result = adjustQualityForConnection(85);

      expect(result).toBe(45); // 85 - 40
    });

    it('Should moderately reduce quality on 3g connection', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: '3g' },
        },
        writable: true,
      });

      const result = adjustQualityForConnection(85);

      expect(result).toBe(65); // 85 - 20
    });

    it('Should maintain original quality on 4g connection', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: '4g' },
        },
        writable: true,
      });

      const result = adjustQualityForConnection(85);

      expect(result).toBe(85);
    });

    it('Should maintain original quality on unknown connection type', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: 'unknown' },
        },
        writable: true,
      });

      const result = adjustQualityForConnection(85);

      expect(result).toBe(85);
    });
  });

  describe('Connection type specification via parameter', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', { value: {}, writable: true });
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });
    });

    it('Should prioritize connection type passed as parameter', () => {
      const result = adjustQualityForConnection(85, '2g');

      expect(result).toBe(45); // 2g quality applied
    });
  });

  describe('Minimum quality guarantee', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', { value: {}, writable: true });
    });

    it('Should guarantee minimum quality of 30 even on slow-2g', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: 'slow-2g' },
        },
        writable: true,
      });

      const result = adjustQualityForConnection(50);

      expect(result).toBe(30);
    });

    it('Should guarantee minimum quality of 50 even on 3g', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: '3g' },
        },
        writable: true,
      });

      const result = adjustQualityForConnection(60);

      expect(result).toBe(50);
    });
  });

  describe('Default value handling', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', { value: {}, writable: true });
      Object.defineProperty(global, 'navigator', {
        value: {
          connection: { effectiveType: '4g' },
        },
        writable: true,
      });
    });

    it('Should use default value 85 when quality is not provided', () => {
      const result = adjustQualityForConnection();

      expect(result).toBe(85);
    });
  });
});
