"use client";

import { ImageTransforms } from "@snapkit-studio/core";
import { useSnapkitConfig } from "@snapkit-studio/react";
import NextImage, { type ImageProps } from "next/image";
import { createSnapkitLoader } from "./image-loader";
import { calculateEnhancedStyle } from "./utils";

interface SnapkitImageProps extends Omit<ImageProps, "loader"> {
  transforms?: ImageTransforms;
}

export function Image({ src, transforms, style, ...props }: SnapkitImageProps) {
  const config = useSnapkitConfig();

  const loader = createSnapkitLoader({
    organizationName: config.organizationName,
    baseUrl: config.baseUrl,
    defaultFormat: config.defaultFormat,
    transforms,
  });

  const isUrlImageSource = typeof src === "string";

  if (!isUrlImageSource) {
    return <NextImage {...props} src={src} style={style} />;
  }

  const numWidth = props.width ? Number(props.width) : undefined;
  const numHeight = props.height ? Number(props.height) : undefined;

  const enhancedStyle = calculateEnhancedStyle(numWidth, numHeight, style);

  return (
    <NextImage
      {...props}
      className={props.className}
      src={src}
      loader={loader}
      style={enhancedStyle}
    />
  );
}
