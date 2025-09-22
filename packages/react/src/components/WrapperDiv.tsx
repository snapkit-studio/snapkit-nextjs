import { CSSProperties, ReactNode } from 'react';

interface WrapperDivProps {
  fill?: boolean;
  reservedSpace?: CSSProperties | null;
  children: ReactNode;
}

/**
 * Wrapper div component for images that need container styling
 * Extracted to improve code reusability and reduce duplication
 */
export function WrapperDiv({ fill, reservedSpace, children }: WrapperDivProps) {
  return (
    <div
      style={{
        position: fill ? 'relative' : undefined,
        width: fill ? '100%' : undefined,
        height: fill ? '100%' : undefined,
        ...reservedSpace,
      }}
    >
      {children}
    </div>
  );
}
