import { DPROptimizationExample } from 'apps/nextjs-demo/app/examples/DPROptimizationExample';
import { ReactServerComponentExample } from 'apps/nextjs-demo/app/examples/ReactServerComponentExample';
import ServerClientImageExample from 'apps/nextjs-demo/app/examples/ServerClientImageExample';
import { SnapkitImageExample } from 'apps/nextjs-demo/app/examples/SnapkitImageExample';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-8 text-4xl font-bold">Snapkit Next.js Demo</h1>

        {/* Navigation */}
        <nav className="mb-8 flex gap-4">
          <a href="#basic" className="text-blue-500 hover:underline">
            Basic Usage
          </a>
          <a href="#server-client" className="text-blue-500 hover:underline">
            Next.js Server/Client
          </a>
          <a
            href="#react-server-client"
            className="text-blue-500 hover:underline"
          >
            React Server/Client
          </a>
          <a href="#dpr" className="text-blue-500 hover:underline">
            DPR Optimization
          </a>
        </nav>

        {/* Basic Image Component */}
        <div id="basic" className="mb-16">
          <h2 className="mb-4 text-2xl font-semibold">Basic Image Component</h2>
          <SnapkitImageExample />
        </div>

        {/* Next.js Server/Client Component Demo */}
        <div id="server-client" className="mt-16 w-full">
          <ServerClientImageExample />
        </div>

        {/* React Package Server/Client Component Demo */}
        <div id="react-server-client" className="mt-16 w-full">
          <ReactServerComponentExample />
        </div>

        {/* DPR Optimization Demo */}
        <div id="dpr" className="mt-16 w-full">
          <DPROptimizationExample />
        </div>
      </div>
    </main>
  );
}
