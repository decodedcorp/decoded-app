import { test, expect } from '@playwright/test';

test.describe('Simple Image Proxy Test', () => {
  test('should test proxy with GitHub avatar', async ({ page }) => {
    console.log('Testing proxy API with GitHub avatar...');
    
    try {
      const response = await page.request.get('/api/proxy/image', {
        params: {
          url: 'https://avatars.githubusercontent.com/u/1?v=4'
        }
      });

      console.log('Response status:', response.status());
      console.log('Response headers:', response.headers());
      
      if (response.status() !== 200) {
        const errorBody = await response.text();
        console.log('Error response body:', errorBody);
      } else {
        console.log('Content-Type:', response.headers()['content-type']);
        console.log('Success! Image proxy working correctly.');
      }

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('image');
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  });

  test('should test simple page load', async ({ page }) => {
    // 테스트 페이지 로드 확인
    await page.goto('/test');
    
    // 페이지가 로드되었는지 확인
    const title = await page.locator('h1').first().textContent();
    console.log('Page title:', title);
    
    expect(title).toContain('Test Laboratory');
  });
});