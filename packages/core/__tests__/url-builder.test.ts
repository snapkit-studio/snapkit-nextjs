import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ImageTransforms } from '../src/types';
import {
  SnapkitUrlBuilder,
  buildImageUrl,
  getDefaultUrlBuilder,
  setDefaultUrlBuilder,
} from '../src/url-builder';

describe('SnapkitUrlBuilder Class', () => {
  let urlBuilder: SnapkitUrlBuilder;

  beforeEach(() => {
    urlBuilder = new SnapkitUrlBuilder('https://image-proxy.snapkit.com', 'test-org');
  });

  describe('Constructor', () => {
    it('should create instance with default base URL and organization name', () => {
      const builder = new SnapkitUrlBuilder();

      expect(builder).toBeInstanceOf(SnapkitUrlBuilder);
    });

    it('should create instance with custom base URL and organization name', () => {
      const builder = new SnapkitUrlBuilder('https://custom.domain.com', 'custom-org');

      expect(builder).toBeInstanceOf(SnapkitUrlBuilder);
    });

    it('should remove trailing slash from base URL', () => {
      const builder = new SnapkitUrlBuilder('https://example.com/', 'org');
      const result = builder.buildImageUrl('test.jpg');

      expect(result).toBe('https://example.com/image/org/test.jpg');
    });
  });

  describe('buildImageUrl Method', () => {
    it('should generate basic image URL', () => {
      const result = urlBuilder.buildImageUrl('test.jpg');

      expect(result).toBe('https://image-proxy.snapkit.com/image/test-org/test.jpg');
    });

    it('should return complete URLs as-is', () => {
      const httpUrl = 'http://example.com/image.jpg';
      const httpsUrl = 'https://example.com/image.jpg';

      expect(urlBuilder.buildImageUrl(httpUrl)).toBe(httpUrl);
      expect(urlBuilder.buildImageUrl(httpsUrl)).toBe(httpsUrl);
    });

    it('should add slash to paths not starting with slash', () => {
      const result = urlBuilder.buildImageUrl('folder/test.jpg');

      expect(result).toBe('https://image-proxy.snapkit.com/image/test-org/folder/test.jpg');
    });

    it('should use paths already starting with slash as-is', () => {
      const result = urlBuilder.buildImageUrl('/folder/test.jpg');

      expect(result).toBe('https://image-proxy.snapkit.com/image/test-org/folder/test.jpg');
    });

    it('should allow overriding organization name as parameter', () => {
      const result = urlBuilder.buildImageUrl('test.jpg', 'override-org');

      expect(result).toBe('https://image-proxy.snapkit.com/image/override-org/test.jpg');
    });
  });

  describe('buildTransformedUrl Method', () => {
    it('should return basic URL when no transform parameters', () => {
      const transforms: ImageTransforms = {};
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toBe('https://image-proxy.snapkit.com/image/test-org/test.jpg');
    });

    it('should generate URL with size transform parameters', () => {
      const transforms: ImageTransforms = {
        width: 800,
        height: 600,
        fit: 'cover',
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('w=800');
      expect(result).toContain('h=600');
      expect(result).toContain('fit=cover');
    });

    it('should generate URL with flip parameters', () => {
      const transforms: ImageTransforms = {
        flip: true,
        flop: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('flip=true');
      expect(result).toContain('flop=true');
    });

    it('should generate URL with visual effect parameters', () => {
      const transforms: ImageTransforms = {
        blur: 10,
        grayscale: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('blur=10');
      expect(result).toContain('grayscale=true');
    });

    it('should set blur to "true" when blur is boolean true', () => {
      const transforms: ImageTransforms = {
        blur: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('blur=true');
    });

    it('should generate URL with color adjustment parameters', () => {
      const transforms: ImageTransforms = {
        brightness: 1.2,
        hue: 180,
        lightness: 0.8,
        saturation: 1.5,
        negate: true,
        normalize: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('brightness=1.2');
      expect(result).toContain('hue=180');
      expect(result).toContain('lightness=0.8');
      expect(result).toContain('saturation=1.5');
      expect(result).toContain('negate=true');
      expect(result).toContain('normalize=true');
    });

    it('should generate URL with extract region parameters', () => {
      const transforms: ImageTransforms = {
        extract: {
          x: 25,
          y: 10,
          width: 50,
          height: 75,
        },
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('extract=25%2C10%2C50%2C75');
    });

    it('should generate URL with background color parameters', () => {
      const transforms: ImageTransforms = {
        background: [255, 255, 255, 0.8],
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('background=255%2C255%2C255%2C0.8');
    });

    it('should generate URL with format and quality parameters', () => {
      const transforms: ImageTransforms = {
        format: 'webp',
        quality: 85,
        timeout: 5000,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('format=webp');
      expect(result).toContain('quality=85');
      expect(result).toContain('timeout=5000');
    });

    it('should not include auto format in URL', () => {
      const transforms: ImageTransforms = {
        format: 'auto',
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).not.toContain('format');
    });
  });

  describe('buildFormatUrls Method', () => {
    it('should generate URLs for AVIF, WebP, and original formats', () => {
      const transforms: ImageTransforms = {
        width: 800,
        quality: 85,
      };
      const result = urlBuilder.buildFormatUrls('test.jpg', transforms);

      expect(result.avif).toContain('format=avif');
      expect(result.avif).toContain('w=800');
      expect(result.webp).toContain('format=webp');
      expect(result.webp).toContain('w=800');
      expect(result.original).not.toContain('format');
      expect(result.original).toContain('w=800');
    });

    it('should allow overriding organization name as parameter', () => {
      const transforms: ImageTransforms = { width: 400 };
      const result = urlBuilder.buildFormatUrls('test.jpg', transforms, 'custom-org');

      expect(result.avif).toContain('/image/custom-org/');
      expect(result.webp).toContain('/image/custom-org/');
      expect(result.original).toContain('/image/custom-org/');
    });
  });

  describe('buildSrcSet Method', () => {
    it('should generate srcset string for multiple widths', () => {
      const widths = [400, 800, 1200];
      const transforms: ImageTransforms = {
        quality: 85,
        fit: 'cover',
      };
      const result = urlBuilder.buildSrcSet('test.jpg', widths, transforms);

      expect(result).toContain('w=400');
      expect(result).toContain('400w');
      expect(result).toContain('w=800');
      expect(result).toContain('800w');
      expect(result).toContain('w=1200');
      expect(result).toContain('1200w');
      expect(result).toContain('quality=85');
      expect(result).toContain('fit=cover');
    });

    it('should separate srcset string with comma and space', () => {
      const widths = [400, 800];
      const result = urlBuilder.buildSrcSet('test.jpg', widths, {});

      expect(result).toMatch(/400w,\s/);
      expect(result).toMatch(/800w$/);
    });

    it('should allow overriding organization name as parameter', () => {
      const widths = [400, 800];
      const result = urlBuilder.buildSrcSet('test.jpg', widths, {}, 'custom-org');

      expect(result).toContain('/image/custom-org/');
    });
  });
});

describe('Default URL Builder Functions', () => {
  let originalDefaultBuilder: SnapkitUrlBuilder | null;

  beforeEach(() => {
    // Backup existing default builder
    originalDefaultBuilder = getDefaultUrlBuilder();
  });

  afterEach(() => {
    // Restore default builder after test
    if (originalDefaultBuilder) {
      setDefaultUrlBuilder(
        originalDefaultBuilder['baseUrl'],
        originalDefaultBuilder['organizationName'],
      );
    }
  });

  describe('setDefaultUrlBuilder Function', () => {
    it('should set default URL builder', () => {
      setDefaultUrlBuilder('https://custom.domain.com', 'custom-org');
      const builder = getDefaultUrlBuilder();
      const result = builder.buildImageUrl('test.jpg');

      expect(result).toBe('https://custom.domain.com/image/custom-org/test.jpg');
    });

    it('should set base URL only', () => {
      setDefaultUrlBuilder('https://custom.domain.com');
      const builder = getDefaultUrlBuilder();
      const result = builder.buildImageUrl('test.jpg');

      expect(result).toBe('https://custom.domain.com/image//test.jpg');
    });

    it('should set organization name only', () => {
      setDefaultUrlBuilder(undefined, 'custom-org');
      const builder = getDefaultUrlBuilder();
      const result = builder.buildImageUrl('test.jpg');

      expect(result).toContain('/image/custom-org/');
    });
  });

  describe('getDefaultUrlBuilder Function', () => {
    it('should create new instance when no default builder is set', () => {
      // Reset default builder
      setDefaultUrlBuilder();
      const builder = getDefaultUrlBuilder();

      expect(builder).toBeInstanceOf(SnapkitUrlBuilder);
    });

    it('should return the set default builder', () => {
      setDefaultUrlBuilder('https://test.com', 'test-org');
      const builder1 = getDefaultUrlBuilder();
      const builder2 = getDefaultUrlBuilder();

      expect(builder1).toBe(builder2); // Should be same instance
    });
  });
});

describe('buildImageUrl Helper Function', () => {
  beforeEach(() => {
    setDefaultUrlBuilder('https://default.com', 'default-org');
  });

  afterEach(() => {
    setDefaultUrlBuilder(); // Reset
  });

  describe('Basic Usage', () => {
    it('should generate basic URL without transforms', () => {
      const result = buildImageUrl('test.jpg');

      expect(result).toBe('https://default.com/image/default-org/test.jpg');
    });

    it('should generate transformed URL when transforms are provided', () => {
      const transforms: ImageTransforms = {
        width: 800,
        quality: 85,
      };
      const result = buildImageUrl('test.jpg', transforms);

      expect(result).toContain('w=800');
      expect(result).toContain('quality=85');
    });

    it('should ignore empty transform object', () => {
      const result = buildImageUrl('test.jpg', {});

      expect(result).toBe('https://default.com/image/default-org/test.jpg');
    });
  });

  describe('Options Overrides', () => {
    it('should allow overriding base URL', () => {
      const options = {
        baseUrl: 'https://custom.com',
      };
      const result = buildImageUrl('test.jpg', undefined, options);

      expect(result).toContain('https://custom.com');
    });

    it('should allow overriding organization name', () => {
      const options = {
        organizationName: 'custom-org',
      };
      const result = buildImageUrl('test.jpg', undefined, options);

      expect(result).toContain('/image/custom-org/');
    });

    it('should allow overriding both base URL and organization name', () => {
      const options = {
        baseUrl: 'https://custom.com',
        organizationName: 'custom-org',
      };
      const result = buildImageUrl('test.jpg', undefined, options);

      expect(result).toBe('https://custom.com/image/custom-org/test.jpg');
    });

    it('should use transforms and options together', () => {
      const transforms: ImageTransforms = {
        width: 400,
        format: 'webp',
      };
      const options = {
        baseUrl: 'https://custom.com',
        organizationName: 'custom-org',
      };
      const result = buildImageUrl('test.jpg', transforms, options);

      expect(result).toContain('https://custom.com/image/custom-org/');
      expect(result).toContain('w=400');
      expect(result).toContain('format=webp');
    });
  });

  describe('Fallback Behavior', () => {
    it('should use default builder when no options', () => {
      const result = buildImageUrl('test.jpg');

      expect(result).toContain('https://default.com');
      expect(result).toContain('/image/default-org/');
    });

    it('should use default builder when empty options object', () => {
      const result = buildImageUrl('test.jpg', undefined, {});

      expect(result).toContain('https://default.com');
      expect(result).toContain('/image/default-org/');
    });
  });
});
