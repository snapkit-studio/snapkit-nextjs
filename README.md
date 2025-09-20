# Snapkit

Next-generation image optimization for React and Next.js applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-blueviolet)](https://turbo.build/)

[![English](https://img.shields.io/badge/docs-English-blue)](./README.md) [![한국어](https://img.shields.io/badge/docs-한국어-blue)](./README-ko.md)

## What is Snapkit?

Snapkit provides automatic image optimization, format conversion, and responsive loading for modern web applications. Drop-in replacement for Next.js Image with enhanced features and support for any React application.

- **Automatic format optimization** - AVIF, WebP, JPEG with browser detection
- **Real-time transformations** - Resize, crop, filters, and effects
- **Next.js compatibility** - Works with existing Next.js Image API
- **Performance focused** - Lazy loading, network-aware quality, responsive images

## Quick Start

```tsx
// Next.js
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  transforms={{ format: 'auto', fit: 'cover' }}
/>
```

```tsx
// React - Option 1: Optimized import (recommended)
import { Image } from '@snapkit-studio/react/image'; // ~9 KB only

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  transforms={{ format: 'auto', fit: 'cover' }}
/>

// React - Option 2: Full bundle with Provider
import { Image, SnapkitProvider } from '@snapkit-studio/react'; // ~22 KB

<SnapkitProvider organizationName="your-org">
  <Image
    src="/hero.jpg"
    alt="Hero image"
    width={800}
    height={600}
    transforms={{ format: 'auto', fit: 'cover' }}
  />
</SnapkitProvider>
```

## Installation

```bash
# For Next.js projects
npm install @snapkit-studio/nextjs

# For React projects
npm install @snapkit-studio/react

# Core utilities only
npm install @snapkit-studio/core
```

## Documentation

- **[@snapkit-studio/nextjs](./packages/nextjs/README.md)** - Next.js integration guide
- **[@snapkit-studio/react](./packages/react/README.md)** - React components and hooks
- **[@snapkit-studio/core](./packages/core/README.md)** - Core utilities and types

## Examples

- **[Next.js Demo](./apps/nextjs-demo)** - Comprehensive Next.js integration examples
- **[React Demo](./apps/react-demo)** - Interactive React component showcase

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm exec turbo dev

# Run tests
pnpm exec turbo test

# Build packages
pnpm exec turbo build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT