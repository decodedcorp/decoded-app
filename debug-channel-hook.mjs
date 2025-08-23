/**
 * Debug Script for Channel Hook
 * 
 * 채널 콘텐츠 훅의 네트워크 요청을 테스트합니다.
 */

import { chromium } from 'playwright';

async function debugChannelHook() {
  console.log('🔍 Starting Channel Hook Debug...\\n');

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

    // 네트워크 요청 캡처
    const networkRequests = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('channel') || url.includes('contents') || url.includes('proxy')) {
        networkRequests.push({
          url,
          method: request.method(),
          headers: request.headers(),
        });
        console.log(`🌐 Request: ${request.method()} ${url}`);
      }
    });

    page.on('response', response => {
      const url = response.url();
      if (url.includes('channel') || url.includes('contents') || url.includes('proxy')) {
        console.log(`📥 Response: ${response.status()} ${url}`);
      }
    });

    // 1. 메인페이지로 이동
    console.log('📍 Step 1: 메인페이지 로드 중...');
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 2. 페이지 로드 확인
    await page.waitForSelector('main', { timeout: 10000 });
    console.log('✅ 메인페이지 로드 완료');

    // 3. React Query 상태 확인
    console.log('📍 Step 2: React Query 상태 확인...');
    
    // 잠시 대기하여 React Query가 초기화되고 요청을 보낼 수 있도록 함
    await page.waitForTimeout(3000);

    // 페이지에서 React Query 상태 추출
    const reactQueryState = await page.evaluate(() => {
      // React Query DevTools 정보 가져오기 (있다면)
      if (window.__REACT_QUERY_STATE__) {
        return window.__REACT_QUERY_STATE__;
      }
      
      // 또는 콘솔에서 로그 정보 확인
      return {
        note: 'React Query state not directly accessible, check console logs'
      };
    });

    console.log('🔍 React Query State:', JSON.stringify(reactQueryState, null, 2));

    // 4. DOM 구조 분석
    console.log('📍 Step 3: DOM 구조 분석...');
    
    const domInfo = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return { error: 'Main element not found' };
      
      return {
        innerHTML: main.innerHTML.slice(0, 500) + '...',
        children: Array.from(main.children).map(child => ({
          tagName: child.tagName,
          className: child.className,
          textContent: child.textContent?.slice(0, 100) + '...'
        }))
      };
    });

    console.log('🏗️ DOM Structure:', JSON.stringify(domInfo, null, 2));

    // 5. 네트워크 요청 결과 확인
    console.log('📍 Step 4: 네트워크 요청 분석...');
    console.log(`📊 Total API requests captured: ${networkRequests.length}`);
    
    if (networkRequests.length === 0) {
      console.log('❌ No API requests found - React Query may not be working');
    } else {
      networkRequests.forEach((req, index) => {
        console.log(`${index + 1}. ${req.method} ${req.url}`);
        if (req.headers['authorization']) {
          console.log(`   🔑 Auth: ${req.headers['authorization'].slice(0, 20)}...`);
        }
      });
    }

    // 6. 더 오래 기다려서 지연된 요청 확인
    console.log('📍 Step 5: 지연된 요청 확인 (5초 대기)...');
    await page.waitForTimeout(5000);

    console.log('\\n📊 최종 분석:');
    console.log(`✅ 페이지 로드: 성공`);
    console.log(`${networkRequests.length > 0 ? '✅' : '❌'} API 요청: ${networkRequests.length}개`);
    console.log(`📍 서버 포트: 3001`);

  } catch (error) {
    console.error('❌ 디버그 중 오류 발생:', error);
  } finally {
    // 브라우저 종료
    await browser.close();
    console.log('\\n🔚 디버그 완료');
  }
}

// 디버그 실행
debugChannelHook().catch(console.error);