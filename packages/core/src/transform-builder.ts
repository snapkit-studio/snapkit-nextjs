import { ImageTransforms } from "./types";

export class SnapkitTransformBuilder {
  build(src: string, transforms: ImageTransforms): string {
    const urlParams = new URLSearchParams();

    Object.entries(transforms).forEach(([key, value]) => {
      urlParams.set(key, value.toString());
    });

    return `${src}?${urlParams.toString()}`;
  }
}