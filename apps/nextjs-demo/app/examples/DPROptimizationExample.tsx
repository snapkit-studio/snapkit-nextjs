import { CodeBlock } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';

export function DPROptimizationExample() {
  return (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold">DPR-based srcSet Optimization Demo</h2>

      <div className="space-y-4">
        <div className="rounded-lg bg-indigo-50 p-4">
          <h3 className="font-semibold">Automatic DPR Detection</h3>
          <p className="mt-2 text-sm text-gray-600">
            Images automatically generate srcSet for different device pixel
            ratios (1x, 2x, 3x) to ensure crisp display on all devices,
            including Retina displays.
          </p>
        </div>

        {/* Example 1: Standard DPR srcSet */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">
            1. Standard DPR srcSet (Server-side)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Image
                src="/landing-page/fox.jpg"
                width={400}
                height={300}
                alt="Standard DPR srcSet"
                className="rounded-lg object-contain shadow-lg"
              />
              <p className="mt-2 text-xs text-gray-500">
                Automatically generates: 1x, 2x, 3x versions
              </p>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <h4 className="mb-2 text-sm font-semibold">Generated HTML:</h4>
              <CodeBlock language="html">
                {`<picture class="block">
  <source srcset="
    image.jpg?w=400 1x,
    image.jpg?w=800 2x,
    image.jpg?w=1200 3x
  " />
  <img src="image.jpg?w=400" />
</picture>`}
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* Example 2: With sizes attribute */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">
            2. Responsive with sizes attribute
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Image
                src="/landing-page/fox.jpg"
                width={800}
                height={600}
                alt="Responsive with sizes"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-contain shadow-lg"
              />
              <p className="mt-2 text-xs text-gray-500">
                Adapts to viewport width with sizes attribute
              </p>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <h4 className="mb-2 text-sm font-semibold">Configuration:</h4>
              <CodeBlock language="tsx">
                {`sizes="(max-width: 768px) 100vw, 50vw"

// Tells browser:
// - Mobile (<768px): Use full width
// - Desktop: Use 50% of viewport`}
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* Example 3: Priority loading */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">
            3. Priority Images with Preload
          </h3>
          <div className="space-y-2">
            <Image
              src="/landing-page/fox.jpg"
              width={1200}
              height={400}
              alt="Priority hero image"
              priority
              className="w-full rounded-lg object-contain shadow-lg"
            />
            <p className="text-xs text-gray-500">
              Priority images get preload hints for faster loading
            </p>
          </div>
        </section>

        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/nextjs';

// ServerImage component automatically generates DPR-based srcSet:

// Generate DPR-based srcSet for crisp display on high-DPI devices
const dprValues = [1, 2, 3];

// Generate srcSet dynamically
const srcSetEntries = dprValues.map((dpr) => {
  const url = generateUrl(baseImageUrl, dpr);
  return \`\${url} \${dpr}x\`;
});

// Render with picture element for optimal browser support
return (
  <picture className="block">
    <source
      srcSet={srcSetEntries.join(', ')}
      sizes={props.sizes || \`(max-width: \${width}px) 100vw, \${width}px\`}
    />
    <NextImage
      src={url1x}
      width={width}
      height={height}
      sizes={props.sizes}
      unoptimized // Already optimized by Snapkit
    />
  </picture>
);`}
        </CodeBlock>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Device</th>
                <th className="border border-gray-300 p-2 text-left">DPR</th>
                <th className="border border-gray-300 p-2 text-left">
                  Image Loaded
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Actual Pixels
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Standard Display</td>
                <td className="border border-gray-300 p-2">1x</td>
                <td className="border border-gray-300 p-2">400w version</td>
                <td className="border border-gray-300 p-2">400×300</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Retina Display</td>
                <td className="border border-gray-300 p-2">2x</td>
                <td className="border border-gray-300 p-2">800w version</td>
                <td className="border border-gray-300 p-2">800×600</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">iPhone Pro</td>
                <td className="border border-gray-300 p-2">3x</td>
                <td className="border border-gray-300 p-2">1200w version</td>
                <td className="border border-gray-300 p-2">1200×900</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg bg-yellow-50 p-4">
          <h4 className="font-semibold text-yellow-800">Performance Note</h4>
          <p className="mt-2 text-sm text-gray-700">
            {`DPR-based srcSet ensures your images look crisp on all devices
            without loading unnecessarily large images on standard displays. The
            browser automatically selects the appropriate image based on the
            device's pixel density.`}
          </p>
        </div>
      </div>
    </div>
  );
}
