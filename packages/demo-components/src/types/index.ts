export interface NavItem {
  id: string;
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

export interface DemoLayoutProps {
  title: string;
  description?: string;
  navigation: NavGroup[];
  children: React.ReactNode;
}

export interface ExampleContainerProps {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  code?: string;
  language?: string;
}

export interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}
