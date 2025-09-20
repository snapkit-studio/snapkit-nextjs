# @snapkit-studio/nextjs

Next.js image loader and React component for Snapkit image optimization service.

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Features

- 🖼️ **Next.js Image Integration**: Seamless integration with Next.js Image component
- ⚡ **Automatic Optimization**: Dynamic image transformation and optimization
- 🎯 **Flexible Configuration**: Global and per-component configuration options
- 📱 **Format Auto-Selection**: Intelligent format selection (WebP, AVIF, etc.)
- 🔧 **TypeScript Support**: Full TypeScript definitions included
- 🧪 **Well Tested**: 90%+ test coverage with comprehensive edge case handling

## Installation

```bash
npm install @snapkit-studio/nextjs @snapkit-studio/core
# or
yarn add @snapkit-studio/nextjs @snapkit-studio/core
# or
pnpm add @snapkit-studio/nextjs @snapkit-studio/core
```

## Quick Start

### 1. Configure Snapkit (Global Setup)

```typescript
// app/layout.tsx or pages/_app.tsx
import { setDefaultUrlBuilder, SnapkitUrlBuilder } from '@snapkit-studio/core';

// Set up global Snapkit configuration
setDefaultUrlBuilder(
  new SnapkitUrlBuilder('your-organization-name')
);
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
        format: 'webp',
        quality: 85
      }}
    />
  );
}
```

## Usage Patterns

### Pattern 1: Global Configuration (Recommended)

Best for most applications where you want consistent optimization across all images.

```typescript
// Set up once in your app root
import { setDefaultUrlBuilder, SnapkitUrlBuilder } from '@snapkit-studio/core';

setDefaultUrlBuilder(
  new SnapkitUrlBuilder('your-org-name')
);

// Use anywhere in your app
import { Image } from '@snapkit-studio/nextjs';

<Image src="/photo.jpg" width={800} height={600} alt="Photo" />
```

### Pattern 2: Custom Loader (Advanced)

Use when you need different optimization settings for specific image components.

```typescript
import { createSnapkitLoader } from '@snapkit-studio/nextjs';
import NextImage from 'next/image';

const customLoader = createSnapkitLoader({
  organizationName: 'your-org-name',
  transforms: {
    format: 'avif',
    quality: 90,
    blur: 0
  }
});

<NextImage
  src="/high-quality-photo.jpg"
  width={1920}
  height={1080}
  alt="High quality photo"
  loader={customLoader}
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
  quality: 85
});

console.log(optimizedUrl);
// Output: "https://your-org-name.snapkit.studio/transform/w_800,q_85,f_auto/my-image.jpg"
```

## Configuration Options

### SnapkitLoaderOptions

```typescript
interface SnapkitLoaderOptions {
  /** Your Snapkit organization name */
  organizationName: string;

  /** Disable format optimization (keeps original format) */
  unoptimizedFormat?: boolean;

  /** Default transforms to apply to all images */
  transforms?: ImageTransforms;
}
```

### ImageTransforms

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

## React Integration

### Basic Usage with Snapkit Provider

```typescript
// app/layout.tsx
import { SnapkitProvider } from '@snapkit-studio/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SnapkitProvider organizationName="your-org-name">
          {children}
        </SnapkitProvider>
      </body>
    </html>
  );
}

// app/components/Gallery.tsx
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
          transforms={{ format: 'webp', quality: 80 }}
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

## Error Handling

### Common Errors and Solutions

#### Error: "Snapkit URL builder not configured"

```typescript
// ❌ This will throw an error
import { snapkitLoader } from '@snapkit-studio/nextjs';
snapkitLoader({ src: '/image.jpg', width: 800 });

// ✅ Solution: Configure global URL builder first
import { setDefaultUrlBuilder, SnapkitUrlBuilder } from '@snapkit-studio/core';

setDefaultUrlBuilder(new SnapkitUrlBuilder('your-org-name'));

// Now this works
snapkitLoader({ src: '/image.jpg', width: 800 });
```

#### Error: Invalid organization name

```typescript
// ❌ Invalid organization name
setDefaultUrlBuilder(new SnapkitUrlBuilder(''));

// ✅ Use your actual Snapkit organization name
setDefaultUrlBuilder(new SnapkitUrlBuilder('my-company'));
```

### Error Boundary Example

```typescript
import { ErrorBoundary } from 'react-error-boundary';
import { Image } from '@snapkit-studio/nextjs';

function ImageErrorFallback({ error }: { error: Error }) {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <p>Failed to load image: {error.message}</p>
    </div>
  );
}

export function SafeImage(props: any) {
  return (
    <ErrorBoundary FallbackComponent={ImageErrorFallback}>
      <Image {...props} />
    </ErrorBoundary>
  );
}
```

## Performance Optimization

### Best Practices

1. **Use appropriate image sizes**
   ```typescript
   // ✅ Good: Match display size
   <Image src="/hero.jpg" width={1200} height={600} />

   // ❌ Avoid: Oversized images
   <Image src="/hero.jpg" width={4000} height={3000} />
   ```

2. **Choose optimal formats**
   ```typescript
   // ✅ Modern browsers: Use WebP/AVIF
   transforms={{ format: 'auto' }}  // Automatically selects best format

   // ✅ Legacy support: Specify fallback
   transforms={{ format: 'webp' }}  // Falls back to JPEG if WebP unsupported
   ```

3. **Quality settings**
   ```typescript
   // ✅ Photography: Higher quality
   transforms={{ quality: 85 }}

   // ✅ Graphics/Icons: Lower quality acceptable
   transforms={{ quality: 65 }}
   ```

### Monitoring Performance

```typescript
// Monitor image load performance
const imageProps = {
  src: '/large-image.jpg',
  width: 1200,
  height: 800,
  onLoad: () => console.log('Image loaded successfully'),
  onError: (e) => console.error('Image failed to load', e)
};

<Image {...imageProps} />
```

## Troubleshooting

### Debug Configuration

```typescript
import { getDefaultUrlBuilder } from '@snapkit-studio/core';

// Check if global configuration is set
const urlBuilder = getDefaultUrlBuilder();
if (!urlBuilder) {
  console.error('Snapkit not configured. Call setDefaultUrlBuilder() first.');
} else {
  console.log('Snapkit configured successfully');
}
```

### Test URL Generation

```typescript
import { createSnapkitLoader } from '@snapkit-studio/nextjs';

const testLoader = createSnapkitLoader({
  organizationName: 'your-org-name'
});

const testUrl = testLoader({
  src: '/test-image.jpg',
  width: 800,
  quality: 85
});

console.log('Generated URL:', testUrl);
// Expected: "https://your-org-name.snapkit.studio/transform/w_800,q_85,f_auto/test-image.jpg"
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Images not optimized | Global config missing | Call `setDefaultUrlBuilder()` in app root |
| TypeScript errors | Missing type imports | Import types from `@snapkit-studio/core` |
| 404 errors on images | Wrong organization name | Verify organization name in Snapkit dashboard |
| Slow image loading | Large unoptimized images | Use appropriate `width`/`height` props |

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
    loaderFile: './snapkit-loader.js'
  }
};

module.exports = nextConfig;
```

### Custom Loader File (snapkit-loader.js)

```javascript
// snapkit-loader.js
import { snapkitLoader } from '@snapkit-studio/nextjs';

export default snapkitLoader;
```

## TypeScript Integration

### Type Definitions

```typescript
import { ImageLoader } from 'next/image';
import type {
  SnapkitLoaderOptions,
  ImageTransforms
} from '@snapkit-studio/nextjs';

// Custom loader with full typing
const typedLoader: ImageLoader = createSnapkitLoader({
  organizationName: 'my-org',
  transforms: {
    format: 'webp',
    quality: 85
  }
});

// Component props with transforms
interface ImageCardProps {
  src: string;
  alt: string;
  transforms?: ImageTransforms;
}

function ImageCard({ src, alt, transforms }: ImageCardProps) {
  return (
    <Image
      src={src}
      width={400}
      height={300}
      alt={alt}
      transforms={transforms}
    />
  );
}
```

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

#### `createSnapkitLoader(options: SnapkitLoaderOptions): ImageLoader`

Create a custom image loader with specific configuration.

**Parameters:**
- `organizationName`: Your Snapkit organization name
- `unoptimizedFormat`: Disable format optimization
- `transforms`: Default transforms to apply

**Returns:** Image loader function

### Components

#### `<Image />`

React component wrapper around Next.js Image with Snapkit optimization.

**Props:** All Next.js Image props plus:
- `transforms?: ImageTransforms` - Image transformations to apply

## Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md) for details on our code of conduct and development process.

## License

MIT © [Snapkit](https://snapkit.studio)

## Production Deployment

### Environment Configuration

```typescript
// production-config-validator.ts
export function validateProductionConfig() {
  const issues: string[] = [];

  // Check organization name
  const orgName = process.env.NEXT_PUBLIC_SNAPKIT_ORG_NAME;
  if (!orgName) {
    issues.push('NEXT_PUBLIC_SNAPKIT_ORG_NAME environment variable not set');
  } else if (orgName.includes('test') || orgName.includes('dev')) {
    issues.push('Using development organization name in production');
  }

  // Check CDN configuration
  const cdnUrl = process.env.NEXT_PUBLIC_SNAPKIT_CDN_URL;
  if (cdnUrl && !cdnUrl.startsWith('https://')) {
    issues.push('CDN URL must use HTTPS in production');
  }

  if (issues.length > 0) {
    throw new Error(`Production configuration issues:\n${issues.join('\n')}`);
  }

  return { valid: true, orgName, cdnUrl };
}
```

### Performance Monitoring

```typescript
// utils/snapkit-analytics.ts
interface ImageMetrics {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  bytesTransferred: number;
}

export class SnapkitAnalytics {
  private metrics: ImageMetrics = {
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    bytesTransferred: 0
  };

  track(event: 'load' | 'error', data: {
    url: string;
    loadTime?: number;
    optimizedSize?: number;
  }) {
    this.metrics.totalImages++;

    if (event === 'load') {
      this.metrics.loadedImages++;
      if (data.loadTime) {
        // Update average load time
      }
    } else {
      this.metrics.failedImages++;
    }

    // Send to analytics service
    this.sendMetrics();
  }

  private sendMetrics() {
    if (window.gtag) {
      window.gtag('event', 'snapkit_metrics', {
        custom_parameter: this.metrics
      });
    }
  }

  getMetrics(): ImageMetrics {
    return { ...this.metrics };
  }
}
```

### Security Best Practices

```typescript
// utils/csp-config.ts
export const snapkitCSP = {
  'img-src': [
    "'self'",
    'data:',
    '*-cdn.snapkit.studio',
    // Add your custom domains
    'images.yourdomain.com'
  ],
  'connect-src': [
    "'self'",
    '*-cdn.snapkit.studio'
  ]
};

// Apply via next.config.js
const cspHeader = `
  img-src ${snapkitCSP['img-src'].join(' ')};
  connect-src ${snapkitCSP['connect-src'].join(' ')};
`;
```

### Health Checks

```typescript
// health/snapkit-health.ts
import { createSnapkitLoader } from '@snapkit-studio/nextjs';

export async function checkSnapkitHealth(organizationName?: string): Promise<{
  healthy: boolean;
  details: any;
}> {
  const checks = {
    urlGeneration: false,
    imageDelivery: false,
    responseTime: 0,
    timestamp: Date.now()
  };

  try {
    const orgName = organizationName || process.env.NEXT_PUBLIC_SNAPKIT_ORG_NAME;

    if (!orgName) {
      throw new Error('Organization name not configured');
    }

    // Test URL generation using createSnapkitLoader
    const loader = createSnapkitLoader({ organizationName: orgName });
    const testUrl = loader({
      src: '/health-check.jpg',
      width: 100,
      quality: 75
    });
    checks.urlGeneration = !!testUrl;

    // Test image delivery (if URL was generated successfully)
    if (checks.urlGeneration) {
      const start = performance.now();
      const response = await fetch(testUrl, { method: 'HEAD' });
      checks.responseTime = performance.now() - start;
      checks.imageDelivery = response.ok;
    }

    return {
      healthy: checks.urlGeneration && checks.imageDelivery && checks.responseTime < 1000,
      details: checks
    };
  } catch (error) {
    return {
      healthy: false,
      details: { ...checks, error: error.message }
    };
  }
}
```

## Troubleshooting

### Quick Diagnostics

```typescript
import { createSnapkitLoader } from '@snapkit-studio/nextjs';

// 1. Test URL generation
const testLoader = createSnapkitLoader({
  organizationName: 'your-org-name'
});

const testUrl = testLoader({
  src: '/test-image.jpg',
  width: 800,
  quality: 85
});

console.log('Generated URL:', testUrl);
// Expected: "https://your-org-name-cdn.snapkit.studio/test-image.jpg?w=800&quality=85&format=auto"
```

### Common Issues and Solutions

#### 1. Images Not Loading / 404 Errors

**Symptoms:**
- Images show broken image icon
- Network tab shows 404 errors for image URLs
- Console shows "Failed to load resource" errors

**Solutions:**

##### A. Incorrect Organization Name

```typescript
// ❌ Common mistakes
// Wrong format or empty name

// ✅ Correct format
const loader = createSnapkitLoader({
  organizationName: 'your-actual-org-name'
});
```

**How to find your organization name:**
1. Log into your Snapkit dashboard
2. Check the URL: `https://dashboard.snapkit.studio/organizations/YOUR-ORG-NAME`
3. Use exactly the `YOUR-ORG-NAME` part

##### B. Image Path Issues

```typescript
// ❌ Common mistakes
<Image src="images/photo.jpg" />          // Missing leading slash
<Image src="../assets/photo.jpg" />       // Relative paths don't work
<Image src="/public/images/photo.jpg" />  // Don't include 'public'

// ✅ Correct paths
<Image src="/images/photo.jpg" />         // Absolute path from public directory
<Image src="/assets/photos/hero.jpg" />   // Correct public directory structure
```

##### C. CORS Issues

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-org-name-cdn.snapkit.studio'],
    // If using custom domain:
    domains: ['cdn.yourdomain.com'],
  }
};

module.exports = nextConfig;
```

#### 2. Configuration Errors

**Error:** `"Snapkit configuration not found"`

This occurs when using the `Image` component without `SnapkitProvider`:

```typescript
// ✅ Solution: Wrap your app with SnapkitProvider
import { SnapkitProvider } from '@snapkit-studio/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SnapkitProvider organizationName="your-org-name">
          {children}
        </SnapkitProvider>
      </body>
    </html>
  );
}
```

#### 3. TypeScript Errors

**Error:** Type errors with Image props

```typescript
// ❌ Common TypeScript issues
<Image
  src="/test.jpg"
  width="800"     // Should be number, not string
  height="600"    // Should be number, not string
  transforms={{
    quality: "85"  // Should be number, not string
  }}
/>

// ✅ Correct typing
<Image
  src="/test.jpg"
  width={800}     // Number
  height={600}    // Number
  transforms={{
    quality: 85   // Number
  }}
/>
```

#### 4. Performance Issues

**Issue:** Images loading slowly or not optimizing properly

**Solutions:**

1. **Use appropriate image sizes:**

   ```typescript
   // ❌ Don't request oversized images
   <Image src="/huge-image.jpg" width={4000} height={3000} />

   // ✅ Match display size
   <Image src="/huge-image.jpg" width={800} height={600} />
   ```

2. **Optimize quality settings:**

   ```typescript
   // Different quality for different use cases
   const qualitySettings = {
     thumbnail: 60,
     gallery: 80,
     hero: 90,
     print: 95
   };

   <Image
     src="/image.jpg"
     transforms={{ quality: qualitySettings.gallery }}
   />
   ```

3. **Use proper loading strategy:**

   ```typescript
   // Above the fold: priority loading
   <Image src="/hero.jpg" priority />

   // Below the fold: lazy loading (default)
   <Image src="/content.jpg" loading="lazy" />
   ```

#### 5. Environment-Specific Issues

**Issue:** Works in development but fails in production

**Common causes:**

1. **Environment variables:**

   ```typescript
   // Use environment-specific organization names
   const orgName = process.env.NODE_ENV === 'production'
     ? process.env.NEXT_PUBLIC_SNAPKIT_ORG_PROD
     : process.env.NEXT_PUBLIC_SNAPKIT_ORG_DEV;
   ```

2. **Build-time optimization:**

   ```typescript
   // For static imports, don't use Snapkit optimization
   import staticImage from '/public/images/hero.jpg';
   <NextImage src={staticImage} alt="Hero" />

   // For dynamic paths, use Snapkit optimization
   <Image src="/images/hero.jpg" alt="Hero" />
   ```

#### 6. Testing Issues

**Issue:** Tests fail with image-related errors

**Solution:**

```typescript
// vitest.config.ts or jest.config.js
export default {
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom'
};

// src/test-setup.ts
import { vi } from 'vitest';

// Mock Snapkit modules
vi.mock('@snapkit-studio/nextjs', () => ({
  Image: vi.fn(({ src, alt, ...props }) =>
    <img src={src} alt={alt} {...props} />
  ),
  snapkitLoader: vi.fn((params) => params.src),
  createSnapkitLoader: vi.fn(() => vi.fn((params) => params.src))
}));
```

### Debugging Tools

#### Configuration Checker

```typescript
// utils/snapkit-debug.ts
export function debugSnapkitConfiguration() {
  const checks = {
    globalConfig: true, // SnapkitProvider based
    canGenerateUrls: false,
    organizationReachable: false
  };

  // Test URL generation
  try {
    const loader = createSnapkitLoader({
      organizationName: process.env.NEXT_PUBLIC_SNAPKIT_ORG_NAME
    });
    const testUrl = loader({
      src: '/test.jpg',
      width: 400,
      quality: 85
    });
    checks.canGenerateUrls = !!testUrl;
    console.log('Test URL:', testUrl);
  } catch (error) {
    console.error('URL generation failed:', error);
  }

  return checks;
}
```

#### Performance Monitoring Tools

```typescript
// Monitor image loading performance
export function monitorImagePerformance() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('snapkit.studio')) {
          console.log('Snapkit image loaded:', {
            url: entry.name,
            duration: entry.duration,
            size: entry.transferSize
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}
```

### Getting Help

#### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Verify your configuration with debug tools**
3. **Test with a minimal reproduction case**
4. **Check the browser's Network and Console tabs**

#### Information to Provide

When reporting issues, please include:

```typescript
// Debug information to include
const debugInfo = {
  package: '@snapkit-studio/nextjs',
  version: '1.6.0',
  nextVersion: process.env.npm_package_dependencies_next,
  organization: 'your-org-name', // Replace with actual org
  environment: process.env.NODE_ENV,
  userAgent: navigator.userAgent,
  configuration: {
    hasSnapkitProvider: true, // If using SnapkitProvider
    // Don't include sensitive information
  }
};

console.log('Debug info:', debugInfo);
```

#### Creating Minimal Reproduction

```typescript
// minimal-reproduction.tsx
import { SnapkitProvider } from '@snapkit-studio/react';
import { Image } from '@snapkit-studio/nextjs';

export default function MinimalExample() {
  return (
    <SnapkitProvider organizationName="your-org-name">
      <Image
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    </SnapkitProvider>
  );
}
```

This reproduction case helps isolate issues and makes it easier for maintainers to help you.

## Support

- 📚 [Documentation](https://docs.snapkit.studio)
- 💬 [Discord Community](https://discord.gg/snapkit)
- 🐛 [Issue Tracker](https://github.com/snapkit-studio/snapkit-nextjs/issues)
- 📧 [Email Support](mailto:support@snapkit.studio)
