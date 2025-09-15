import { describe, expect, it } from 'vitest';
import type {
    ImageTransforms,
    NextImageProps,
    PictureSource,
    ProcessedImageUrl,
    SnapkitConfig,
    SnapkitImageProps,
    SnapkitPictureProps,
} from '../types';

// This file provides compile-time tests to verify the correctness of type definitions.
// It focuses on type validation through the TypeScript compiler rather than actual runtime tests.

describe('Type definition validation', () => {
  describe('ImageTransforms interface', () => {
    it('should allow all fields to be optional', () => {
      const emptyTransforms: ImageTransforms = {};
      expect(emptyTransforms).toBeDefined();

      const fullTransforms: ImageTransforms = {
        width: 800,
        height: 600,
        fit: 'cover',
        flip: true,
        flop: false,
        blur: 10,
        grayscale: true,
        brightness: 1.2,
        hue: 180,
        lightness: 0.8,
        saturation: 1.5,
        negate: false,
        normalize: true,
        extract: { x: 0, y: 0, width: 100, height: 100 },
        background: [255, 255, 255, 1],
        quality: 85,
        format: 'webp',
        timeout: 5000,
      };
      expect(fullTransforms).toBeDefined();
    });

    it('should allow valid fit option values', () => {
      const validFits: ImageTransforms['fit'][] = [
        'contain',
        'cover',
        'fill',
        'inside',
        'outside',
        undefined,
      ];

      validFits.forEach((fit) => {
        const transform: ImageTransforms = { fit };
        expect(transform.fit).toBe(fit);
      });
    });

    it('should allow valid format option values', () => {
      const validFormats: ImageTransforms['format'][] = [
        'jpeg',
        'jpg',
        'png',
        'webp',
        'avif',
        'auto',
        undefined,
      ];

      validFormats.forEach((format) => {
        const transform: ImageTransforms = { format };
        expect(transform.format).toBe(format);
      });
    });

    it('should allow blur as number or boolean', () => {
      const numericBlur: ImageTransforms = { blur: 15 };
      const booleanBlur: ImageTransforms = { blur: true };

      expect(numericBlur.blur).toBe(15);
      expect(booleanBlur.blur).toBe(true);
    });

    it('should have correct extract structure', () => {
      const transform: ImageTransforms = {
        extract: {
          x: 10,
          y: 20,
          width: 100,
          height: 150,
        },
      };

      expect(transform.extract?.x).toBe(10);
      expect(transform.extract?.y).toBe(20);
      expect(transform.extract?.width).toBe(100);
      expect(transform.extract?.height).toBe(150);
    });

    it('should allow background as RGBA array', () => {
      const transform: ImageTransforms = {
        background: [255, 128, 0, 0.8],
      };

      expect(transform.background).toEqual([255, 128, 0, 0.8]);
    });
  });

  describe('NextImageProps interface', () => {
    it('should have properties compatible with Next.js Image component', () => {
      const props: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        fill: false,
        sizes: '(max-width: 768px) 100vw, 50vw',
        quality: 85,
        priority: true,
        placeholder: 'blur',
        blurDataURL: 'data:image/jpeg;base64,test',
        loading: 'eager',
        onLoad: () => {},
        onError: () => {},
        className: 'test-class',
        style: { border: '1px solid red' },
      };

      expect(props.src).toBe('test.jpg');
      expect(props.alt).toBe('Test image');
      expect(props.placeholder).toBe('blur');
      expect(props.loading).toBe('eager');
    });

    it('should allow valid placeholder values', () => {
      const blurPlaceholder: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test',
        placeholder: 'blur',
      };

      const emptyPlaceholder: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test',
        placeholder: 'empty',
      };

      expect(blurPlaceholder.placeholder).toBe('blur');
      expect(emptyPlaceholder.placeholder).toBe('empty');
    });

    it('should allow valid loading values', () => {
      const lazyLoading: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test',
        loading: 'lazy',
      };

      const eagerLoading: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test',
        loading: 'eager',
      };

      expect(lazyLoading.loading).toBe('lazy');
      expect(eagerLoading.loading).toBe('eager');
    });
  });

  describe('SnapkitImageProps interface', () => {
    it('should extend NextImageProps functionality', () => {
      const props: SnapkitImageProps = {
        src: 'test.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        organizationName: 'test-org',
        baseUrl: 'https://test.com',
        transforms: {
          blur: 20,
          grayscale: true,
        },
        optimizeFormat: 'webp',
        // Next.js props
        priority: true,
        placeholder: 'blur',
        loading: 'eager',
        className: 'test-class',
        onClick: () => {},
      };

      expect(props.organizationName).toBe('test-org');
      expect(props.baseUrl).toBe('https://test.com');
      expect(props.optimizeFormat).toBe('webp');
      expect(props.transforms?.blur).toBe(20);
    });

    it('should allow extended placeholder options', () => {
      const noneProps: SnapkitImageProps = {
        src: 'test.jpg',
        alt: 'Test',
        placeholder: 'none',
      };

      expect(noneProps.placeholder).toBe('none');
    });

    it('should allow valid optimizeFormat values', () => {
      const formatOptions: SnapkitImageProps['optimizeFormat'][] = [
        'avif',
        'webp',
        'auto',
        'off',
        undefined,
      ];

      formatOptions.forEach((format) => {
        const props: SnapkitImageProps = {
          src: 'test.jpg',
          alt: 'Test',
          optimizeFormat: format,
        };

        expect(props.optimizeFormat).toBe(format);
      });
    });
  });

  describe('PictureSource interface', () => {
    it('should correctly define required and optional properties', () => {
      const minimalSource: PictureSource = {
        src: 'mobile.jpg',
        width: 400,
        height: 300,
      };

      const fullSource: PictureSource = {
        media: '(max-width: 768px)',
        src: 'mobile.jpg',
        width: 400,
        height: 300,
        transforms: {
          fit: 'cover',
          quality: 80,
        },
      };

      expect(minimalSource.src).toBe('mobile.jpg');
      expect(minimalSource.width).toBe(400);
      expect(minimalSource.height).toBe(300);

      expect(fullSource.media).toBe('(max-width: 768px)');
      expect(fullSource.transforms?.fit).toBe('cover');
    });
  });

  describe('SnapkitPictureProps interface', () => {
    it('should define properties needed for Picture component', () => {
      const props: SnapkitPictureProps = {
        sources: [
          {
            media: '(max-width: 768px)',
            src: 'mobile.jpg',
            width: 400,
            height: 300,
          },
          {
            media: '(min-width: 769px)',
            src: 'desktop.jpg',
            width: 1200,
            height: 800,
          },
        ],
        src: 'fallback.jpg',
        alt: 'Test image',
        organizationName: 'test-org',
        baseUrl: 'https://test.com',
        quality: 90,
        optimizeFormat: 'avif',
        className: 'picture-class',
        onClick: () => {},
      };

      expect(props.sources).toHaveLength(2);
      expect(props.src).toBe('fallback.jpg');
      expect(props.alt).toBe('Test image');
      expect(props.quality).toBe(90);
    });
  });

  describe('SnapkitConfig interface', () => {
    it('should make all config options optional', () => {
      const emptyConfig: SnapkitConfig = {};
      expect(emptyConfig).toBeDefined();

      const fullConfig: SnapkitConfig = {
        baseUrl: 'https://test.com',
        organizationName: 'test-org',
        defaultQuality: 85,
        defaultFormat: 'auto',
        enableBlurPlaceholder: true,
      };

      expect(fullConfig.baseUrl).toBe('https://test.com');
      expect(fullConfig.organizationName).toBe('test-org');
      expect(fullConfig.defaultQuality).toBe(85);
      expect(fullConfig.defaultFormat).toBe('auto');
      expect(fullConfig.enableBlurPlaceholder).toBe(true);
    });

    it('should allow valid defaultFormat values', () => {
      const formats: SnapkitConfig['defaultFormat'][] = [
        'avif',
        'webp',
        'auto',
        undefined,
      ];

      formats.forEach((format) => {
        const config: SnapkitConfig = { defaultFormat: format };
        expect(config.defaultFormat).toBe(format);
      });
    });
  });

  describe('ProcessedImageUrl interface', () => {
    it('should represent image URL processing results', () => {
      const minimalUrl: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
      };

      const fullUrl: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
        srcSet:
          'https://test.com/image-400.jpg 400w, https://test.com/image-800.jpg 800w',
        sources: {
          avif: 'https://test.com/image.avif',
          webp: 'https://test.com/image.webp',
          original: 'https://test.com/image.jpg',
        },
      };

      expect(minimalUrl.src).toBe('https://test.com/image.jpg');
      expect(fullUrl.srcSet).toContain('400w');
      expect(fullUrl.sources?.avif).toBe('https://test.com/image.avif');
      expect(fullUrl.sources?.webp).toBe('https://test.com/image.webp');
      expect(fullUrl.sources?.original).toBe('https://test.com/image.jpg');
    });

    it('should make sources optional', () => {
      const urlWithoutSources: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
        srcSet: 'https://test.com/image-400.jpg 400w',
      };

      expect(urlWithoutSources.sources).toBeUndefined();
    });

    it('should make srcSet optional', () => {
      const urlWithoutSrcSet: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
        sources: {
          webp: 'https://test.com/image.webp',
        },
      };

      expect(urlWithoutSrcSet.srcSet).toBeUndefined();
    });
  });

  describe('Generic and utility types', () => {
    it('should work correctly with Pick and Omit', () => {
      // Check type with src excluded from SnapkitImageProps
      type PicturePropsWithoutSrc = Omit<SnapkitImageProps, 'src'>;

      const propsWithoutSrc: PicturePropsWithoutSrc = {
        alt: 'Test',
        width: 800,
        organizationName: 'test-org',
      };

      expect(propsWithoutSrc.alt).toBe('Test');
      expect(propsWithoutSrc.width).toBe(800);

      // Select only specific properties from ImageTransforms
      type SizeTransforms = Pick<ImageTransforms, 'width' | 'height' | 'fit'>;

      const sizeTransforms: SizeTransforms = {
        width: 800,
        height: 600,
        fit: 'cover',
      };

      expect(sizeTransforms.width).toBe(800);
      expect(sizeTransforms.height).toBe(600);
      expect(sizeTransforms.fit).toBe('cover');
    });
  });
});
