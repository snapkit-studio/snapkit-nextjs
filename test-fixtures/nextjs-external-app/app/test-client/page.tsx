'use client';

import { Image } from '@snapkit-studio/nextjs';
import { useState } from 'react';

export default function TestClientPage() {
  const [loadStatus, setLoadStatus] = useState<Record<string, string>>({});
  const [errorStatus, setErrorStatus] = useState<Record<string, string>>({});

  const handleLoad = (id: string) => {
    setLoadStatus(prev => ({ ...prev, [id]: 'loaded' }));
    console.log(`Image ${id} loaded`);
  };

  const handleError = (id: string) => {
    setErrorStatus(prev => ({ ...prev, [id]: 'error' }));
    console.error(`Image ${id} failed to load`);
  };

  return (
    <div className="test-client-page" style={{ padding: '2rem' }}>
      <h1>Client Component Test</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 1. ClientImage with onLoad handler */}
        <section data-testid="client-onload">
          <h2>1. ClientImage with onLoad Handler</h2>
          <Image
            src="https://picsum.photos/800/600"
            alt="Client image with onLoad"
            width={800}
            height={600}
            onLoad={() => handleLoad('image1')}
            data-testid="client-image-onload"
          />
          <p data-testid="status-image1">
            Status: {loadStatus.image1 || 'loading...'}
          </p>
          <p>Has onLoad handler → automatically renders as ClientImage</p>
        </section>

        {/* 2. ClientImage with error handling */}
        <section data-testid="client-onerror">
          <h2>2. ClientImage with Error Handler</h2>
          <Image
            src="/broken-image-404.jpg"
            alt="Image with error handler"
            width={600}
            height={400}
            onError={() => handleError('image2')}
            data-testid="client-image-onerror"
          />
          <p data-testid="status-error-image2">
            Status: {errorStatus.image2 || 'loading...'}
          </p>
          <p>Has onError handler → automatically renders as ClientImage</p>
        </section>

        {/* 3. ClientImage with network quality adjustment */}
        <section data-testid="client-network-adaptive">
          <h2>3. Network-Adaptive ClientImage</h2>
          <Image
            src="https://picsum.photos/1200/800"
            alt="Network adaptive image"
            width={1200}
            height={800}
            adjustQualityByNetwork={true}
            onLoad={() => handleLoad('image3')}
            data-testid="client-image-network"
          />
          <p data-testid="status-image3">
            Status: {loadStatus.image3 || 'loading...'}
          </p>
          <p>adjustQualityByNetwork → requires browser APIs → ClientImage</p>
        </section>

        {/* 4. Forced client mode */}
        <section data-testid="client-forced">
          <h2>4. Forced Client Mode</h2>
          <Image
            src="https://picsum.photos/600/600"
            alt="Forced client"
            width={600}
            height={600}
            optimize="client"
            onLoad={() => handleLoad('image4')}
            data-testid="client-image-forced"
          />
          <p data-testid="status-image4">
            Status: {loadStatus.image4 || 'loading...'}
          </p>
          <p>optimize="client" → explicitly forced ClientImage</p>
        </section>

        {/* 5. Interactive gallery */}
        <section data-testid="client-gallery">
          <h2>5. Interactive Gallery (All ClientImages)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} style={{ position: 'relative' }}>
                <Image
                  src={`https://picsum.photos/400/300?random=${num}`}
                  alt={`Gallery image ${num}`}
                  width={400}
                  height={300}
                  onLoad={() => handleLoad(`gallery${num}`)}
                  data-testid={`client-image-gallery-${num}`}
                  style={{ width: '100%', height: 'auto' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  data-testid={`status-gallery${num}`}
                >
                  {loadStatus[`gallery${num}`] === 'loaded' ? '✓' : '⏳'}
                </div>
              </div>
            ))}
          </div>
          <p>All have onLoad handlers → all ClientImages</p>
        </section>

        {/* Status summary */}
        <section data-testid="status-summary" style={{ marginTop: '3rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Load Status Summary:</h3>
          <pre data-testid="load-status-json">{JSON.stringify(loadStatus, null, 2)}</pre>
          {Object.keys(errorStatus).length > 0 && (
            <>
              <h3>Error Status:</h3>
              <pre data-testid="error-status-json">{JSON.stringify(errorStatus, null, 2)}</pre>
            </>
          )}
        </section>
      </div>
    </div>
  );
}