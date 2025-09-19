import { Image } from "@snapkit-studio/nextjs";

export function SnapkitImageExample() {
  return (
    <Image
      src="/landing-page/fox.jpg"
      alt="Demo image with Snapkit React component"
      width={400}
      height={300}
      className="object-contain"
      transforms={{
        grayscale: true,
        flop: true,
        quality: 100,
      }}
    />
  );
}
