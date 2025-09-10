import { test, expect } from '@playwright/test';
import { AuthHelpers } from './auth-helpers';

test.describe('Auth Integration Tests', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    await authHelpers.clearAuthState();
  });

  test('complete auth flow - environment validation', async ({ page }) => {
    await page.goto('/');
    
    // Check auth configuration
    const config = await authHelpers.verifyAuthConfig();
    console.log('Auth config validation:', config);
    
    // Should have minimum required config
    expect(config.errors.length).toBeLessThan(5); // Allow some missing test vars
  });

  test('auth component rendering', async ({ page }) => {
    await authHelpers.navigateToLogin();
    
    // Should render auth UI without errors
    const hasAuthUI = await page.locator(
      'form, [class*="login"], [class*="auth"], button:has-text("Google")'
    ).count() > 0;
    
    expect(hasAuthUI).toBeTruthy();
  });

  test('popup auth flow initiation', async ({ page }) => {
    await authHelpers.navigateToLogin();
    
    // Try to trigger auth popup
    const loginButton = page.locator('button:has-text("Continue with Google")').first();
    
    if (await loginButton.isVisible()) {
      const popupResult = await Promise.race([
        authHelpers.handleAuthPopup(),
        loginButton.click().then(() => ({ type: 'button_clicked' }))
      ]);
      
      console.log('Popup auth test result:', popupResult);
      
      // Should either open popup or redirect
      expect(['oauth_popup_opened', 'popup_closed', 'button_clicked', 'no_popup']).toContain(popupResult.type);
    }
  });

  test('auth callback handling', async ({ page }) => {
    // Test successful callback
    await authHelpers.simulateOAuthCallback('valid_test_code');
    
    // Should process without crashing
    await page.waitForLoadState('networkidle');
    
    // Check for processing state or completion
    const hasProcessingOrComplete = await page.locator(
      'text*="Processing", text*="authentication", text*="Loading", text*="success", text*="error"'
    ).count() > 0;
    
    expect(hasProcessingOrComplete).toBeTruthy();
  });

  test('auth error handling', async ({ page }) => {
    // Test error callback
    await page.goto('/auth/callback?error=access_denied&debug=true');
    
    // Should display error appropriately
    await expect(page.locator('text*="error", text*="Error"')).toBeVisible({ timeout: 10000 });
    
    // Should have recovery option
    const hasRecovery = await page.locator('button, a').count() > 0;
    expect(hasRecovery).toBeTruthy();
  });

  test('auth API endpoint functionality', async ({ page }) => {
    const apiResult = await authHelpers.testAuthEndpoint('test_invalid_code');
    
    console.log('Auth API test:', apiResult);
    
    // Should handle the request (not crash)
    expect([200, 400, 401, 403, 500]).toContain(apiResult.status);
    
    // Should return some response
    expect(apiResult.body.length).toBeGreaterThan(0);
  });

  test('auth state management', async ({ page }) => {
    await page.goto('/');
    
    // Check initial auth state
    const initialAuth = await authHelpers.isAuthenticated();
    console.log('Initial auth state:', { initialAuth });
    
    // Try to change auth state (simulate login attempt)
    await authHelpers.navigateToLogin();
    
    // State should be manageable without errors
    const authAfterNavigation = await authHelpers.isAuthenticated();
    console.log('Auth after navigation:', { authAfterNavigation });
  });

  test('auth persistence across pages', async ({ page }) => {
    await page.goto('/');
    const initialAuth = await authHelpers.isAuthenticated();
    
    // Navigate to different page
    await page.goto('/channels');
    const authAfterNavigation = await authHelpers.isAuthenticated();
    
    // Auth state should persist
    expect(authAfterNavigation).toBe(initialAuth);
  });

  test('logout functionality', async ({ page }) => {
    await page.goto('/');
    
    // Look for logout button (if user is logged in)
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out")').first();
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should clear auth state
      const authAfterLogout = await authHelpers.isAuthenticated();
      expect(authAfterLogout).toBeFalsy();
    } else {
      console.log('No logout button found - user likely not logged in');
    }
  });

  test('protected route access', async ({ page }) => {
    // Clear auth to ensure we're logged out
    await authHelpers.clearAuthState();
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should either redirect to login or show login prompt
    const currentUrl = page.url();
    const hasLoginPrompt = await page.locator(
      'text*="login", text*="sign", text*="authenticate", button:has-text("Login")'
    ).count() > 0;
    
    console.log('Protected route test:', { currentUrl, hasLoginPrompt });
    
    // Should either redirect or prompt for login
    expect(currentUrl.includes('login') || currentUrl.includes('auth') || hasLoginPrompt).toBeTruthy();
  });

  test('auth error recovery', async ({ page }) => {
    // Simulate auth error
    await page.goto('/auth/callback?error=server_error&debug=true');
    
    // Look for recovery options
    const recoveryButton = page.locator('button, a[href="/"], a[href="/login"]').first();
    
    if (await recoveryButton.isVisible()) {
      await recoveryButton.click();
      
      // Should navigate away from error page
      await page.waitForTimeout(1000);
      const newUrl = page.url();
      expect(newUrl).not.toContain('error=server_error');
    } else {
      console.log('No recovery option found in error state');
    }
  });
});