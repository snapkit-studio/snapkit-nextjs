'use client';

import { useState, useEffect } from 'react';
import type { DemoLayoutProps } from '../../types';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';

export function DemoLayout({
  title,
  description,
  navigation,
  children,
}: DemoLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get all navigation item IDs
  const allIds = navigation.flatMap(group => group.items.map(item => item.id));
  const activeId = useScrollSpy(allIds);

  // Close sidebar when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <MobileMenu
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          navigation={navigation}
          activeId={activeId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl">
                {title}
              </h1>
              {description && (
                <p className="mt-4 text-lg text-gray-600 lg:text-xl max-w-3xl">
                  {description}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-16">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}