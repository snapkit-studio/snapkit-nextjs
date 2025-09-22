# @snapkit-studio/react

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/react.svg)](https://www.npmjs.com/package/@snapkit-studio/react)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/react.svg)](https://www.npmjs.com/package/@snapkit-studio/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

React components and hooks for Snapkit Studio image optimization. This package provides high-performance React image components with automatic format optimization, responsive loading, and Next.js-compatible APIs.

## Installation

```bash
npm install @snapkit-studio/react
# or
yarn add @snapkit-studio/react
# or
pnpm add @snapkit-studio/react
```

## Features

- **React Image Component** - Drop-in replacement for HTML img with optimization
- **Provider-less Architecture** - Direct component usage without wrappers
- **Next.js Compatible** - Same API as Next.js Image component
- **Automatic Format Detection** - AVIF, WebP, JPEG fallback
- **Responsive Images** - Automatic srcset generation
- **DPR-based Optimization** - Crisp images on high-DPI displays
- **Lazy Loading** - Intersection Observer based
- **Network-aware Quality** - Automatic adjustment based on connection
- **TypeScript Support** - Full type definitions included

## 🎯 Optimized Import Methods

### Option 1: Selective Imports (Recommended for Bundle Size)

Import only what you need for optimal bundle size:

```typescript
// Image component only (~9 KB)

// Specific hooks only (~8 KB)
import {
  useImageLazyLoading,
  useImageOptimization,
} from '@snapkit-studio/react/hooks';
import { Image } from '@snapkit-studio/react/image';
// Utility functions only (~5 KB)
import {
  createImageStyle,
  mergeConfiguration,
} from '@snapkit-studio/react/utils';
```

### Option 2: Full Bundle Import

Import everything from the main bundle (larger bundle size):

```typescript
import { Image, SnapkitProvider, useImageRefresh } from '@snapkit-studio/react';
```

### Bundle Size Comparison

| Import Method                 | Bundle Size | Use Case               |
| ----------------------------- | ----------- | ---------------------- |
| `@snapkit-studio/react/image` | ~9 KB       | Image component only   |
| `@snapkit-studio/react/hooks` | ~8 KB       | Custom implementations |
| `@snapkit-studio/react/utils` | ~5 KB       | Utility functions      |
| `@snapkit-studio/react`       | ~22 KB      | Full bundle            |

## Quick Start

### 1. Environment Setup

```bash
# .env (Vite/CRA) - All available environment variables
VITE_SNAPKIT_ORGANIZATION_NAME=your-organization-name  # Required
VITE_SNAPKIT_DEFAULT_QUALITY=85                       # Optional (default: 85)
VITE_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto             # Optional (default: auto)
```

### 2. Basic Image Usage (Provider-less)

```tsx
import { Image } from '@snapkit-studio/react/image';

function MyComponent() {
  return (
    <Image
      src="/project/hero.jpg"
      alt="Hero Image"
      width={800}
      height={600}
      priority
      transforms={{ format: 'auto' }}
    />
  );
}
```

## API Reference

### Image Component

The main image component with automatic optimization and responsive features.

```tsx
import { Image } from '@snapkit-studio/react';

<Image
  src="/path/to/image.jpg"
  alt="Image description"
  width={800}
  height={600}
  // Core props
  quality={90}
  priority={true}
  sizes="(max-width: 768px) 100vw, 50vw"
  // Snapkit features
  organizationName="your-org"
  baseUrl="https://your-cdn.com"
  optimizeFormat="auto" // auto | avif | webp | off
  transforms={{
    blur: 20,
    grayscale: true,
    fit: 'cover',
  }}
  // Event handlers
  onLoad={() => console.log('Loaded')}
  onError={() => console.log('Error')}
/>;
```

#### Props

| Prop               | Type                                  | Default  | Description                  |
| ------------------ | ------------------------------------- | -------- | ---------------------------- |
| `src`              | `string`                              | -        | Image path (required)        |
| `alt`              | `string`                              | -        | Alt text (required)          |
| `width`            | `number`                              | -        | Image width                  |
| `height`           | `number`                              | -        | Image height                 |
| `fill`             | `boolean`                             | `false`  | Fill parent container        |
| `sizes`            | `string`                              | -        | Responsive size settings     |
| `quality`          | `number`                              | `85`     | Image quality (1-100)        |
| `priority`         | `boolean`                             | `false`  | Priority loading             |
| `loading`          | `'lazy' \| 'eager'`                   | `'lazy'` | Loading method               |
| `optimizeFormat`   | `'auto' \| 'avif' \| 'webp' \| 'off'` | `'auto'` | Format optimization          |
| `transforms`       | `ImageTransforms`                     | `{}`     | Image transformation options |
| `organizationName` | `string`                              | -        | Override organization name   |
| `baseUrl`          | `string`                              | -        | Override base URL            |

### Environment Configuration

Configuration through environment variables (recommended for most use cases).

```bash
# .env (Vite/CRA) - All available variables
VITE_SNAPKIT_ORGANIZATION_NAME=your-organization-name  # Required
VITE_SNAPKIT_DEFAULT_QUALITY=85                       # Optional (1-100, default: 85)
VITE_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto             # Optional (auto|avif|webp|off, default: auto)

# .env.local (Next.js) - If using React package in Next.js
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name
NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY=85
NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto
```

#### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_SNAPKIT_ORGANIZATION_NAME` | Yes | - | Your Snapkit organization identifier |
| `VITE_SNAPKIT_DEFAULT_QUALITY` | No | `85` | Default image quality (1-100) |
| `VITE_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT` | No | `auto` | Format optimization strategy |

**Format Options:**
- `auto`: Automatically select best format based on browser support
- `avif`: Use AVIF format if supported, fallback to WebP/JPEG
- `webp`: Use WebP format if supported, fallback to JPEG
- `off`: Disable format optimization

### Component Props Override

Override environment settings on individual components when needed.

```tsx
import { Image } from '@snapkit-studio/react/image';

function MyComponent() {
  return (
    <Image
      src="/special-image.jpg"
      alt="Special image"
      width={800}
      height={600}
      organizationName="custom-org"  // Override env var
      quality={95}                   // Override default quality
      transforms={{ format: 'avif' }} // Override default format
    />
  );
}
```

## Image Optimization Features

### Automatic Format Detection

The Image component automatically selects the best format based on browser support:

```tsx
// Automatically serves AVIF, WebP, or JPEG based on browser
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  optimizeFormat="auto"
/>

// Force specific format
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  optimizeFormat="webp"
/>

// Disable optimization for special cases
<Image
  src="/animation.gif"
  alt="Animation"
  width={300}
  height={200}
  optimizeFormat="off"
/>
```

### Responsive Images

Generate responsive images with automatic srcset:

```tsx
// DPR-based srcset (1x, 2x, 3x) - default behavior
<Image
  src="/image.jpg"
  alt="High-DPI optimized"
  width={800}
  height={600}
/>

// Width-based srcset for responsive layouts
<Image
  src="/banner.jpg"
  alt="Responsive banner"
  width={1200}
  height={400}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
/>

// Fill mode for container-based sizing
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/background.jpg"
    alt="Background"
    fill={true}
    className="object-cover"
  />
</div>
```

### Image Transformations

Apply various transformations to images:

```tsx
// Basic transformations
<Image
  src="/photo.jpg"
  alt="Transformed"
  width={400}
  height={400}
  transforms={{
    fit: "cover",      // contain | cover | fill | inside | outside
    quality: 90,       // Override quality
    blur: 20,          // Blur effect
    grayscale: true,   // Convert to grayscale
    flip: true,        // Flip vertically
    flop: true,        // Flip horizontally
  }}
/>

// Extract/crop region
<Image
  src="/large-image.jpg"
  alt="Cropped section"
  width={300}
  height={200}
  transforms={{
    extract: {
      x: 100,
      y: 100,
      width: 300,
      height: 200,
    },
  }}
/>

// Complex transformations
<Image
  src="/original.jpg"
  alt="Complex transformation"
  width={600}
  height={400}
  transforms={{
    fit: "cover",
    blur: 10,
    grayscale: true,
    extract: { x: 50, y: 50, width: 400, height: 300 },
  }}
/>
```

### Loading

Control loading behavior:

```tsx
// Priority loading for above-the-fold images
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority={true}
/>

// Lazy loading (default)
<Image
  src="/content.jpg"
  alt="Content image"
  width={400}
  height={300}
  loading="lazy"
/>

// Eager loading
<Image
  src="/important.jpg"
  alt="Important image"
  width={600}
  height={400}
  loading="eager"
/>
```

## Advanced Usage

### Custom Configuration per Component

Override global configuration for specific images:

```tsx
function ProductGallery() {
  return (
    <div>
      {/* High quality for product images */}
      <Image
        src="/product-main.jpg"
        alt="Main product"
        width={800}
        height={800}
        quality={95}
        organizationName="product-cdn"
        baseUrl="https://products.example.com"
      />

      {/* Lower quality for thumbnails */}
      <Image
        src="/product-thumb.jpg"
        alt="Thumbnail"
        width={150}
        height={150}
        quality={70}
      />
    </div>
  );
}
```

### Event Handling

Handle loading and error events:

```tsx
function ImageWithEvents() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {hasError && <div>Failed to load image</div>}

      <Image
        src="/photo.jpg"
        alt="Photo"
        width={600}
        height={400}
        onLoad={() => {
          setIsLoading(false);
          console.log('Image loaded successfully');
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          console.log('Failed to load image');
        }}
      />
    </div>
  );
}
```

### Performance Optimization

```tsx
// Optimize for different use cases
function OptimizedGallery() {
  return (
    <div>
      {/* Hero image - high priority */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        priority={true}
        quality={90}
        sizes="100vw"
      />

      {/* Grid thumbnails - optimized for size */}
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={300}
          height={300}
          quality={75}
          transforms={{ fit: 'cover' }}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ))}
    </div>
  );
}
```

## Network Optimization

The Image component automatically adjusts quality based on network conditions:

- **4G/WiFi**: Original quality (85%)
- **3G**: 20% quality reduction (68%)
- **2G/Slow**: 40% quality reduction (51%)
- **Data Saver Mode**: 30% quality reduction (60%)

```tsx
// Quality is automatically adjusted based on user's connection
<Image
  src="/photo.jpg"
  alt="Network-optimized photo"
  width={800}
  height={600}
  quality={85} // Base quality - will be adjusted automatically
/>
```

## Type Definitions

### Core Types

```typescript
// Image component props
interface SnapkitImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  optimizeFormat?: 'auto' | 'avif' | 'webp' | 'off';
  transforms?: ImageTransforms;
  organizationName?: string;
  baseUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
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

// Provider configuration
interface SnapkitConfig {
  baseUrl?: string;
  organizationName?: string;
  defaultQuality?: number;
  defaultFormat?: 'auto' | 'avif' | 'webp';
}

// Image formats
type ImageFormat = 'auto' | 'avif' | 'webp' | 'jpeg' | 'png' | 'gif';
```

## Migration from Next.js Image

The Snapkit Image component is designed to be a drop-in replacement for Next.js Image:

```tsx
// Before (Next.js Image)
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={90}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// After (Snapkit Image)
import { Image } from '@snapkit-studio/react';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={90}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
  // Additional Snapkit features
  transforms={{ fit: "cover" }}
  optimizeFormat="auto"
/>
```

## Browser Support

- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+
- **Lazy Loading**: Chrome 76+, Firefox 75+, Safari 15.4+
- **Intersection Observer**: Chrome 58+, Firefox 55+, Safari 12.1+

Automatically falls back to JPEG/PNG in older browsers.

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

### Basic Gallery

```tsx
import { Image } from '@snapkit-studio/react/image';

// .env: VITE_SNAPKIT_ORGANIZATION_NAME=gallery-app
function Gallery() {
  const images = [
    { id: 1, src: '/gallery/1.jpg', alt: 'Photo 1' },
    { id: 2, src: '/gallery/2.jpg', alt: 'Photo 2' },
    { id: 3, src: '/gallery/3.jpg', alt: 'Photo 3' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={400}
          height={300}
          transforms={{ fit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ))}
    </div>
  );
}
```

### Responsive Hero Section

```tsx
function HeroSection() {
  return (
    <div className="relative h-screen">
      <Image
        src="/hero-background.jpg"
        alt="Hero background"
        fill={true}
        priority={true}
        quality={90}
        transforms={{ fit: 'cover' }}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Welcome</h1>
      </div>
    </div>
  );
}
```

### Product Showcase

```tsx
function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill={true}
          transforms={{
            fit: 'cover',
            quality: 85,
          }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
    </div>
  );
}
```

## Contributing

See the main [repository README](../../README.md) for contribution guidelines.

## 🤖 AI Integration Prompts

Copy-paste these prompts for AI coding assistants (Copilot, Cursor, Claude):

### Basic Setup - No Provider Required
```
Add Snapkit image optimization to React component.
Import from @snapkit-studio/react/image for 9KB bundle.
No Provider needed - direct component usage.
Set VITE_SNAPKIT_ORGANIZATION_NAME=your-org in .env
or pass organizationName prop to each Image.
<Image src="/photo.jpg" alt="Photo" width={800} height={600} />
```

### Vite Environment Setup
```
Configure Snapkit for Vite React app:
1. npm install @snapkit-studio/react
2. Create .env: VITE_SNAPKIT_ORGANIZATION_NAME=your-org
3. Optional: VITE_SNAPKIT_DEFAULT_QUALITY=85
4. Import: import { Image } from '@snapkit-studio/react/image'
No Provider or wrapper components needed.
```

### Responsive Gallery - Provider-less
```
Build image gallery with @snapkit-studio/react/image:
import { Image } from '@snapkit-studio/react/image';
// No Provider wrapper needed
{images.map(img => (
  <Image
    key={img.id}
    src={img.src}
    alt={img.alt}
    width={400}
    height={300}
    transforms={{ fit: 'cover' }}
    sizes="(max-width: 768px) 100vw, 33vw"
  />
))}
```

### E-commerce Product Images
```
Product gallery without Provider setup:
import { Image } from '@snapkit-studio/react/image';
Main: <Image src={mainImg} priority width={800} height={800} />
Thumbs: <Image src={thumb} width={100} height={100} transforms={{ fit: 'cover' }} />
Each Image works independently - no context needed.
Pass organizationName or use VITE env var.
```

### Blog Images with Optimization
```
Optimize blog images - no Provider required:
import { Image } from '@snapkit-studio/react/image';
<Image
  src="/blog/hero.jpg"
  alt="Article"
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, 768px"
  quality={75}
  transforms={{ format: 'auto' }}
/>
Works standalone without SnapkitProvider.
```

### Migration: Provider to Provider-less
```
Migrate from SnapkitProvider to direct usage:
// OLD with Provider
import { SnapkitProvider, Image } from '@snapkit-studio/react';
<SnapkitProvider organizationName="org">
  <Image src="/img.jpg" />
</SnapkitProvider>

// NEW without Provider (9KB smaller)
import { Image } from '@snapkit-studio/react/image';
<Image src="/img.jpg" organizationName="org" />
// Or use env: VITE_SNAPKIT_ORGANIZATION_NAME
```

## License

MIT
