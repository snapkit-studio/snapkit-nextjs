# @snapkit-studio/nextjs

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

[![English](https://img.shields.io/badge/docs-English-blue)](./README.md) [![한국어](https://img.shields.io/badge/docs-한국어-blue)](./README-ko.md)

A high-performance image optimization library for Next.js. Seamlessly integrates with Snapkit image proxy service to provide automatic format optimization, real-time image transformations, lazy loading, and more.

## Features

✅ **Automatic Format Optimization** - Auto-select AVIF, WebP, JPEG  
✅ **Real-time Image Transformations** - Resize, crop, filters, etc.  
✅ **Next.js Image Compatible** - Perfect compatibility with existing API  
✅ **Lazy Loading** - Intersection Observer based  
✅ **TypeScript Support** - Full type safety  
✅ **Responsive Images** - Automatic srcset, sizes generation  
✅ **Network Optimization** - Quality adjustment per connection speed

## Installation

```bash
npm install @snapkit-studio/nextjs
# or
yarn add @snapkit-studio/nextjs
# or
pnpm add @snapkit-studio/nextjs
```

## Quick Start

### 1. Provider Setup (Optional)

```tsx
// app/layout.tsx or _app.tsx
import { SnapkitProvider } from "@snapkit-studio/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SnapkitProvider
          baseUrl="https://image-proxy.snapkit.com"
          organizationName="your-org"
          defaultQuality={85}
          defaultFormat="auto"
        >
          {children}
        </SnapkitProvider>
      </body>
    </html>
  );
}
```

### 2. Basic Usage

```tsx
import { Image } from "@snapkit-studio/nextjs";

export default function MyComponent() {
  return (
    <Image
      src="/project/hero.jpg"
      alt="Hero Image"
      width={800}
      height={600}
      priority
    />
  );
}
```

## API Reference

### Image Component

Provides API compatible with Next.js `Image` component.

```tsx
import { Image } from "@snapkit-studio/nextjs";

<Image
  src="/path/to/image.jpg"
  alt="Image description"
  width={800}
  height={600}
  // Next.js Image compatible props
  quality={90}
  priority={true}
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 50vw"
  // Snapkit exclusive features
  organizationName="your-org"
  baseUrl="https://your-cdn.com"
  optimizeFormat="avif" // auto | avif | webp | off
  transforms={{
    blur: 20,
    grayscale: true,
    fit: "cover",
  }}
/>;
```

#### Props

| Prop             | Type                                  | Default   | Description                    |
| ---------------- | ------------------------------------- | --------- | ------------------------------ |
| `src`            | `string`                              | -         | Image path (required)          |
| `alt`            | `string`                              | -         | Alt text (required)            |
| `width`          | `number`                              | -         | Image width                    |
| `height`         | `number`                              | -         | Image height                   |
| `fill`           | `boolean`                             | `false`   | Fill parent container          |
| `sizes`          | `string`                              | -         | Responsive size settings       |
| `quality`        | `number`                              | `85`      | Image quality (1-100)          |
| `priority`       | `boolean`                             | `false`   | Priority loading               |
| `placeholder`    | `'blur' \| 'empty'`                   | `'empty'` | Placeholder type               |
| `loading`        | `'lazy' \| 'eager'`                   | `'lazy'`  | Loading method                 |
| `optimizeFormat` | `'auto' \| 'avif' \| 'webp' \| 'off'` | `'auto'`  | Format optimization            |
| `transforms`     | `ImageTransforms`                     | `{}`      | Image transformation options   |



## Image Transformation Options

### Resizing

```tsx
<Image
  src="/image.jpg"
  alt="Resized"
  width={400}
  height={300}
  transforms={{
    fit: "cover", // contain | cover | fill | inside | outside
  }}
/>
```

### Visual Effects

```tsx
<Image
  src="/image.jpg"
  alt="Effects"
  width={400}
  height={300}
  transforms={{
    blur: 20, // Blur effect
    grayscale: true, // Convert to grayscale
    brightness: 120, // Brightness adjustment
    flip: true, // Flip vertically
    flop: true, // Flip horizontally
  }}
/>
```

### Crop (Extract Region)

```tsx
<Image
  src="/image.jpg"
  alt="Cropped"
  width={400}
  height={300}
  transforms={{
    extract: {
      x: 100,
      y: 100,
      width: 300,
      height: 200,
    },
  }}
/>
```

## Advanced Features

### Custom Hooks

```tsx
import { useImageOptimization } from "@snapkit-studio/nextjs";

function CustomImage({ src }) {
  const { original } = useImageOptimization({
    src,
    width: 800,
    quality: 85,
    optimizeFormat: "auto",
  });

  return <img src={original} alt="Optimized image" />;
}
```


## Next.js Image Loader Integration

@snapkit-studio/nextjs provides custom loader functions that can be used directly with Next.js Image component for seamless integration.

### Basic Loader Usage

```tsx
import Image from 'next/image';
import { snapkitLoader } from '@snapkit-studio/nextjs';

export default function MyComponent() {
  return (
    <Image
      loader={snapkitLoader}
      src="/hero.jpg"
      width={800}
      height={600}
      alt="Hero image"
    />
  );
}
```

### Custom Loader with Configuration

```tsx
import Image from 'next/image';
import { createSnapkitLoader } from '@snapkit-studio/nextjs';

const customLoader = createSnapkitLoader({
  baseUrl: 'https://custom-proxy.snapkit.com',
  organizationName: 'my-org',
  optimizeFormat: 'webp',
});

export default function MyComponent() {
  return (
    <Image
      loader={customLoader}
      src="/image.jpg"
      width={800}
      height={600}
      alt="Optimized image"
    />
  );
}
```

### Global Configuration in next.config.js

Create a loader file (e.g., `snapkit-loader.js`):

```js
const { createSnapkitLoader } = require('@snapkit-studio/nextjs');

module.exports = createSnapkitLoader({
  baseUrl: 'https://image-proxy.snapkit.com',
  organizationName: 'your-org',
  optimizeFormat: 'auto',
});
```

Configure in `next.config.js`:

```js
/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './snapkit-loader.js',
  },
};
```

### Pre-built Loaders

Use optimized loaders for common use cases:

```tsx
import Image from 'next/image';
import { defaultSnapkitLoaders } from '@snapkit-studio/nextjs';

// High-quality images
<Image
  loader={defaultSnapkitLoaders.highQuality}
  src="/photo.jpg"
  width={1200}
  height={800}
  alt="High-quality photo"
/>

// Compressed thumbnails
<Image
  loader={defaultSnapkitLoaders.compressed}
  src="/thumb.jpg"
  width={150}
  height={150}
  alt="Thumbnail"
/>

// Grayscale images
<Image
  loader={defaultSnapkitLoaders.grayscale}
  src="/profile.jpg"
  width={200}
  height={200}
  alt="Profile picture"
/>
```

### Advanced Loader Features

#### Loader with Image Transformations

```tsx
import { createSnapkitLoaderWithTransforms } from '@snapkit-studio/nextjs';

const blurredLoader = createSnapkitLoaderWithTransforms({
  blur: 20,
  brightness: 110,
  saturation: 120,
});

<Image
  loader={blurredLoader}
  src="/background.jpg"
  width={1920}
  height={1080}
  alt="Blurred background"
/>
```

#### Responsive Loader

```tsx
import { createResponsiveSnapkitLoader } from '@snapkit-studio/nextjs';

const responsiveLoader = createResponsiveSnapkitLoader([
  400, 800, 1200, 1600, 2000
]);

<Image
  loader={responsiveLoader}
  src="/responsive.jpg"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  width={1200}
  height={800}
  alt="Responsive image"
/>
```

#### Organization-specific Loader

```tsx
import { createSnapkitLoaderForOrganization } from '@snapkit-studio/nextjs';

const orgLoader = createSnapkitLoaderForOrganization(
  'client-org',
  'https://client-cdn.snapkit.com'
);

<Image
  loader={orgLoader}
  src="/client-asset.jpg"
  width={600}
  height={400}
  alt="Client asset"
/>
```

## Configuration Options

### SnapkitProvider Props

| Prop                    | Type                         | Default  | Description               |
| ----------------------- | ---------------------------- | -------- | ------------------------- |
| `baseUrl`               | `string`                     | -        | Image proxy server URL    |
| `organizationName`      | `string`                     | -        | Organization name         |
| `defaultQuality`        | `number`                     | `85`     | Default image quality     |
| `defaultFormat`         | `'auto' \| 'avif' \| 'webp'` | `'auto'` | Default format            |
| `enableBlurPlaceholder` | `boolean`                    | `true`   | Enable blur placeholder   |

### Network-based Optimization

Quality automatically adjusts based on network conditions:

- **4G/WiFi**: Original quality (85%)
- **3G**: 20% quality reduction (68%)
- **2G/Slow**: 40% quality reduction (51%)
- **Data Saver Mode**: 30% quality reduction (60%)

## Performance Tips

### 1. Appropriate Size Setting

```tsx
// ❌ Too large image
<Image src="/image.jpg" width={4000} height={3000} />

// ✅ Appropriate size
<Image src="/image.jpg" width={800} height={600} />
```

### 2. Using priority Property

```tsx
// Important images visible above the fold
<Image src="/hero.jpg" width={1200} height={600} priority />

// Images requiring scroll to view
<Image src="/content.jpg" width={400} height={300} loading="lazy" />
```

### 3. Appropriate Format Selection

```tsx
// Photos: Auto-select AVIF/WebP
<Image src="/photo.jpg" optimizeFormat="auto" />

// Illustrations/Logos: Keep PNG when necessary
<Image src="/logo.png" optimizeFormat="off" />
```

### 4. Responsive Optimization with sizes

```tsx
<Image
  src="/responsive.jpg"
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
/>
```

## Browser Support

- **AVIF**: Chrome 85+, Firefox 93+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+
- **Lazy Loading**: Chrome 76+, Firefox 75+, Safari 15.4+

Automatically falls back to JPEG/PNG in older browsers.

## Troubleshooting

### Images Not Loading

- **Check organizationName**

```tsx
<SnapkitProvider organizationName="correct-org-name">
```

- **Check image path**

```tsx
// Use absolute path
<Image src="/project/image.jpg" />

// Or full URL
<Image src="https://cdn.snapkit.com/org/project/image.jpg" />
```

- **Check network requests**
   Verify image request URLs and responses in browser dev tools.

### TypeScript Errors

```tsx
// Add to tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  }
}
```

## Release Process

This project uses **Semantic Versioning** and **Conventional Commits** for automated package-specific releases.

### Automatic Version Management

- `fix:` → patch release (1.0.0 → 1.0.1) 🩹
- `feat:` → minor release (1.0.0 → 1.1.0) ✨
- `feat!:` or `BREAKING CHANGE:` → major release (1.0.0 → 2.0.0) 💥

### Commit Message Rules

Please follow standard Conventional Commits format:

```
type(scope): description

[optional body]

[optional footer]
```

#### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Refactoring
- `test`: Adding/modifying tests
- `chore`: Build process or tooling changes

#### Examples

```bash
feat(core): add support for AVIF format
fix(nextjs): resolve image loading issue in Safari
docs: update API documentation
feat(react)!: change default quality from 75 to 85

# With BREAKING CHANGE
feat(nextjs): update Image component API

BREAKING CHANGE: remove deprecated `lazy` prop, use `loading` instead
```

### Package-specific Release Workflow

1. **Development**: Modify content in package folders (`packages/core/`, `packages/react/`, `packages/nextjs/`)
2. **Auto Detection**: Workflow runs only when changes are detected in specific packages
3. **CI Validation**: Automatic tests, linting, type checking
4. **Automatic Release**: When CI passes, GitHub Actions:
   - Analyzes commit history to determine package version
   - Creates GitHub Release (with release notes)
   - Automatically publishes to npm
   - Creates Git tags (`core-v1.0.1`, `react-v2.1.0`, etc.)

### Manual Release (if needed)

```bash
# Local individual package release
./scripts/publish-local.sh --package=core --version=1.0.1 --dry-run

# Manual execution in GitHub Actions
# Repository → Actions → Release Core/React/NextJS → Run workflow
```

## Examples

Check out our example projects to see @snapkit-studio/nextjs in action:

- **[Basic Example](./examples/basic-nextjs/)** - Simple Next.js application showing basic usage
- **[Advanced Features](./examples/advanced-features/)** - Progressive loading, custom hooks, and batch preloading
- **[Online Demo](https://codesandbox.io/s/snapkit-nextjs-basic)** - Try it out in CodeSandbox

## Contributing

Please report bugs and feature requests at [GitHub Issues](https://github.com/snapkit/snapkit-nextjs/issues).

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT