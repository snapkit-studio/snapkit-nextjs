"use client";

import Image from "next/image";
import { SnapkitTransformBuilder } from "@snapkit-studio/core";
import { createSnapkitLoader } from "@snapkit-studio/nextjs";

export function SnapkitImageLoaderExample() {
  const loader = createSnapkitLoader({ organizationName: "snapkit" });
  const src = new SnapkitTransformBuilder().build("/landing-page/fox.jpg", {
    grayscale: true,
    flop: true,
  });

  return (
    <Image
      src={src}
      alt="fox image with grayscale and flop"
      width={400}
      height={300}
      style={{
        width: 400,
        height: 300,
      }}
      className="object-contain"
      loader={loader}
    />
  );
}
