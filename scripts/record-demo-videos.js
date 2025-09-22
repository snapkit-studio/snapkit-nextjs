const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Ensure videos directory exists
const videosDir = path.join(__dirname, '..', 'demos', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

async function recordNextJsDemo(port = 3000) {
  console.log('🎬 Recording Next.js demo...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: videosDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  try {
    // Navigate to Next.js demo
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Showcase Server/Client Image components
    console.log('  📸 Showcasing Server/Client components...');
    await smoothScroll(page, 0, 500);
    await page.waitForTimeout(1500);

    // Show Server Component example
    await page.locator('h3:has-text("1. Server Component")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Show Client Component with interactions
    await page.locator('h3:has-text("2. Client Component")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Click on an interactive element if available
    const clientImage = page.locator('img[alt*="Client"]').first();
    if (await clientImage.isVisible()) {
      await clientImage.hover();
      await page.waitForTimeout(1000);
    }

    // Show DPR Optimization
    await page.locator('h3:has-text("DPR Optimization")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Show transform examples
    await page.locator('h3:has-text("Transform")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Scroll through code examples
    const codeBlocks = await page.locator('pre').all();
    for (let i = 0; i < Math.min(3, codeBlocks.length); i++) {
      await codeBlocks[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
    }

    // Final overview
    await smoothScroll(page, 0, 0);
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('Error recording Next.js demo:', error);
  } finally {
    await context.close();
    await browser.close();

    // Rename video file
    const videos = fs.readdirSync(videosDir).filter(f => f.endsWith('.webm'));
    const latestVideo = videos[videos.length - 1];
    if (latestVideo) {
      const oldPath = path.join(videosDir, latestVideo);
      const newPath = path.join(videosDir, 'nextjs-demo-showcase.webm');
      fs.renameSync(oldPath, newPath);
      console.log('  ✅ Next.js demo video saved as: nextjs-demo-showcase.webm');
    }
  }
}

async function recordReactDemo(port = 5173) {
  console.log('🎬 Recording React demo...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: videosDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  try {
    // Navigate to React demo
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Showcase main features
    console.log('  📸 Showcasing React components...');

    // Show header and navigation
    await page.waitForTimeout(1500);

    // Scroll through image examples
    await smoothScroll(page, 0, 500);
    await page.waitForTimeout(1500);

    // Show responsive images
    const images = await page.locator('img').all();
    for (let i = 0; i < Math.min(4, images.length); i++) {
      await images[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // Hover for interaction
      await images[i].hover();
      await page.waitForTimeout(500);
    }

    // Show code examples if available
    const codeBlocks = await page.locator('pre, code').all();
    for (let i = 0; i < Math.min(2, codeBlocks.length); i++) {
      await codeBlocks[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
    }

    // Test responsive design - change viewport
    console.log('  📱 Testing responsive design...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);

    // Back to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1500);

    // Final overview
    await smoothScroll(page, 0, 0);
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('Error recording React demo:', error);
  } finally {
    await context.close();
    await browser.close();

    // Rename video file
    const videos = fs.readdirSync(videosDir).filter(f => f.endsWith('.webm'));
    const latestVideo = videos[videos.length - 1];
    if (latestVideo) {
      const oldPath = path.join(videosDir, latestVideo);
      const newPath = path.join(videosDir, 'react-demo-showcase.webm');
      fs.renameSync(oldPath, newPath);
      console.log('  ✅ React demo video saved as: react-demo-showcase.webm');
    }
  }
}

// Smooth scroll helper
async function smoothScroll(page, x, y) {
  await page.evaluate(({ x, y }) => {
    window.scrollTo({
      top: y,
      left: x,
      behavior: 'smooth'
    });
  }, { x, y });
  await page.waitForTimeout(1000);
}

async function main() {
  console.log('🎥 Starting demo video recording...\n');

  // Port configuration - adjust if needed
  const NEXTJS_PORT = process.env.NEXTJS_PORT || 3004;
  const REACT_PORT = process.env.REACT_PORT || 5174;

  console.log('⚠️  Make sure both demos are running:');
  console.log(`   - Next.js: http://localhost:${NEXTJS_PORT}`);
  console.log(`   - React: http://localhost:${REACT_PORT}\n`);

  // Check if servers are running
  const checkServer = async (url, name) => {
    try {
      const testBrowser = await chromium.launch({ headless: true });
      const page = await testBrowser.newPage();
      const response = await page.goto(url, { timeout: 5000 });
      await testBrowser.close();
      return response.ok();
    } catch {
      console.error(`❌ ${name} is not running at ${url}`);
      console.log(`   Please run: cd apps/${name.toLowerCase().replace('.js', 'js')}-demo && npm run dev\n`);
      return false;
    }
  };

  const nextjsRunning = await checkServer(`http://localhost:${NEXTJS_PORT}`, 'Next.js');
  const reactRunning = await checkServer(`http://localhost:${REACT_PORT}`, 'React');

  if (!nextjsRunning || !reactRunning) {
    console.log('Please start both demo apps before recording videos.');
    process.exit(1);
  }

  // Record videos
  await recordNextJsDemo(NEXTJS_PORT);
  await recordReactDemo(REACT_PORT);

  console.log('\n✨ Video recording complete!');
  console.log(`📁 Videos saved in: ${videosDir}`);

  // Convert to MP4 if ffmpeg is available
  console.log('\n💡 To convert to MP4 (requires ffmpeg):');
  console.log('   ffmpeg -i demos/videos/nextjs-demo-showcase.webm demos/videos/nextjs-demo-showcase.mp4');
  console.log('   ffmpeg -i demos/videos/react-demo-showcase.webm demos/videos/react-demo-showcase.mp4');
}

// Run the script
main().catch(console.error);