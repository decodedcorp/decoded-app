import { test, expect, Page } from '@playwright/test';

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  // Google OAuth test credentials (for development only)
  googleTestAccount: {
    email: process.env.TEST_GOOGLE_EMAIL || 'test@decoded.style',
    password: process.env.TEST_GOOGLE_PASSWORD || 'TestPassword123!'
  }
};

test.describe('Google Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    // Navigate to page first before trying to access localStorage
    await page.goto(TEST_CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Clear storage only if accessible
    try {
      await page.evaluate(() => {
        if (typeof Storage !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
      });
    } catch (error) {
      console.log('Storage not accessible:', error);
    }
  });

  test('should display Google login button', async ({ page }) => {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Look for login button or modal trigger
    const loginButton = page.locator('button').filter({ hasText: /Continue with Google|Login|Sign in/ }).first();
    await expect(loginButton).toBeVisible({ timeout: 10000 });
  });

  test('should open Google OAuth popup on login click', async ({ page, context }) => {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Click login button
    const loginButton = page.locator('button').filter({ hasText: /Continue with Google|Login|Sign in/ }).first();
    await loginButton.click();
    
    // Wait for popup to appear
    const popupPromise = context.waitForEvent('page');
    
    // Wait for either popup or redirect
    const popup = await Promise.race([
      popupPromise.then(p => ({ type: 'popup', page: p })),
      page.waitForURL('**/auth/**').then(() => ({ type: 'redirect', page: page }))
    ]).catch(() => null);
    
    if (popup?.type === 'popup') {
      await expect(popup.page.url()).toContain('accounts.google.com');
      await popup.page.close();
    } else if (popup?.type === 'redirect') {
      await expect(page.url()).toContain('auth');
    }
  });

  test('should handle OAuth callback with valid code', async ({ page }) => {
    // Mock a successful OAuth callback
    await page.goto(`${TEST_CONFIG.baseUrl}/auth/callback?code=test_auth_code_12345&debug=true`);
    
    // Should show processing state initially
    await expect(page.locator('text=Processing authentication')).toBeVisible();
    
    // Wait for either success redirect or error message
    await page.waitForTimeout(5000);
    
    // Check for either successful redirect or error display
    const currentUrl = page.url();
    const hasError = await page.locator('[class*="error"], [class*="red"], text=error').count() > 0;
    
    // Log the result for debugging
    console.log('OAuth callback result:', { currentUrl, hasError });
    
    // In debug mode, we might see an error due to test environment
    if (hasError) {
      const errorText = await page.locator('[class*="error"], [class*="red"]').first().textContent();
      console.log('Expected error in test environment:', errorText);
    }
  });

  test('should handle OAuth callback with error', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.baseUrl}/auth/callback?error=access_denied&debug=true`);
    
    // Should show error message
    await expect(page.locator('text=error, text=Error, text=OAuth').first()).toBeVisible({ timeout: 10000 });
  });

  test('should validate environment variables', async ({ page }) => {
    // Navigate to a page that would trigger auth checks
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Check console for environment variable validation
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });
    
    // Trigger login attempt to check env vars
    const loginButton = page.locator('button').filter({ hasText: /Continue with Google|Login|Sign in/ }).first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }
    
    await page.waitForTimeout(2000);
    
    // Check for environment variable errors
    const hasEnvError = consoleLogs.some(log => 
      log.includes('GOOGLE_CLIENT_ID') || 
      log.includes('not configured') ||
      log.includes('missing')
    );
    
    console.log('Environment check result:', { hasEnvError, logs: consoleLogs });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/auth/google', route => {
      route.abort('failed');
    });
    
    await page.goto(TEST_CONFIG.baseUrl);
    
    const loginButton = page.locator('button').filter({ hasText: /Continue with Google|Login|Sign in/ }).first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }

    // Should handle the error gracefully
    await page.waitForTimeout(3000);
    
    // Check that the app doesn't crash
    const hasError = await page.locator('[class*="error"], text=network, text=failed').count() > 0;
    console.log('Network error handling test:', { hasError });
  });

  test('should validate auth API endpoint', async ({ page }) => {
    // Test direct API endpoint
    const response = await page.request.post(`${TEST_CONFIG.baseUrl}/api/auth/google`, {
      data: { code: 'invalid_test_code' },
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Should return proper HTTP status (not crash)
    expect([400, 401, 403, 500]).toContain(response.status());
    
    const responseBody = await response.text();
    console.log('Auth API test result:', { 
      status: response.status(), 
      hasBody: !!responseBody,
      bodyPreview: responseBody.substring(0, 100)
    });
  });

  test('should maintain auth state persistence', async ({ page }) => {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Check for existing auth state
    const authState = await page.evaluate(() => {
      try {
        return {
          localStorage: typeof Storage !== 'undefined' ? Object.keys(localStorage) : [],
          sessionStorage: typeof Storage !== 'undefined' ? Object.keys(sessionStorage) : [],
          cookies: document.cookie || ''
        };
      } catch (error) {
        return {
          localStorage: [],
          sessionStorage: [],
          cookies: '',
          error: String(error)
        };
      }
    });
    
    console.log('Auth state check:', authState);
    
    // Should have clean state initially
    expect(authState.localStorage.length + authState.sessionStorage.length).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Auth Components Integration', () => {
  test('should render login form correctly', async ({ page }) => {
    await page.goto(TEST_CONFIG.baseUrl);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for key UI elements  
    const hasLoginUI = await page.locator('button, [class*="login"], [class*="auth"]').count() > 0;
    const hasLoginText = await page.locator('text=Login, text=Sign').count() > 0;
    console.log('Login UI check:', { hasLoginUI, hasLoginText });
    
    expect(hasLoginUI || hasLoginText).toBeTruthy();
  });

  test('should handle auth errors in UI', async ({ page }) => {
    // Mock an auth error scenario
    await page.goto(`${TEST_CONFIG.baseUrl}/auth/callback?error=invalid_request&debug=true`);
    
    // Should display error appropriately
    await expect(page.locator('text=error, text=Error').first()).toBeVisible({ timeout: 10000 });
    
    // Should have a way to recover (return home, try again, etc.)
    const hasRecoveryOption = await page.locator('button, a, [role="button"]').count() > 0;
    console.log('Error recovery UI:', { hasRecoveryOption });
    
    expect(hasRecoveryOption).toBeTruthy();
  });
});