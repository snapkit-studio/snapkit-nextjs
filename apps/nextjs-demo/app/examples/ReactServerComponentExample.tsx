'use client';

import { CodeBlock } from '@repo/demo-components';
import { ClientImage, Image, ServerImage } from '@snapkit-studio/react';

export function ReactServerComponentExample() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">
        React Package - Server/Client Components Demo
      </h2>

      <div className="rounded-lg bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-800">
          @snapkit-studio/react Package
        </h3>
        <p className="mt-2 text-sm text-gray-700">
          The React package also provides ServerImage and ClientImage components
          for optimal performance in Next.js applications. Unlike the Next.js
          package, these components are built with pure React without Next.js
          dependencies.
        </p>
      </div>

      {/* Section 1: Auto-selection with React Image */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">
          1. Auto-Selection with React Image Component
        </h3>
        <p className="text-gray-600">
          The React Image component automatically selects between ServerImage
          and ClientImage
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="mb-2 font-medium">Basic (Server Component)</h4>
            <Image
              src="/landing-page/fox.jpg"
              width={300}
              height={200}
              alt="Auto-selected as server component"
              className="rounded-lg object-contain shadow-lg"
            />
            <p className="mt-2 text-xs text-gray-500">
              No event handlers → ServerImage
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium">With Events (Client Component)</h4>
            <Image
              src="/landing-page/fox.jpg"
              width={300}
              height={200}
              alt="Auto-selected as client component"
              className="rounded-lg object-contain shadow-lg"
              onLoad={() => console.log('React Image loaded!')}
            />
            <p className="mt-2 text-xs text-gray-500">
              Has onLoad → ClientImage
            </p>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/react';

// Automatically selects ServerImage (no JS needed)
<Image
  src="/landing-page/fox.jpg"
  width={300}
  height={200}
  alt="Server component from React package"
  className="object-contain rounded-lg shadow-lg"
/>

// Automatically selects ClientImage (has event handler)
<Image
  src="/landing-page/fox.jpg"
  width={300}
  height={200}
  alt="Client component from React package"
  className="object-contain rounded-lg shadow-lg"
  onLoad={() => console.log('Loaded!')}
/>`}
        </CodeBlock>
      </section>

      {/* Section 2: Explicit ServerImage */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">
          2. Explicit ServerImage Component
        </h3>
        <p className="text-gray-600">
          Force server-side rendering with zero JavaScript
        </p>
        <ServerImage
          src="/landing-page/fox.jpg"
          width={600}
          height={400}
          alt="Explicit React ServerImage"
          className="rounded-lg object-contain shadow-lg"
        />
        <CodeBlock language="tsx">
          {`import { ServerImage } from '@snapkit-studio/react';

// No 'use client' directive in your component file
// This component runs entirely on the server

<ServerImage
  src="/landing-page/fox.jpg"
  width={600}
  height={400}
  alt="Server-rendered image"
  className="object-contain rounded-lg shadow-lg"
/>

// Features:
// ✅ Pre-computed URLs and srcSet
// ✅ No JavaScript bundle
// ✅ Instant render
// ✅ Better SEO
// ❌ No event handlers
// ❌ No dynamic features`}
        </CodeBlock>
      </section>

      {/* Section 3: Explicit ClientImage */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">
          3. Explicit ClientImage Component
        </h3>
        <p className="text-gray-600">
          Force client-side rendering with all interactive features
        </p>
        <ClientImage
          src="/landing-page/fox.jpg"
          width={600}
          height={400}
          alt="Explicit React ClientImage"
          className="rounded-lg object-contain shadow-lg"
          priority={true}
          adjustQualityByNetwork={true}
          onLoad={() => console.log('ClientImage loaded with all features!')}
        />
        <CodeBlock language="tsx">
          {`'use client'; // Required for client components

import { ClientImage } from '@snapkit-studio/react';

<ClientImage
  src="/landing-page/fox.jpg"
  width={600}
  height={400}
  alt="Client-rendered image"
  className="object-contain rounded-lg shadow-lg"
  priority={true}
  adjustQualityByNetwork={true}
  onLoad={() => console.log('Loaded!')}
/>

// Features:
// ✅ Event handlers (onLoad, onError)
// ✅ Priority preloading
// ✅ Network adaptation
// ✅ Lazy loading with IntersectionObserver
// ✅ Dynamic quality adjustment
// ❌ Requires JavaScript`}
        </CodeBlock>
      </section>

      {/* Section 4: React Package Features */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">
          4. React Package Unique Features
        </h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-semibold">ServerImage with Transforms</h4>
            <ServerImage
              src="/landing-page/fox.jpg"
              width={400}
              height={267}
              alt="Server image with transforms"
              className="rounded-lg object-contain shadow-md"
              transforms={{
                grayscale: true,
                blur: 5,
              }}
            />
            <p className="mt-2 text-xs text-gray-500">
              Transforms applied server-side, no JS needed
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-semibold">
              ClientImage with Network Adaptation
            </h4>
            <ClientImage
              src="/landing-page/fox.jpg"
              width={400}
              height={267}
              alt="Network adaptive client image"
              className="rounded-lg object-contain shadow-md"
              adjustQualityByNetwork={true}
            />
            <p className="mt-2 text-xs text-gray-500">
              Quality adjusts based on network speed (client-side only)
            </p>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`import { ServerImage, ClientImage } from '@snapkit-studio/react';

// Server-side transforms (no JS)
<ServerImage
  src="/image.jpg"
  width={400}
  height={267}
  alt="Transformed server-side"
  transforms={{
    grayscale: true,
    blur: 5,
    rotate: 90
  }}
/>

// Client-side network adaptation
<ClientImage
  src="/image.jpg"
  width={400}
  height={267}
  alt="Network adaptive"
  adjustQualityByNetwork={true}
  priority={true}
/>`}
        </CodeBlock>
      </section>

      {/* Section 5: Comparison Table */}
      <section className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">
          React vs Next.js Package Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">
                  Feature
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  @snapkit-studio/react
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  @snapkit-studio/nextjs
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Base Framework</td>
                <td className="border border-gray-300 p-2">Pure React</td>
                <td className="border border-gray-300 p-2">Next.js Image</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">
                  Server Components
                </td>
                <td className="border border-gray-300 p-2">✅ ServerImage</td>
                <td className="border border-gray-300 p-2">✅ ServerImage</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Client Components
                </td>
                <td className="border border-gray-300 p-2">✅ ClientImage</td>
                <td className="border border-gray-300 p-2">✅ ClientImage</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">Auto Selection</td>
                <td className="border border-gray-300 p-2">
                  ✅ Image component
                </td>
                <td className="border border-gray-300 p-2">
                  ✅ Image component
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">DPR Support</td>
                <td className="border border-gray-300 p-2">✅ Manual srcSet</td>
                <td className="border border-gray-300 p-2">
                  ✅ Via picture element
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">
                  Next.js Integration
                </td>
                <td className="border border-gray-300 p-2">Works in Next.js</td>
                <td className="border border-gray-300 p-2">
                  Native Next.js Image
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Bundle Size</td>
                <td className="border border-gray-300 p-2">
                  Smaller (no Next.js deps)
                </td>
                <td className="border border-gray-300 p-2">
                  Includes Next.js Image
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">Use Case</td>
                <td className="border border-gray-300 p-2">
                  Multi-framework apps
                </td>
                <td className="border border-gray-300 p-2">
                  Next.js apps only
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="mt-8 rounded-lg bg-yellow-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-yellow-800">
          📚 Usage Guidelines
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <strong>Use @snapkit-studio/react when:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li>Building a React app that might migrate to/from Next.js</li>
              <li>Need consistent API across different React frameworks</li>
              <li>Want smaller bundle size without Next.js dependencies</li>
              <li>Using in a monorepo with multiple React apps</li>
            </ul>
          </div>
          <div className="mt-4">
            <strong>Use @snapkit-studio/nextjs when:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li>Building exclusively for Next.js</li>
              <li>Want native Next.js Image component integration</li>
              <li>Need Next.js-specific optimizations</li>
              <li>Using App Router with full RSC support</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
