import { test, expect } from '@playwright/test';

test.describe('Layout Responsiveness Debug Tests', () => {

  // 다양한 뷰포트 크기에서 테스트
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop-Large' },
    { width: 1440, height: 900, name: 'Desktop-Medium' },
    { width: 1280, height: 720, name: 'Desktop-Small' },
    { width: 1024, height: 768, name: 'Tablet-Landscape' },
    { width: 768, height: 1024, name: 'Tablet-Portrait' },
    { width: 375, height: 667, name: 'Mobile' }
  ];

  for (const viewport of viewports) {
    test(`Layout overflow check: ${viewport.name}`, async ({ page }) => {
      // 뷰포트 설정
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // 홈페이지로 이동
      await page.goto('http://localhost:3000');

      // 페이지 로드 완료 대기
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // CSS 적용 대기

      // 핵심 레이아웃 요소들 확인
      const layoutExists = await page.locator('.layout').isVisible();
      const contentWrapperExists = await page.locator('.content-wrapper').isVisible();

      if (!layoutExists || !contentWrapperExists) {
        console.log(`❌ ${viewport.name}: Layout elements not found`);
        return;
      }

      // 실제 계산된 CSS 값들 수집
      const layoutData = await page.evaluate(() => {
        const layout = document.querySelector('.layout') as HTMLElement;
        const contentWrapper = document.querySelector('.content-wrapper') as HTMLElement;
        const leftSidebar = document.querySelector('.sidebar-left') as HTMLElement;
        const rightSidebar = document.querySelector('.sidebar-right') as HTMLElement;
        const main = document.querySelector('.main') as HTMLElement;

        if (!layout || !contentWrapper) return null;

        const layoutStyles = window.getComputedStyle(layout);
        const contentStyles = window.getComputedStyle(contentWrapper);
        const leftStyles = leftSidebar ? window.getComputedStyle(leftSidebar) : null;
        const rightStyles = rightSidebar ? window.getComputedStyle(rightSidebar) : null;
        const mainStyles = main ? window.getComputedStyle(main) : null;

        return {
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          scroll: {
            documentWidth: document.documentElement.scrollWidth,
            documentClientWidth: document.documentElement.clientWidth,
            bodyWidth: document.body.scrollWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            overflowAmount: document.documentElement.scrollWidth - document.documentElement.clientWidth
          },
          layout: {
            width: layoutStyles.width,
            maxWidth: layoutStyles.maxWidth,
            overflowX: layoutStyles.overflowX,
            cssVariables: {
              sidebarWidth: layoutStyles.getPropertyValue('--sidebar-width'),
              gapMain: layoutStyles.getPropertyValue('--gap-main'),
              containerPaddingX: layoutStyles.getPropertyValue('--container-padding-x'),
              contentMaxWidth: layoutStyles.getPropertyValue('--content-max-width')
            }
          },
          contentWrapper: {
            width: contentStyles.width,
            maxWidth: contentStyles.maxWidth,
            overflowX: contentStyles.overflowX,
            display: contentStyles.display,
            gap: contentStyles.gap,
            paddingLeft: contentStyles.paddingLeft,
            paddingRight: contentStyles.paddingRight,
            clientWidth: contentWrapper.clientWidth,
            scrollWidth: contentWrapper.scrollWidth,
            offsetWidth: contentWrapper.offsetWidth
          },
          sidebars: {
            left: leftSidebar ? {
              visible: leftStyles?.display !== 'none',
              width: leftStyles?.width,
              flex: leftStyles?.flex,
              display: leftStyles?.display,
              clientWidth: leftSidebar.clientWidth,
              offsetWidth: leftSidebar.offsetWidth
            } : null,
            right: rightSidebar ? {
              visible: rightStyles?.display !== 'none',
              width: rightStyles?.width,
              flex: rightStyles?.flex,
              display: rightStyles?.display,
              clientWidth: rightSidebar.clientWidth,
              offsetWidth: rightSidebar.offsetWidth
            } : null
          },
          main: main ? {
            width: mainStyles?.width,
            maxWidth: mainStyles?.maxWidth,
            flex: mainStyles?.flex,
            clientWidth: main.clientWidth,
            offsetWidth: main.offsetWidth,
            scrollWidth: main.scrollWidth
          } : null
        };
      });

      if (!layoutData) {
        console.log(`❌ ${viewport.name}: Could not collect layout data`);
        return;
      }

      // 결과 분석 및 출력
      const hasOverflow = layoutData.scroll.hasHorizontalScroll;
      const overflowAmount = layoutData.scroll.overflowAmount;

      console.log(`\n${'='.repeat(60)}`);
      console.log(`📱 ${viewport.name} (${viewport.width}x${viewport.height})`);
      console.log(`${'='.repeat(60)}`);

      console.log(`🖥️  Viewport: ${layoutData.viewport.width}x${layoutData.viewport.height}`);
      console.log(`📏 Document width: ${layoutData.scroll.documentWidth}px`);
      console.log(`📐 Client width: ${layoutData.scroll.documentClientWidth}px`);

      if (hasOverflow) {
        console.log(`❌ OVERFLOW DETECTED: +${overflowAmount}px`);
      } else {
        console.log(`✅ No horizontal overflow`);
      }

      console.log(`\n🎨 CSS Variables:`);
      console.log(`   --sidebar-width: ${layoutData.layout.cssVariables.sidebarWidth}`);
      console.log(`   --gap-main: ${layoutData.layout.cssVariables.gapMain}`);
      console.log(`   --container-padding-x: ${layoutData.layout.cssVariables.containerPaddingX}`);

      console.log(`\n📦 Content Wrapper:`);
      console.log(`   width: ${layoutData.contentWrapper.width}`);
      console.log(`   gap: ${layoutData.contentWrapper.gap}`);
      console.log(`   padding: ${layoutData.contentWrapper.paddingLeft} | ${layoutData.contentWrapper.paddingRight}`);
      console.log(`   clientWidth: ${layoutData.contentWrapper.clientWidth}px`);
      console.log(`   scrollWidth: ${layoutData.contentWrapper.scrollWidth}px`);

      console.log(`\n🏛️  Sidebars:`);
      if (layoutData.sidebars.left) {
        console.log(`   Left: ${layoutData.sidebars.left.visible ? '✅ Visible' : '❌ Hidden'} | width: ${layoutData.sidebars.left.width} | offsetWidth: ${layoutData.sidebars.left.offsetWidth}px`);
      }
      if (layoutData.sidebars.right) {
        console.log(`   Right: ${layoutData.sidebars.right.visible ? '✅ Visible' : '❌ Hidden'} | width: ${layoutData.sidebars.right.width} | offsetWidth: ${layoutData.sidebars.right.offsetWidth}px`);
      }

      console.log(`\n📄 Main Content:`);
      if (layoutData.main) {
        console.log(`   width: ${layoutData.main.width}`);
        console.log(`   flex: ${layoutData.main.flex}`);
        console.log(`   clientWidth: ${layoutData.main.clientWidth}px`);
        console.log(`   scrollWidth: ${layoutData.main.scrollWidth}px`);
      }

      // 스크린샷 저장
      await page.screenshot({
        path: `debug-${viewport.name}-${viewport.width}x${viewport.height}.png`,
        fullPage: false
      });

      // 가로 스크롤이 있으면 테스트 실패
      if (hasOverflow) {
        console.log(`\n🚨 Test FAILED: Horizontal overflow detected at ${viewport.name}`);
      }
    });
  }

  test('Container Query Support Check', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const containerQueryInfo = await page.evaluate(() => {
      return {
        supports: CSS.supports('container-type: inline-size'),
        contentWrapperContainer: (() => {
          const el = document.querySelector('.content-wrapper') as HTMLElement;
          if (!el) return null;
          const styles = window.getComputedStyle(el);
          return {
            containerType: styles.containerType,
            containerName: styles.containerName,
            width: styles.width,
            clientWidth: el.clientWidth
          };
        })()
      };
    });

    console.log('\n🔍 Container Query Debug:');
    console.log('   Browser supports container queries:', containerQueryInfo.supports);
    console.log('   Content wrapper container info:', containerQueryInfo.contentWrapperContainer);
  });
});