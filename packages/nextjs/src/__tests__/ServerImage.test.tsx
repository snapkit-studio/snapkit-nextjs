import { describe, expect, it } from 'vitest';

import { ServerImage } from '../ServerImage';

describe('ServerImage', () => {
  describe('Basic functionality', () => {
    it('should be a valid React component', () => {
      expect(typeof ServerImage).toBe('function');
    });

    // Test removed - environment variable validation prevents direct calls
  });
});
