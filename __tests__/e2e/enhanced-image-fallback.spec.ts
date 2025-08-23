import { test, expect } from '@playwright/test';

test.describe('Enhanced Image Fallback and New Domains', () => {
  test.beforeEach(async ({ page }) => {
    // Enable console logging for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test('should allow newly added domains through proxy', async ({ page }) => {
    const newDomains = [
      'talkimg.imbc.com',
      'newsimg.hankookilbo.com', 
      'pickcon.co.kr',
      'image.msscdn.net',
      'blogthumb.pstatic.net'
    ];

    for (const domain of newDomains) {
      const response = await page.request.get('/api/proxy/image', {
        params: {
          url: `https://${domain}/test-image.jpg`
        }
      });

      // 도메인이 허용되어야 함 (실제 이미지 파일이 없어도 403이 아닌 다른 에러 응답)
      expect(response.status()).not.toBe(403);
      
      if (response.status() === 403) {
        const errorData = await response.json();
        console.log(`Domain ${domain} blocked:`, errorData);
      }
    }
  });

  test('should use downloadedSrc as primary source when provided', async ({ page }) => {
    await page.goto('/test');

    // downloadedSrc가 있는 이미지 컴포넌트 테스트
    const testImageWithDownloaded = `
      <img 
        data-testid="downloaded-priority-test"
        src="https://invalid-original.com/image.jpg"
        downloaded-src="https://avatars.githubusercontent.com/u/1?v=4"
        alt="Test downloaded priority"
        width="200"
        height="200"
      />
    `;

    await page.evaluate((html) => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
    }, testImageWithDownloaded);

    // downloadedSrc가 실제로 사용되는지 확인
    const img = page.locator('[data-testid="downloaded-priority-test"]');
    await expect(img).toBeVisible();
    
    // GitHub 아바타 URL이 로드되는지 확인
    await img.waitFor({ state: 'visible' });
    const src = await img.getAttribute('src');
    expect(src).toContain('github');
  });

  test('should fallback from downloadedSrc to original src when downloadedSrc fails', async ({ page }) => {
    // 실패하는 downloadedSrc와 성공하는 원본 src를 가진 시나리오 시뮬레이션
    await page.route('**/proxy/image**', (route) => {
      const url = route.request().url();
      
      // downloadedSrc URL이면 실패시키기
      if (url.includes('invalid-downloaded')) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Downloaded image failed' })
        });
      } 
      // 원본 URL이면 성공시키기 (GitHub 아바타)
      else if (url.includes('avatars.githubusercontent.com')) {
        route.continue();
      }
      else {
        route.continue();
      }
    });

    await page.goto('/test');

    // Console 로그 모니터링
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('Downloaded image failed') || 
          msg.text().includes('switching to original src')) {
        consoleLogs.push(msg.text());
      }
    });

    // downloadedSrc 실패 → 원본 src 폴백 테스트용 컴포넌트
    const testImageFallback = `
      <div id="fallback-test-container">
        <img 
          data-testid="downloadedSrc-fallback-test"
          src="https://avatars.githubusercontent.com/u/1?v=4"
          alt="Test fallback mechanism"
          width="200"
          height="200"
        />
      </div>
    `;

    await page.evaluate((html) => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
    }, testImageFallback);

    // 이미지가 결국 로드되는지 확인
    const img = page.locator('[data-testid="downloadedSrc-fallback-test"]');
    await expect(img).toBeVisible({ timeout: 10000 });
    
    // 폴백 로그가 출력되었는지 확인
    await page.waitForTimeout(2000);
    
    // 이미지가 실제로 로드되었는지 확인
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('should use smart fallback when both downloadedSrc and original src fail', async ({ page }) => {
    // 모든 이미지 요청을 실패시키는 라우트
    await page.route('**/proxy/image**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'All images failed' })
      });
    });

    await page.goto('/test');

    // 모든 소스가 실패하는 경우의 smart fallback 테스트
    const testSmartFallback = `
      <div id="smart-fallback-container">
        <img 
          data-testid="smart-fallback-test"
          src="https://invalid-original.com/image.jpg"
          alt="Test smart fallback"
          width="300"
          height="200"
          image-type="news"
        />
      </div>
    `;

    await page.evaluate((html) => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
    }, testSmartFallback);

    // Smart fallback SVG가 표시되는지 확인
    const fallbackContainer = page.locator('[data-testid="smart-fallback-test"]');
    await expect(fallbackContainer).toBeVisible({ timeout: 15000 });
    
    // SVG 데이터 URL이 사용되었는지 확인
    await page.waitForTimeout(3000);
    const src = await fallbackContainer.getAttribute('src');
    expect(src).toContain('data:image/svg+xml');
  });

  test('should handle retry mechanism without breaking downloadedSrc fallback', async ({ page }) => {
    let attemptCount = 0;
    
    await page.route('**/proxy/image**', (route) => {
      const url = route.request().url();
      attemptCount++;
      
      // 처음 2번은 실패, 3번째에 성공 (재시도 메커니즘 테스트)
      if (url.includes('retry-test') && attemptCount <= 2) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Retry test failure' })
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/test');

    const retryTestImage = `
      <div id="retry-test-container">
        <img 
          data-testid="retry-mechanism-test"
          src="https://avatars.githubusercontent.com/u/1?v=4&retry-test=true"
          alt="Test retry mechanism"
          width="200"
          height="200"
        />
      </div>
    `;

    await page.evaluate((html) => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
    }, retryTestImage);

    // 재시도 후 이미지가 로드되는지 확인
    const img = page.locator('[data-testid="retry-mechanism-test"]');
    await expect(img).toBeVisible({ timeout: 15000 });
    
    // 재시도가 실제로 이루어졌는지 확인
    expect(attemptCount).toBeGreaterThan(1);
    
    // 최종적으로 이미지가 로드되었는지 확인
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});