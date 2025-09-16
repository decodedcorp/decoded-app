import { test, expect, Page } from '@playwright/test';

test.describe('Modal Click Events', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 페이지로 이동
    await page.goto('/test-modal');
    await page.waitForLoadState('networkidle');
  });

  test('SimpleModal - 오버레이 클릭으로 모달 닫기', async ({ page }) => {
    // 브라우저 콘솔 로그 수집
    page.on('console', msg => console.log('Browser log:', msg.text()));

    // Simple Modal 열기
    await page.click('button:has-text("Simple Modal 테스트")');

    // 모달이 열렸는지 확인
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('#modal-title:has-text("Simple Modal 테스트")')).toBeVisible();

    // 잠깐 대기해서 모달이 완전히 렌더링되도록 함
    await page.waitForTimeout(500);

    // 오버레이 클릭 (모달 외부 영역)
    console.log('🧪 About to click modal overlay...');
    await page.locator('.modal-overlay').click({ position: { x: 50, y: 50 }, force: true });

    // 잠깐 대기해서 클릭 이벤트가 처리되도록 함
    await page.waitForTimeout(500);

    // 모달이 닫혔는지 확인
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 테스트 결과 로그 확인
    await expect(page.locator('text=SimpleModal 닫힘')).toBeVisible();
  });

  test('SimpleModal - X 버튼으로 모달 닫기', async ({ page }) => {
    // Simple Modal 열기
    await page.click('button:has-text("Simple Modal 테스트")');

    // 모달이 열렸는지 확인
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // X 버튼 클릭
    await page.locator('[aria-label="Close modal"]').click();

    // 모달이 닫혔는지 확인
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 테스트 결과 로그 확인
    await expect(page.locator('text=SimpleModal 닫힘')).toBeVisible();
  });

  test('SimpleModal - ESC 키로 모달 닫기', async ({ page }) => {
    // Simple Modal 열기
    await page.click('text=Simple Modal 테스트');

    // 모달이 열렸는지 확인
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // ESC 키 누르기
    await page.keyboard.press('Escape');

    // 모달이 닫혔는지 확인
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 테스트 결과 로그 확인
    await expect(page.locator('text=SimpleModal 닫힘')).toBeVisible();
  });

  test('SimpleModal - 내부 콘텐츠 클릭 시 모달이 닫히지 않음', async ({ page }) => {
    // Simple Modal 열기
    await page.click('text=Simple Modal 테스트');

    // 모달이 열렸는지 확인
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // 모달 내부 콘텐츠 클릭
    await page.locator('text=내부 버튼 테스트').click();

    // 모달이 여전히 열려있는지 확인
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // 내부 버튼 클릭 로그 확인
    await expect(page.locator('text=내부 버튼 클릭 - 모달이 닫히면 안됨')).toBeVisible();
  });

  test('ConfirmModal - 확인/취소 버튼 동작', async ({ page }) => {
    // Confirm Modal 열기
    await page.click('text=Confirm Modal 테스트');

    // 모달이 열렸는지 확인
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=확인 모달 테스트')).toBeVisible();

    // 취소 버튼 클릭
    await page.click('text=취소');

    // 모달이 닫혔는지 확인
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 취소 버튼 클릭 로그 확인
    await expect(page.locator('text=취소 버튼 클릭')).toBeVisible();

    // 다시 모달 열기
    await page.click('text=Confirm Modal 테스트');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // 확인 버튼 클릭
    await page.click('text=확인');

    // 모달이 닫혔는지 확인
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 확인 버튼 클릭 로그 확인
    await expect(page.locator('text=확인 버튼 클릭')).toBeVisible();
  });

  test('CustomModal - 모든 클릭 이벤트 테스트', async ({ page }) => {
    // Custom Modal 열기
    await page.click('text=Custom Modal 테스트');

    // 모달이 열렸는지 확인
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Custom Modal 테스트')).toBeVisible();

    // 내부 버튼 클릭 (모달이 닫히면 안됨)
    await page.locator('text=내부 버튼 (닫히면 안됨)').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Custom Modal 내부 버튼 클릭')).toBeVisible();

    // 완료 버튼으로 모달 닫기
    await page.click('text=완료');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Custom Modal 완료 버튼으로 닫기')).toBeVisible();
  });

  test('중첩 모달 테스트', async ({ page }) => {
    // Simple Modal 열기
    await page.click('text=Simple Modal 테스트');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // 중첩 모달 열기
    await page.click('text=중첩 모달 열기');

    // 중첩 모달이 보이는지 확인
    await expect(page.locator('text=중첩 모달')).toBeVisible();

    // 중첩 모달 내부 버튼 클릭
    await page.locator('text=중첩 모달 내부 버튼').click();
    await expect(page.locator('text=중첩 모달 내부 버튼 클릭')).toBeVisible();

    // ESC로 중첩 모달 닫기
    await page.keyboard.press('Escape');

    // 원래 모달이 다시 보이는지 확인
    await expect(page.locator('text=Simple Modal 테스트')).toBeVisible();
    await expect(page.locator('text=중첩 모달')).not.toBeVisible();
  });

  test('모달 접근성 테스트', async ({ page }) => {
    // Simple Modal 열기
    await page.click('text=Simple Modal 테스트');

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // 접근성 속성 확인
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby');

    // 포커스 트랩 확인 (Tab 키로 순환)
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluateHandle(() => document.activeElement);

    // 모달 내부의 포커스 가능한 요소에 포커스가 있는지 확인
    const isInsideModal = await page.evaluate((modal, focused) => {
      return modal.contains(focused);
    }, await modal.elementHandle(), focusedElement);

    expect(isInsideModal).toBe(true);
  });
});

test.describe('모달 성능 테스트', () => {
  test('모달 열기/닫기 성능', async ({ page }) => {
    await page.goto('/test-modal');

    // 성능 측정 시작
    await page.evaluate(() => performance.mark('modal-test-start'));

    // 여러 번 모달 열기/닫기
    for (let i = 0; i < 5; i++) {
      await page.click('text=Simple Modal 테스트');
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    }

    // 성능 측정 종료
    const duration = await page.evaluate(() => {
      performance.mark('modal-test-end');
      performance.measure('modal-test', 'modal-test-start', 'modal-test-end');
      const measure = performance.getEntriesByName('modal-test')[0];
      return measure.duration;
    });

    // 성능 검증 (5초 이내)
    expect(duration).toBeLessThan(5000);
    console.log(`모달 5회 열기/닫기 소요 시간: ${duration.toFixed(2)}ms`);
  });
});

test.describe('모바일 환경 테스트', () => {
  test.use({
    viewport: { width: 375, height: 667 } // iPhone SE 크기
  });

  test('모바일에서 모달 동작', async ({ page }) => {
    await page.goto('/test-modal');

    // 모바일에서 Simple Modal 열기
    await page.click('text=Simple Modal 테스트');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // 터치로 오버레이 클릭
    await page.locator('.modal-overlay').tap({ position: { x: 50, y: 50 } });
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});