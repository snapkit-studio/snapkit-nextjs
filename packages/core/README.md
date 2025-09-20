# @snapkit-studio/core

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/core.svg)](https://www.npmjs.com/package/@snapkit-studio/core)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/core.svg)](https://www.npmjs.com/package/@snapkit-studio/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Core utilities and types for Snapkit Studio image optimization. This package provides the fundamental building blocks used by other Snapkit packages including URL building, format detection, responsive utilities, and image transformation capabilities.

## Installation

```bash
npm install @snapkit-studio/core
# or
yarn add @snapkit-studio/core
# or
pnpm add @snapkit-studio/core
```

## Features

✅ **URL Builder** - Construct optimized image URLs with transformations
✅ **Format Detection** - Detect browser support for AVIF, WebP, and other formats
✅ **Responsive Utilities** - Calculate optimal sizes and generate responsive configurations
✅ **Transform Builder** - Type-safe image transformation parameter building
✅ **Browser Compatibility** - Cross-browser compatibility utilities
✅ **TypeScript Support** - Full type definitions included

## API Reference

### URL Builder

The `SnapkitUrlBuilder` class provides a fluent API for constructing optimized image URLs.

```typescript
import { SnapkitUrlBuilder } from '@snapkit-studio/core';

const urlBuilder = new SnapkitUrlBuilder({
  baseUrl: 'https://snapkit-cdn.snapkit.studio',
  organizationName: 'my-org'
});

// Basic usage
const imageUrl = urlBuilder
  .setSource('/project/image.jpg')
  .setDimensions(800, 600)
  .setQuality(85)
  .setFormat('webp')
  .build();

// With transformations
const transformedUrl = urlBuilder
  .setSource('/project/image.jpg')
  .setDimensions(400, 400)
  .setTransforms({
    fit: 'cover',
    blur: 20,
    grayscale: true
  })
  .build();
```

#### SnapkitUrlBuilder Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `setSource(src)` | Set the source image path | `src: string` |
| `setDimensions(width, height)` | Set image dimensions | `width: number, height?: number` |
| `setQuality(quality)` | Set image quality (1-100) | `quality: number` |
| `setFormat(format)` | Set output format | `format: 'auto' \| 'avif' \| 'webp' \| 'jpeg' \| 'png'` |
| `setTransforms(transforms)` | Set image transformations | `transforms: ImageTransforms` |
| `build()` | Build the final URL | Returns: `string` |
| `reset()` | Reset builder to initial state | Returns: `SnapkitUrlBuilder` |

### Format Detection

Utilities for detecting and managing image format support across browsers.

```typescript
import {
  supportsImageFormat,
  getBestSupportedFormat,
  estimateFormatSupportFromUA,
  preloadFormatSupport
} from '@snapkit-studio/core';

// Check format support
const supportsAVIF = supportsImageFormat('avif');
const supportsWebP = supportsImageFormat('webp');

// Get best format for browser
const bestFormat = getBestSupportedFormat(['avif', 'webp', 'jpeg']);

// Server-side format detection
const serverSupport = estimateFormatSupportFromUA(userAgent);

// Preload format detection (runs tests in background)
preloadFormatSupport();
```

#### Format Detection Functions

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `supportsImageFormat(format)` | Check if browser supports format | `format: string` | `boolean` |
| `getBestSupportedFormat(formats)` | Get best supported format from array | `formats: string[]` | `string` |
| `estimateFormatSupportFromUA(ua)` | Estimate support from user agent | `ua: string` | `{avif: boolean, webp: boolean}` |
| `getSupportedFormatsFromAcceptHeader(accept)` | Parse Accept header for formats | `accept: string` | `string[]` |
| `preloadFormatSupport()` | Preload format detection tests | None | `Promise<void>` |

### Responsive Utilities

Calculate optimal image sizes and generate responsive configurations.

```typescript
import {
  generateResponsiveWidths,
  calculateOptimalImageSize,
  adjustQualityForConnection,
  createLazyLoadObserver,
  parseImageSizes
} from '@snapkit-studio/core';

// Generate responsive width array
const widths = generateResponsiveWidths(1200, { steps: 5, minWidth: 300 });
// Result: [300, 450, 600, 900, 1200]

// Calculate optimal size for container
const optimalSize = calculateOptimalImageSize(
  { width: 800, height: 600 },
  { maxWidth: 1200, pixelDensity: 2 }
);

// Adjust quality based on connection
const adjustedQuality = adjustQualityForConnection(85, {
  effectiveType: '3g',
  saveData: false
});

// Create intersection observer for lazy loading
const observer = createLazyLoadObserver({
  threshold: 0.1,
  rootMargin: '50px'
}, (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load image
    }
  });
});

// Parse CSS sizes attribute
const parsedSizes = parseImageSizes('(max-width: 768px) 100vw, 50vw');
```

#### Responsive Utility Functions

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `generateResponsiveWidths(maxWidth, options)` | Generate array of responsive widths | `maxWidth: number, options?: ResponsiveOptions` | `number[]` |
| `calculateOptimalImageSize(dimensions, constraints)` | Calculate optimal image size | `dimensions: Size, constraints: SizeConstraints` | `Size` |
| `adjustQualityForConnection(quality, connection)` | Adjust quality for network conditions | `quality: number, connection: NetworkInfo` | `number` |
| `determineImagePriority(element, options)` | Determine if image should be prioritized | `element: Element, options?: PriorityOptions` | `boolean` |
| `getDeviceCharacteristics()` | Get device pixel ratio and viewport | None | `DeviceInfo` |
| `parseImageSizes(sizes)` | Parse CSS sizes attribute | `sizes: string` | `ParsedSizes[]` |

### Transform Builder

Type-safe builder for image transformation parameters.

```typescript
import { SnapkitTransformBuilder } from '@snapkit-studio/core';

const transforms = new SnapkitTransformBuilder()
  .resize(800, 600, 'cover')
  .quality(85)
  .blur(20)
  .grayscale()
  .flip()
  .extract(100, 100, 300, 200)
  .build();

// Use with URL builder
const url = urlBuilder
  .setSource('/image.jpg')
  .setTransforms(transforms)
  .build();
```

#### Transform Builder Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `resize(width, height, fit)` | Set resize parameters | `width: number, height?: number, fit?: FitMode` |
| `quality(value)` | Set quality (1-100) | `value: number` |
| `format(value)` | Set output format | `value: ImageFormat` |
| `blur(radius)` | Apply blur effect | `radius: number` |
| `grayscale(enable)` | Convert to grayscale | `enable?: boolean` |
| `flip(enable)` | Flip vertically | `enable?: boolean` |
| `flop(enable)` | Flip horizontally | `enable?: boolean` |
| `extract(x, y, width, height)` | Extract region | `x: number, y: number, width: number, height: number` |
| `build()` | Build transform object | Returns: `ImageTransforms` |
| `reset()` | Reset to initial state | Returns: `SnapkitTransformBuilder` |

## Type Definitions

### Core Types

```typescript
// Configuration
interface SnapkitConfig {
  baseUrl: string;
  organizationName: string;
  defaultQuality?: number;
  defaultFormat?: ImageFormat;
}

// Image transformations
interface ImageTransforms {
  width?: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  blur?: number;
  grayscale?: boolean;
  flip?: boolean;
  flop?: boolean;
  extract?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Image formats
type ImageFormat = 'auto' | 'avif' | 'webp' | 'jpeg' | 'png' | 'gif';

// Responsive configuration
interface ResponsiveConfig {
  breakpoints?: number[];
  densities?: number[];
  sizes?: string;
}

// Network information
interface NetworkInfo {
  effectiveType?: '2g' | '3g' | '4g';
  saveData?: boolean;
  downlink?: number;
}
```

### Component Props

```typescript
// Base image props
interface SnapkitImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  optimizeFormat?: ImageFormat;
  transforms?: ImageTransforms;
  organizationName?: string;
  baseUrl?: string;
}

// Next.js compatible props
interface NextImageProps extends SnapkitImageProps {
  fill?: boolean;
  sizes?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}
```

## Browser Compatibility

The core package includes utilities for handling browser compatibility:

```typescript
import {
  detectBrowserFeatures,
  getCompatibilityLayer,
  isModernBrowser
} from '@snapkit-studio/core';

// Detect browser capabilities
const features = detectBrowserFeatures();
// Returns: { avif: boolean, webp: boolean, lazyLoading: boolean, ... }

// Check if modern browser
const isModern = isModernBrowser();

// Get compatibility shims
const compat = getCompatibilityLayer();
```

## Network Optimization

Automatic quality adjustment based on network conditions:

```typescript
import { adjustQualityForConnection } from '@snapkit-studio/core';

// Adjust quality based on connection
const baseQuality = 85;
const connection = navigator.connection;

const optimizedQuality = adjustQualityForConnection(baseQuality, {
  effectiveType: connection?.effectiveType,
  saveData: connection?.saveData,
  downlink: connection?.downlink
});

// Quality reductions:
// - 4G/WiFi: No reduction (85%)
// - 3G: 20% reduction (68%)
// - 2G/Slow: 40% reduction (51%)
// - Data Saver: 30% reduction (60%)
```

## Testing

The package includes comprehensive test coverage:

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run check-types

# Linting
npm run lint
```

## Examples

### Basic URL Building

```typescript
import { SnapkitUrlBuilder } from '@snapkit-studio/core';

const builder = new SnapkitUrlBuilder({
  baseUrl: 'https://cdn.snapkit.com',
  organizationName: 'my-org'
});

// Simple resize
const url1 = builder
  .setSource('/images/hero.jpg')
  .setDimensions(800, 600)
  .build();

// With quality and format
const url2 = builder
  .setSource('/images/photo.jpg')
  .setDimensions(400, 300)
  .setQuality(90)
  .setFormat('webp')
  .build();

// Complex transformations
const url3 = builder
  .setSource('/images/original.jpg')
  .setDimensions(600, 400)
  .setTransforms({
    fit: 'cover',
    blur: 10,
    grayscale: true,
    extract: { x: 100, y: 50, width: 300, height: 200 }
  })
  .build();
```

### Progressive Format Detection

```typescript
import {
  preloadFormatSupport,
  getBestSupportedFormat,
  supportsImageFormat
} from '@snapkit-studio/core';

// Initialize format detection early
preloadFormatSupport();

// Later in your app
function getOptimalImageUrl(src: string) {
  const formats = ['avif', 'webp', 'jpeg'];
  const bestFormat = getBestSupportedFormat(formats);

  return urlBuilder
    .setSource(src)
    .setFormat(bestFormat)
    .build();
}

// Check specific format support
if (supportsImageFormat('avif')) {
  // Use AVIF
} else if (supportsImageFormat('webp')) {
  // Fallback to WebP
} else {
  // Use JPEG/PNG
}
```

### Responsive Image Configuration

```typescript
import {
  generateResponsiveWidths,
  calculateOptimalImageSize
} from '@snapkit-studio/core';

// Generate responsive breakpoints
const widths = generateResponsiveWidths(1200, {
  steps: 6,
  minWidth: 320,
  maxWidth: 1200
});
// Result: [320, 480, 640, 800, 1000, 1200]

// Calculate optimal size for container
const containerSize = { width: 800, height: 600 };
const optimal = calculateOptimalImageSize(containerSize, {
  maxWidth: 1920,
  pixelDensity: window.devicePixelRatio || 1,
  qualityBudget: 'high'
});

// Generate srcset
const srcset = widths
  .map(width => {
    const url = urlBuilder
      .setSource('/image.jpg')
      .setDimensions(width)
      .build();
    return `${url} ${width}w`;
  })
  .join(', ');
```

## Contributing

See the main [repository README](../../README.md) for contribution guidelines.

## License

MIT