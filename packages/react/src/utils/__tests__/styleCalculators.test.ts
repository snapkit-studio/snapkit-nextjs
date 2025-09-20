import { describe, it, expect } from 'vitest';
import {
  createImageStyle,
  createContainerStyle,
} from '../styleCalculators';

describe('styleCalculators', () => {
  describe('createImageStyle', () => {
    it('should create basic image style without fill mode', () => {
      const baseStyle = {
        borderRadius: '8px',
        opacity: 0.8,
      };

      const result = createImageStyle(baseStyle, false);

      expect(result).toEqual({
        borderRadius: '8px',
        opacity: 0.8,
      });
    });

    it('should create image style with fill mode', () => {
      const baseStyle = {
        borderRadius: '8px',
      };

      const result = createImageStyle(baseStyle, true);

      expect(result).toEqual({
        borderRadius: '8px',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      });
    });

    it('should create image style without base style', () => {
      const result = createImageStyle(undefined, true);

      expect(result).toEqual({
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      });
    });

    it('should not add fill styles when fill is false', () => {
      const result = createImageStyle({}, false);

      expect(result).toEqual({});
    });
  });

  describe('createContainerStyle', () => {
    it('should create container style for fill mode', () => {
      const result = createContainerStyle(true);

      expect(result).toEqual({
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        height: '100%',
      });
    });

    it('should create empty style for non-fill mode', () => {
      const result = createContainerStyle(false);

      expect(result).toEqual({});
    });
  });

});
