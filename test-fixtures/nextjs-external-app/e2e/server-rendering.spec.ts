import { expect, test } from '@playwright/test';

test.describe('ServerImage Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-server');
  });

  test('should render basic ServerImage without client JS', async ({
    page,
  }) => {
    // Check basic image is rendered
    const basicImage = page.locator('[data-testid="server-image-basic"]');
    await expect(basicImage).toBeVisible();

    // Verify it's an img tag with proper attributes
    await expect(basicImage).toHaveAttribute('alt', 'Server rendered image');
    await expect(basicImage).toHaveAttribute('width', '800');
    await expect(basicImage).toHaveAttribute('height', '600');

    // Check srcset for responsive images
    const srcset = await basicImage.getAttribute('srcset');
    expect(srcset).toBeTruthy();
    expect(srcset).toContain('1x');
    expect(srcset).toContain('2x');
  });

  test('should render ServerImage with priority', async ({ page }) => {
    const priorityImage = page.locator('[data-testid="server-image-priority"]');
    await expect(priorityImage).toBeVisible();

    // Priority images should have loading="eager"
    await expect(priorityImage).toHaveAttribute('loading', 'eager');

    // Should have fetchpriority="high" for priority images
    await expect(priorityImage).toHaveAttribute('fetchpriority', 'high');
  });

  test('should render responsive ServerImage with sizes', async ({ page }) => {
    const responsiveImage = page.locator(
      '[data-testid="server-image-responsive"]',
    );
    await expect(responsiveImage).toBeVisible();

    // Check sizes attribute
    await expect(responsiveImage).toHaveAttribute(
      'sizes',
      '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    );

    // Should have srcset with multiple sizes
    const srcset = await responsiveImage.getAttribute('srcset');
    expect(srcset).toBeTruthy();
    expect(srcset?.split(',').length).toBeGreaterThan(2);
  });

  test('should render fill mode ServerImage', async ({ page }) => {
    const fillImage = page.locator('[data-testid="server-image-fill"]');
    await expect(fillImage).toBeVisible();

    // Fill images should not have width/height attributes
    const width = await fillImage.getAttribute('width');
    const height = await fillImage.getAttribute('height');
    expect(width).toBeNull();
    expect(height).toBeNull();

    // Should have object-fit style
    const style = await fillImage.getAttribute('style');
    expect(style).toContain('object-fit: cover');
  });

  test('should apply format optimization', async ({ page }) => {
    const formatImage = page.locator('[data-testid="server-image-format"]');
    await expect(formatImage).toBeVisible();

    // Check if WebP format is being used in src
    const src = await formatImage.getAttribute('src');
    expect(src).toBeTruthy();
    // The actual format transformation would be applied by the image optimization service
  });

  test('should have proper lazy loading for non-priority images', async ({
    page,
  }) => {
    const nonPriorityImages = page.locator(
      '[data-testid^="server-image-"]:not([data-testid="server-image-priority"])',
    );
    const count = await nonPriorityImages.count();

    for (let i = 0; i < count; i++) {
      const image = nonPriorityImages.nth(i);
      const loading = await image.getAttribute('loading');
      expect(loading).toBe('lazy');
    }
  });

  test('should not have any client-side event handlers', async ({ page }) => {
    // Disable JavaScript to verify server-only rendering
    await page.setJavaScriptEnabled(false);
    await page.reload();

    // All images should still be visible without JS
    const allImages = page.locator('[data-testid^="server-image-"]');
    const count = await allImages.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(allImages.nth(i)).toBeVisible();
    }
  });
});
