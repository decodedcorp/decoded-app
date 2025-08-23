import { test, expect } from '@playwright/test';

test.describe('Domain Allowlist Tests', () => {
  test('should allow newly added domains through proxy', async ({ page }) => {
    const newlyAddedDomains = [
      'talkimg.imbc.com',
      'newsimg.hankookilbo.com', 
      'pickcon.co.kr',
      'image.msscdn.net',
      'blogthumb.pstatic.net'
    ];

    for (const domain of newlyAddedDomains) {
      const response = await page.request.get('/api/proxy/image', {
        params: {
          url: `https://${domain}/test-image.jpg`
        }
      });

      // 도메인이 허용되어야 함 (403이 아닌 다른 에러 응답)
      // 실제 이미지가 없어도 500은 괜찮음 (도메인이 허용되었다는 의미)
      expect(response.status()).not.toBe(403);
      
      if (response.status() === 403) {
        const errorData = await response.json();
        console.log(`❌ Domain ${domain} is blocked:`, errorData.error);
      } else {
        console.log(`✅ Domain ${domain} is allowed (status: ${response.status()})`);
      }
    }
  });

  test('should block unauthorized domains', async ({ page }) => {
    const unauthorizedDomains = [
      'evil-domain.com',
      'malicious-site.net',
      'unauthorized.org'
    ];

    for (const domain of unauthorizedDomains) {
      const response = await page.request.get('/api/proxy/image', {
        params: {
          url: `https://${domain}/image.jpg`
        }
      });

      // 이러한 도메인들은 차단되어야 함
      expect(response.status()).toBe(403);
      
      if (response.status() === 403) {
        const errorData = await response.json();
        expect(errorData.error).toBe('Domain not allowed');
        console.log(`✅ Domain ${domain} is correctly blocked`);
      }
    }
  });

  test('should allow previously working domains', async ({ page }) => {
    const workingDomains = [
      'avatars.githubusercontent.com',
      'biz.chosun.com',
      'image.ajunews.com'
    ];

    for (const domain of workingDomains) {
      const response = await page.request.get('/api/proxy/image', {
        params: {
          url: `https://${domain}/test.jpg`
        }
      });

      // 기존에 작동하던 도메인들은 여전히 허용되어야 함
      expect(response.status()).not.toBe(403);
      console.log(`✅ Domain ${domain} is still allowed (status: ${response.status()})`);
    }
  });
});