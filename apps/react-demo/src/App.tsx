import { useEffect, useState } from 'react';
//
import {
  detectNetworkSpeed,
  getDevicePixelRatio,
  getOptimalDprValues,
  Image,
} from '@snapkit-studio/react';

import { CodeBlock } from './components/CodeBlock';
import { ImageErrorBoundaryExample } from './examples/ImageErrorBoundaryExample';

// DPR Detection Demo component
function DprDetectionDemo() {
  const [deviceDpr, setDeviceDpr] = useState<number>(1);
  const [optimalDprs, setOptimalDprs] = useState<number[]>([1, 2]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const dpr = getDevicePixelRatio();
    const optimal = getOptimalDprValues();
    setDeviceDpr(dpr);
    setOptimalDprs(optimal);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h4 className="mb-4 text-lg font-medium text-gray-700">Live Demo</h4>
        <div className="rounded-lg bg-gray-100 p-6">
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Your Device Information:
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Device Pixel Ratio:</span>
                  <span className="font-semibold">{deviceDpr}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Optimal DPR Values:</span>
                  <span className="font-semibold">
                    {optimalDprs.join('x, ')}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3x Images Needed:</span>
                  <span className="font-semibold">
                    {optimalDprs.includes(3) ? 'Yes' : 'No (Skipped)'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {showComparison ? 'Hide' : 'Show'} Optimized vs Standard
              Comparison
            </button>

            {showComparison && (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Smart DPR (Optimized):
                  </p>
                  <Image
                    src="/landing-page/fox.jpg"
                    alt="Smart DPR optimization"
                    width={300}
                    height={200}
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    Using: {optimalDprs.join('x, ')}x
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Snapkit automatically detects your device&apos;s pixel ratio and
          generates only the necessary image sizes, reducing bandwidth usage
          while maintaining visual quality.
        </p>
      </div>
      <div>
        <h4 className="mb-4 text-lg font-medium text-gray-700">
          Implementation
        </h4>
        <CodeBlock language="tsx">
          {`// Automatic smart DPR detection (default)
<Image
  src="/landing-page/fox.jpg"
  alt="Smart DPR optimization"
  width={300}
  height={200}
/>

// Force specific DPR for testing
<Image
  src="/landing-page/fox.jpg"
  alt="Force 2x DPR"
  width={300}
  height={200}
  dprOptions={{ forceDpr: 2 }}
/>`}
        </CodeBlock>
      </div>
    </div>
  );
}

// Network Quality Demo component
type NetworkSpeed = 'slow' | 'fast' | 'offline' | 'unknown';

function NetworkQualityDemo() {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>('unknown');
  const [manualQuality] = useState(85);

  useEffect(() => {
    const speed = detectNetworkSpeed();
    setNetworkSpeed(speed);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h4 className="mb-4 text-lg font-medium text-gray-700">Live Demo</h4>
        <div className="rounded-lg bg-gray-100 p-6">
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Network Information:
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Connection Speed:</span>
                  <span className="font-semibold capitalize">
                    {networkSpeed === 'slow' && '🟡 Slow'}
                    {networkSpeed === 'fast' && '🟢 Fast'}
                    {networkSpeed === 'unknown' && '⚪ Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto Adjustment:</span>
                  <span className="font-semibold">Enabled</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Auto Quality:
                </p>
                <Image
                  src="/landing-page/fox.jpg"
                  alt="Auto quality adjustment"
                  width={150}
                  height={100}
                  adjustQualityByNetwork={true}
                  className="w-full rounded-lg shadow-md"
                />
                <p className="mt-1 text-xs text-gray-600">
                  Quality: {networkSpeed === 'slow' ? '~60%' : '~85%'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Fixed Quality:
                </p>
                <Image
                  src="/landing-page/fox.jpg"
                  alt="Fixed quality"
                  width={150}
                  height={100}
                  quality={manualQuality}
                  adjustQualityByNetwork={false}
                  className="w-full rounded-lg shadow-md"
                />
                <p className="mt-1 text-xs text-gray-600">
                  Quality: {manualQuality}%
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Images automatically adjust their quality based on network conditions
          to provide the best balance between visual quality and loading
          performance.
        </p>
      </div>
      <div>
        <h4 className="mb-4 text-lg font-medium text-gray-700">
          Implementation
        </h4>
        <CodeBlock language="tsx">
          {`// Automatic network-based quality (default)
<Image
  src="/landing-page/fox.jpg"
  alt="Auto quality"
  width={300}
  height={200}
  adjustQualityByNetwork={true}
/>

// Fixed quality (no network adjustment)
<Image
  src="/landing-page/fox.jpg"
  alt="Fixed quality"
  width={300}
  height={200}
  quality={95}
  adjustQualityByNetwork={false}
/>`}
        </CodeBlock>
      </div>
    </div>
  );
}

// PreloadMonitor component for use in Priority Loading Example
function PreloadMonitor() {
  const [preloadLinks, setPreloadLinks] = useState<
    Array<{ href: string; timestamp: number }>
  >([]);

  useEffect(() => {
    const checkPreloadLinks = () => {
      const links = Array.from(
        document.querySelectorAll('link[rel="preload"][as="image"]'),
      );
      const linkData = links.map((link: Element) => ({
        href: (link as HTMLLinkElement).href,
        timestamp: Date.now(),
      }));
      setPreloadLinks(linkData);
    };

    // Initial check
    checkPreloadLinks();

    // Detect head changes with MutationObserver
    const observer = new MutationObserver(() => {
      checkPreloadLinks();
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
      <h5 className="mb-2 text-sm font-semibold text-green-800">
        🔗 Document Head Preload Links ({preloadLinks.length})
      </h5>
      {preloadLinks.length === 0 ? (
        <p className="text-sm text-green-600">
          No image preload links detected
        </p>
      ) : (
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {preloadLinks.map((link, index) => (
            <div key={index} className="rounded border bg-white p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono break-all text-green-700">
                  {decodeURIComponent(link.href).split('?')[0].split('/').pop()}
                </span>
                <span className="ml-2 text-xs text-green-600">✅ preload</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {new URL(link.href).searchParams.toString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Priority Loading Demo component
function PriorityLoadingDemo() {
  const [showPriorityImage, setShowPriorityImage] = useState(false);

  const handleLoadPriorityImage = () => {
    setShowPriorityImage(!showPriorityImage);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h4 className="mb-4 text-lg font-medium text-gray-700">Live Demo</h4>
        <div className="rounded-lg bg-gray-100 p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={handleLoadPriorityImage}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {showPriorityImage
                  ? 'Hide Image'
                  : 'Click Me to Load Priority Image'}
              </button>
              <div className="flex items-center text-sm text-gray-600">
                {showPriorityImage && (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                    ⚡ Priority Loading Active
                  </span>
                )}
              </div>
            </div>

            {showPriorityImage && (
              <div className="relative">
                <Image
                  src="/landing-page/fox.jpg"
                  alt="Priority loaded hero image"
                  width={400}
                  height={267}
                  priority={true}
                  className="rounded-lg shadow-md"
                />
                <div className="absolute -top-2 -left-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  PRIORITY
                </div>
              </div>
            )}

            <PreloadMonitor />

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>How to Verify:</strong>
              </p>
              <ul className="mt-1 space-y-1 text-sm text-blue-700">
                <li>
                  • Watch the box above for real-time preload link generation
                </li>
                <li>• F12 → Network tab to see preload requests</li>
                <li>
                  • F12 → Elements tab to inspect &lt;head&gt; &lt;link
                  rel=&quot;preload&quot;&gt; tags
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Priority images generate preload links immediately to improve page
          load performance by allowing the browser to start downloading in
          advance. This helps improve LCP (Largest Contentful Paint) scores.
        </p>
      </div>
      <div>
        <h4 className="mb-4 text-lg font-medium text-gray-700">
          Implementation
        </h4>
        <CodeBlock language="tsx">
          {`// Automatic priority loading
<Image
  src="/landing-page/fox.jpg"
  alt="Priority loaded hero image"
  width={400}
  height={267}
  priority={true}  // ← This prop automatically creates preload link
  className="rounded-lg shadow-md"
/>

// Advanced: Manual preload hint creation
import { createPreloadHint } from '@snapkit-studio/react';

const cleanup = createPreloadHint(
  'https://example.com/image.jpg',
  '400px'  // sizes attribute
);

// Clean up later (prevents memory leaks)
cleanup();

// HTML automatically generates:
// <link rel="preload" as="image" 
//       href="..." imagesizes="400px" />`}
        </CodeBlock>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Snapkit React Image Component Demo
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Explore the various features and use cases of Snapkit&apos;s React
            Image component. Each example shows the component in action
            alongside its implementation code.
          </p>
        </div>

        {/* Basic Features Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Basic Features
          </h2>

          {/* DPR Srcset Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              DPR-based Srcset
            </h3>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Live Demo
                </h4>
                <div className="flex rounded-lg bg-gray-100 p-6">
                  <Image
                    src="/landing-page/fox.jpg"
                    alt="Fox with DPR srcset"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  This image automatically generates 1x, 2x, 3x versions for
                  crisp display on all devices.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Implementation
                </h4>
                <CodeBlock language="tsx">
                  {`<Image
  src="/landing-page/fox.jpg"
  alt="Fox with DPR srcset"
  width={300}
  height={200}
  className="rounded-lg shadow-md"
/>`}
                </CodeBlock>
              </div>
            </div>
          </div>
          {/* Fill Mode Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Fill Mode
            </h3>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Live Demo
                </h4>
                <div className="rounded-lg bg-gray-100 p-6">
                  <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-md">
                    <Image
                      src="/landing-page/fox.jpg"
                      alt="Fill mode fox"
                      fill={true}
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Fill mode makes the image fill its container completely,
                  useful for responsive layouts.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Implementation
                </h4>
                <CodeBlock language="tsx">
                  {`<div className="relative w-full h-64 rounded-lg overflow-hidden">
  <Image
    src="/landing-page/fox.jpg"
    alt="Fill mode fox"
    fill={true}
    className="object-cover"
  />
</div>`}
                </CodeBlock>
              </div>
            </div>
          </div>

          {/* Image Transforms Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Image Transforms
            </h3>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Live Demo
                </h4>
                <div className="rounded-lg bg-gray-100 p-6">
                  <div className="space-y-6">
                    {/* Format Conversion */}
                    <div>
                      <p className="mb-3 text-sm font-medium text-gray-700">
                        Format Optimization
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <Image
                            src="/landing-page/fox.jpg"
                            alt="WebP format"
                            width={100}
                            height={67}
                            transforms={{ format: 'webp' }}
                            className="h-auto w-full rounded shadow-sm"
                          />
                          <p className="mt-1 text-xs text-gray-600">WebP</p>
                        </div>
                        <div className="text-center">
                          <Image
                            src="/landing-page/fox.jpg"
                            alt="AVIF format"
                            width={100}
                            height={67}
                            transforms={{ format: 'avif' }}
                            className="h-auto w-full rounded shadow-sm"
                          />
                          <p className="mt-1 text-xs text-gray-600">AVIF</p>
                        </div>
                        <div className="text-center">
                          <Image
                            src="/landing-page/fox.jpg"
                            alt="Auto format"
                            width={100}
                            height={67}
                            transforms={{ format: 'auto' }}
                            className="h-auto w-full rounded shadow-sm"
                          />
                          <p className="mt-1 text-xs text-gray-600">Auto</p>
                        </div>
                      </div>
                    </div>

                    {/* Visual Effects */}
                    <div>
                      <p className="mb-3 text-sm font-medium text-gray-700">
                        Visual Effects
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <Image
                            src="/landing-page/fox.jpg"
                            alt="Original image"
                            width={120}
                            height={80}
                            className="h-auto w-full rounded shadow-sm"
                          />
                          <p className="mt-1 text-xs text-gray-600">Original</p>
                        </div>
                        <div className="text-center">
                          <Image
                            src="/landing-page/fox.jpg"
                            alt="Grayscale effect"
                            width={120}
                            height={80}
                            transforms={{ grayscale: true }}
                            className="h-auto w-full rounded shadow-sm"
                          />
                          <p className="mt-1 text-xs text-gray-600">
                            Grayscale
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Region Extraction */}
                    <div>
                      <p className="mb-3 text-sm font-medium text-gray-700">
                        Region Extraction
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <Image
                            src="/landing-page/fox.jpg"
                            alt="Full image"
                            width={120}
                            height={80}
                            className="h-auto w-full rounded shadow-sm"
                          />
                          <p className="mt-1 text-xs text-gray-600">
                            Full Image
                          </p>
                        </div>
                        <div className="text-center">
                          <Image
                            src="/landing-page/fox.jpg"
                            alt="Center crop"
                            width={120}
                            height={80}
                            transforms={{
                              extract: { x: 25, y: 25, width: 50, height: 50 },
                            }}
                            className="h-auto w-full rounded shadow-sm"
                          />
                          <p className="mt-1 text-xs text-gray-600">
                            Center Crop
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Real-time image transformations including format optimization,
                  visual effects, and region extraction.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Implementation
                </h4>
                <CodeBlock language="tsx">
                  {`// Format optimization for better performance
<Image
  src="/landing-page/fox.jpg"
  alt="Optimized image"
  width={300}
  height={200}
  transforms={{ format: 'auto' }}
/>

// Visual effects
<Image
  src="/landing-page/fox.jpg"
  alt="Grayscale effect"
  width={300}
  height={200}
  transforms={{ grayscale: true }}
/>

// Region extraction (crop)
<Image
  src="/landing-page/fox.jpg"
  alt="Center crop"
  width={300}
  height={200}
  transforms={{
    extract: { x: 25, y: 25, width: 50, height: 50 }
  }}
/>`}
                </CodeBlock>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Optimization Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Performance Optimization
          </h2>

          {/* Lazy Loading Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Lazy Loading
            </h3>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Live Demo
                </h4>
                <div className="rounded-lg bg-gray-100 p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Scroll down to see lazy-loaded images:
                    </p>
                    <div className="h-64 space-y-4 overflow-y-auto rounded border border-gray-200 p-4">
                      <div className="h-32"></div>
                      <Image
                        src="/landing-page/fox.jpg"
                        alt="Lazy loaded image 1"
                        width={200}
                        height={133}
                        loading="lazy"
                        className="rounded shadow-sm"
                      />
                      <div className="h-32"></div>
                      <Image
                        src="/landing-page/fox.jpg"
                        alt="Lazy loaded image 2"
                        width={200}
                        height={133}
                        loading="lazy"
                        className="rounded shadow-sm"
                      />
                      <div className="h-32"></div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Images are only loaded when they enter the viewport, improving
                  initial page load performance.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Implementation
                </h4>
                <CodeBlock language="tsx">
                  {`<Image
  src="/landing-page/fox.jpg"
  alt="Lazy loaded image"
  width={200}
  height={133}
  loading="lazy"
  className="rounded shadow-sm"
/>`}
                </CodeBlock>
              </div>
            </div>
          </div>

          {/* Priority Loading Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Priority Loading
            </h3>
            <PriorityLoadingDemo />
          </div>

          {/* DPR Detection Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Smart DPR Detection
            </h3>
            <DprDetectionDemo />
          </div>

          {/* Network-Aware Quality Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Network-Aware Quality
            </h3>
            <NetworkQualityDemo />
          </div>
        </section>

        {/* Advanced Patterns Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Advanced Patterns
          </h2>

          {/* Error Boundary Example */}
          <ImageErrorBoundaryExample />

          {/* Art Direction Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Art Direction
            </h3>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Live Demo
                </h4>
                <div className="rounded-lg bg-gray-100 p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Wide Screen (16:9 landscape)
                      </p>
                      <div className="flex justify-center">
                        <Image
                          src="/landing-page/fox.jpg"
                          alt="Wide screen art direction"
                          width={320}
                          height={180}
                          className="h-auto w-full rounded shadow-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Mobile Screen (1:1 square crop)
                      </p>
                      <div className="flex justify-center">
                        <Image
                          src="/landing-page/fox.jpg"
                          alt="Mobile art direction"
                          width={180}
                          height={180}
                          className="rounded shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Different aspect ratios and compositions optimized for
                  different devices and viewing contexts.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Implementation
                </h4>
                <CodeBlock language="tsx">
                  {`// Wide screen version (16:9)
<Image
  src="/landing-page/fox.jpg"
  alt="Wide screen art direction"
  width={320}
  height={180}
  className="rounded shadow-sm w-full h-auto"
/>

// Mobile version (1:1 square)
<Image
  src="/landing-page/fox.jpg"
  alt="Mobile art direction"
  width={180}
  height={180}
  className="rounded shadow-sm"
/>

// Use CSS media queries to show/hide appropriate version
// Or use responsive hooks for dynamic switching`}
                </CodeBlock>
              </div>
            </div>
          </div>

          {/* Dynamic Quality Example */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">
              Network-Aware Quality
            </h3>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Live Demo
                </h4>
                <div className="rounded-lg bg-gray-100 p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        High Quality (WiFi)
                      </p>
                      <Image
                        src="/landing-page/fox.jpg"
                        alt="High quality image"
                        width={200}
                        height={133}
                        quality={95}
                        className="rounded shadow-sm"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Optimized (Slow Connection)
                      </p>
                      <Image
                        src="/landing-page/fox.jpg"
                        alt="Optimized quality image"
                        width={200}
                        height={133}
                        quality={60}
                        className="rounded shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Automatically adjusts image quality based on network
                  conditions for optimal experience.
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-700">
                  Implementation
                </h4>
                <CodeBlock language="tsx">
                  {`// High quality for fast connections
<Image
  src="/landing-page/fox.jpg"
  alt="High quality image"
  width={200}
  height={133}
  quality={95}
  className="rounded shadow-sm"
/>

// Reduced quality for slow connections
<Image
  src="/landing-page/fox.jpg"
  alt="Optimized quality image"
  width={200}
  height={133}
  quality={60}
  className="rounded shadow-sm"
/>`}
                </CodeBlock>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 text-center">
          <p className="text-gray-600">
            Built with{' '}
            <a
              href="https://snapkit.studio"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Snapkit
            </a>{' '}
            - Next-generation image optimization for React applications
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
