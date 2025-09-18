import { snapkitLoader } from '@snapkit-studio/nextjs';
import { Image } from '@snapkit-studio/react';
import NextImage from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Snapkit Next.js Demo</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Using @snapkit-studio/react Image</h2>
            <Image
              src="/demo-image.jpg"
              alt="Demo image with Snapkit React component"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Using Next.js Image with Snapkit Loader</h2>
            <NextImage
              src="/demo-image.jpg"
              alt="Demo image with Next.js Image and Snapkit loader"
              width={400}
              height={300}
              loader={snapkitLoader}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
}