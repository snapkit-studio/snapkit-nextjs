import { Image } from "@snapkit-studio/nextjs";

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
}
