import { test, expect } from '@playwright/test';

test.describe('Color Theme Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not generate OKLCH colors in login button', async ({ page }) => {
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Find the login button
    const loginButton = page.getByRole('button', { name: /로그인|login/i });
    await expect(loginButton).toBeVisible();

    // Get all computed styles
    const computedStyles = await loginButton.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor,
        // Get all CSS custom properties
        customProperties: Array.from(document.styleSheets)
          .flatMap(sheet => {
            try {
              return Array.from(sheet.cssRules || []);
            } catch (e) {
              return [];
            }
          })
          .flatMap(rule => {
            if (rule.type === CSSRule.STYLE_RULE) {
              const styleRule = rule as CSSStyleRule;
              const props: string[] = [];
              for (let i = 0; i < styleRule.style.length; i++) {
                const prop = styleRule.style[i];
                if (prop.startsWith('--')) {
                  props.push(`${prop}: ${styleRule.style.getPropertyValue(prop)}`);
                }
              }
              return props;
            }
            return [];
          })
      };
    });

    console.log('Login Button Computed Styles:', computedStyles);

    // Check that no OKLCH colors are present
    const hasOKLCH =
      computedStyles.backgroundColor.includes('oklch') ||
      computedStyles.color.includes('oklch') ||
      computedStyles.borderColor.includes('oklch');

    expect(hasOKLCH).toBeFalsy();

    // Verify expected design token values
    expect(computedStyles.backgroundColor).not.toContain('oklch');
    expect(computedStyles.color).not.toContain('oklch');
    expect(computedStyles.borderColor).not.toContain('oklch');
  });

  test('should use correct design tokens for login button', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const loginButton = page.getByRole('button', { name: /로그인|login/i });
    await expect(loginButton).toBeVisible();

    // Get CSS custom property values
    const tokenValues = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        colorPrimary: styles.getPropertyValue('--color-primary').trim(),
        colorPrimaryOn: styles.getPropertyValue('--color-on-primary').trim(),
        colorPrimaryBd: styles.getPropertyValue('--color-primary-bd').trim(),
        colorBg: styles.getPropertyValue('--color-background').trim(),
        neutralBg: styles.getPropertyValue('--neutral-bg').trim(),
        brandH: styles.getPropertyValue('--brand-h').trim(),
        brandS: styles.getPropertyValue('--brand-s').trim(),
        brandL: styles.getPropertyValue('--brand-l').trim(),
      };
    });

    console.log('Design Token Values:', tokenValues);

    // Verify brand color values
    expect(tokenValues.brandH).toBe('74');
    expect(tokenValues.brandS).toBe('96%');
    expect(tokenValues.brandL).toBe('70%');

    // Verify primary color is HSL-based, not OKLCH
    expect(tokenValues.colorPrimary).toContain('hsl');
    expect(tokenValues.colorPrimary).not.toContain('oklch');
  });

  test('should hover correctly without OKLCH conversion', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const loginButton = page.getByRole('button', { name: /로그인|login/i });
    await expect(loginButton).toBeVisible();

    // Get initial styles
    const initialStyles = await loginButton.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor,
      };
    });

    // Hover over the button
    await loginButton.hover();
    await page.waitForTimeout(100); // Wait for hover transition

    // Get hover styles
    const hoverStyles = await loginButton.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor,
      };
    });

    console.log('Initial Styles:', initialStyles);
    console.log('Hover Styles:', hoverStyles);

    // Verify no OKLCH in hover state
    expect(hoverStyles.backgroundColor).not.toContain('oklch');
    expect(hoverStyles.color).not.toContain('oklch');
    expect(hoverStyles.borderColor).not.toContain('oklch');

    // Verify colors changed on hover (should be different)
    expect(hoverStyles.backgroundColor).not.toBe(initialStyles.backgroundColor);
  });

  test('should verify theme switching works without OKLCH', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Test dark theme (default)
    let tokenValues = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        theme: document.documentElement.getAttribute('data-theme'),
        colorPrimary: styles.getPropertyValue('--color-primary').trim(),
        colorBackground: styles.getPropertyValue('--color-background').trim(),
      };
    });

    expect(tokenValues.theme).toBe('dark');
    expect(tokenValues.colorPrimary).not.toContain('oklch');
    expect(tokenValues.colorBackground).not.toContain('oklch');

    // Switch to light theme by setting data-theme attribute
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await page.waitForTimeout(100);

    // Test light theme
    tokenValues = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        theme: document.documentElement.getAttribute('data-theme'),
        colorPrimary: styles.getPropertyValue('--color-primary').trim(),
        colorBackground: styles.getPropertyValue('--color-background').trim(),
      };
    });

    expect(tokenValues.theme).toBe('light');
    expect(tokenValues.colorPrimary).not.toContain('oklch');
    expect(tokenValues.colorBackground).not.toContain('oklch');

    console.log('Light Theme Values:', tokenValues);
  });

  test('should check all CSS rules for OKLCH usage', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Scan all CSS rules for OKLCH usage
    const oklchUsage = await page.evaluate(() => {
      const oklchRules: string[] = [];

      try {
        Array.from(document.styleSheets).forEach((sheet, sheetIndex) => {
          try {
            Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
              const ruleText = rule.cssText || '';
              if (ruleText.includes('oklch')) {
                oklchRules.push(`Sheet ${sheetIndex}, Rule ${ruleIndex}: ${ruleText}`);
              }
            });
          } catch (e) {
            // Skip cross-origin stylesheets
          }
        });
      } catch (e) {
        console.error('Error scanning stylesheets:', e);
      }

      return oklchRules;
    });

    console.log('OKLCH Usage Found:', oklchUsage);

    // Should have no OKLCH usage
    expect(oklchUsage.length).toBe(0);
  });
});