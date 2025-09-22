import '@testing-library/jest-dom';

// Mock Next.js Image component globally
Object.defineProperty(window, 'Image', {
  value: class {
    constructor() {
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 100);
    }
    addEventListener = () => {};
    removeEventListener = () => {};
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
  },
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class IntersectionObserver {
    observe = () => null;
    unobserve = () => null;
    disconnect = () => null;
  },
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe = () => null;
    unobserve = () => null;
    disconnect = () => null;
  },
});
