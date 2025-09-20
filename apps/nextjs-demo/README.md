# Next.js Demo - Snapkit Integration Showcase

Comprehensive demonstration of @snapkit-studio/nextjs package showcasing both the custom Image component and Next.js native Image integration with Snapkit loaders. This demo highlights the seamless integration between Snapkit optimization and Next.js ecosystem.

## Features Demonstrated

### 🖼️ Core Next.js Integration
- **Snapkit Image Component** - Drop-in replacement for Next.js Image with enhanced optimization
- **Custom Loaders** - Integration with Next.js native Image component using Snapkit loaders
- **Transform Builder** - Type-safe image transformation configuration
- **Server-side Optimization** - Next.js compatible server-side rendering

### ⚡ Next.js Specific Features
- **App Router Compatibility** - Full support for Next.js 13+ App Router
- **Static Generation** - Works seamlessly with SSG and ISR
- **Edge Runtime Support** - Compatible with Edge runtime environments
- **Automatic Code Splitting** - Optimized bundle size with tree-shaking

### 🎯 Advanced Integration Patterns
- **Provider Setup** - Global configuration with SnapkitProvider
- **Loader Customization** - Custom loader functions for specific use cases
- **Transform Builder API** - Programmatic image transformation setup
- **TypeScript Integration** - Full type safety with Next.js patterns

## Quick Start

### Development Server

```bash
# From project root
pnpm dev:nextjs-demo

# Or from demo directory
cd apps/nextjs-demo
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

### Building for Production

```bash
# Build the demo
npm run build

# Start production server
npm run start

# Static export (if configured)
npm run build && npm run export
```

## Demo Structure

### App Router Structure (`app/`)

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Main demo page
├── components/             # Shared components
│   └── CodeBlock.tsx       # Syntax highlighting component
├── examples/               # Demo examples
│   ├── SnapkitImageExample.tsx
│   └── SnapkitImageLoaderExample.tsx
└── libs/                   # Additional utilities
    └── components/
        └── CodeBlock.tsx   # Alternative CodeBlock implementation
```

### Core Examples

#### 1. Snapkit Image Component
- **File**: `app/examples/SnapkitImageExample.tsx`
- **Features**: Direct use of @snapkit-studio/nextjs Image component
- **Transformations**: Grayscale and horizontal flip effects

#### 2. Next.js Image with Custom Loader
- **File**: `app/examples/SnapkitImageLoaderExample.tsx`
- **Features**: Native Next.js Image with Snapkit optimization loader
- **API**: Transform Builder for programmatic image processing

## Technical Stack

- **Next.js 15** - Latest Next.js with App Router
- **React 19** - React Server Components support
- **TypeScript** - Full type safety
- **@snapkit-studio/nextjs** - Next.js optimized image components
- **@snapkit-studio/react** - Core React components
- **Shiki** - Syntax highlighting for code examples
- **Tailwind CSS** - Utility-first styling

## Configuration Files

### Next.js Configuration (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable for Edge runtime if needed
    runtime: 'nodejs'
  },
  images: {
    // Configure for Snapkit if using loaders globally
    domains: ['snapkit-cdn.snapkit.studio'],
    // Custom loader can be set here
    // loader: 'custom',
    // loaderFile: './snapkit-loader.js'
  }
}

module.exports = nextConfig
```

### TypeScript Configuration
- **tsconfig.json** - Main TypeScript configuration with Next.js presets
- Includes strict type checking and Next.js specific settings

### ESLint Configuration (`eslint.config.js`)
```javascript
import { config } from '@repo/eslint-config/react-internal'

export default config
```

## Integration Examples

### Basic Snapkit Image Usage
```tsx
import { Image } from '@snapkit-studio/nextjs';

export function BasicExample() {
  return (
    <Image
      src="/landing-page/fox.jpg"
      alt="Optimized image"
      width={400}
      height={300}
      className="object-contain"
      transforms={{
        grayscale: true,
        flop: true,
      }}
    />
  );
}
```

### Next.js Image with Custom Loader
```tsx
"use client";

import Image from "next/image";
import { SnapkitTransformBuilder } from "@snapkit-studio/core";
import { createSnapkitLoader } from "@snapkit-studio/nextjs";

export function LoaderExample() {
  const loader = createSnapkitLoader({
    organizationName: "snapkit"
  });

  const src = new SnapkitTransformBuilder().build("/landing-page/fox.jpg", {
    grayscale: true,
    flop: true,
  });

  return (
    <Image
      src={src}
      alt="Loader optimized image"
      width={400}
      height={300}
      loader={loader}
      className="object-contain"
    />
  );
}
```

### Provider Setup in Layout
```tsx
// app/layout.tsx
import { SnapkitProvider } from '@snapkit-studio/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SnapkitProvider
          baseUrl="https://snapkit-cdn.snapkit.studio"
          organizationName="snapkit"
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

### Advanced Transform Builder Usage
```tsx
import { SnapkitTransformBuilder } from '@snapkit-studio/core';

export function AdvancedTransforms() {
  // Programmatic transform building
  const transforms = new SnapkitTransformBuilder()
    .resize(800, 600, 'cover')
    .quality(90)
    .format('webp')
    .grayscale()
    .blur(10)
    .build();

  return (
    <Image
      src="/complex-image.jpg"
      alt="Advanced transforms"
      width={800}
      height={600}
      transforms={transforms}
    />
  );
}
```

## Next.js Specific Features

### Server-Side Rendering (SSR)
```tsx
// Works seamlessly with SSR
export default function SSRPage({ imageData }: { imageData: any }) {
  return (
    <Image
      src={imageData.src}
      alt={imageData.alt}
      width={imageData.width}
      height={imageData.height}
      priority // Critical for above-the-fold content
    />
  );
}

export async function getServerSideProps() {
  // Fetch image data server-side
  const imageData = await fetchImageData();
  return { props: { imageData } };
}
```

### Static Site Generation (SSG)
```tsx
// Static generation compatible
export default function StaticPage({ images }: { images: ImageData[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={300}
          height={200}
          transforms={{ fit: 'cover' }}
        />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const images = await fetchAllImages();
  return {
    props: { images },
    revalidate: 3600 // ISR: regenerate every hour
  };
}
```

### Edge Runtime Support
```tsx
// app/api/image-transform/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SnapkitUrlBuilder } from '@snapkit-studio/core';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get('src');

  if (!src) {
    return NextResponse.json({ error: 'Missing src parameter' }, { status: 400 });
  }

  const urlBuilder = new SnapkitUrlBuilder('your-org');
  const optimizedUrl = urlBuilder.buildTransformedUrl(src, {
    format: 'auto',
    quality: 85
  });

  return NextResponse.json({ url: optimizedUrl });
}
```

## Performance Optimization

### Critical Resource Loading
```tsx
// Above-the-fold images
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Loads immediately
  sizes="100vw"
/>

// Below-the-fold images
<Image
  src="/content-image.jpg"
  alt="Content"
  width={400}
  height={300}
  loading="lazy" // Default behavior
/>
```

### Responsive Images
```tsx
<Image
  src="/responsive-image.jpg"
  alt="Responsive"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  transforms={{ fit: 'cover' }}
/>
```

### Quality Optimization
```tsx
// High quality for important images
<Image
  src="/product-hero.jpg"
  alt="Product showcase"
  width={1000}
  height={800}
  quality={95}
  priority
/>

// Optimized quality for thumbnails
<Image
  src="/thumbnail.jpg"
  alt="Thumbnail"
  width={150}
  height={150}
  quality={70}
  transforms={{ fit: 'cover' }}
/>
```

## Deployment

### Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod

# Or with custom configuration
vercel --prod --env SNAPKIT_ORG=your-org
```

### Custom Server Deployment
```bash
# Build for production
npm run build

# Start server
npm run start

# Or with PM2
pm2 start npm --name "nextjs-demo" -- start
```

### Static Export (if applicable)
```bash
# Configure next.config.js for static export
npm run build
npm run export

# Deploy static files from out/ directory
```

## Environment Variables

Create `.env.local` for local development:
```env
# Snapkit Configuration
NEXT_PUBLIC_SNAPKIT_ORG=your-organization
NEXT_PUBLIC_SNAPKIT_BASE_URL=https://snapkit-cdn.snapkit.studio

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-analytics-id
```

## Testing

### Type Checking
```bash
npm run check-types
```

### Linting
```bash
npm run lint
```

### Build Verification
```bash
npm run build
```

### Performance Testing
```bash
# Lighthouse CI
npx lighthouse http://localhost:3000 --output html

# Next.js Bundle Analyzer
ANALYZE=true npm run build
```

## Browser Support

- **Next.js Image**: All modern browsers with Next.js support
- **AVIF Format**: Chrome 85+, Firefox 93+, Safari 16+
- **WebP Format**: Chrome 23+, Firefox 65+, Safari 14+
- **Lazy Loading**: Chrome 76+, Firefox 75+, Safari 15.4+

## Migration from Next.js Image

### Before (Standard Next.js)
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Standard image"
  width={800}
  height={600}
  quality={90}
  priority
/>
```

### After (Snapkit Enhanced)
```tsx
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/image.jpg"
  alt="Optimized image"
  width={800}
  height={600}
  quality={90}
  priority
  // Enhanced features
  transforms={{
    format: 'auto',
    fit: 'cover'
  }}
  organizationName="your-org"
/>
```

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check organization name configuration
   - Verify image paths exist
   - Check network requests in dev tools

2. **TypeScript errors**
   - Ensure @snapkit-studio/nextjs is properly installed
   - Check tsconfig.json configuration
   - Run `npm run check-types` for detailed errors

3. **Build failures**
   - Clear `.next` directory: `rm -rf .next`
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for ESLint errors: `npm run lint`

4. **Performance issues**
   - Use `priority` for above-the-fold images
   - Optimize image sizes with appropriate width/height
   - Check bundle size with `ANALYZE=true npm run build`

### Development Tips

- Use Next.js DevTools to inspect component props
- Check Network tab for image optimization requests
- Use `next/dynamic` for code splitting heavy components
- Monitor Core Web Vitals with Next.js analytics

## Advanced Patterns

### Dynamic Image Loading
```tsx
'use client';

import { useState, useEffect } from 'react';
import { Image } from '@snapkit-studio/nextjs';

export function DynamicGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Load images dynamically
    fetchImages().then(setImages);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={300}
          height={200}
          transforms={{ fit: 'cover' }}
          loading="lazy"
        />
      ))}
    </div>
  );
}
```

### Image with Fallback
```tsx
'use client';

import { useState } from 'react';
import { Image } from '@snapkit-studio/nextjs';

export function ImageWithFallback({ src, fallback, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => setImgSrc(fallback)}
    />
  );
}
```

## Contributing

To add new demo features:

1. Create new example components in `app/examples/`
2. Add to main page in `app/page.tsx`
3. Include code examples with syntax highlighting
4. Test across different Next.js configurations
5. Update this README with new patterns

## Resources

- **Package Documentation**: [packages/nextjs/README.md](../../packages/nextjs/README.md)
- **React Package**: [packages/react/README.md](../../packages/react/README.md)
- **Core Utilities**: [packages/core/README.md](../../packages/core/README.md)
- **Main Repository**: [README.md](../../README.md)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Snapkit Website**: [https://snapkit.studio](https://snapkit.studio)

## License

MIT - Same as parent project