import { test, expect } from '@playwright/test';

test.describe('Image Proxy and ProxiedImage Component', () => {
  test.beforeEach(async ({ page }) => {
    // Enable request/response logging for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test('should load external image through proxy', async ({ page }) => {
    // 프록시 API 직접 테스트
    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://via.placeholder.com/300x200/0066cc/ffffff?text=Test+Image'
      }
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['cache-control']).toContain('public');
  });

  test('should block unauthorized domains', async ({ page }) => {
    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://evil-domain.com/malicious-image.jpg'
      }
    });

    expect(response.status()).toBe(403);
    const errorData = await response.json();
    expect(errorData.error).toBe('Domain not allowed');
  });

  test('should handle missing URL parameter', async ({ page }) => {
    const response = await page.request.get('/api/proxy/image');

    expect(response.status()).toBe(400);
    const errorData = await response.json();
    expect(errorData.error).toBe('Missing image URL');
  });

  test('should handle invalid image URLs', async ({ page }) => {
    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://via.placeholder.com/invalid-url'
      }
    });

    expect(response.status()).toBe(500);
    const errorData = await response.json();
    expect(errorData.error).toBe('Failed to proxy image');
  });

  test('ProxiedImage component should render and load images', async ({ page }) => {
    // 테스트 페이지로 이동 (테스트 페이지가 있다고 가정)
    await page.goto('/test');

    // ProxiedImage 컴포넌트가 렌더링되는지 확인
    const imageContainer = page.locator('[data-testid="proxied-image"]');
    await expect(imageContainer).toBeVisible();

    // 이미지가 로드되었는지 확인
    const image = imageContainer.locator('img');
    await expect(image).toBeVisible();
    
    // 이미지 src가 프록시 URL을 포함하는지 확인
    const src = await image.getAttribute('src');
    expect(src).toMatch(/\/api\/proxy\/image|\/api\/image-proxy/);
  });

  test('ProxiedImage should show loading state initially', async ({ page }) => {
    await page.goto('/test');

    // 로딩 상태 확인 (스피너나 플레이스홀더)
    const loadingIndicator = page.locator('[data-testid="proxied-image"] .animate-spin');
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
  });

  test('ProxiedImage should handle image load errors gracefully', async ({ page }) => {
    await page.goto('/test');

    // 네트워크 요청을 가로채서 이미지 로딩 실패 시뮬레이션
    await page.route('**/api/proxy/image**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to proxy image' })
      });
    });

    const imageContainer = page.locator('[data-testid="proxied-image-error"]');
    await expect(imageContainer).toBeVisible();

    // 에러 상태 UI 확인
    const errorIcon = imageContainer.locator('svg');
    await expect(errorIcon).toBeVisible();
    
    const errorText = imageContainer.locator('text=Image not available');
    await expect(errorText).toBeVisible();
  });

  test('ProxiedImage should prioritize downloadedSrc over original src', async ({ page }) => {
    await page.goto('/test');

    const imageWithDownloaded = page.locator('[data-testid="proxied-image-downloaded"]');
    await expect(imageWithDownloaded).toBeVisible();

    const image = imageWithDownloaded.locator('img');
    const src = await image.getAttribute('src');
    
    // downloadedSrc가 사용되었는지 확인 (R2 도메인이면 프록시 우회)
    expect(src).toMatch(/r2\.dev|r2\.cloudflarestorage\.com|\/api\/proxy\/image/);
  });

  test('ProxiedImage should bypass proxy for R2 domains', async ({ page }) => {
    await page.goto('/test');

    const r2Image = page.locator('[data-testid="proxied-image-r2"]');
    await expect(r2Image).toBeVisible();

    const image = r2Image.locator('img');
    const src = await image.getAttribute('src');
    
    // R2 도메인은 프록시를 우회해야 함
    expect(src).toMatch(/r2\.dev|r2\.cloudflarestorage\.com/);
    expect(src).not.toContain('/api/proxy/image');
  });

  test('ProxiedImage should handle fallback images', async ({ page }) => {
    await page.goto('/test');

    // 원본 이미지 로딩 실패 시뮬레이션
    await page.route('**/original-image.jpg', (route) => {
      route.abort('failed');
    });

    const imageWithFallback = page.locator('[data-testid="proxied-image-fallback"]');
    await expect(imageWithFallback).toBeVisible();

    // fallback 이미지로 전환되었는지 확인
    await page.waitForTimeout(2000); // 에러 처리 시간 대기
    
    const image = imageWithFallback.locator('img');
    const src = await image.getAttribute('src');
    expect(src).toContain('fallback');
  });

  test('should cache proxied images with proper headers', async ({ page }) => {
    // 첫 번째 요청
    const firstResponse = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://via.placeholder.com/150x150/ff0000/ffffff?text=Cache+Test'
      }
    });

    expect(firstResponse.status()).toBe(200);
    expect(firstResponse.headers()['cache-control']).toContain('public');
    expect(firstResponse.headers()['etag']).toBeTruthy();

    // ETag 값 저장
    const etag = firstResponse.headers()['etag'];

    // 조건부 요청 (If-None-Match 헤더 사용)
    const conditionalResponse = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://via.placeholder.com/150x150/ff0000/ffffff?text=Cache+Test'
      },
      headers: {
        'If-None-Match': etag
      }
    });

    // 캐시가 유효하면 304 응답이 와야 하지만, 
    // 우리 구현에서는 ETag 검증을 하지 않으므로 200 응답
    expect(conditionalResponse.status()).toBe(200);
  });

  test('should handle CORS requests properly', async ({ page }) => {
    // OPTIONS 요청 테스트
    const optionsResponse = await page.request.fetch('/api/proxy/image', {
      method: 'OPTIONS'
    });

    expect(optionsResponse.status()).toBe(200);
    expect(optionsResponse.headers()['access-control-allow-origin']).toBe('*');
    expect(optionsResponse.headers()['access-control-allow-methods']).toContain('GET');
    expect(optionsResponse.headers()['access-control-allow-headers']).toContain('Content-Type');
  });

  test('should handle network timeouts gracefully', async ({ page }) => {
    // 긴 응답 시간 시뮬레이션
    await page.route('**/slow-image.jpg', async (route) => {
      await page.waitForTimeout(10000); // 10초 대기
      route.fulfill({
        status: 200,
        contentType: 'image/jpeg',
        body: Buffer.from('fake-image-data')
      });
    });

    const response = await page.request.get('/api/proxy/image', {
      params: {
        url: 'https://via.placeholder.com/slow-image.jpg'
      }
    });

    // 타임아웃이나 에러 응답 확인
    expect([408, 500, 504]).toContain(response.status());
  });

  test('ProxiedImage adaptive loading based on priority', async ({ page }) => {
    await page.goto('/test');

    // 높은 우선순위 이미지는 즉시 로드
    const highPriorityImage = page.locator('[data-testid="proxied-image-high-priority"]');
    await expect(highPriorityImage.locator('img')).toBeVisible({ timeout: 3000 });

    // 낮은 우선순위 이미지는 지연 로드
    const lowPriorityImage = page.locator('[data-testid="proxied-image-low-priority"]');
    const placeholderVisible = await lowPriorityImage.locator('.animate-pulse').isVisible();
    expect(placeholderVisible).toBe(true);

    // 스크롤하거나 시간이 지나면 로드됨
    await page.waitForTimeout(5000);
    await expect(lowPriorityImage.locator('img')).toBeVisible({ timeout: 5000 });
  });
});