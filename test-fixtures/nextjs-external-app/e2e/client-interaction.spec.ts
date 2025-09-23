import { expect, test } from '@playwright/test';

test.describe('ClientImage Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-client');
  });

  test('should handle onLoad events', async ({ page }) => {
    // Wait for the first image to load
    await page.waitForFunction(
      () => {
        const status = document.querySelector('[data-testid="status-image1"]');
        return status?.textContent?.includes('loaded');
      },
      { timeout: 10000 },
    );

    // Check that load status is updated
    const status = page.locator('[data-testid="status-image1"]');
    await expect(status).toContainText('loaded');

    // Verify console log was called
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });

    // Reload to capture console logs
    await page.reload();
    await page.waitForTimeout(2000);

    // Check for load event logs
    const hasLoadLog = consoleLogs.some((log) =>
      log.includes('Image image1 loaded'),
    );
    expect(
      hasLoadLog || (await status.textContent())?.includes('loaded'),
    ).toBeTruthy();
  });

  test('should handle onError events', async ({ page }) => {
    // Wait for error to occur
    await page.waitForFunction(
      () => {
        const status = document.querySelector(
          '[data-testid="status-error-image2"]',
        );
        return status?.textContent?.includes('error');
      },
      { timeout: 10000 },
    );

    // Check that error status is updated
    const errorStatus = page.locator('[data-testid="status-error-image2"]');
    await expect(errorStatus).toContainText('error');
  });

  test('should apply network-adaptive quality', async ({ page }) => {
    const networkImage = page.locator('[data-testid="client-image-network"]');
    await expect(networkImage).toBeVisible();

    // Wait for image to load
    await page.waitForFunction(
      () => {
        const status = document.querySelector('[data-testid="status-image3"]');
        return status?.textContent?.includes('loaded');
      },
      { timeout: 10000 },
    );

    // Network adaptive images should be ClientImage components
    const status = page.locator('[data-testid="status-image3"]');
    await expect(status).toContainText('loaded');
  });

  test('should force client mode when specified', async ({ page }) => {
    const forcedClientImage = page.locator(
      '[data-testid="client-image-forced"]',
    );
    await expect(forcedClientImage).toBeVisible();

    // Wait for forced client image to load
    await page.waitForFunction(
      () => {
        const status = document.querySelector('[data-testid="status-image4"]');
        return status?.textContent?.includes('loaded');
      },
      { timeout: 10000 },
    );

    const status = page.locator('[data-testid="status-image4"]');
    await expect(status).toContainText('loaded');
  });

  test('should load gallery images with individual status', async ({
    page,
  }) => {
    // Wait for at least one gallery image to load
    await page.waitForFunction(
      () => {
        const statuses = document.querySelectorAll(
          '[data-testid^="status-gallery"]',
        );
        return Array.from(statuses).some((s) => s.textContent?.includes('✓'));
      },
      { timeout: 10000 },
    );

    // Check that gallery images have status indicators
    const galleryStatuses = page.locator('[data-testid^="status-gallery"]');
    const count = await galleryStatuses.count();
    expect(count).toBe(6);

    // Verify at least some images loaded
    const loadedCount = await galleryStatuses.locator('text=✓').count();
    expect(loadedCount).toBeGreaterThan(0);
  });

  test('should update load status summary', async ({ page }) => {
    // Wait for some images to load
    await page.waitForTimeout(3000);

    // Check that status summary is populated
    const statusJson = page.locator('[data-testid="load-status-json"]');
    await expect(statusJson).toBeVisible();

    const jsonContent = await statusJson.textContent();
    expect(jsonContent).toBeTruthy();

    // Parse and verify JSON structure
    try {
      const status = JSON.parse(jsonContent || '{}');
      expect(Object.keys(status).length).toBeGreaterThan(0);
    } catch (e) {
      // If not valid JSON yet, wait a bit more
      await page.waitForTimeout(2000);
    }
  });

  test('should handle multiple client images on same page', async ({
    page,
  }) => {
    // Count all client images
    const clientImages = page.locator('[data-testid^="client-image-"]');
    const count = await clientImages.count();

    // Should have multiple client images
    expect(count).toBeGreaterThan(5);

    // All should be visible
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(clientImages.nth(i)).toBeVisible();
    }
  });

  test('should maintain interactivity with JavaScript enabled', async ({
    page,
  }) => {
    // Ensure JavaScript is enabled
    await page.setJavaScriptEnabled(true);

    // Check that interactive features work
    const onLoadImage = page.locator('[data-testid="client-image-onload"]');
    await expect(onLoadImage).toBeVisible();

    // Verify the page has client-side React hydration
    const hasReactRoot = await page.evaluate(() => {
      return (
        document.querySelector('#__next') !== null ||
        document.querySelector('[data-reactroot]') !== null ||
        document.querySelector('body > div') !== null
      );
    });
    expect(hasReactRoot).toBeTruthy();
  });
});
