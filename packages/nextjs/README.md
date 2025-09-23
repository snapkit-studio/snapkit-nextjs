# @snapkit-studio/nextjs

Next.js image loader and React component for Snapkit image optimization service.

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Features

- 🖼️ **Next.js Image Integration**: Seamless integration with Next.js Image component
- ⚡ **Automatic Optimization**: Dynamic image transformation with DPR-based srcset
- 🎯 **Flexible Configuration**: Global and per-component configuration options
- 📱 **Format Auto-Selection**: Intelligent format selection (WebP, AVIF, etc.)
- 🚀 **Server Components Support**: Automatic server/client component selection
- 🔧 **TypeScript Support**: Full TypeScript definitions included
- 🧪 **Well Tested**: 90%+ test coverage with comprehensive edge case handling
- 🛡️ **Memory Leak Prevention**: Advanced cleanup logic for IntersectionObserver and resources
- 📦 **Picture Element Support**: Server-side rendering with optimized srcSet generation

## Installation

```bash
npm install @snapkit-studio/nextjs
# or
yarn add @snapkit-studio/nextjs
# or
pnpm add @snapkit-studio/nextjs
```

## Quick Start

### 1. Environment Configuration

```bash
# .env.local (Required and Optional variables)
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name  # Required
NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY=85                       # Optional (default: 85)
NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto             # Optional (default: auto)
```

### 2. Use with Next.js Image Component

```typescript
// app/components/MyComponent.tsx
import { Image } from '@snapkit-studio/nextjs';

export function Hero() {
  return (
    <Image
      src="/hero-image.jpg"
      width={1200}
      height={600}
      alt="Hero image"
      transforms={{
        format: 'auto',
        quality: 85
      }}
    />
  );
}
```

## Usage Patterns

### Pattern 1: Environment Variables (Recommended)

Best for most applications where you want consistent optimization across all images.

```bash
# .env.local - All available environment variables
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name  # Required
NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY=85                       # Optional (1-100, default: 85)
NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto             # Optional (auto|avif|webp|off, default: auto)
```

**Environment Variables Reference:**

- `NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME`: Your Snapkit organization identifier (required)
- `NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY`: Global quality setting for all images (1-100)
- `NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT`: Default format optimization strategy
  - `auto`: Automatically select best format based on browser support
  - `avif`: Use AVIF format if supported
  - `webp`: Use WebP format if supported
  - `off`: Disable format optimization

```typescript
// Use anywhere in your app - no setup required
import { Image } from '@snapkit-studio/nextjs';

<Image src="/photo.jpg" width={800} height={600} alt="Photo" />
```

### Pattern 2: Direct Props (Advanced)

Use when you need different optimization settings for specific image components.

```typescript
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/high-quality-photo.jpg"
  width={1920}
  height={1080}
  alt="High quality photo"
  organizationName="custom-org"
  transforms={{
    format: 'avif',
    quality: 90
  }}
/>
```

### Pattern 3: Direct Loader Usage

For maximum control or integration with custom image components.

```typescript
import { snapkitLoader } from '@snapkit-studio/nextjs';

// Get optimized URL directly
const optimizedUrl = snapkitLoader({
  src: '/my-image.jpg',
  width: 800,
  quality: 85,
});

console.log(optimizedUrl);
// Output: "https://your-org-name.snapkit.studio/transform/w_800,q_85,f_auto/my-image.jpg"
```

## Image Transforms

```typescript
interface ImageTransforms {
  /** Output format: 'auto', 'webp', 'avif', 'jpeg', 'png' */
  format?: string;

  /** Image quality: 1-100 */
  quality?: number;

  /** Image width in pixels */
  width?: number;

  /** Image height in pixels */
  height?: number;

  /** Blur radius: 0-100 */
  blur?: number;

  /** Additional transforms... */
  [key: string]: any;
}
```

## Server Components Support

The Next.js package now includes automatic server/client component selection for optimal performance:

### Automatic Component Selection

```typescript
import { Image } from '@snapkit-studio/nextjs';

// Automatically renders as a server component (no client JS)
<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero image"
/>

// Automatically switches to client component (has onLoad handler)
<Image
  src="/interactive.jpg"
  width={800}
  height={400}
  alt="Interactive image"
  onLoad={() => console.log('Loaded!')}
/>
```

### Component Selection Logic

| Props                    | Renders As    | Reason                                            |
| ------------------------ | ------------- | ------------------------------------------------- |
| Basic props only         | `ServerImage` | Default, best performance with server-side srcSet |
| `onLoad`, `onError`      | `ClientImage` | Event handlers need browser                       |
| `adjustQualityByNetwork` | `ClientImage` | Network detection needs browser                   |
| `dprOptions`             | `ClientImage` | Custom DPR detection needs browser                |
| `optimize="server"`      | `ServerImage` | Explicitly forced server rendering                |
| `optimize="client"`      | `ClientImage` | Explicitly forced client rendering                |

### Explicit Control

```typescript
// Force server rendering
<Image
  src="/static.jpg"
  optimize="server"
  alt="Always server rendered"
/>

// Force client rendering
<Image
  src="/dynamic.jpg"
  optimize="client"
  alt="Always client rendered"
/>
```

### Advanced Usage

For cases where you need direct access to specific components:

```typescript
import { ServerImage, ClientImage } from '@snapkit-studio/nextjs';

// Use ServerImage directly (no 'use client' needed)
export default function ServerComponent() {
  return <ServerImage src="/image.jpg" width={800} height={600} alt="Server" />;
}

// Use ClientImage in client components
'use client';
export default function ClientComponent() {
  return <ClientImage src="/image.jpg" width={800} height={600} alt="Client" />;
}
```

## Advanced Configuration

### Custom Organization Name

```typescript
// Override environment variable per component
import { Image } from '@snapkit-studio/nextjs';

export function Gallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          width={400}
          height={300}
          alt={`Gallery image ${index + 1}`}
          organizationName="custom-org"
          transforms={{ format: 'auto', quality: 80 }}
        />
      ))}
    </div>
  );
}
```

### Advanced Transforms

```typescript
<Image
  src="/portrait.jpg"
  width={600}
  height={800}
  alt="Portrait"
  transforms={{
    format: 'webp',
    quality: 85,
    blur: 2,                    // Slight blur effect
  }}
/>
```

## Next.js Configuration

### next.config.js Setup

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Snapkit domains
    domains: ['your-org-name.snapkit.studio'],

    // Use custom loader globally (optional)
    loader: 'custom',
    loaderFile: './snapkit-loader.js',
  },
};

module.exports = nextConfig;
```

### Custom Loader File (snapkit-loader.js)

```javascript
// snapkit-loader.js
import { snapkitLoader } from '@snapkit-studio/nextjs';

export default snapkitLoader;
```

## Live Demo

Experience all features in action with our interactive demo:

**[🚀 Live Demo →](https://nextjs.snapkit.studio)** - Real-time examples with source code

Explore features including:

- Server/Client component automatic selection
- DPR optimization with srcSet generation
- Image transformations with live preview
- Picture element server-side rendering
- All optimization features and configurations

## Migration Guide

### From Next.js Built-in Optimization

```typescript
// Before: Next.js built-in
<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Image"
/>

// After: Snapkit optimization
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Image"
  transforms={{ format: 'webp', quality: 85 }}
/>
```

### From Other Image Services

```typescript
// Before: Cloudinary
<Image
  src="https://res.cloudinary.com/demo/image/upload/w_800,q_85/sample.jpg"
  width={800}
  height={600}
/>

// After: Snapkit
<Image
  src="/sample.jpg"
  width={800}
  height={600}
  transforms={{ width: 800, quality: 85 }}
/>
```

## API Reference

### Functions

#### `snapkitLoader(params: ImageLoaderParams): string`

Default image loader using global configuration.

**Parameters:**

- `src`: Image source path
- `width`: Target width in pixels
- `quality`: Image quality (1-100)

**Returns:** Optimized image URL

#### `createSnapkitLoader(): ImageLoader`

Create a custom image loader with specific configuration.

**Returns:** Image loader function

### Components

#### `<Image />`

React component wrapper around Next.js Image with Snapkit optimization.

**Props:** All Next.js Image props plus:

- `transforms?: ImageTransforms` - Image transformations to apply

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
- **Test Framework**: Vitest with jsdom environment and v8 coverage provider
- **Coverage Reports**: Text (console), JSON, HTML, and LCOV formats
- **Coverage Exclusions**: Test setup files, configuration files, type definitions, and test utilities

Coverage reports are generated in multiple formats:

- **Text**: Console output during test runs
- **HTML**: Detailed coverage report in `coverage/` directory
- **LCOV**: For CI/CD integration and coverage tools
- **JSON**: Machine-readable coverage data

### Test Environment

Tests run in a jsdom environment to simulate browser behavior for React Server Components and Client Components testing.

## Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md) for details on our code of conduct and development process.

## License

MIT © [Snapkit](https://snapkit.studio)
