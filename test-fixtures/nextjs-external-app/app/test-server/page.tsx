// Test ServerImage (no client-side JS)
import { Image } from '@snapkit-studio/nextjs';

export default function TestServerPage() {
  return (
    <div className="test-server-page" style={{ padding: '2rem' }}>
      <h1>Server Component Test</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 1. Basic ServerImage - should render without client JS */}
        <section data-testid="basic-server-image">
          <h2>1. Basic ServerImage (No event handlers)</h2>
          <Image
            src="https://picsum.photos/800/600"
            alt="Server rendered image"
            width={800}
            height={600}
            data-testid="server-image-basic"
          />
          <p>This should render as ServerImage with zero client JS</p>
        </section>

        {/* 2. ServerImage with priority */}
        <section data-testid="priority-server-image">
          <h2>2. ServerImage with Priority</h2>
          <Image
            src="https://picsum.photos/600/400"
            alt="Priority image"
            width={600}
            height={400}
            priority
            data-testid="server-image-priority"
          />
          <p>Priority prop but still server rendered</p>
        </section>

        {/* 3. ServerImage with sizes */}
        <section data-testid="responsive-server-image">
          <h2>3. Responsive ServerImage with sizes</h2>
          <Image
            src="https://picsum.photos/1200/800"
            alt="Responsive image"
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-testid="server-image-responsive"
          />
          <p>Uses native srcSet for responsiveness</p>
        </section>

        {/* 4. Fill mode ServerImage */}
        <section data-testid="fill-server-image">
          <h2>4. Fill Mode ServerImage</h2>
          <div style={{ position: 'relative', height: '400px', width: '100%' }}>
            <Image
              src="https://picsum.photos/1600/900"
              alt="Fill image"
              fill
              style={{ objectFit: 'cover' }}
              data-testid="server-image-fill"
            />
          </div>
          <p>Fill mode with object-cover</p>
        </section>

        {/* 5. Multiple formats test */}
        <section data-testid="format-server-image">
          <h2>5. Format Optimization Test</h2>
          <Image
            src="https://picsum.photos/600/600"
            alt="Format test"
            width={600}
            height={600}
            transforms={{ format: 'webp' }}
            data-testid="server-image-format"
          />
          <p>WebP format optimization</p>
        </section>
      </div>
    </div>
  );
}
