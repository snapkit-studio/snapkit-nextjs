import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Image } from '../Image';
import { SnapkitProvider } from '../../providers/SnapkitProvider';
import { createImageUrl } from '../../utils/createImageUrl';

// Mock @snapkit-studio/core
vi.mock('@snapkit-studio/core', () => ({
  SnapkitUrlBuilder: vi.fn().mockImplementation(() => ({
    buildTransformedUrl: vi.fn((src, transforms) => {
      // Create a mock URL with transforms
      const params = new URLSearchParams();
      if (transforms.width) params.append('w', transforms.width.toString());
      if (transforms.height) params.append('h', transforms.height.toString());
      if (transforms.quality) params.append('q', transforms.quality.toString());
      if (transforms.format) params.append('f', transforms.format);

      const mockUrl = `https://demo-cdn.snapkit.studio${src}`;
      return params.toString() ? `${mockUrl}?${params.toString()}` : mockUrl;
    }),
  })),
  getBestSupportedFormat: vi.fn(() => 'webp'),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SnapkitProvider
    config={{
      organizationName: 'demo',
      baseUrl: 'https://demo-cdn.snapkit.studio',
      defaultQuality: 85,
      defaultFormat: 'webp',
    }}
  >
    {children}
  </SnapkitProvider>
);

describe('Image component', () => {
  it('should render image with basic props', () => {
    render(
      <TestWrapper>
        <Image src="/test-image.jpg" alt="Test image" width={200} height={150} />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('width', '200');
    expect(img).toHaveAttribute('height', '150');
    expect(img).toHaveAttribute('src');
  });

  it('should generate optimized URL with transforms', () => {
    render(
      <TestWrapper>
        <Image
          src="/test-image.jpg"
          alt="Test image"
          width={400}
          height={300}
          quality={90}
          transforms={{ blur: 5 }}
        />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    const src = img.getAttribute('src');

    expect(src).toContain('demo-cdn.snapkit.studio');
    expect(src).toContain('/test-image.jpg');
    expect(src).toContain('w=400');
    expect(src).toContain('h=300');
    expect(src).toContain('q=90');
  });

  it('should apply aspect ratio styles when only width is provided', () => {
    render(
      <TestWrapper>
        <Image src="/test-image.jpg" alt="Test image" width={300} />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    const style = img.style;

    expect(style.width).toBe('300px');
    expect(style.height).toBe('');
  });

  it('should apply aspect ratio styles when only height is provided', () => {
    render(
      <TestWrapper>
        <Image src="/test-image.jpg" alt="Test image" height={200} />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    const style = img.style;

    expect(style.width).toBe('auto');
    expect(style.height).toBe('200px');
  });

  it('should apply both width and height when provided', () => {
    render(
      <TestWrapper>
        <Image src="/test-image.jpg" alt="Test image" width={400} height={300} />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    const style = img.style;

    expect(style.width).toBe('400px');
    expect(style.height).toBe('300px');
  });

  it('should set loading to eager when priority is true', () => {
    render(
      <TestWrapper>
        <Image
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={150}
          priority={true}
        />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('should set loading to lazy by default', () => {
    render(
      <TestWrapper>
        <Image src="/test-image.jpg" alt="Test image" width={200} height={150} />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should merge custom styles with calculated styles', () => {
    render(
      <TestWrapper>
        <Image
          src="/test-image.jpg"
          alt="Test image"
          width={300}
          style={{ border: '1px solid red', opacity: 0.8 }}
        />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    const style = img.style;

    expect(style.width).toBe('300px');
    expect(style.border).toBe('1px solid red');
    expect(style.opacity).toBe('0.8');
  });

  it('should apply className', () => {
    render(
      <TestWrapper>
        <Image
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={150}
          className="custom-image-class"
        />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('custom-image-class');
  });

  it('should pass through other HTML img attributes', () => {
    render(
      <TestWrapper>
        <Image
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={150}
          title="Test title"
          data-testid="test-image"
        />
      </TestWrapper>
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('title', 'Test title');
    expect(img).toHaveAttribute('data-testid', 'test-image');
  });
});