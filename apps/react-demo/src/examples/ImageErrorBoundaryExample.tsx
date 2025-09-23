import { useState } from 'react';
import { CodeBlock } from '@repo/demo-components';
//
import {
  Image,
  ImageErrorBoundary,
  withImageErrorBoundary,
} from '@snapkit-studio/react';

// Custom error fallback component
function CustomErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-red-200 bg-red-50">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-2 font-semibold text-red-800">
          Oops! Something went wrong
        </h3>
        <p className="mt-1 text-sm text-red-600">
          {error?.message || 'The image could not be loaded'}
        </p>
      </div>
    </div>
  );
}

// Example component wrapped with error boundary using HOC
const ImageWithBoundary = withImageErrorBoundary(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ src, ...props }: any) => <Image src={src} {...props} />,
  <CustomErrorFallback />,
);

export function ImageErrorBoundaryExample() {
  const [brokenUrl] = useState('/broken-image-url-12345.jpg');
  const [showBroken, setShowBroken] = useState(false);
  const [errorLog, setErrorLog] = useState<string[]>([]);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    const logEntry = `[${new Date().toLocaleTimeString()}] ${error.message}`;
    setErrorLog((prev) => [...prev.slice(-4), logEntry]);
    console.error('Error boundary caught:', error, errorInfo);
  };

  return (
    <div className="space-y-8">
      <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
        <h3 className="mb-6 text-2xl font-semibold text-gray-800">
          Error Boundary Protection
        </h3>

        {/* Example 1: Basic Error Boundary */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              1. Basic Error Boundary
            </h4>
            <div className="rounded-lg bg-gray-100 p-6">
              <p className="mb-4 text-sm text-gray-600">
                Automatically catches and displays fallback UI when image fails
              </p>

              <ImageErrorBoundary>
                <Image
                  src="/broken-image-404.jpg"
                  alt="This image will fail"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </ImageErrorBoundary>

              <p className="mt-4 text-xs text-gray-500">
                ☝️ This shows the default error fallback
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              Implementation
            </h4>
            <CodeBlock language="tsx">
              {`import { Image, ImageErrorBoundary } from '@snapkit-studio/react';

// Wrap image components that might fail
<ImageErrorBoundary>
  <Image
    src="/broken-image-404.jpg"
    alt="This image will fail"
    width={300}
    height={200}
    className="rounded-lg shadow-md"
  />
</ImageErrorBoundary>

// The boundary catches errors and shows a fallback UI`}
            </CodeBlock>
          </div>
        </div>

        {/* Example 2: Custom Fallback */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              2. Custom Error Fallback
            </h4>
            <div className="rounded-lg bg-gray-100 p-6">
              <p className="mb-4 text-sm text-gray-600">
                Provide your own custom error UI
              </p>

              <ImageErrorBoundary fallback={<CustomErrorFallback />}>
                <Image
                  src="/another-broken-image.jpg"
                  alt="Custom error display"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </ImageErrorBoundary>

              <p className="mt-4 text-xs text-gray-500">
                ☝️ This shows a custom error component
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              Implementation
            </h4>
            <CodeBlock language="tsx">
              {`// Define custom error fallback
function CustomErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="error-container">
      <svg className="error-icon">...</svg>
      <h3>Oops! Something went wrong</h3>
      <p>{error?.message || 'The image could not be loaded'}</p>
    </div>
  );
}

// Use custom fallback
<ImageErrorBoundary fallback={<CustomErrorFallback />}>
  <Image src="/image.jpg" alt="Image" width={300} height={200} />
</ImageErrorBoundary>`}
            </CodeBlock>
          </div>
        </div>

        {/* Example 3: Error Logging */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              3. Error Logging & Monitoring
            </h4>
            <div className="rounded-lg bg-gray-100 p-6">
              <p className="mb-4 text-sm text-gray-600">
                Track errors for monitoring and debugging
              </p>

              <button
                onClick={() => setShowBroken(!showBroken)}
                className="mb-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {showBroken ? 'Hide' : 'Trigger'} Error
              </button>

              {showBroken && (
                <ImageErrorBoundary
                  fallback={<CustomErrorFallback />}
                  onError={handleError}
                >
                  <Image
                    src={brokenUrl}
                    alt="Error logging example"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </ImageErrorBoundary>
              )}

              {errorLog.length > 0 && (
                <div className="mt-4 rounded border border-gray-300 bg-white p-3">
                  <p className="mb-2 text-xs font-semibold text-gray-700">
                    Error Log:
                  </p>
                  <div className="space-y-1">
                    {errorLog.map((log, i) => (
                      <div key={i} className="font-mono text-xs text-red-600">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              Implementation
            </h4>
            <CodeBlock language="tsx">
              {`// Error handler for logging/monitoring
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  // Log to console in development
  console.error('Image Error:', error, errorInfo);

  // Send to error tracking service
  errorTracker.logError(error, {
    component: 'ImageComponent',
    ...errorInfo
  });
};

<ImageErrorBoundary
  fallback={<CustomErrorFallback />}
  onError={handleError}
>
  <Image src="/image.jpg" alt="Image" width={300} height={200} />
</ImageErrorBoundary>`}
            </CodeBlock>
          </div>
        </div>

        {/* Example 4: HOC Pattern */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              4. HOC Pattern (withImageErrorBoundary)
            </h4>
            <div className="rounded-lg bg-gray-100 p-6">
              <p className="mb-4 text-sm text-gray-600">
                Wrap components using Higher-Order Component pattern
              </p>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Working Image:
                  </p>
                  <ImageWithBoundary
                    src="/landing-page/fox.jpg"
                    alt="Working image with HOC"
                    width={250}
                    height={167}
                    className="rounded-lg shadow-md"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Broken Image (with HOC protection):
                  </p>
                  <ImageWithBoundary
                    src="/hoc-broken-image.jpg"
                    alt="Broken image with HOC"
                    width={250}
                    height={167}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                ☝️ HOC pattern automatically wraps components
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              Implementation
            </h4>
            <CodeBlock language="tsx">
              {`import { withImageErrorBoundary } from '@snapkit-studio/react';

// Create wrapped component using HOC
const SafeImage = withImageErrorBoundary(
  Image,
  <CustomErrorFallback />,
  (error, errorInfo) => {
    console.error('Image error:', error);
  }
);

// Use the wrapped component anywhere
<SafeImage
  src="/image.jpg"
  alt="Protected image"
  width={250}
  height={167}
/>

// Or wrap custom image components
const MyImageComponent = ({ src, ...props }) => (
  <div className="image-wrapper">
    <Image src={src} {...props} />
  </div>
);

const SafeMyImage = withImageErrorBoundary(
  MyImageComponent,
  <CustomErrorFallback />
);`}
            </CodeBlock>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-blue-800">
            📚 Best Practices
          </h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Always wrap image galleries and user-uploaded content with error
                boundaries
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Provide meaningful fallback UI that matches your design system
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Log errors to monitoring services for production debugging
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Use HOC pattern for consistent error handling across components
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Consider retry mechanisms for transient network failures
              </span>
            </li>
          </ul>
        </div>

        {/* Performance Note */}
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-yellow-800">
            ⚡ Performance Note
          </h4>
          <p className="text-sm text-yellow-700">
            Error boundaries prevent entire app crashes from image loading
            failures. They isolate errors to specific components, maintaining
            app stability and user experience even when individual images fail
            to load.
          </p>
        </div>
      </div>
    </div>
  );
}
