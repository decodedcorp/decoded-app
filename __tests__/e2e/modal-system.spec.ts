import { test, expect } from '@playwright/test';

test.describe('Modal System', () => {
  test('모달이 뷰포트를 벗어나지 않음', async ({ page }) => {
    await page.goto('/');

    // ContentUploadModal 열기
    await page.click('[data-testid="create-button"]');
    await page.click('[data-testid="upload-content-button"]');

    // 모달이 로드될 때까지 대기
    await page.waitForSelector('[role="dialog"]');

    // 모달의 bounding box 확인
    const modalBox = await page.locator('[role="dialog"]').boundingBox();
    const viewport = page.viewportSize();

    expect(modalBox).toBeTruthy();
    expect(modalBox!.x).toBeGreaterThanOrEqual(0);
    expect(modalBox!.y).toBeGreaterThanOrEqual(0);
    expect(modalBox!.x + modalBox!.width).toBeLessThanOrEqual(viewport!.width);
    expect(modalBox!.y + modalBox!.height).toBeLessThanOrEqual(viewport!.height);
  });

  test('모달 중첩 시 최상단만 ESC/오버레이 반응', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 모달 열기
    await page.click('[data-testid="create-button"]');
    await page.click('[data-testid="upload-content-button"]');
    await page.waitForSelector('[role="dialog"]');

    // 두 번째 모달 열기 (예: 채널 선택)
    await page.click('[data-testid="select-channel-button"]');
    await page.waitForSelector('[role="dialog"]:nth-child(2)');

    // ESC 키로 최상단 모달만 닫히는지 확인
    await page.keyboard.press('Escape');

    // 첫 번째 모달은 여전히 열려있어야 함
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // 오버레이 클릭으로 첫 번째 모달 닫기
    await page.click('[data-testid="modal-overlay"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('모달 크기가 토큰에 따라 올바르게 적용됨', async ({ page }) => {
    await page.goto('/');

    // ContentUploadModal 열기 (wide 사이즈)
    await page.click('[data-testid="create-button"]');
    await page.click('[data-testid="upload-content-button"]');
    await page.waitForSelector('[role="dialog"]');

    // 모달이 올바른 크기 클래스를 가지는지 확인
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toHaveClass(/modal-size-wide/);

    // CSS 변수가 올바르게 적용되었는지 확인
    const maxWidth = await modal.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('max-width'),
    );

    expect(maxWidth).toContain('75rem'); // --modal-max-w-wide
  });
});
