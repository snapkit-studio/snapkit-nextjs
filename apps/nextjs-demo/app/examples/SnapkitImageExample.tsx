import { Image } from '@snapkit-studio/nextjs';

import { CodeBlock } from '../components/CodeBlock';

export function SnapkitImageExample() {
  return (
    <>
      <Image
        src="/landing-page/fox.jpg"
        alt="fox image with grayscale and flop"
        width={400}
        height={300}
        className="object-contain"
        transforms={{
          grayscale: true,
          flop: true,
        }}
      />
      <CodeBlock language="tsx">
        {`import { Image } from "@snapkit-studio/nextjs";

export function SnapkitImageExample() {
  return (
    <Image
      src="/landing-page/fox.jpg"
      alt="fox image with grayscale and flop"
      width={400}
      height={300}
      className="object-contain"
      transforms={{
        grayscale: true,
        flop: true,
      }}
    />
  );
}`}
      </CodeBlock>
    </>
  );
}
