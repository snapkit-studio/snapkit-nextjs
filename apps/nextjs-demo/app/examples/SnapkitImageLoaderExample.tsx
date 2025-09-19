"use client";

import Image from "next/image";
import { createSnapkitLoader } from "@snapkit-studio/nextjs";

export function SnapkitImageLoaderExample() {
  const loader = createSnapkitLoader({ organizationName: "snapkit" });

  return (
    <Image
      src="/landing-page/fox.jpg"
      alt="Demo image with Next.js Image and Snapkit loader"
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
