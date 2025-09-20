"use client";

import { ImageTransforms } from "@snapkit-studio/core";
import { useSnapkitConfig } from "@snapkit-studio/react";
import NextImage, { ImageLoader, type ImageProps } from 'next/image';
import { createSnapkitLoader } from "./image-loader";
import { calculateEnhancedStyle } from "./utils";

interface SnapkitImageProps extends Omit<ImageProps, "loader"> {
  transforms?: ImageTransforms;
}

export function Image({ src, transforms, style, ...props }: SnapkitImageProps) {
  const config = useSnapkitConfig();

  // Validate configuration
  if (!config) {
    throw new Error(
      'Snapkit configuration not found. Please ensure your component is wrapped with SnapkitProvider. ' +
      'Example: <SnapkitProvider organizationName="your-org">{children}</SnapkitProvider>'
    );
  }

  if (!config.organizationName) {
    throw new Error(
      'Missing organization name in Snapkit configuration. ' +
      'Please provide organizationName prop to SnapkitProvider.'
    );
  }

  let loader: ImageLoader;
  try {
    loader = createSnapkitLoader({
      organizationName: config.organizationName,
      unoptimizedFormat: config.defaultFormat === 'off',
      transforms,
    });
  } catch (error) {
    throw new Error(
      'Failed to create Snapkit loader: ' +
      (error instanceof Error ? error.message : String(error))
    );
  }

  const isUrlImageSource = typeof src === "string";

  if (!isUrlImageSource) {
    // For static imports, use Next.js Image without Snapkit optimization
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
