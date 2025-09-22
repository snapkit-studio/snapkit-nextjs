import { describe, expect, it } from 'vitest';

import { calculateEnhancedStyle } from '../utils';

describe('Image Component - Aspect Ratio Logic', () => {
  describe('calculateEnhancedStyle function', () => {
    it('Should add height auto when only width is specified', () => {
      const result = calculateEnhancedStyle(300, undefined);

      expect(result).toEqual({ height: undefined, width: 300 });
    });

    it('Should add width auto when only height is specified', () => {
      const result = calculateEnhancedStyle(undefined, 200);

      expect(result).toEqual({ width: 'auto', height: 200 });
    });

    it('Should return both width and height when both are specified', () => {
      const result = calculateEnhancedStyle(300, 200);

      expect(result).toEqual({ height: 200, width: 300 });
    });

    it('Should return undefined when neither width nor height are specified', () => {
      const result = calculateEnhancedStyle(undefined, undefined);

      expect(result).toBeUndefined();
    });

    it('Should preserve existing styles when adding auto dimensions', () => {
      const customStyle = { border: '1px solid red', margin: '10px' };
      const result = calculateEnhancedStyle(300, undefined, customStyle);

      expect(result).toEqual({
        height: undefined,
        width: 300,
        border: '1px solid red',
        margin: '10px',
      });
    });

    it('Should allow manual style override of auto dimensions', () => {
      const overrideStyle = { height: '100px' };
      const result = calculateEnhancedStyle(300, undefined, overrideStyle);

      // User's style should override the auto height
      expect(result).toEqual({ height: '100px', width: 300 });
    });

    it('Should preserve existing styles when adding width auto', () => {
      const customStyle = { border: '2px solid blue' };
      const result = calculateEnhancedStyle(undefined, 200, customStyle);

      expect(result).toEqual({
        width: 'auto',
        height: 200,
        border: '2px solid blue',
      });
    });

    it('Should return existing style with both dimensions when both are provided', () => {
      const customStyle = { padding: '10px' };
      const result = calculateEnhancedStyle(300, 200, customStyle);

      expect(result).toEqual({ height: 200, width: 300, padding: '10px' });
    });
  });

  describe('Width/Height Detection Edge Cases', () => {
    it('Should handle width: 0 as falsy', () => {
      const result = calculateEnhancedStyle(0, 200);

      expect(result).toEqual({ width: 'auto', height: 200 });
    });

    it('Should handle height: 0 as falsy', () => {
      const result = calculateEnhancedStyle(300, 0);

      expect(result).toEqual({ height: 0, width: 300 });
    });

    it('Should handle both 0 values', () => {
      const result = calculateEnhancedStyle(0, 0);

      expect(result).toBeUndefined();
    });
  });
});
