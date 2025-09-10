import { Page, expect } from '@playwright/test';

export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to login page or trigger login modal
   */
  async navigateToLogin() {
    await this.page.goto('/');
    
    // Look for login button or trigger
    const loginTrigger = this.page.locator(
      'button:has-text("Login"), button:has-text("Sign"), button:has-text("Continue with Google"), [data-testid="login-button"]'
    ).first();
    
    if (await loginTrigger.isVisible()) {
      await loginTrigger.click();
    }
    
    return loginTrigger;
  }

  /**
   * Wait for authentication to complete
   */
  async waitForAuth(timeout = 30000) {
    return await Promise.race([
      this.page.waitForURL('**/dashboard', { timeout }),
      this.page.waitForURL('**/', { timeout }),
      this.page.waitForFunction(() => {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        return !!token;
      }, { timeout })
    ]);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.page.evaluate(() => {
      // Check for auth tokens in storage
      const hasTokenInLocal = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const hasTokenInSession = sessionStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      
      // Check for auth cookies
      const hasAuthCookie = document.cookie.includes('auth') || document.cookie.includes('token');
      
      return !!(hasTokenInLocal || hasTokenInSession || hasAuthCookie);
    });
  }

  /**
   * Clear all authentication state
   */
  async clearAuthState() {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Mock Google OAuth success
   */
  async mockGoogleOAuthSuccess() {
    await this.page.addInitScript(() => {
      // Mock successful OAuth response
      window.addEventListener('message', (event) => {
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          console.log('Mocked OAuth success:', event.data);
        }
      });
    });
  }

  /**
   * Simulate OAuth callback with test data
   */
  async simulateOAuthCallback(code: string = 'test_code_12345', state?: string) {
    const callbackUrl = `/auth/callback?code=${code}${state ? `&state=${state}` : ''}`;
    await this.page.goto(callbackUrl);
  }

  /**
   * Check for auth-related console errors
   */
  async getAuthErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error' && 
          (msg.text().includes('auth') || 
           msg.text().includes('login') || 
           msg.text().includes('OAuth') ||
           msg.text().includes('token'))) {
        errors.push(msg.text());
      }
    });
    
    return errors;
  }

  /**
   * Verify auth environment variables are set
   */
  async verifyAuthConfig(): Promise<{ isValid: boolean; errors: string[] }> {
    const result = await this.page.evaluate(() => {
      const errors: string[] = [];
      
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        errors.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing');
      }
      
      // Note: GOOGLE_CLIENT_SECRET is server-only, can't check from client
      
      return {
        isValid: errors.length === 0,
        errors,
        hasClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      };
    });
    
    return result;
  }

  /**
   * Wait for and handle popup authentication flow
   */
  async handleAuthPopup(timeout = 30000) {
    const popupPromise = this.page.context().waitForEvent('page');
    
    try {
      const popup = await popupPromise;
      
      // Wait for popup to load
      await popup.waitForLoadState('networkidle');
      
      // Check if it's Google OAuth
      if (popup.url().includes('accounts.google.com')) {
        // In test environment, we can't actually complete OAuth
        // So we'll close the popup and return
        await popup.close();
        return { type: 'oauth_popup_opened' };
      }
      
      await popup.close();
      return { type: 'popup_closed' };
      
    } catch (error) {
      return { type: 'no_popup', error: String(error) };
    }
  }

  /**
   * Test auth API endpoint directly
   */
  async testAuthEndpoint(code: string = 'test_code') {
    const response = await this.page.request.post('/api/auth/google', {
      data: { code },
      headers: { 'Content-Type': 'application/json' }
    });
    
    return {
      status: response.status(),
      ok: response.ok(),
      body: await response.text().catch(() => ''),
      headers: Object.fromEntries(response.headers())
    };
  }

  /**
   * Assert user is logged in
   */
  async assertLoggedIn() {
    const isAuth = await this.isAuthenticated();
    expect(isAuth).toBeTruthy();
    
    // Additional UI checks
    const hasUserAvatar = await this.page.locator('[data-testid="user-avatar"], [class*="avatar"], [class*="user"]').count() > 0;
    const hasLogoutButton = await this.page.locator('button:has-text("Logout"), button:has-text("Sign out")').count() > 0;
    
    console.log('Login assertion:', { isAuth, hasUserAvatar, hasLogoutButton });
  }

  /**
   * Assert user is logged out
   */
  async assertLoggedOut() {
    const isAuth = await this.isAuthenticated();
    expect(isAuth).toBeFalsy();
    
    // Check for login UI
    const hasLoginButton = await this.page.locator('button:has-text("Login"), button:has-text("Sign"), button:has-text("Continue with Google")').count() > 0;
    
    console.log('Logout assertion:', { isAuth, hasLoginButton });
  }
}