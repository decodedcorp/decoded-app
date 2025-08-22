// 브라우저 콘솔에서 실행할 카드 클릭 테스트 스크립트
// 개발자 도구 콘솔에 붙여넣고 실행하세요

console.log('🎯 Testing card click functionality...');

// 1. 카드 요소들 찾기
const cards = document.querySelectorAll('[data-testid="simple-card"]');
console.log(`Found ${cards.length} cards`);

if (cards.length === 0) {
  console.log('❌ No cards found. Checking for alternative selectors...');
  
  // 대체 선택자들 시도
  const altSelectors = [
    '.grid > div', 
    '[class*="card"]',
    '[class*="Card"]',
    'div[onclick]',
    'div[role="button"]'
  ];
  
  altSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`${selector}: ${elements.length} elements`);
  });
} else {
  console.log('✅ Cards found, testing first card click...');
  
  // 2. 첫 번째 카드의 클릭 핸들러 확인
  const firstCard = cards[0];
  console.log('First card element:', firstCard);
  console.log('First card click handler:', firstCard.onclick);
  
  // 3. 이벤트 리스너 확인 (getEventListeners는 개발자 도구에서만 사용 가능)
  if (typeof getEventListeners === 'function') {
    console.log('Event listeners on first card:', getEventListeners(firstCard));
  }
  
  // 4. 클릭 이벤트 시뮬레이션
  console.log('📍 Simulating click...');
  
  // 클릭 이벤트 생성 및 발생
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  firstCard.dispatchEvent(clickEvent);
  
  // 5. 모달 상태 확인 (약간의 지연 후)
  setTimeout(() => {
    console.log('📍 Checking modal state...');
    
    const modal = document.querySelector('[data-testid="channel-modal"]');
    const modalVisible = modal && modal.style.display !== 'none';
    
    console.log('Modal element found:', !!modal);
    console.log('Modal visible:', modalVisible);
    
    // URL 확인
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);
    
    const hasChannelParam = currentUrl.includes('channel=');
    const hasContentParam = currentUrl.includes('content=');
    
    console.log('Has channel parameter:', hasChannelParam);
    console.log('Has content parameter:', hasContentParam);
    
    // 결과 요약
    console.log('\n📊 Test Results:');
    console.log(`- Cards found: ${cards.length > 0 ? '✅' : '❌'}`);
    console.log(`- Click triggered: ✅`);
    console.log(`- Modal found: ${modal ? '✅' : '❌'}`);
    console.log(`- Modal visible: ${modalVisible ? '✅' : '❌'}`);
    console.log(`- URL updated: ${hasChannelParam || hasContentParam ? '✅' : '❌'}`);
    
  }, 1000);
}

// 6. 추가: React 컴포넌트 상태 확인
console.log('\n🔍 React component debugging:');
console.log('Window location:', window.location.href);

// 스토어 상태 확인 (Zustand)
if (window.__ZUSTAND_STORE__) {
  console.log('Zustand store state:', window.__ZUSTAND_STORE__.getState());
}