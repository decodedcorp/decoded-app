import { chromium } from 'playwright';

async function testCardClickAndBlur() {
  console.log('🎭 Playwright 테스트 시작: 카드 클릭 및 블러 효과');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // 1초 지연으로 애니메이션 관찰
  });
  
  const page = await browser.newPage();
  
  try {
    // 메인 페이지로 이동
    await page.goto('http://localhost:3001');
    console.log('✅ 페이지 로드 완료');
    
    // 카드가 로드될 때까지 대기
    await page.waitForSelector('[data-original-card-id]', { timeout: 10000 });
    console.log('✅ 카드 로드 확인');
    
    // 사이드바가 닫혀있는지 확인
    const sidebarBefore = await page.locator('[data-testid="content-sidebar"]').isVisible();
    console.log(`📋 사이드바 초기 상태: ${sidebarBefore ? '열림' : '닫힘'}`);
    
    // 첫 번째 카드 클릭 - 헤더를 피해서 클릭
    const firstCard = page.locator('[data-original-card-id]').first();
    const cardId = await firstCard.getAttribute('data-original-card-id');
    console.log(`🎯 첫 번째 카드 클릭 준비 (ID: ${cardId})`);
    
    // 헤더 때문에 클릭이 방해받지 않도록 force 옵션 사용
    await firstCard.click({ force: true });
    console.log('✅ 카드 클릭 완료');
    
    // 사이드바가 열렸는지 확인 (최대 5초 대기)
    await page.waitForSelector('.fixed.right-0.w-\\[500px\\]', { timeout: 5000 });
    console.log('✅ 사이드바 열림 확인');
    
    // 선택된 카드가 하이라이트 되었는지 확인
    const selectedCard = page.locator(`[data-original-card-id="${cardId}"]`).first();
    const hasRing = await selectedCard.locator('..').evaluate(el => 
      el.className.includes('ring-4') && el.className.includes('ring-blue-400')
    );
    console.log(`🎨 선택된 카드 하이라이트: ${hasRing ? '✅ 적용됨' : '❌ 미적용'}`);
    
    // 다른 카드들이 블러 처리되었는지 확인
    const allCards = page.locator('[data-original-card-id]');
    const cardCount = await allCards.count();
    console.log(`📊 전체 카드 수: ${cardCount}`);
    
    // 블러 오버레이가 있는 카드 수 확인
    const blurredCards = page.locator('[data-original-card-id] .backdrop-blur-sm');
    const blurredCount = await blurredCards.count();
    console.log(`🔍 블러 처리된 카드 수: ${blurredCount}`);
    
    // 스크롤 위치 확인 (선택된 카드가 중앙에 있는지)
    const cardRect = await selectedCard.boundingBox();
    const viewportSize = await page.viewportSize();
    
    if (cardRect && viewportSize) {
      const cardCenterY = cardRect.y + cardRect.height / 2;
      const viewportCenterY = viewportSize.height / 2;
      const distanceFromCenter = Math.abs(cardCenterY - viewportCenterY);
      
      console.log(`📍 카드 중앙 정렬 상태:`);
      console.log(`   - 카드 중심: ${cardCenterY.toFixed(0)}px`);
      console.log(`   - 뷰포트 중심: ${viewportCenterY.toFixed(0)}px`);
      console.log(`   - 거리: ${distanceFromCenter.toFixed(0)}px`);
      console.log(`   - 중앙 정렬: ${distanceFromCenter < 100 ? '✅ 성공' : '❌ 실패'}`);
    }
    
    // 사이드바 닫기 테스트
    console.log('🚪 사이드바 닫기 테스트...');
    await page.keyboard.press('Escape');
    
    // 사이드바가 닫혔는지 확인 (translate-x-full 클래스로 확인)
    await page.waitForFunction(() => {
      const sidebar = document.querySelector('.fixed.right-0.w-\\[500px\\]');
      return sidebar && sidebar.classList.contains('translate-x-full');
    }, { timeout: 3000 });
    console.log('✅ 사이드바 닫힘 확인');
    
    // 모든 효과가 리셋되었는지 확인
    const ringsAfterClose = page.locator('.ring-4.ring-blue-400');
    const ringCount = await ringsAfterClose.count();
    console.log(`🎨 사이드바 닫은 후 하이라이트 수: ${ringCount} ${ringCount === 0 ? '✅ 정상' : '❌ 비정상'}`);
    
    const blurAfterClose = page.locator('.backdrop-blur-sm');
    const blurCountAfter = await blurAfterClose.count();
    console.log(`🔍 사이드바 닫은 후 블러 수: ${blurCountAfter} ${blurCountAfter === 0 ? '✅ 정상' : '❌ 비정상'}`);
    
    console.log('🎉 모든 테스트 완료!');
    
    // 5초 동안 결과 관찰
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  } finally {
    await browser.close();
  }
}

// 테스트 실행
testCardClickAndBlur().catch(console.error);