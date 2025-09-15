import { Image, SnapkitProvider } from '@snapkit/react';

function App() {
  return (
    <SnapkitProvider
      config={{
        baseUrl: 'https://image-proxy.snapkit.com',
        organizationName: 'demo',
        defaultQuality: 85,
      }}
    >
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="md:shrink-0">
              <Image
                src="/demo-image.jpg"
                alt="Demo image"
                width={200}
                height={200}
                className="h-48 w-full object-cover md:h-full md:w-48"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Snapkit React Demo
              </div>
              <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
                Optimized Image Component
              </h1>
              <p className="mt-2 text-slate-500">
                This image is automatically optimized using Snapkit&apos;s React components,
                with format detection, responsive sizing, and lazy loading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SnapkitProvider>
  );
}

export default App;