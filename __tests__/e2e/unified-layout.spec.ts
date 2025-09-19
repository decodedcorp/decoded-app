import { test, expect } from '@playwright/test';

test.describe('Unified Layout System', () => {
  test('no horizontal overflow at any viewport size', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1280, height: 720 }, // Desktop
      { width: 1440, height: 900 }, // Large Desktop
      { width: 1920, height: 1080 }, // Extra Large
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Wait for layout to stabilize
      await page.waitForLoadState('networkidle');

      // Check for horizontal overflow
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }
  });

  test('sticky sidebar positioning is correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check left sidebar sticky positioning
    const leftSidebarTop = await page.evaluate(() => {
      const sidebar = document.querySelector('.sidebar-left');
      return sidebar ? getComputedStyle(sidebar).top : null;
    });

    // Should be header height + gap edge (72px + 16px = 88px)
    expect(leftSidebarTop).toBe('88px');
  });

  test('responsive sidebar visibility', async ({ page }) => {
    // Mobile: both sidebars hidden
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileLeftSidebar = await page.locator('.sidebar-left').isVisible();
    const mobileRightSidebar = await page.locator('.sidebar-right').isVisible();

    expect(mobileLeftSidebar).toBe(false);
    expect(mobileRightSidebar).toBe(false);

    // Tablet: left sidebar visible, right hidden
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    const tabletLeftSidebar = await page.locator('.sidebar-left').isVisible();
    const tabletRightSidebar = await page.locator('.sidebar-right').isVisible();

    expect(tabletLeftSidebar).toBe(true);
    expect(tabletRightSidebar).toBe(false);

    // Desktop: both sidebars visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();

    const desktopLeftSidebar = await page.locator('.sidebar-left').isVisible();
    const desktopRightSidebar = await page.locator('.sidebar-right').isVisible();

    expect(desktopLeftSidebar).toBe(true);
    expect(desktopRightSidebar).toBe(true);
  });

  test('main content respects max-width', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const mainElement = page.locator('.main');
    const mainWidth = await mainElement.evaluate((el) => el.getBoundingClientRect().width);

    // Should not exceed content-max-width (1200px at desktop)
    expect(mainWidth).toBeLessThanOrEqual(1200);
  });

  test('layout variables are applied correctly', async ({ page }) => {
    await page.goto('/');

    // Check CSS variables are set
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        headerHeight: getComputedStyle(root).getPropertyValue('--header-height'),
        sidebarWidth: getComputedStyle(root).getPropertyValue('--sidebar-width'),
        contentMaxWidth: getComputedStyle(root).getPropertyValue('--content-max-width'),
        gapMain: getComputedStyle(root).getPropertyValue('--gap-main'),
        containerPaddingX: getComputedStyle(root).getPropertyValue('--container-padding-x'),
      };
    });

    expect(rootStyles.headerHeight).toBe('72px');
    expect(rootStyles.contentMaxWidth).toBe('1200px');
  });

  test('no w-screen usage (overflow prevention)', async ({ page }) => {
    await page.goto('/');

    // Check that no elements use w-screen class
    const wScreenElements = await page.locator('.w-screen').count();
    expect(wScreenElements).toBe(0);

    // Check that main layout uses w-full instead
    const mainElement = page.locator('.main');
    const hasWFull = await mainElement.evaluate(
      (el) => el.classList.contains('w-full') || getComputedStyle(el).width === '100%',
    );
    expect(hasWFull).toBe(true);
  });

  test('images and videos are responsive', async ({ page }) => {
    await page.goto('/');

    // Check that images have max-width: 100%
    const imageStyles = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).map((img) => ({
        maxWidth: getComputedStyle(img).maxWidth,
        width: getComputedStyle(img).width,
      }));
    });

    imageStyles.forEach((style) => {
      expect(style.maxWidth).toBe('100%');
    });
  });

  test('flex items have min-width: 0 for proper shrinking', async ({ page }) => {
    await page.goto('/');

    const flexItems = await page.evaluate(() => {
      const main = document.querySelector('.main');
      const sidebars = document.querySelectorAll('.sidebar-left, .sidebar-right');

      return {
        mainMinWidth: main ? getComputedStyle(main).minWidth : null,
        sidebarMinWidth: Array.from(sidebars).map((sidebar) => getComputedStyle(sidebar).minWidth),
      };
    });

    expect(flexItems.mainMinWidth).toBe('0px');
    flexItems.sidebarMinWidth.forEach((minWidth) => {
      expect(minWidth).toBe('0px');
    });
  });
});
