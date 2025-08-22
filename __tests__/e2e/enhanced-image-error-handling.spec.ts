import { test, expect } from '@playwright/test';

test.describe('Enhanced Image Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    // Enable console logging for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test('should show retry mechanism for failed images', async ({ page }) => {
    await page.goto('/test');

    // 특정 URL을 500 에러로 가로채기
    await page.route('**/api/proxy/image**', (route) => {
      const url = route.request().url();
      if (url.includes('retry-test-image')) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Simulated server error' })
        });
      } else {
        route.continue();
      }
    });

    // 재시도 테스트용 이미지 컴포넌트가 있다고 가정
    const retryImage = page.locator('[data-testid="retry-test-image"]');
    
    // 재시도 중 메시지가 표시되는지 확인
    await expect(retryImage.locator('text=Retrying')).toBeVisible({ timeout: 5000 });
    
    // 최대 재시도 후 fallback으로 전환되는지 확인
    await expect(retryImage.locator('text=News Image Unavailable')).toBeVisible({ timeout: 15000 });
  });

  test('should use smart fallback for news images', async ({ page }) => {
    await page.goto('/test');

    // 뉴스 이미지가 실패했을 때 적절한 fallback이 표시되는지 확인
    const newsImage = page.locator('[data-testid="news-image-fallback"]');
    
    // SVG fallback이 로드되었는지 확인
    const fallbackImg = newsImage.locator('img');
    await expect(fallbackImg).toBeVisible();
    
    const src = await fallbackImg.getAttribute('src');
    expect(src).toContain('data:image/svg+xml');
  });

  test('should handle different image types with appropriate fallbacks', async ({ page }) => {
    await page.goto('/test');

    // 아바타 이미지 fallback 테스트
    const avatarImage = page.locator('[data-testid="avatar-fallback"]');
    await expect(avatarImage).toBeVisible();
    
    // 로고 이미지 fallback 테스트  
    const logoImage = page.locator('[data-testid="logo-fallback"]');
    await expect(logoImage).toBeVisible();
    
    // 프리뷰 이미지 fallback 테스트
    const previewImage = page.locator('[data-testid="preview-fallback"]');
    await expect(previewImage).toBeVisible();
  });

  test('should gracefully handle network timeout scenarios', async ({ page }) => {
    await page.goto('/test');

    // 느린 응답 시뮬레이션
    await page.route('**/slow-response-image.jpg', async (route) => {
      await page.waitForTimeout(30000); // 30초 지연
      route.fulfill({
        status: 200,
        contentType: 'image/jpeg',
        body: Buffer.from('fake-image-data')
      });
    });

    const slowImage = page.locator('[data-testid="slow-image"]');
    
    // 로딩 상태가 표시되는지 확인
    await expect(slowImage.locator('.animate-spin')).toBeVisible();
    
    // 타임아웃 후 fallback으로 전환되는지 확인 (실제로는 더 짧은 타임아웃 설정)
    await expect(slowImage.locator('text=Image not available')).toBeVisible({ timeout: 10000 });
  });

  test('should show appropriate error messages for blocked domains', async ({ page }) => {
    // 차단된 도메인에 대한 403 응답 테스트
    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://blocked-domain.com/image.jpg'
      }
    });

    expect(response.status()).toBe(403);
    const errorData = await response.json();
    expect(errorData.error).toBe('Domain not allowed');
  });

  test('should handle CORS and security headers correctly', async ({ page }) => {
    // GitHub 아바타로 CORS 테스트
    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://avatars.githubusercontent.com/u/1?v=4'
      }
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['content-type']).toContain('image');
    
    // 캐시 헤더 확인
    expect(response.headers()['cache-control']).toContain('public');
    expect(response.headers()['etag']).toBeTruthy();
  });

  test('should preserve image quality and optimization', async ({ page }) => {
    // 이미지 최적화 옵션 테스트
    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://avatars.githubusercontent.com/u/1?v=4',
        quality: 'high',
        format: 'webp'
      }
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/webp');
    expect(response.headers()['x-image-quality']).toBe('95');
  });

  test('should handle malformed URLs gracefully', async ({ page }) => {
    // 잘못된 URL 파라미터 테스트
    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'not-a-valid-url'
      }
    });

    expect(response.status()).toBe(500);
    const errorData = await response.json();
    expect(errorData.error).toBe('Failed to proxy image');
  });

  test('should handle missing URL parameter', async ({ page }) => {
    // URL 파라미터 누락 테스트
    const response = await page.request.get('/api/proxy/image');

    expect(response.status()).toBe(400);
    const errorData = await response.json();
    expect(errorData.error).toBe('Missing image URL');
  });
});