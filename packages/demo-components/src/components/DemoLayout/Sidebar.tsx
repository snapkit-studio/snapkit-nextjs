'use client';

import { clsx } from 'clsx';

import type { NavGroup } from '../../types';
import { NavGroup as NavGroupComponent } from '../Navigation';

interface SidebarProps {
  navigation: NavGroup[];
  activeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  navigation,
  activeId,
  isOpen,
  onClose,
}: SidebarProps) {
  const handleItemClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-30 bg-gray-600 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-full w-64 transform bg-white shadow-lg transition-transform lg:static lg:z-auto lg:h-auto lg:w-64 lg:translate-x-0 lg:border-r lg:border-gray-200 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900">Examples</h2>
          </div>
          <nav>
            {navigation.map((group, index) => (
              <NavGroupComponent
                key={index}
                group={group}
                activeId={activeId}
                onItemClick={handleItemClick}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
