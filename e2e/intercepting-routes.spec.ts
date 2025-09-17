import { test, expect } from '@playwright/test';

test.describe('Intercepting Routes - Content Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // 개발 서버가 실행 중인지 확인
    await page.goto('http://localhost:3000');
  });

  test('메인 피드에서 콘텐츠 카드 클릭 → URL 변경 확인', async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('http://localhost:3000');

    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle');

    // 콘텐츠 카드가 있는지 확인 (ContentsCardLink)
    const contentCards = page.locator('[aria-label*="콘텐츠 보기"]');

    if (await contentCards.count() > 0) {
      console.log('Found content cards:', await contentCards.count());

      // 첫 번째 카드 클릭
      await contentCards.first().click();

      // URL이 /channels/[channelId]/contents/[contentId] 패턴으로 변경되었는지 확인
      await expect(page).toHaveURL(/\/channels\/[^\/]+\/contents\/[^\/]+$/);

      console.log('URL after click:', page.url());
    } else {
      console.log('No content cards found, checking for other clickable elements');

      // 다른 클릭 가능한 요소들 확인
      const clickableElements = page.locator('a[href*="/channels/"], button[data-testid*="content"]');
      console.log('Found clickable elements:', await clickableElements.count());
    }
  });

  test('테스트 페이지에서 Intercepting Routes 동작 확인', async ({ page }) => {
    // 테스트 페이지로 이동
    await page.goto('http://localhost:3000/test/intercepting-routes');

    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle');

    // 테스트 카드가 있는지 확인
    const testCards = page.locator('[aria-label*="콘텐츠 보기"]');

    if (await testCards.count() > 0) {
      console.log('Found test cards:', await testCards.count());

      // 첫 번째 테스트 카드 클릭
      await testCards.first().click();

      // URL 변경 확인
      await expect(page).toHaveURL(/\/channels\/test\/contents\/test-content-\d+$/);

      // 모달이 표시되는지 확인 (Intercepting Routes)
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      console.log('Modal appeared successfully');

      // ESC 키로 모달 닫기
      await page.keyboard.press('Escape');

      // 원래 URL로 돌아갔는지 확인
      await expect(page).toHaveURL('/test/intercepting-routes');

      console.log('Modal closed, URL restored');
    } else {
      console.log('No test cards found');
    }
  });

  test('직접 링크 접근 시 풀페이지 표시', async ({ page }) => {
    // 콘텐츠 페이지에 직접 접근
    await page.goto('http://localhost:3000/channels/test/contents/test-content-1');

    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle');

    // 풀페이지 알림이 있는지 확인
    const fullPageIndicator = page.locator('text=풀페이지 모드');

    if (await fullPageIndicator.isVisible()) {
      console.log('Full page mode indicator found');

      // 모달이 아닌 풀페이지임을 확인 (role="dialog"가 없어야 함)
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      console.log('Confirmed: Full page mode (no modal)');
    } else {
      console.log('Full page indicator not found, checking page structure');

      // 메인 콘텐츠와 사이드바가 있는지 확인
      await expect(page.locator('main')).toBeVisible();
      console.log('Main content area found');
    }
  });

  test('브라우저 뒤로가기/앞으로가기 동작', async ({ page }) => {
    // 테스트 페이지로 시작
    await page.goto('http://localhost:3000/test/intercepting-routes');
    await page.waitForLoadState('networkidle');

    const initialUrl = page.url();
    console.log('Initial URL:', initialUrl);

    // 콘텐츠 카드 클릭
    const testCards = page.locator('[aria-label*="콘텐츠 보기"]');

    if (await testCards.count() > 0) {
      await testCards.first().click();

      const afterClickUrl = page.url();
      console.log('URL after click:', afterClickUrl);

      // 뒤로가기
      await page.goBack();

      // 원래 URL로 돌아갔는지 확인
      await expect(page).toHaveURL(initialUrl);
      console.log('Back navigation successful');

      // 앞으로가기
      await page.goForward();

      // 콘텐츠 URL로 다시 이동했는지 확인
      await expect(page).toHaveURL(afterClickUrl);
      console.log('Forward navigation successful');
    }
  });

  test('현재 메인 피드 구조 분석', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 페이지 구조 분석
    console.log('=== Page Structure Analysis ===');

    // Link 요소들 확인
    const links = page.locator('a[href*="/channels/"]');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} channel links`);

    if (linkCount > 0) {
      const firstLinkHref = await links.first().getAttribute('href');
      console.log('First link href:', firstLinkHref);
    }

    // ContentsCard 관련 요소들 확인
    const contentsCards = page.locator('[data-card-id], [data-original-card-id]');
    const cardCount = await contentsCards.count();
    console.log(`Found ${cardCount} content cards`);

    // 클릭 가능한 요소들 확인
    const clickableElements = page.locator('button, a, [role="button"]');
    const clickableCount = await clickableElements.count();
    console.log(`Found ${clickableCount} clickable elements`);

    // 첫 번째 클릭 가능한 요소의 정보
    if (clickableCount > 0) {
      const firstClickable = clickableElements.first();
      const tagName = await firstClickable.evaluate(el => el.tagName);
      const href = await firstClickable.getAttribute('href');
      const ariaLabel = await firstClickable.getAttribute('aria-label');

      console.log('First clickable element:');
      console.log('  Tag:', tagName);
      console.log('  Href:', href);
      console.log('  Aria-label:', ariaLabel);
    }
  });
});