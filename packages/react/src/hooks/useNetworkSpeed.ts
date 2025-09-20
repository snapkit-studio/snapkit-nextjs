'use client';

import { useEffect, useState } from 'react';
import { NetworkSpeed, detectNetworkSpeed } from '@snapkit-studio/core';

/**
 * Hook to detect and monitor network speed changes
 * @returns Current network speed type
 */
export function useNetworkSpeed(): NetworkSpeed {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>(detectNetworkSpeed());

  useEffect(() => {
    const updateNetworkSpeed = () => {
      setNetworkSpeed(detectNetworkSpeed());
    };

    // Listen for network changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection?.addEventListener('change', updateNetworkSpeed);

      return () => {
        connection?.removeEventListener('change', updateNetworkSpeed);
      };
    }

    // Also listen for online/offline events
    window.addEventListener('online', updateNetworkSpeed);
    window.addEventListener('offline', updateNetworkSpeed);

    return () => {
      window.removeEventListener('online', updateNetworkSpeed);
      window.removeEventListener('offline', updateNetworkSpeed);
    };
  }, []);

  return networkSpeed;
}