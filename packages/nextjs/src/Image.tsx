import dynamic from 'next/dynamic';

import { ServerImage } from './ServerImage';
import type { SnapkitImageProps } from './types';
import { forceServerRendering, requiresClientFeatures } from './types';

// Dynamically import ClientImage to handle client-server boundary
const ClientImage = dynamic(() =>
  import('./ClientImage').then((mod) => mod.ClientImage),
);

/**
 * Smart Image component that automatically chooses between
 * server and client rendering based on props
 *
 * @example
 * // Automatically renders as server component (no client features)
 * <Image src="/static.jpg" width={800} height={600} alt="Static" />
 *
 * // Automatically renders as client component (has onLoad handler)
 * <Image src="/interactive.jpg" width={800} height={600} alt="Interactive" onLoad={() => {}} />
 *
 * // Force server rendering
 * <Image src="/forced.jpg" optimize="server" alt="Server" />
 */
export function Image(props: SnapkitImageProps) {
  // Step 1: Check for explicit optimization mode
  if (forceServerRendering(props)) {
    return <ServerImage {...props} />;
  }

  // Step 2: Check if props require client-side features
  if (requiresClientFeatures(props)) {
    return <ClientImage {...props} />;
  }

  // Step 3: Default to server component for optimal performance
  // Server components provide better initial load performance
  // and smaller bundle sizes
  return <ServerImage {...props} />;
}
