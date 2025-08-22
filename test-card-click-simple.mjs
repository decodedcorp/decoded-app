import { chromium } from 'playwright';

async function testCardClick() {
  console.log('🎯 Testing card click functionality...\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const page = await browser.newPage();

  try {
    // 페이지 로드
    console.log('📍 Loading page...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

    // 카드가 로드될 때까지 대기
    console.log('📍 Waiting for cards to load...');
    await page.waitForSelector('[data-testid="simple-card"]', { timeout: 10000 });

    // 모든 카드 찾기
    const cards = await page.$$('[data-testid="simple-card"]');
    console.log(`✅ Found ${cards.length} cards`);

    if (cards.length > 0) {
      console.log('📍 Clicking first card...');
      
      // 클릭 이벤트 리스너 추가하여 클릭 감지
      await page.evaluate(() => {
        window.clickDetected = false;
        document.addEventListener('click', (e) => {
          console.log('Click detected on:', e.target);
          if (e.target.closest('[data-testid="simple-card"]')) {
            window.clickDetected = true;
            console.log('Card click detected!');
          }
        });
      });

      // 첫 번째 카드 클릭
      await cards[0].click();
      
      // 클릭이 감지되었는지 확인
      const clickDetected = await page.evaluate(() => window.clickDetected);
      console.log('Click detected:', clickDetected);

      // 모달이 열렸는지 확인 (3초 대기)
      console.log('📍 Checking for modal...');
      await page.waitForTimeout(3000);
      
      const modal = await page.$('[data-testid="channel-modal"]');
      const isModalVisible = modal ? await modal.isVisible() : false;
      
      console.log(`Modal found: ${!!modal}`);
      console.log(`Modal visible: ${isModalVisible}`);

      // URL 파라미터 확인
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);
      
      if (currentUrl.includes('channel=') || currentUrl.includes('content=')) {
        console.log('✅ URL parameters updated successfully');
      } else {
        console.log('❌ URL parameters not updated');
      }

      // 모달 내용 확인
      if (isModalVisible) {
        const modalContent = await page.textContent('[data-testid="channel-modal"]');
        console.log('Modal content preview:', modalContent?.slice(0, 200) + '...');
      }

    } else {
      console.log('❌ No cards found to click');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('\n🔚 Test completed');
  }
}

testCardClick().catch(console.error);