// 브라우저 콘솔에서 실행할 레이아웃 디버깅 스크립트
// 사용법: 브라우저에서 F12 개발자 도구 열고 Console 탭에서 이 코드를 복사-붙여넣기

console.log('🔍 Layout Debug Tool Started');
console.log('================================');

function debugLayout() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  console.log(`📱 Viewport: ${viewportWidth}x${viewportHeight}`);

  // 핵심 요소들 가져오기
  const layout = document.querySelector('.layout');
  const contentWrapper = document.querySelector('.content-wrapper');
  const leftSidebar = document.querySelector('.sidebar-left');
  const rightSidebar = document.querySelector('.sidebar-right');
  const main = document.querySelector('.main');

  if (!layout || !contentWrapper) {
    console.error('❌ Layout elements not found!');
    return;
  }

  // 스크롤 정보
  const scrollInfo = {
    documentWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyWidth: document.body.scrollWidth,
    hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    overflowAmount: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };

  console.log('\n📏 Scroll Analysis:');
  console.log(`   Document width: ${scrollInfo.documentWidth}px`);
  console.log(`   Client width: ${scrollInfo.clientWidth}px`);
  console.log(`   Body width: ${scrollInfo.bodyWidth}px`);

  if (scrollInfo.hasHorizontalScroll) {
    console.log(`❌ HORIZONTAL OVERFLOW: +${scrollInfo.overflowAmount}px`);
  } else {
    console.log(`✅ No horizontal overflow`);
  }

  // CSS 변수들
  const layoutStyles = window.getComputedStyle(layout);
  const cssVars = {
    sidebarWidth: layoutStyles.getPropertyValue('--sidebar-width'),
    gapMain: layoutStyles.getPropertyValue('--gap-main'),
    containerPaddingX: layoutStyles.getPropertyValue('--container-padding-x'),
    contentMaxWidth: layoutStyles.getPropertyValue('--content-max-width')
  };

  console.log('\n🎨 CSS Variables:');
  Object.entries(cssVars).forEach(([key, value]) => {
    console.log(`   --${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`);
  });

  // 컨테이너 쿼리 지원 확인
  const containerQuerySupport = CSS.supports('container-type: inline-size');
  console.log(`\n🔧 Container Query Support: ${containerQuerySupport ? '✅' : '❌'}`);

  // Content Wrapper 분석
  const contentStyles = window.getComputedStyle(contentWrapper);
  console.log('\n📦 Content Wrapper:');
  console.log(`   width: ${contentStyles.width}`);
  console.log(`   max-width: ${contentStyles.maxWidth}`);
  console.log(`   display: ${contentStyles.display}`);
  console.log(`   gap: ${contentStyles.gap}`);
  console.log(`   padding-left: ${contentStyles.paddingLeft}`);
  console.log(`   padding-right: ${contentStyles.paddingRight}`);
  console.log(`   overflow-x: ${contentStyles.overflowX}`);
  console.log(`   container-type: ${contentStyles.containerType || 'none'}`);
  console.log(`   clientWidth: ${contentWrapper.clientWidth}px`);
  console.log(`   scrollWidth: ${contentWrapper.scrollWidth}px`);
  console.log(`   offsetWidth: ${contentWrapper.offsetWidth}px`);

  // 사이드바 분석
  console.log('\n🏛️ Sidebars:');

  if (leftSidebar) {
    const leftStyles = window.getComputedStyle(leftSidebar);
    const isVisible = leftStyles.display !== 'none';
    console.log(`   Left Sidebar: ${isVisible ? '✅ Visible' : '❌ Hidden'}`);
    if (isVisible) {
      console.log(`     width: ${leftStyles.width}`);
      console.log(`     flex: ${leftStyles.flex}`);
      console.log(`     clientWidth: ${leftSidebar.clientWidth}px`);
      console.log(`     offsetWidth: ${leftSidebar.offsetWidth}px`);
    }
  }

  if (rightSidebar) {
    const rightStyles = window.getComputedStyle(rightSidebar);
    const isVisible = rightStyles.display !== 'none';
    console.log(`   Right Sidebar: ${isVisible ? '✅ Visible' : '❌ Hidden'}`);
    if (isVisible) {
      console.log(`     width: ${rightStyles.width}`);
      console.log(`     flex: ${rightStyles.flex}`);
      console.log(`     clientWidth: ${rightSidebar.clientWidth}px`);
      console.log(`     offsetWidth: ${rightSidebar.offsetWidth}px`);
    }
  }

  // 메인 콘텐츠 분석
  if (main) {
    const mainStyles = window.getComputedStyle(main);
    console.log('\n📄 Main Content:');
    console.log(`   width: ${mainStyles.width}`);
    console.log(`   max-width: ${mainStyles.maxWidth}`);
    console.log(`   flex: ${mainStyles.flex}`);
    console.log(`   clientWidth: ${main.clientWidth}px`);
    console.log(`   offsetWidth: ${main.offsetWidth}px`);
    console.log(`   scrollWidth: ${main.scrollWidth}px`);
  }

  // 계산된 총 너비
  let calculatedWidth = 0;
  const paddingX = parseInt(contentStyles.paddingLeft) + parseInt(contentStyles.paddingRight);
  const gap = parseInt(contentStyles.gap) || 0;

  calculatedWidth += paddingX;

  if (leftSidebar && window.getComputedStyle(leftSidebar).display !== 'none') {
    calculatedWidth += leftSidebar.offsetWidth + gap;
  }

  if (rightSidebar && window.getComputedStyle(rightSidebar).display !== 'none') {
    calculatedWidth += rightSidebar.offsetWidth + gap;
  }

  if (main) {
    calculatedWidth += main.offsetWidth;
  }

  console.log('\n🧮 Calculated Total Width:');
  console.log(`   Padding: ${paddingX}px`);
  console.log(`   Gaps: ${gap}px (per gap)`);
  console.log(`   Left sidebar: ${leftSidebar && window.getComputedStyle(leftSidebar).display !== 'none' ? leftSidebar.offsetWidth : 0}px`);
  console.log(`   Main content: ${main ? main.offsetWidth : 0}px`);
  console.log(`   Right sidebar: ${rightSidebar && window.getComputedStyle(rightSidebar).display !== 'none' ? rightSidebar.offsetWidth : 0}px`);
  console.log(`   Total calculated: ${calculatedWidth}px`);
  console.log(`   Viewport width: ${viewportWidth}px`);
  console.log(`   Difference: ${calculatedWidth - viewportWidth}px`);

  return {
    viewport: { width: viewportWidth, height: viewportHeight },
    scroll: scrollInfo,
    cssVars,
    calculatedWidth,
    hasOverflow: scrollInfo.hasHorizontalScroll
  };
}

// 반응형 테스트용 함수
function testResponsive() {
  console.log('\n🔄 Testing Multiple Viewport Sizes...');
  console.log('=====================================');

  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop Large' },
    { width: 1440, height: 900, name: 'Desktop Medium' },
    { width: 1280, height: 720, name: 'Desktop Small' },
    { width: 1024, height: 768, name: 'Tablet' },
    { width: 768, height: 1024, name: 'Mobile' }
  ];

  // 현재 창 크기 저장
  const originalWidth = window.outerWidth;
  const originalHeight = window.outerHeight;

  viewports.forEach(viewport => {
    console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log('-'.repeat(50));

    // 창 크기 변경 (실제로는 수동으로 해야 함)
    console.log(`🔧 Please manually resize window to ${viewport.width}x${viewport.height} and run debugLayout()`);
  });

  console.log('\n💡 Manual Testing Instructions:');
  console.log('1. 브라우저 창 크기를 위의 각 크기로 수동 조정');
  console.log('2. 각 크기에서 debugLayout() 함수 실행');
  console.log('3. 가로 스크롤 발생 여부 확인');
}

// 실시간 리사이즈 모니터링
function startResizeMonitoring() {
  console.log('\n👀 Starting resize monitoring...');

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log('\n🔄 Window resized, re-analyzing...');
      debugLayout();
    }, 500);
  });

  console.log('✅ Resize monitoring active');
}

// 즉시 실행
const result = debugLayout();

console.log('\n🛠️ Available Commands:');
console.log('   debugLayout() - 현재 레이아웃 분석');
console.log('   testResponsive() - 반응형 테스트 가이드');
console.log('   startResizeMonitoring() - 리사이즈 모니터링 시작');

// 오버플로우가 있으면 경고
if (result.hasOverflow) {
  console.warn('\n🚨 WARNING: Horizontal overflow detected!');
  console.warn(`Consider checking the calculated width: ${result.calculatedWidth}px vs viewport: ${result.viewport.width}px`);
}