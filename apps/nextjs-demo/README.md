# Next.js Demo Application

Comprehensive demonstration of `@snapkit-studio/nextjs` package features.

## Features Demonstrated

### 1. **Basic Image Component**
- Zero-config setup with environment variables
- Automatic format optimization (WebP, AVIF)
- Responsive image loading

### 2. **Server/Client Component Auto-Selection**
- Automatic detection of component requirements
- Server-side rendering for static images (no client JS)
- Client-side rendering for interactive features
- Explicit control with `optimize` prop

### 3. **DPR Optimization**
- Automatic srcSet generation for different pixel densities (1x, 2x, 3x)
- Picture element support for optimal browser compatibility
- Responsive images with `sizes` attribute
- Priority loading with preload hints

### 4. **Memory Leak Prevention**
- IntersectionObserver automatic cleanup
- Preload hint DOM element cleanup
- Safe state updates with mounted checks
- Comprehensive error boundaries

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name
NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY=85
NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.
