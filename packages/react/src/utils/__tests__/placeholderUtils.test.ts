import { describe, it, expect } from 'vitest';
import {
  shouldShowBlurPlaceholder,
  getPlaceholderUrl,
} from '../placeholderUtils';

describe('placeholderUtils', () => {
  describe('shouldShowBlurPlaceholder', () => {
    it('should return true when placeholder is blur and image is not loaded and no error', () => {
      const result = shouldShowBlurPlaceholder('blur', false, false);
      expect(result).toBe(true);
    });

    it('should return false when placeholder is not blur', () => {
      const result = shouldShowBlurPlaceholder('empty', false, false);
      expect(result).toBe(false);
    });

    it('should return false when image is loaded', () => {
      const result = shouldShowBlurPlaceholder('blur', true, false);
      expect(result).toBe(false);
    });

    it('should return false when there is an error', () => {
      const result = shouldShowBlurPlaceholder('blur', false, true);
      expect(result).toBe(false);
    });

    it('should return false when image is loaded and there is an error', () => {
      const result = shouldShowBlurPlaceholder('blur', true, true);
      expect(result).toBe(false);
    });

    it('should handle custom placeholder types', () => {
      const result = shouldShowBlurPlaceholder('custom', false, false);
      expect(result).toBe(false);
    });
  });

  describe('getPlaceholderUrl', () => {
    it('should return blurDataURL when provided', () => {
      const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...';
      const generatedUrl = 'https://cdn.example.com/image.jpg?blur=20';

      const result = getPlaceholderUrl('blur', blurDataURL, generatedUrl);

      expect(result).toBe(blurDataURL);
    });

    it('should return generated URL when blurDataURL is not provided and placeholder is blur', () => {
      const generatedUrl = 'https://cdn.example.com/image.jpg?blur=20';

      const result = getPlaceholderUrl('blur', undefined, generatedUrl);

      expect(result).toBe(generatedUrl);
    });

    it('should return undefined when placeholder is not blur and no blurDataURL', () => {
      const generatedUrl = 'https://cdn.example.com/image.jpg?blur=20';

      const result = getPlaceholderUrl('empty', undefined, generatedUrl);

      expect(result).toBe(undefined);
    });

    it('should return undefined when neither blurDataURL nor generatedUrl are provided', () => {
      const result = getPlaceholderUrl('blur', undefined, undefined);

      expect(result).toBe(undefined);
    });

    it('should prioritize blurDataURL over generated URL', () => {
      const blurDataURL = 'data:image/jpeg;base64,custom...';
      const generatedUrl = 'https://cdn.example.com/image.jpg?blur=20';

      const result = getPlaceholderUrl('blur', blurDataURL, generatedUrl);

      expect(result).toBe(blurDataURL);
    });

    it('should handle empty string blurDataURL', () => {
      const generatedUrl = 'https://cdn.example.com/image.jpg?blur=20';

      const result = getPlaceholderUrl('blur', '', generatedUrl);

      expect(result).toBe('');
    });

    it('should handle custom placeholder types with blurDataURL', () => {
      const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...';
      const generatedUrl = 'https://cdn.example.com/image.jpg?blur=20';

      const result = getPlaceholderUrl('custom', blurDataURL, generatedUrl);

      expect(result).toBe(blurDataURL);
    });
  });
});
