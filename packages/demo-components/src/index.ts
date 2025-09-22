// Components
export { DemoLayout, Sidebar, MobileMenu } from './components/DemoLayout';
export { ExampleContainer } from './components/ExampleContainer';
export { CodeBlock } from './components/CodeBlock';
export { NavGroup as NavGroupComponent } from './components/Navigation';

// Hooks
export { useScrollSpy } from './hooks/useScrollSpy';
export { useMediaQuery, useIsMobile, useIsDesktop } from './hooks/useMediaQuery';

// Types
export type {
  NavItem,
  NavGroup,
  DemoLayoutProps,
  ExampleContainerProps,
  CodeBlockProps,
} from './types';