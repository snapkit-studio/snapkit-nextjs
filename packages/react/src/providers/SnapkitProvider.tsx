'use client';

import { preloadFormatSupport, SnapkitConfig } from '@snapkit-studio/core';
import React, { createContext, useContext, useEffect } from 'react';

const SnapkitContext = createContext<SnapkitConfig>({});

export interface SnapkitProviderProps extends SnapkitConfig {
  children: React.ReactNode;
}

/**
 * Provider that provides global Snapkit configuration
 *
 * @example
 * ```tsx
 * import { SnapkitProvider } from '@snapkit-studio/nextjs';
 *
 * // Basic setup
 * function App() {
 *   return (
 *     <SnapkitProvider
 *       baseUrl="https://images.example.com"
 *       organizationName="my-company"
 *       defaultQuality={85}
 *     >
 *       <MyApp />
 *     </SnapkitProvider>
 *   );
 * }
 *
 * // Advanced configuration
 * function App() {
 *   return (
 *     <SnapkitProvider
 *       baseUrl="https://cdn.example.com"
 *       organizationName="acme-corp"
 *       defaultQuality={90}
 *       defaultFormat="webp"
 *     >
 *       <MyApp />
 *     </SnapkitProvider>
 *   );
 * }
 * ```
 */
export function SnapkitProvider({
  children,
  baseUrl,
  organizationName,
  defaultQuality = 85,
  defaultFormat = 'auto',
  ...config
}: SnapkitProviderProps) {
  const contextValue: SnapkitConfig = {
    baseUrl,
    organizationName,
    defaultQuality,
    defaultFormat,
    ...config,
  };


  // Preload format support detection
  useEffect(() => {
    preloadFormatSupport();
  }, []);

  return (
    <SnapkitContext.Provider value={contextValue}>
      {children}
    </SnapkitContext.Provider>
  );
}

/**
 * Hook to access Snapkit configuration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const config = useSnapkitConfig();
 *
 *   return (
 *     <div>
 *       <p>Base URL: {config.baseUrl}</p>
 *       <p>Organization: {config.organizationName}</p>
 *       <p>Default Quality: {config.defaultQuality}</p>
 *     </div>
 *   );
 * }
 *
 * // Using config in custom hook
 * function useCustomImageUrl(src: string) {
 *   const { baseUrl, organizationName, defaultQuality } = useSnapkitConfig();
 *
 *   return useMemo(() => {
 *     return buildImageUrl(src, { quality: defaultQuality }, {
 *       baseUrl,
 *       organizationName
 *     });
 *   }, [src, baseUrl, organizationName, defaultQuality]);
 * }
 * ```
 */
export function useSnapkitConfig(): SnapkitConfig {
  const context = useContext(SnapkitContext);
  return context;
}
