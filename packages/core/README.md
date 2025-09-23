# @snapkit-studio/core

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/core.svg)](https://www.npmjs.com/package/@snapkit-studio/core)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/core.svg)](https://www.npmjs.com/package/@snapkit-studio/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Unified image optimization engine for Snapkit Studio. This package provides the core **SnapkitImageEngine** that powers both React and Next.js packages, offering consistent image optimization across all frameworks with URL building, format detection, responsive utilities, and advanced transformations.

## Installation

```bash
npm install @snapkit-studio/core
# or
yarn add @snapkit-studio/core
# or
pnpm add @snapkit-studio/core
```

## Features

- **URL Builder** - Construct optimized image URLs with transformations
- **Format Detection** - Detect browser support for AVIF, WebP, and other formats
- **Responsive Utilities** - Calculate optimal sizes and generate responsive configurations
- **Transform Builder** - Type-safe image transformation parameter building
- **Browser Compatibility** - Cross-browser compatibility utilities
- **TypeScript Support** - Full type definitions included

## Quick Start

### URL Builder

```typescript
import { SnapkitUrlBuilder } from '@snapkit-studio/core';

const urlBuilder = new SnapkitUrlBuilder({
  baseUrl: 'https://snapkit-cdn.snapkit.studio',
  organizationName: 'my-org',
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
    grayscale: true,
  })
  .build();
```

### Format Detection

```typescript
import {
  estimateFormatSupportFromUA,
  getBestSupportedFormat,
  preloadFormatSupport,
  supportsImageFormat,
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

### Responsive Utilities

```typescript
import {
  adjustQualityForConnection,
  calculateOptimalImageSize,
  generateResponsiveWidths,
} from '@snapkit-studio/core';

// Generate responsive width array
const widths = generateResponsiveWidths(1200, { steps: 5, minWidth: 300 });
// Result: [300, 450, 600, 900, 1200]

// Calculate optimal size for container
const optimalSize = calculateOptimalImageSize(
  { width: 800, height: 600 },
  { maxWidth: 1200, pixelDensity: 2 },
);

// Adjust quality based on connection
const adjustedQuality = adjustQualityForConnection(85, {
  effectiveType: '3g',
  saveData: false,
});
```

### Transform Builder

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

## Core Types

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

// Network information
interface NetworkInfo {
  effectiveType?: '2g' | '3g' | '4g';
  saveData?: boolean;
  downlink?: number;
}
```

## Browser Compatibility

The core package includes utilities for handling browser compatibility:

```typescript
import {
  detectBrowserFeatures,
  getCompatibilityLayer,
  isModernBrowser,
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
  downlink: connection?.downlink,
});

// Quality reductions:
// - 4G/WiFi: No reduction (85%)
// - 3G: 20% reduction (68%)
// - 2G/Slow: 40% reduction (51%)
// - Data Saver: 30% reduction (60%)
```

## Testing

The package includes comprehensive test coverage with automatic coverage reporting:

```bash
# Run tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm test -- --watch
```

### Test Coverage

The package maintains high test coverage standards:

- **Coverage Threshold**: 80% minimum for branches, functions, lines, and statements
- **Test Framework**: Vitest with v8 coverage provider
- **Coverage Reports**: Text (console), JSON, HTML, and LCOV formats
- **Coverage Exclusions**: Configuration files, type definitions, and test utilities

Coverage reports are generated in multiple formats:

- **Text**: Console output during test runs
- **HTML**: Detailed coverage report in `coverage/` directory
- **LCOV**: For CI/CD integration and coverage tools
- **JSON**: Machine-readable coverage data

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

## Contributing

See the main [repository README](../../README.md) for contribution guidelines.

## License

MIT
