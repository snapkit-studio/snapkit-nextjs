import { forwardRef } from 'react';
import { SnapkitImageProps } from '@snapkit-studio/core';

import { ClientImage } from './ClientImage';
import { ServerImage } from './ServerImage';

/**
 * Snapkit Image Component with automatic Server/Client selection
 *
 * Automatically selects between ServerImage and ClientImage based on props:
 * - Uses ServerImage by default for better performance (no JavaScript required)
 * - Uses ClientImage when client-side features are needed:
 *   - Event handlers (onLoad, onError)
 *   - Network quality adjustment
 *   - Priority preloading
 *
 * @example
 * ```tsx
 * // Renders as ServerImage (no JavaScript needed)
 * <Image src="/path/to/image.jpg" alt="Description" width={800} height={600} />
 *
 * // Renders as ClientImage (onLoad handler requires browser)
 * <Image
 *   src="/path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   onLoad={() => console.log('Loaded!')}
 * />
 *
 * // Renders as ClientImage (network adaptation requires browser)
 * <Image
 *   src="/path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   adjustQualityByNetwork={true}
 * />
 * ```
 */
export const Image = forwardRef<HTMLImageElement, SnapkitImageProps>(
  (props, ref) => {
    // Determine if client-side features are required
    const requiresClientFeatures = !!(
      props.onLoad ||
      props.onError ||
      props.adjustQualityByNetwork ||
      props.priority // Priority preloading requires client-side <link> injection
    );

    // Select the appropriate component based on requirements
    if (requiresClientFeatures) {
      return <ClientImage ref={ref} {...props} />;
    }

    // Default to server component for better performance
    return <ServerImage ref={ref} {...props} />;
  },
);

Image.displayName = 'SnapkitImage';
