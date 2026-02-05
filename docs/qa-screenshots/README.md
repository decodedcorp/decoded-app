# Visual QA Screenshots

**Generated:** 2026-02-05
**Reference:** docs/design-system/decoded.pen
**Test Automation:** packages/web/tests/visual-qa.spec.ts

이 문서는 v2.0 디자인 시스템 구현이 decoded.pen 디자인 참조와 일치하는지 검증하기 위한 시각적 QA 스크린샷을 포함합니다.

## Breakpoints Tested

| Name | Width | Height | Device |
|------|-------|--------|--------|
| Mobile | 375px | 812px | iPhone 13 Pro |
| Tablet | 768px | 1024px | iPad |
| Desktop | 1280px | 800px | Standard Desktop |
| Desktop LG | 1440px | 900px | Large Desktop |

## Pages Captured

| Page | Mobile | Tablet | Desktop | Desktop LG |
|------|--------|--------|---------|------------|
| Home | [mobile-home.png](./mobile-home.png) | [tablet-home.png](./tablet-home.png) | [desktop-home.png](./desktop-home.png) | [desktop-lg-home.png](./desktop-lg-home.png) |
| Explore | [mobile-explore.png](./mobile-explore.png) | [tablet-explore.png](./tablet-explore.png) | [desktop-explore.png](./desktop-explore.png) | [desktop-lg-explore.png](./desktop-lg-explore.png) |
| Feed | [mobile-feed.png](./mobile-feed.png) | [tablet-feed.png](./tablet-feed.png) | [desktop-feed.png](./desktop-feed.png) | [desktop-lg-feed.png](./desktop-lg-feed.png) |
| Search | [mobile-search.png](./mobile-search.png) | [tablet-search.png](./tablet-search.png) | [desktop-search.png](./desktop-search.png) | [desktop-lg-search.png](./desktop-lg-search.png) |
| Profile | [mobile-profile.png](./mobile-profile.png) | [tablet-profile.png](./tablet-profile.png) | [desktop-profile.png](./desktop-profile.png) | [desktop-lg-profile.png](./desktop-lg-profile.png) |
| Login | [mobile-login.png](./mobile-login.png) | [tablet-login.png](./tablet-login.png) | [desktop-login.png](./desktop-login.png) | [desktop-lg-login.png](./desktop-lg-login.png) |
| Request Upload | [mobile-request-upload.png](./mobile-request-upload.png) | [tablet-request-upload.png](./tablet-request-upload.png) | [desktop-request-upload.png](./desktop-request-upload.png) | [desktop-lg-request-upload.png](./desktop-lg-request-upload.png) |

## Findings

### Awaiting Manual Review

스크린샷이 자동으로 캡처되었습니다. 다음 단계에서 decoded.pen 디자인 참조와 비교하여 시각적 차이점을 식별하고 문서화합니다.

**검토 항목:**
- [ ] 간격(spacing) - 여백, 패딩, gap 값이 디자인 토큰과 일치하는지
- [ ] 타이포그래피(typography) - 폰트 크기, 줄 높이, 두께가 일치하는지
- [ ] 색상(colors) - 배경, 텍스트, 보더 색상이 일치하는지
- [ ] 정렬(alignment) - 요소 정렬 및 배치가 일치하는지
- [ ] 반응형 레이아웃 - 각 breakpoint에서 레이아웃이 올바르게 동작하는지
- [ ] 애니메이션/인터랙션 - 스크롤, 호버 등 동적 요소가 올바르게 동작하는지

**비교 방법:**
1. decoded.pen 파일 열기 (docs/design-system/decoded.pen)
2. 각 페이지의 스크린샷과 대응되는 디자인 섹션 비교
3. 차이점 발견 시 아래 템플릿 사용하여 문서화

```markdown
### [Page Name] - [Issue Description]
- **Issue**: [구체적인 시각적 차이 설명]
- **Severity**: [Critical/Major/Minor]
  - Critical: 레이아웃 깨짐, 기능 영향
  - Major: 명확한 시각적 차이
  - Minor: 미세한 spacing/color 차이
- **Status**: [To Fix/Fixed/Documented/Deferred]
- **decoded.pen Reference**: [관련 디자인 섹션]
- **Files Affected**: [수정이 필요한 파일]
```

## Test Automation

스크린샷은 Playwright로 자동화되어 있으며, 언제든지 재생성할 수 있습니다.

### Prerequisites
```bash
# Playwright 브라우저 설치 (최초 1회)
cd packages/web
yarn playwright install chromium
```

### Regeneration
```bash
# 개발 서버 시작
yarn dev:web

# 다른 터미널에서 테스트 실행
cd packages/web
yarn playwright test tests/visual-qa.spec.ts
```

### Test Configuration
- **Config:** packages/web/playwright.config.ts
- **Test:** packages/web/tests/visual-qa.spec.ts
- **Output:** docs/qa-screenshots/

## Notes

- 모든 스크린샷은 full-page 캡처로 생성됩니다 (전체 페이지 스크롤 포함)
- 각 페이지는 networkidle 상태를 기다린 후 500ms 추가 대기하여 애니메이션이 완료되도록 합니다
- Search 페이지는 `?q=dress` 쿼리 파라미터로 검색 결과 상태를 캡처합니다
- 스크린샷 파일명 형식: `{viewport}-{page}.png`
