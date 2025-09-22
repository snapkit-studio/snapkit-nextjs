import { Image } from '@snapkit-studio/nextjs';

export default function TestAutoSelectPage() {
  return (
    <div className="test-auto-select-page" style={{ padding: '2rem' }}>
      <h1>Auto Component Selection Test</h1>
      <p>This page tests automatic selection between ServerImage and ClientImage based on props</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Should render as ServerImage (no client features) */}
        <section data-testid="auto-server">
          <h2>1. Should Auto-Select ServerImage</h2>
          <Image
            src="https://picsum.photos/800/600"
            alt="Auto server selection"
            width={800}
            height={600}
            priority
            data-testid="auto-image-server"
          />
          <p>No client features → ServerImage</p>
        </section>

        {/* Should render as ClientImage (has onLoad) */}
        <section data-testid="auto-client">
          <h2>2. Should Auto-Select ClientImage</h2>
          <Image
            src="https://picsum.photos/800/600"
            alt="Auto client selection"
            width={800}
            height={600}
            onLoad={() => console.log('Auto-selected client image loaded')}
            data-testid="auto-image-client"
          />
          <p>Has onLoad handler → ClientImage</p>
        </section>

        {/* Force server mode despite client feature */}
        <section data-testid="force-server">
          <h2>3. Force Server Mode</h2>
          <Image
            src="https://picsum.photos/800/600"
            alt="Forced server mode"
            width={800}
            height={600}
            optimize="server"
            adjustQualityByNetwork={true}  // This would normally trigger client mode
            data-testid="forced-server-image"
          />
          <p>optimize="server" overrides client features</p>
        </section>

        {/* Force client mode despite no client features */}
        <section data-testid="force-client">
          <h2>4. Force Client Mode</h2>
          <Image
            src="https://picsum.photos/800/600"
            alt="Forced client mode"
            width={800}
            height={600}
            optimize="client"
            data-testid="forced-client-image"
          />
          <p>optimize="client" forces client rendering</p>
        </section>

        {/* Network adaptive should auto-select client */}
        <section data-testid="auto-network">
          <h2>5. Network Features Auto-Select Client</h2>
          <Image
            src="https://picsum.photos/800/600"
            alt="Network adaptive auto selection"
            width={800}
            height={600}
            adjustQualityByNetwork={true}
            data-testid="auto-image-network"
          />
          <p>adjustQualityByNetwork → ClientImage</p>
        </section>

        {/* Multiple images with different selection logic */}
        <section data-testid="mixed-selection">
          <h2>6. Mixed Selection in Same Page</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <Image
                src="https://picsum.photos/400/300?server"
                alt="Server image in grid"
                width={400}
                height={300}
                data-testid="mixed-server"
              />
              <p>Server</p>
            </div>
            <div>
              <Image
                src="https://picsum.photos/400/300?client"
                alt="Client image in grid"
                width={400}
                height={300}
                onLoad={() => console.log('Grid client loaded')}
                data-testid="mixed-client"
              />
              <p>Client (has onLoad)</p>
            </div>
            <div>
              <Image
                src="https://picsum.photos/400/300?network"
                alt="Network adaptive in grid"
                width={400}
                height={300}
                adjustQualityByNetwork={true}
                data-testid="mixed-network"
              />
              <p>Client (network adaptive)</p>
            </div>
            <div>
              <Image
                src="https://picsum.photos/400/300?priority"
                alt="Priority image in grid"
                width={400}
                height={300}
                priority
                data-testid="mixed-priority"
              />
              <p>Server (priority only)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}