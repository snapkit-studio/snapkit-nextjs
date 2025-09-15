import { describe, it, expect } from 'vitest';
import {
  createImageStyle,
  createContainerStyle,
  createPlaceholderStyle,
  createMainImageStyle,
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

  describe('createPlaceholderStyle', () => {
    it('should create placeholder style when image is not loaded', () => {
      const imageStyle = {
        width: '100%',
        height: '100%',
      };

      const result = createPlaceholderStyle(imageStyle, false);

      expect(result).toEqual({
        width: '100%',
        height: '100%',
        filter: 'blur(20px)',
        transition: 'opacity 0.3s ease',
        opacity: 1,
      });
    });

    it('should create placeholder style when image is loaded', () => {
      const imageStyle = {
        width: '100%',
        height: '100%',
      };

      const result = createPlaceholderStyle(imageStyle, true);

      expect(result).toEqual({
        width: '100%',
        height: '100%',
        filter: 'blur(20px)',
        transition: 'opacity 0.3s ease',
        opacity: 0,
      });
    });

    it('should create placeholder style with custom blur amount', () => {
      const imageStyle = {
        borderRadius: '4px',
      };

      const result = createPlaceholderStyle(imageStyle, false, 15);

      expect(result).toEqual({
        borderRadius: '4px',
        filter: 'blur(15px)',
        transition: 'opacity 0.3s ease',
        opacity: 1,
      });
    });
  });

  describe('createMainImageStyle', () => {
    it('should create style when image is loaded without blur placeholder', () => {
      const imageStyle = {
        width: '100%',
        height: '100%',
      };

      const result = createMainImageStyle(imageStyle, true, false);

      expect(result).toEqual({
        width: '100%',
        height: '100%',
        opacity: 1,
        transition: undefined,
      });
    });

    it('should create style when image is not loaded without blur placeholder', () => {
      const imageStyle = {
        width: '100%',
        height: '100%',
      };

      const result = createMainImageStyle(imageStyle, false, false);

      expect(result).toEqual({
        width: '100%',
        height: '100%',
        opacity: 1,
        transition: undefined,
      });
    });

    it('should create style when image is loaded with blur placeholder', () => {
      const imageStyle = {
        width: '100%',
        height: '100%',
      };

      const result = createMainImageStyle(imageStyle, true, true);

      expect(result).toEqual({
        width: '100%',
        height: '100%',
        opacity: 1,
        transition: 'opacity 0.3s ease',
      });
    });

    it('should create style when image is not loaded with blur placeholder', () => {
      const imageStyle = {
        width: '100%',
        height: '100%',
      };

      const result = createMainImageStyle(imageStyle, false, true);

      expect(result).toEqual({
        width: '100%',
        height: '100%',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      });
    });
  });
});
