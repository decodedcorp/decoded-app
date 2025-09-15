const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 로컬 개발 서버로 이동
  await page.goto('http://localhost:3000');

  // 페이지가 완전히 로드될 때까지 기다림
  await page.waitForLoadState('networkidle');

  const viewports = [
    { width: 1280, height: 800, name: '1280x800' },
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1920, height: 1080, name: '1920x1080' }
  ];

  for (const viewport of viewports) {
    console.log(`Testing viewport: ${viewport.name}`);

    // 뷰포트 설정
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    // 레이아웃이 적용될 시간을 줌
    await page.waitForTimeout(1000);

    // 메인 콘텐츠의 여백을 측정
    const mainElement = await page.locator('main').first();
    const boundingBox = await mainElement.boundingBox();
    const paddingLeft = await mainElement.evaluate(el =>
      parseInt(window.getComputedStyle(el).paddingLeft)
    );
    const paddingRight = await mainElement.evaluate(el =>
      parseInt(window.getComputedStyle(el).paddingRight)
    );

    console.log(`Viewport: ${viewport.name}`);
    console.log(`Main element width: ${boundingBox.width}px`);
    console.log(`Padding left: ${paddingLeft}px`);
    console.log(`Padding right: ${paddingRight}px`);
    console.log('---');

    // 스크린샷 촬영
    await page.screenshot({
      path: `layout-${viewport.name}.png`,
      fullPage: false
    });
  }

  await browser.close();
  console.log('Screenshots saved!');
})();