# Snapkit

Next-generation image optimization for React and Next.js applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Overview

Drop-in image optimization with automatic format conversion (AVIF/WebP), lazy loading, and responsive images. Zero-config for Next.js, minimal setup for React.

### 🚀 React Server Components (RSC) Support

Both **@snapkit-studio/nextjs** and **@snapkit-studio/react** offer full RSC support:

#### Next.js Package

- **Zero JavaScript** for static images with automatic ServerImage selection
- **Automatic ServerImage/ClientImage selection** based on props
- **Native Next.js Image integration** with picture element wrapper
- **Full App Router compatibility**

#### React Package

- **Framework-agnostic RSC support** - works in any React 18+ environment
- **ServerImage and ClientImage components** for explicit control
- **Smaller bundle size** without Next.js dependencies
- **Same automatic selection logic** as Next.js package

## Packages

| Package                                       | Size  | Description                                     |
| --------------------------------------------- | ----- | ----------------------------------------------- |
| [`@snapkit-studio/nextjs`](./packages/nextjs) | ~15KB | Next.js Image component with zero configuration |
| [`@snapkit-studio/react`](./packages/react)   | ~9KB  | Lightweight React Image component               |
| [`@snapkit-studio/core`](./packages/core)     | ~5KB  | Core utilities for custom implementations       |

## Quick Start

### Next.js (Zero Config)

```bash
npm install @snapkit-studio/nextjs
```

```bash
# .env.local
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name
```

```tsx
// app/page.tsx - No layout changes needed!
import { Image } from '@snapkit-studio/nextjs';

export default function Page() {
  return (
    <>
      {/* Automatically renders as ServerImage (no client JS) */}
      <Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />

      {/* Automatically switches to ClientImage (has event handler) */}
      <Image
        src="/interactive.jpg"
        alt="Interactive"
        width={800}
        height={400}
        onLoad={() => console.log('Loaded!')}
      />
    </>
  );
}
```

### React (Vite/CRA)

```bash
npm install @snapkit-studio/react
```

```bash
# .env
VITE_SNAPKIT_ORGANIZATION_NAME=your-organization-name
```

```tsx
// App.tsx
import { Image } from '@snapkit-studio/react';

function App() {
  return (
    <>
      {/* Automatically renders as ServerImage in RSC environments */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        transforms={{ format: 'auto' }}
      />

      {/* Automatically switches to ClientImage (has event handler) */}
      <Image
        src="/interactive.jpg"
        alt="Interactive"
        width={800}
        height={400}
        onLoad={() => console.log('Loaded!')}
        adjustQualityByNetwork={true}
      />
    </>
  );
}
```

## Features Comparison

| Feature                      | @snapkit-studio/nextjs | @snapkit-studio/react |
| ---------------------------- | ---------------------- | --------------------- |
| React Server Components      | ✅ via Next.js         | ✅ Native support     |
| Auto Server/Client Selection | ✅                     | ✅                    |
| Next.js Image Integration    | ✅ Native              | ❌                    |
| Bundle Size                  | ~15KB                  | ~9KB                  |
| Error Boundaries             | ✅                     | ✅ ImageErrorBoundary |
| Network-aware Quality        | ✅                     | ✅                    |
| DPR Optimization             | ✅                     | ✅                    |
| Provider Required            | ❌                     | ❌                    |

## Environment Variables

### Next.js

| Variable                                      | Default  | Description                                   |
| --------------------------------------------- | -------- | --------------------------------------------- |
| `NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME`       | Required | Your Snapkit organization name                |
| `NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY`         | `85`     | Default image quality (1-100)                 |
| `NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT` | `auto`   | Default format: `auto`, `avif`, `webp`, `off` |

### React (Vite/CRA)

| Variable                               | Default  | Description                                   |
| -------------------------------------- | -------- | --------------------------------------------- |
| `VITE_SNAPKIT_ORGANIZATION_NAME`       | Required | Your Snapkit organization name                |
| `VITE_SNAPKIT_DEFAULT_QUALITY`         | `85`     | Default image quality (1-100)                 |
| `VITE_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT` | `auto`   | Default format: `auto`, `avif`, `webp`, `off` |

## Live Demos

- **Next.js Demo**: [https://nextjs.snapkit.studio](https://nextjs.snapkit.studio) - Server/Client components, DPR optimization ([Source](./apps/nextjs-demo))
- **React Demo**: [https://react.snapkit.studio](https://react.snapkit.studio) - Error boundaries, network adaptation, transforms ([Source](./apps/react-demo))

## Testing

The project maintains comprehensive test coverage across all packages:

```bash
# Run all tests
pnpm exec turbo test

# Run tests with coverage
pnpm exec turbo test:coverage
```

### Test Coverage Standards

All packages maintain consistent coverage standards:

- **Coverage Threshold**: 80% minimum for branches, functions, lines, and statements
- **Test Framework**: Vitest with v8 coverage provider
- **Coverage Reports**: Text (console), JSON, HTML, and LCOV formats

## Development

```bash
pnpm install          # Install dependencies
pnpm exec turbo dev   # Start development
pnpm exec turbo build # Build packages
pnpm exec turbo test  # Run tests

# Run specific demo apps
pnpm exec turbo dev --filter nextjs-demo  # Next.js demo at http://localhost:3000
pnpm exec turbo dev --filter react-demo   # React demo at http://localhost:5173
```

## License

MIT
