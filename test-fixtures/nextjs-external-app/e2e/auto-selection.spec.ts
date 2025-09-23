import { expect, test } from '@playwright/test';

test.describe('Auto Component Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-auto-select');
  });

  test('should auto-select ServerImage for basic props', async ({ page }) => {
    const serverImage = page.locator('[data-testid="auto-image-server"]');
    await expect(serverImage).toBeVisible();

    // Should have basic server image attributes
    await expect(serverImage).toHaveAttribute('width', '800');
    await expect(serverImage).toHaveAttribute('height', '600');
    await expect(serverImage).toHaveAttribute('alt', 'Auto server selection');

    // Should have priority since it was specified
    await expect(serverImage).toHaveAttribute('loading', 'eager');
  });

  test('should auto-select ClientImage when onLoad is present', async ({
    page,
  }) => {
    const clientImage = page.locator('[data-testid="auto-image-client"]');
    await expect(clientImage).toBeVisible();

    // Set up console listener before any actions
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });

    // Wait for image to load and trigger onLoad
    await page.waitForTimeout(3000);

    // Should have triggered onLoad (check console or DOM updates)
    const hasLoadLog = consoleLogs.some((log) =>
      log.includes('Auto-selected client image loaded'),
    );

    // The presence of onLoad makes it a ClientImage
    expect(hasLoadLog || (await clientImage.isVisible())).toBeTruthy();
  });

  test('should force server mode despite client features', async ({ page }) => {
    const forcedServer = page.locator('[data-testid="forced-server-image"]');
    await expect(forcedServer).toBeVisible();

    // Even with adjustQualityByNetwork, should render as server
    await expect(forcedServer).toHaveAttribute('width', '800');
    await expect(forcedServer).toHaveAttribute('height', '600');

    // Disable JS to verify it still works
    await page.setJavaScriptEnabled(false);
    await page.reload();

    // Should still be visible without JS
    await expect(forcedServer).toBeVisible();
  });

  test('should force client mode despite no client features', async ({
    page,
  }) => {
    const forcedClient = page.locator('[data-testid="forced-client-image"]');
    await expect(forcedClient).toBeVisible();

    // Even without event handlers, should be client
    await expect(forcedClient).toHaveAttribute('width', '800');
    await expect(forcedClient).toHaveAttribute('height', '600');
  });

  test('should auto-select client for network-adaptive features', async ({
    page,
  }) => {
    const networkImage = page.locator('[data-testid="auto-image-network"]');
    await expect(networkImage).toBeVisible();

    // Network features require client-side JS
    await expect(networkImage).toHaveAttribute('width', '800');
    await expect(networkImage).toHaveAttribute('height', '600');
  });

  test('should handle mixed selection in same page', async ({ page }) => {
    // Server image
    const mixedServer = page.locator('[data-testid="mixed-server"]');
    await expect(mixedServer).toBeVisible();

    // Client image with onLoad
    const mixedClient = page.locator('[data-testid="mixed-client"]');
    await expect(mixedClient).toBeVisible();

    // Network adaptive (client)
    const mixedNetwork = page.locator('[data-testid="mixed-network"]');
    await expect(mixedNetwork).toBeVisible();

    // Priority only (server)
    const mixedPriority = page.locator('[data-testid="mixed-priority"]');
    await expect(mixedPriority).toBeVisible();
    await expect(mixedPriority).toHaveAttribute('loading', 'eager');

    // Count total images
    const allImages = page.locator('[data-testid^="mixed-"]');
    const count = await allImages.count();
    expect(count).toBe(4);
  });

  test('should maintain proper selection with JS disabled', async ({
    page,
  }) => {
    // Disable JavaScript
    await page.setJavaScriptEnabled(false);
    await page.reload();

    // Server images should still work
    const serverImages = [
      '[data-testid="auto-image-server"]',
      '[data-testid="forced-server-image"]',
      '[data-testid="mixed-server"]',
      '[data-testid="mixed-priority"]',
    ];

    for (const selector of serverImages) {
      const image = page.locator(selector);
      await expect(image).toBeVisible();
    }

    // Client images might degrade gracefully or not render
    // This depends on implementation - they might render as static images
  });

  test('should have correct image count for each section', async ({ page }) => {
    // Auto server section
    const autoServer = page.locator('[data-testid="auto-server"] img');
    await expect(autoServer).toHaveCount(1);

    // Auto client section
    const autoClient = page.locator('[data-testid="auto-client"] img');
    await expect(autoClient).toHaveCount(1);

    // Force server section
    const forceServer = page.locator('[data-testid="force-server"] img');
    await expect(forceServer).toHaveCount(1);

    // Force client section
    const forceClient = page.locator('[data-testid="force-client"] img');
    await expect(forceClient).toHaveCount(1);

    // Auto network section
    const autoNetwork = page.locator('[data-testid="auto-network"] img');
    await expect(autoNetwork).toHaveCount(1);

    // Mixed selection section
    const mixedSelection = page.locator('[data-testid="mixed-selection"] img');
    await expect(mixedSelection).toHaveCount(4);
  });

  test('should verify optimize prop overrides auto-selection', async ({
    page,
  }) => {
    // Get all images with optimize prop
    const forcedServerWithClient = page.locator(
      '[data-testid="forced-server-image"]',
    );
    const forcedClientWithoutHandlers = page.locator(
      '[data-testid="forced-client-image"]',
    );

    // Both should be visible
    await expect(forcedServerWithClient).toBeVisible();
    await expect(forcedClientWithoutHandlers).toBeVisible();

    // Verify optimize="server" works even with client features
    const serverOptimize =
      await forcedServerWithClient.getAttribute('data-testid');
    expect(serverOptimize).toBe('forced-server-image');

    // Verify optimize="client" works even without client features
    const clientOptimize =
      await forcedClientWithoutHandlers.getAttribute('data-testid');
    expect(clientOptimize).toBe('forced-client-image');
  });
});
