/**
 * Playwright Grid Click Test
 * 
 * 메인페이지 그리드 카드 클릭 동작을 테스트합니다.
 */

import { chromium } from 'playwright';

async function testGridClick() {
  console.log('🔍 Starting Grid Click Test...\n');

  // 브라우저 시작
  const browser = await chromium.launch({ 
    headless: false, // 디버깅을 위해 브라우저 창 표시
    slowMo: 500 // 동작을 천천히 진행
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  try {
    // 콘솔 로그 캡처
    page.on('console', msg => {
      console.log(`🖥️  Console [${msg.type()}]:`, msg.text());
    });

    // 네트워크 요청 로그
    page.on('request', request => {
      if (request.url().includes('channel') || request.url().includes('contents')) {
        console.log(`🌐 Request: ${request.method()} ${request.url()}`);
      }
    });

    // 1. 메인페이지로 이동
    console.log('📍 Step 1: 메인페이지 로드 중...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 2. 페이지 로드 확인
    await page.waitForSelector('main', { timeout: 10000 });
    console.log('✅ 메인페이지 로드 완료');

    // 3. 그리드 카드 로드 대기
    console.log('📍 Step 2: 그리드 카드 로드 대기...');
    
    // SimpleThiingsGrid 컴포넌트 확인
    const gridExists = await page.locator('[class*="ThiingsGrid"]').count() > 0;
    console.log(`Grid component exists: ${gridExists}`);

    // 카드 요소들 찾기 (다양한 셀렉터 시도)
    const cardSelectors = [
      '[class*="cursor-pointer"]', // 우리가 추가한 클래스
      '[class*="bg-zinc-900"][class*="rounded-xl"]', // SimpleCard 스타일
      'div[style*="transform"]', // 그리드 아이템들
      '[class*="relative"][class*="bg-zinc-900"]' // SimpleCard 기본 클래스
    ];

    let cards = null;
    let usedSelector = '';

    for (const selector of cardSelectors) {
      cards = page.locator(selector);
      const count = await cards.count();
      console.log(`🔍 Selector "${selector}": ${count} elements found`);
      
      if (count > 0) {
        usedSelector = selector;
        break;
      }
    }

    if (!cards || await cards.count() === 0) {
      console.log('❌ 카드 요소를 찾을 수 없습니다. DOM 구조 확인:');
      
      // DOM 구조 디버깅
      const bodyHTML = await page.locator('main').innerHTML();
      console.log('Main element structure:', bodyHTML.slice(0, 500) + '...');
      
      return;
    }

    const cardCount = await cards.count();
    console.log(`✅ ${cardCount}개의 카드 발견 (selector: ${usedSelector})`);

    // 4. 첫 번째 카드 클릭 테스트
    console.log('📍 Step 3: 첫 번째 카드 클릭 테스트...');
    
    const firstCard = cards.first();
    
    // 카드가 보이는지 확인
    await firstCard.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ 첫 번째 카드가 화면에 표시됨');

    // 카드 스타일 확인
    const cardStyles = await firstCard.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        cursor: styles.cursor,
        pointerEvents: styles.pointerEvents,
        position: styles.position,
        zIndex: styles.zIndex
      };
    });
    console.log('🎨 카드 스타일:', cardStyles);

    // 클릭 이벤트 리스너 확인
    const hasClickHandler = await firstCard.evaluate(el => {
      const events = getEventListeners ? getEventListeners(el) : 'getEventListeners not available';
      return { events, onclick: !!el.onclick };
    });
    console.log('🎯 클릭 핸들러:', hasClickHandler);

    // URL 변경 감지 준비
    let urlChanged = false;
    page.on('framenavigated', () => {
      urlChanged = true;
      console.log('🔄 URL 변경됨:', page.url());
    });

    // 카드 클릭
    console.log('👆 카드 클릭 시도...');
    await firstCard.click();

    // 잠시 대기
    await page.waitForTimeout(2000);

    // 5. 모달 열림 확인
    console.log('📍 Step 4: 모달 열림 확인...');
    
    const modalSelectors = [
      '[class*="modal"]',
      '[class*="Modal"]', 
      '[role="dialog"]',
      '[class*="fixed"][class*="inset-0"]'
    ];

    let modalFound = false;
    for (const selector of modalSelectors) {
      const modalCount = await page.locator(selector).count();
      if (modalCount > 0) {
        console.log(`✅ 모달 발견: ${selector} (${modalCount}개)`);
        modalFound = true;
        break;
      }
    }

    if (!modalFound) {
      console.log('❌ 모달이 열리지 않았습니다.');
    }

    // 6. URL 파라미터 확인
    console.log('📍 Step 5: URL 파라미터 확인...');
    const currentUrl = page.url();
    const url = new URL(currentUrl);
    const channelParam = url.searchParams.get('channel');
    const contentParam = url.searchParams.get('content');

    console.log(`🔗 Current URL: ${currentUrl}`);
    console.log(`📝 Channel param: ${channelParam}`);
    console.log(`📝 Content param: ${contentParam}`);

    // 7. 네트워크 요청 확인
    console.log('📍 Step 6: 네트워크 요청 완료');

    // 8. 결과 요약
    console.log('\n📊 테스트 결과 요약:');
    console.log(`✅ 페이지 로드: 성공`);
    console.log(`✅ 카드 발견: ${cardCount}개`);
    console.log(`${modalFound ? '✅' : '❌'} 모달 열림: ${modalFound ? '성공' : '실패'}`);
    console.log(`${channelParam ? '✅' : '❌'} URL 파라미터: ${channelParam ? '성공' : '실패'}`);
    console.log(`${urlChanged ? '✅' : '❌'} URL 변경: ${urlChanged ? '성공' : '실패'}`);

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  } finally {
    // 브라우저 종료
    await browser.close();
    console.log('\n🔚 테스트 완료');
  }
}

// 테스트 실행
testGridClick().catch(console.error);