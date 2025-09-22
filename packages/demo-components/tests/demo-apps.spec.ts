import { test, expect } from '@playwright/test';

test.describe('Next.js Demo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3007');
  });

  test('should load the main page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Snapkit/);
    const heading = page.locator('h1');
    await expect(heading).toContainText('Snapkit Next.js Demo');
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Check if sidebar exists
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check navigation groups
    await expect(page.locator('text=Basic Features')).toBeVisible();
    await expect(page.locator('text=Next.js Features')).toBeVisible();
    await expect(page.locator('text=React Features')).toBeVisible();
    await expect(page.locator('text=Performance')).toBeVisible();
  });

  test('should navigate to sections when clicking sidebar items', async ({ page }) => {
    // Click on "Basic Image Component" in sidebar
    await page.locator('text=Basic Image Component').click();

    // Check if scrolled to the section
    const basicSection = page.locator('#basic');
    await expect(basicSection).toBeInViewport();
  });

  test('should show example containers with code', async ({ page }) => {
    // Check if example container exists
    const exampleContainer = page.locator('.scroll-mt-20').first();
    await expect(exampleContainer).toBeVisible();

    // Check for code block
    const codeBlock = page.locator('.shiki-container').first();
    await expect(codeBlock).toBeVisible();
  });

  test('should have collapsible navigation groups', async ({ page }) => {
    // Find a navigation group button
    const navGroupButton = page.locator('button:has-text("Basic Features")');
    await expect(navGroupButton).toBeVisible();

    // Check if it has the expand/collapse icon
    const icon = navGroupButton.locator('svg');
    await expect(icon).toBeVisible();
  });

  test('mobile menu should work on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile menu button should be visible
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuButton).toBeVisible();

    // Click to open menu
    await mobileMenuButton.click();

    // Sidebar should be visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });
});

test.describe('React Demo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175');
  });

  test('should load the main page with title', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Snapkit React Image Component Demo');
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Check if sidebar exists
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check navigation groups
    await expect(page.locator('text=Basic Features')).toBeVisible();
    await expect(page.locator('text=Performance Optimization')).toBeVisible();
    await expect(page.locator('text=Advanced Patterns')).toBeVisible();
  });

  test('should have more navigation items than Next.js demo', async ({ page }) => {
    // React demo has more examples
    await expect(page.locator('text=DPR-based Srcset')).toBeVisible();
    await expect(page.locator('text=Fill Mode')).toBeVisible();
    await expect(page.locator('text=Image Transforms')).toBeVisible();
    await expect(page.locator('text=Lazy Loading')).toBeVisible();
    await expect(page.locator('text=Priority Loading')).toBeVisible();
    await expect(page.locator('text=Smart DPR Detection')).toBeVisible();
  });

  test('should navigate to sections when clicking sidebar items', async ({ page }) => {
    // Click on "Fill Mode" in sidebar - more specific selector
    await page.locator('button:has-text("Fill Mode")').click();

    // Check if scrolled to the section
    const fillSection = page.locator('#fill-mode');
    await expect(fillSection).toBeInViewport();
  });

  test('should show example containers with live demos and code', async ({ page }) => {
    // Navigate to a specific example - more specific selector
    await page.locator('button:has-text("DPR-based Srcset")').click();

    // Check for live demo section
    const liveDemo = page.locator('text=Live Demo');
    await expect(liveDemo).toBeVisible();

    // Check for implementation section
    const implementation = page.locator('text=Implementation');
    await expect(implementation).toBeVisible();

    // Check for code block
    const codeBlock = page.locator('.shiki-container').first();
    await expect(codeBlock).toBeVisible();
  });

  test('code block should have copy button', async ({ page }) => {
    // Find a code block
    const codeBlockContainer = page.locator('.relative.group').first();
    await codeBlockContainer.hover();

    // Copy button should appear on hover
    const copyButton = codeBlockContainer.locator('button:has-text("Copy")');
    await expect(copyButton).toBeVisible();
  });

  test('should highlight active section in sidebar', async ({ page }) => {
    // Scroll to a specific section - more specific selector
    await page.locator('button:has-text("Network-Aware Quality")').click();

    // Wait for scroll
    await page.waitForTimeout(500);

    // Check if the item is highlighted (has different background)
    const activeItem = page.locator('button:has-text("Network-Aware Quality")');
    const className = await activeItem.getAttribute('class');
    expect(className).toContain('bg-blue-50');
  });

  test('mobile responsive layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile menu button should be visible
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuButton).toBeVisible();

    // Desktop sidebar should be hidden
    const sidebar = page.locator('aside');
    const classes = await sidebar.getAttribute('class');
    expect(classes).toContain('-translate-x-full');

    // Click to open menu
    await mobileMenuButton.click();

    // Sidebar should slide in
    await expect(sidebar).toHaveClass(/translate-x-0/);
  });
});

test.describe('Common Components', () => {
  test('DemoLayout provides consistent structure', async ({ page }) => {
    // Test on Next.js demo
    await page.goto('http://localhost:3007');
    const nextLayout = page.locator('.min-h-screen.bg-gray-50');
    await expect(nextLayout).toBeVisible();

    // Test on React demo
    await page.goto('http://localhost:5175');
    const reactLayout = page.locator('.min-h-screen.bg-gray-50');
    await expect(reactLayout).toBeVisible();
  });

  test('ExampleContainer shows demo and code side by side', async ({ page }) => {
    await page.goto('http://localhost:5175');

    // Find an example container
    const container = page.locator('.rounded-lg.bg-white.p-6.shadow-lg').first();
    await expect(container).toBeVisible();

    // Should have two columns on desktop
    const grid = container.locator('.grid.grid-cols-1.lg\\:grid-cols-2');
    await expect(grid).toBeVisible();
  });
});