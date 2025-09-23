import {
  DemoLayout,
  ExampleContainer,
  type NavGroup,
} from '@repo/demo-components';

import { DPROptimizationExample } from './examples/DPROptimizationExample';
import { ReactServerComponentExample } from './examples/ReactServerComponentExample';
import ServerClientImageExample from './examples/ServerClientImageExample';
import { SnapkitImageExample } from './examples/SnapkitImageExample';

const navigation: NavGroup[] = [
  {
    title: 'Basic Features',
    items: [{ id: 'basic', title: 'Basic Image Component', href: '#basic' }],
    defaultOpen: true,
  },
  {
    title: 'Next.js Features',
    items: [
      {
        id: 'server-client',
        title: 'Server/Client Components',
        href: '#server-client',
      },
    ],
    defaultOpen: true,
  },
  {
    title: 'React Features',
    items: [
      {
        id: 'react-server-client',
        title: 'React Server Components',
        href: '#react-server-client',
      },
    ],
    defaultOpen: true,
  },
  {
    title: 'Performance',
    items: [{ id: 'dpr', title: 'DPR Optimization', href: '#dpr' }],
    defaultOpen: true,
  },
];

export default function Home() {
  return (
    <DemoLayout
      title="Snapkit Next.js Demo"
      description="Explore the features of Snapkit's Next.js image components with server-side rendering and optimizations."
      navigation={navigation}
    >
      {/* Basic Image Component */}
      <ExampleContainer
        id="basic"
        title="Basic Image Component"
        description="Simple usage of Snapkit Image component with automatic optimizations."
        code={`<Image
  src="/landing-page/fox.jpg"
  alt="Example image"
  width={300}
  height={200}
  className="rounded-lg shadow-md"
/>`}
      >
        <SnapkitImageExample />
      </ExampleContainer>

      {/* Next.js Server/Client Component Demo */}
      <div id="server-client" className="scroll-mt-20">
        <ServerClientImageExample />
      </div>

      {/* React Package Server/Client Component Demo */}
      <div id="react-server-client" className="scroll-mt-20">
        <ReactServerComponentExample />
      </div>

      {/* DPR Optimization Demo */}
      <div id="dpr" className="scroll-mt-20">
        <DPROptimizationExample />
      </div>
    </DemoLayout>
  );
}
