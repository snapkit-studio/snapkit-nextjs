'use client';

import { CodeBlock } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';

export default function ServerClientImageExample() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">
        Server/Client Component Auto-Selection Demo
      </h2>

      {/* Section 1: Server Component (default) */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">1. Server Component (Default)</h3>
        <p className="text-gray-600">
          This image renders as a server component - no client-side JavaScript
          needed
        </p>
        <Image
          src="/landing-page/fox.jpg"
          width={600}
          height={400}
          alt="Server rendered mountain"
          className="rounded-lg object-contain shadow-lg"
        />
        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/landing-page/fox.jpg"
  width={600}
  height={400}
  alt="Server rendered mountain"
  className="object-contain rounded-lg shadow-lg"
/>`}
        </CodeBlock>
      </section>

      {/* Section 2: Client Component (with event handler) */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">
          2. Client Component (Auto-detected)
        </h3>
        <p className="text-gray-600">
          This image automatically becomes a client component because it has an
          onLoad handler
        </p>
        <Image
          src="/landing-page/fox.jpg"
          width={600}
          height={400}
          alt="Client rendered landscape"
          className="rounded-lg object-contain shadow-lg"
          onLoad={() => console.log('Image loaded (client-side)!')}
        />
        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/landing-page/fox.jpg"
  width={600}
  height={400}
  alt="Client rendered landscape"
  className="object-contain rounded-lg shadow-lg"
  onLoad={() => console.log('Image loaded (client-side)!')}
/>`}
        </CodeBlock>
      </section>

      {/* Section 3: Forced Server Mode */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">3. Forced Server Mode</h3>
        <p className="text-gray-600">
          {`Explicitly force server rendering with optimize="server"`}
        </p>
        <Image
          src="/landing-page/fox.jpg"
          width={600}
          height={400}
          alt="Forced server rendering"
          className="rounded-lg object-contain shadow-lg"
          optimize="server"
        />
        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/landing-page/fox.jpg"
  width={600}
  height={400}
  alt="Forced server rendering"
  className="object-contain rounded-lg shadow-lg"
  optimize="server"
/>`}
        </CodeBlock>
      </section>

      {/* Section 4: Forced Client Mode */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">4. Forced Client Mode</h3>
        <p className="text-gray-600">
          {`Explicitly force client rendering with optimize="client"`}
        </p>
        <Image
          src="/landing-page/fox.jpg"
          width={600}
          height={400}
          alt="Forced client rendering"
          className="rounded-lg object-contain shadow-lg"
          optimize="client"
        />
        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/landing-page/fox.jpg"
  width={600}
  height={400}
  alt="Forced client rendering"
  className="object-contain rounded-lg shadow-lg"
  optimize="client"
/>`}
        </CodeBlock>
      </section>

      {/* Section 5: Network Adaptation (Client) */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">
          5. Network-Adaptive (Auto Client)
        </h3>
        <p className="text-gray-600">
          Network quality adjustment forces client-side rendering
        </p>
        <Image
          src="/landing-page/fox.jpg"
          width={600}
          height={400}
          alt="Network adaptive image"
          className="rounded-lg object-contain shadow-lg"
          adjustQualityByNetwork={true}
        />
        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/landing-page/fox.jpg"
  width={600}
  height={400}
  alt="Network adaptive image"
  className="object-contain rounded-lg shadow-lg"
  adjustQualityByNetwork={true}
/>`}
        </CodeBlock>
      </section>

      {/* Summary Table */}
      <section className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">
          Component Selection Logic
        </h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Props</th>
              <th className="border border-gray-300 p-2 text-left">
                Renders As
              </th>
              <th className="border border-gray-300 p-2 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Basic props only</td>
              <td className="border border-gray-300 p-2 font-mono text-green-600">
                ServerImage
              </td>
              <td className="border border-gray-300 p-2">
                Default, best performance
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">onLoad, onError</td>
              <td className="border border-gray-300 p-2 font-mono text-blue-600">
                ClientImage
              </td>
              <td className="border border-gray-300 p-2">
                Event handlers need browser
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                adjustQualityByNetwork
              </td>
              <td className="border border-gray-300 p-2 font-mono text-blue-600">
                ClientImage
              </td>
              <td className="border border-gray-300 p-2">
                Network detection needs browser
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">{`optimize="server"`}</td>
              <td className="border border-gray-300 p-2 font-mono text-green-600">
                ServerImage
              </td>
              <td className="border border-gray-300 p-2">Explicitly forced</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">{`optimize="client"`}</td>
              <td className="border border-gray-300 p-2 font-mono text-blue-600">
                ClientImage
              </td>
              <td className="border border-gray-300 p-2">Explicitly forced</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
