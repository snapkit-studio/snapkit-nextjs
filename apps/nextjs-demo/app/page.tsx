import { CodeBlock } from "apps/nextjs-demo/app/components/CodeBlock";
import { SnapkitImageExample } from "apps/nextjs-demo/app/examples/SnapkitImageExample";
import { SnapkitImageLoaderExample } from "apps/nextjs-demo/app/examples/SnapkitImageLoaderExample";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-8 text-4xl font-bold">Snapkit Next.js Demo</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">{`Image Component`}</h2>
            <SnapkitImageExample />
            <CodeBlock language="tsx">
              {`import { Image } from "@snapkit-studio/nextjs";

export function SnapkitImageExample() {
  return (
    <Image
      src="/landing-page/fox.jpg"
      alt="fox image with grayscale and flop"
      width={400}
      height={300}
      className="object-contain"
      transforms={{
        grayscale: true,
        flop: true,
      }}
    />
  );
}`}
            </CodeBlock>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-semibold">next/image with Custom Loader</h2>
            <SnapkitImageLoaderExample />
            <CodeBlock language="tsx">
              {`"use client";

import Image from "next/image";
import { SnapkitTransformBuilder } from "@snapkit-studio/core";
import { createSnapkitLoader } from "@snapkit-studio/nextjs";

export function SnapkitImageLoaderExample() {
  const loader = createSnapkitLoader({ organizationName: "snapkit" });
  const src = new SnapkitTransformBuilder().build("/landing-page/fox.jpg", {
    grayscale: true,
    flop: true,
  });

  return (
    <Image
      src={src}
      alt="fox image with grayscale and flop"
      width={400}
      height={300}
      style={{
        width: 400,
        height: 300,
      }}
      className="object-contain"
      loader={loader}
    />
  );
}`}
            </CodeBlock>
          </div>
        </div>
      </div>
    </main>
  );
}
