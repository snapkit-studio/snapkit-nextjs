'use client';

import type { ExampleContainerProps } from '../../types';
import { CodeBlock } from '../CodeBlock';

export function ExampleContainer({
  id,
  title,
  description,
  children,
  code,
  language = 'tsx',
}: ExampleContainerProps) {
  return (
    <div id={id} className="scroll-mt-20">
      <div className="rounded-lg bg-white p-6 shadow-lg lg:p-8">
        <h3 className="mb-4 text-2xl font-semibold text-gray-800 lg:mb-6">
          {title}
        </h3>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Live Demo */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-700">
              Live Demo
            </h4>
            <div className="rounded-lg bg-gray-100 p-4 lg:p-6">
              {children}
            </div>
            {description && (
              <p className="mt-4 text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>

          {/* Code */}
          {code && (
            <div>
              <h4 className="mb-4 text-lg font-medium text-gray-700">
                Implementation
              </h4>
              <CodeBlock language={language}>
                {code}
              </CodeBlock>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}