import { Image, SnapkitProvider } from '@snapkit-studio/react';
import { useEffect, useState } from 'react';
import { CodeBlock } from './components/CodeBlock';

// PreloadMonitor component for use in Priority Loading Example
function PreloadMonitor() {
  const [preloadLinks, setPreloadLinks] = useState<Array<{href: string, timestamp: number}>>([]);

  useEffect(() => {
    const checkPreloadLinks = () => {
      const links = Array.from(document.querySelectorAll('link[rel="preload"][as="image"]'));
      const linkData = links.map((link: Element) => ({
        href: (link as HTMLLinkElement).href,
        timestamp: Date.now()
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
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h5 className="text-sm font-semibold text-green-800 mb-2">
        🔗 Document Head Preload Links ({preloadLinks.length})
      </h5>
      {preloadLinks.length === 0 ? (
        <p className="text-sm text-green-600">No image preload links detected</p>
      ) : (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {preloadLinks.map((link, index) => (
            <div key={index} className="text-xs bg-white p-2 rounded border">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-mono break-all">
                  {decodeURIComponent(link.href).split('?')[0].split('/').pop()}
                </span>
                <span className="text-green-600 text-xs ml-2">
                  ✅ preload
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h4 className="text-lg font-medium text-gray-700 mb-4">Live Demo</h4>
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={handleLoadPriorityImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {showPriorityImage ? 'Hide Image' : 'Load Priority Image'}
              </button>
              <div className="flex items-center text-sm text-gray-600">
                {showPriorityImage && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
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
                <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  PRIORITY
                </div>
              </div>
            )}
            
            <PreloadMonitor />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>How to Verify:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Watch the box above for real-time preload link generation</li>
                <li>• F12 → Network tab to see preload requests</li>
                <li>• F12 → Elements tab to inspect &lt;head&gt; &lt;link rel=&quot;preload&quot;&gt; tags</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Priority images generate preload links immediately to improve page load performance by allowing 
          the browser to start downloading in advance. This helps improve LCP (Largest Contentful Paint) scores.
        </p>
      </div>
      <div>
        <h4 className="text-lg font-medium text-gray-700 mb-4">Implementation</h4>
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
    <SnapkitProvider organizationName="snapkit">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Snapkit React Image Component Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the various features and use cases of Snapkit&apos;s React Image component.
              Each example shows the component in action alongside its implementation code.
            </p>
          </div>

          {/* Basic Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Basic Features</h2>

            {/* DPR Srcset Example */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">DPR-based Srcset</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Live Demo</h4>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <Image
                      src="/landing-page/fox.jpg"
                      alt="Fox with DPR srcset"
                      width={300}
                      height={200}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    This image automatically generates 1x, 2x, 3x versions for crisp display on all devices.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Implementation</h4>
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
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Fill Mode</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Live Demo</h4>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src="/landing-page/fox.jpg"
                        alt="Fill mode fox"
                        fill={true}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Fill mode makes the image fill its container completely, useful for responsive layouts.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Implementation</h4>
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
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Image Transforms</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Live Demo</h4>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="space-y-6">
                      {/* Format Conversion */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Format Optimization</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <Image
                              src="/landing-page/fox.jpg"
                              alt="WebP format"
                              width={100}
                              height={67}
                              transforms={{ format: 'webp' }}
                              className="rounded shadow-sm w-full h-auto"
                            />
                            <p className="text-xs text-gray-600 mt-1">WebP</p>
                          </div>
                          <div className="text-center">
                            <Image
                              src="/landing-page/fox.jpg"
                              alt="AVIF format"
                              width={100}
                              height={67}
                              transforms={{ format: 'avif' }}
                              className="rounded shadow-sm w-full h-auto"
                            />
                            <p className="text-xs text-gray-600 mt-1">AVIF</p>
                          </div>
                          <div className="text-center">
                            <Image
                              src="/landing-page/fox.jpg"
                              alt="Auto format"
                              width={100}
                              height={67}
                              transforms={{ format: 'auto' }}
                              className="rounded shadow-sm w-full h-auto"
                            />
                            <p className="text-xs text-gray-600 mt-1">Auto</p>
                          </div>
                        </div>
                      </div>

                      {/* Visual Effects */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Visual Effects</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <Image
                              src="/landing-page/fox.jpg"
                              alt="Original image"
                              width={120}
                              height={80}
                              className="rounded shadow-sm w-full h-auto"
                            />
                            <p className="text-xs text-gray-600 mt-1">Original</p>
                          </div>
                          <div className="text-center">
                            <Image
                              src="/landing-page/fox.jpg"
                              alt="Grayscale effect"
                              width={120}
                              height={80}
                              transforms={{ grayscale: true }}
                              className="rounded shadow-sm w-full h-auto"
                            />
                            <p className="text-xs text-gray-600 mt-1">Grayscale</p>
                          </div>
                        </div>
                      </div>

                      {/* Region Extraction */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Region Extraction</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <Image
                              src="/landing-page/fox.jpg"
                              alt="Full image"
                              width={120}
                              height={80}
                              className="rounded shadow-sm w-full h-auto"
                            />
                            <p className="text-xs text-gray-600 mt-1">Full Image</p>
                          </div>
                          <div className="text-center">
                            <Image
                              src="/landing-page/fox.jpg"
                              alt="Center crop"
                              width={120}
                              height={80}
                              transforms={{
                                extract: { x: 25, y: 25, width: 50, height: 50 }
                              }}
                              className="rounded shadow-sm w-full h-auto"
                            />
                            <p className="text-xs text-gray-600 mt-1">Center Crop</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Real-time image transformations including format optimization, visual effects, and region extraction.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Implementation</h4>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Performance Optimization</h2>

            {/* Lazy Loading Example */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Lazy Loading</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Live Demo</h4>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Scroll down to see lazy-loaded images:</p>
                      <div className="h-64 overflow-y-auto space-y-4 border border-gray-200 rounded p-4">
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
                  <p className="text-sm text-gray-600 mt-4">
                    Images are only loaded when they enter the viewport, improving initial page load performance.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Implementation</h4>
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
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Priority Loading</h3>
              <PriorityLoadingDemo />
            </div>

          </section>

          {/* Advanced Patterns Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Advanced Patterns</h2>
            {/* Art Direction Example */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Art Direction</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Live Demo</h4>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Wide Screen (16:9 landscape)</p>
                        <div className="flex justify-center">
                        <Image
                          src="/landing-page/fox.jpg"
                          alt="Wide screen art direction"
                          width={320}
                          height={180}
                          className="rounded shadow-sm w-full h-auto"
                        />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Mobile Screen (1:1 square crop)</p>
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
                  <p className="text-sm text-gray-600 mt-4">
                    Different aspect ratios and compositions optimized for different devices and viewing contexts.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Implementation</h4>
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
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Network-Aware Quality</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Live Demo</h4>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">High Quality (WiFi)</p>
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
                        <p className="text-sm font-medium text-gray-700 mb-2">Optimized (Slow Connection)</p>
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
                  <p className="text-sm text-gray-600 mt-4">
                    Automatically adjusts image quality based on network conditions for optimal experience.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Implementation</h4>
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
          <footer className="text-center py-8 border-t border-gray-200">
            <p className="text-gray-600">
              Built with{' '}
              <a href="https://snapkit.studio" className="text-blue-600 hover:text-blue-800 font-medium">
                Snapkit
              </a>{' '}
              - Next-generation image optimization for React applications
            </p>
          </footer>
        </div>
      </div>
    </SnapkitProvider>
  );
}

export default App;