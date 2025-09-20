import { test, expect, Page } from '@playwright/test';

test.describe('Channel Navigation Performance Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // 성능 추적 시작
    await page.goto('http://localhost:3003');

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
  });

  test('Sidebar channel navigation speed', async () => {
    console.log('🚀 Starting channel navigation performance test...');

    // 사이드바가 로드될 때까지 대기
    const sidebar = page.locator('[data-testid="sidebar"]').first();
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // 채널 리스트 요소들이 로드될 때까지 대기
    const channelItems = page.locator('a[href*="/channels/"]');
    await expect(channelItems.first()).toBeVisible({ timeout: 10000 });

    const channelCount = await channelItems.count();
    console.log(`📊 Found ${channelCount} channels in sidebar`);

    if (channelCount === 0) {
      console.log('⚠️ No channels found in sidebar, skipping test');
      return;
    }

    // 첫 번째 채널의 href 가져오기
    const firstChannelHref = await channelItems.first().getAttribute('href');
    console.log(`🔗 First channel href: ${firstChannelHref}`);

    // 성능 측정: 첫 번째 채널 클릭
    console.log('⏱️ Measuring first channel navigation...');
    const navigationStart = Date.now();

    await channelItems.first().click();
    await page.waitForLoadState('networkidle');

    const firstNavigationTime = Date.now() - navigationStart;
    console.log(`✅ First channel navigation time: ${firstNavigationTime}ms`);

    // 채널 페이지가 로드되었는지 확인
    await expect(page.locator('[data-testid="channel-page"]').first()).toBeVisible({ timeout: 10000 });

    // 두 번째 채널이 있으면 연속 클릭 테스트
    if (channelCount > 1) {
      // 사이드바로 돌아가기
      const sidebarInChannel = page.locator('[data-testid="sidebar"]').first();
      await expect(sidebarInChannel).toBeVisible({ timeout: 5000 });

      const channelItemsInPage = page.locator('a[href*="/channels/"]');
      const secondChannelHref = await channelItemsInPage.nth(1).getAttribute('href');
      console.log(`🔗 Second channel href: ${secondChannelHref}`);

      // 두 번째 채널 클릭 성능 측정
      console.log('⏱️ Measuring second channel navigation...');
      const secondNavigationStart = Date.now();

      await channelItemsInPage.nth(1).click();
      await page.waitForLoadState('networkidle');

      const secondNavigationTime = Date.now() - secondNavigationStart;
      console.log(`✅ Second channel navigation time: ${secondNavigationTime}ms`);

      // 세 번째 채널이 있으면 추가 테스트
      if (channelCount > 2) {
        const thirdChannelHref = await channelItemsInPage.nth(2).getAttribute('href');
        console.log(`🔗 Third channel href: ${thirdChannelHref}`);

        console.log('⏱️ Measuring third channel navigation...');
        const thirdNavigationStart = Date.now();

        await channelItemsInPage.nth(2).click();
        await page.waitForLoadState('networkidle');

        const thirdNavigationTime = Date.now() - thirdNavigationStart;
        console.log(`✅ Third channel navigation time: ${thirdNavigationTime}ms`);

        // 성능 기준 검증
        console.log('\n📈 Performance Analysis:');
        console.log(`First navigation: ${firstNavigationTime}ms`);
        console.log(`Second navigation: ${secondNavigationTime}ms`);
        console.log(`Third navigation: ${thirdNavigationTime}ms`);

        // 캐시가 제대로 작동한다면 2번째, 3번째 네비게이션이 더 빨라야 함
        if (secondNavigationTime < firstNavigationTime * 0.8) {
          console.log('✅ Second navigation shows improvement (cache working)');
        } else {
          console.log('⚠️ Second navigation not improved (check cache)');
        }

        if (thirdNavigationTime < firstNavigationTime * 0.8) {
          console.log('✅ Third navigation shows improvement (cache working)');
        } else {
          console.log('⚠️ Third navigation not improved (check cache)');
        }

        // 모든 네비게이션이 3초 이내여야 함
        expect(firstNavigationTime).toBeLessThan(3000);
        expect(secondNavigationTime).toBeLessThan(3000);
        expect(thirdNavigationTime).toBeLessThan(3000);
      }
    }
  });

  test('Channel data consistency during navigation', async () => {
    console.log('🔍 Testing channel data consistency...');

    // 사이드바 채널 리스트 로드 대기
    const channelItems = page.locator('a[href*="/channels/"]');
    await expect(channelItems.first()).toBeVisible({ timeout: 10000 });

    const channelCount = await channelItems.count();
    if (channelCount < 2) {
      console.log('⚠️ Need at least 2 channels for consistency test');
      return;
    }

    // 첫 번째 채널 클릭
    const firstChannelHref = await channelItems.first().getAttribute('href');
    const firstChannelId = firstChannelHref?.split('/channels/')[1];

    await channelItems.first().click();
    await page.waitForLoadState('networkidle');

    // 첫 번째 채널의 제목 확인
    const firstChannelTitle = await page.locator('h1, [data-testid="channel-title"]').first().textContent();
    console.log(`📝 First channel title: ${firstChannelTitle}`);

    // 두 번째 채널로 즉시 전환
    const secondChannelHref = await page.locator('a[href*="/channels/"]').nth(1).getAttribute('href');
    const secondChannelId = secondChannelHref?.split('/channels/')[1];

    await page.locator('a[href*="/channels/"]').nth(1).click();

    // URL이 변경되었는지 확인
    await page.waitForURL(`**/channels/${secondChannelId}*`);

    // 페이지 콘텐츠가 두 번째 채널과 일치하는지 확인
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // URL과 실제 표시된 데이터가 일치하는지 검증
    expect(currentUrl).toContain(secondChannelId || '');

    // 두 번째 채널의 제목이 첫 번째와 다른지 확인 (데이터 불일치 방지)
    const secondChannelTitle = await page.locator('h1, [data-testid="channel-title"]').first().textContent();
    console.log(`📝 Second channel title: ${secondChannelTitle}`);

    if (firstChannelTitle && secondChannelTitle && firstChannelTitle !== secondChannelTitle) {
      console.log('✅ Channel titles are different - data consistency good');
    } else if (firstChannelTitle === secondChannelTitle) {
      console.log('⚠️ Channel titles are the same - potential data inconsistency');
    }
  });

  test('Network requests optimization', async () => {
    console.log('🌐 Testing network requests optimization...');

    const responses: Array<{ url: string; status: number; timing: number }> = [];

    // 네트워크 요청 추적
    page.on('response', async (response) => {
      if (response.url().includes('/channels/') || response.url().includes('/api/')) {
        const timing = await response.timing();
        responses.push({
          url: response.url(),
          status: response.status(),
          timing: timing.responseEnd
        });
      }
    });

    // 첫 번째 채널 네비게이션
    const channelItems = page.locator('a[href*="/channels/"]');
    await expect(channelItems.first()).toBeVisible({ timeout: 10000 });

    await channelItems.first().click();
    await page.waitForLoadState('networkidle');

    const firstNavRequests = responses.length;
    console.log(`📊 First navigation requests: ${firstNavRequests}`);

    // 두 번째 채널 네비게이션
    responses.length = 0; // 리셋

    if (await channelItems.nth(1).isVisible()) {
      await channelItems.nth(1).click();
      await page.waitForLoadState('networkidle');

      const secondNavRequests = responses.length;
      console.log(`📊 Second navigation requests: ${secondNavRequests}`);

      // 캐시가 잘 작동한다면 두 번째 네비게이션의 요청 수가 적어야 함
      if (secondNavRequests <= firstNavRequests * 0.7) {
        console.log('✅ Request count optimized - caching working well');
      } else {
        console.log('⚠️ Request count not optimized - check caching strategy');
      }

      // API 응답 시간 분석
      const avgResponseTime = responses.reduce((sum, r) => sum + r.timing, 0) / responses.length;
      console.log(`⏱️ Average response time: ${avgResponseTime.toFixed(2)}ms`);

      expect(avgResponseTime).toBeLessThan(1000); // 1초 이내
    }
  });

  test.afterEach(async () => {
    await page.close();
  });
});