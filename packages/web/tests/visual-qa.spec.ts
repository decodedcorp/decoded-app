import { test } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "desktop-lg", width: 1440, height: 900 },
];

const PAGES = [
  { name: "home", path: "/" },
  { name: "explore", path: "/explore" },
  { name: "feed", path: "/feed" },
  { name: "search", path: "/search?q=dress" },
  { name: "profile", path: "/profile" },
  { name: "login", path: "/login" },
  { name: "request-upload", path: "/request/upload" },
];

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const page of PAGES) {
      test(`${page.name}`, async ({ page: p }) => {
        await p.goto(page.path);
        await p.waitForLoadState("networkidle");
        // Wait for animations to settle
        await p.waitForTimeout(500);
        await p.screenshot({
          path: `../../docs/qa-screenshots/${viewport.name}-${page.name}.png`,
          fullPage: true,
        });
      });
    }
  });
}
