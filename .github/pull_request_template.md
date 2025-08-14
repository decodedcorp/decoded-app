# Pull Request

## 📋 변경 사항 요약
<!-- 이 PR에서 수행한 주요 변경사항을 간략히 설명해주세요 -->

## 🎯 변경 유형
<!-- 해당하는 항목에 x 표시해주세요 -->
- [ ] 🐛 버그 수정 (Bug fix)
- [ ] ✨ 새로운 기능 (New feature)  
- [ ] ⚡ 성능 개선 (Performance improvement)
- [ ] 🎨 UI/UX 개선 (UI/UX improvement)
- [ ] ♻️ 리팩토링 (Code refactoring)
- [ ] 📝 문서 업데이트 (Documentation)
- [ ] 🔧 설정 변경 (Configuration)
- [ ] 🧪 테스트 추가/수정 (Testing)

## ⚡ 성능 영향도 체크 (필수)
- [ ] **파일 크기**: 새로운 100줄 이상 파일 없음
- [ ] **이미지 최적화**: Next.js Image 컴포넌트 사용
- [ ] **번들 크기**: `yarn analyze` 결과 확인 완료
- [ ] **LCP 테스트**: 개발 환경에서 로딩 속도 확인
- [ ] **메모리 누수**: useEffect cleanup 함수 구현

## 🔍 코드 품질 체크 (필수)
- [ ] **ESLint**: 모든 린트 에러 수정 완료 (`yarn lint`)
- [ ] **TypeScript**: 타입 에러 없음 (`yarn type-check`)
- [ ] **함수 복잡도**: 모든 함수 복잡도 10 이하 유지
- [ ] **컴포넌트 크기**: 100줄 이하 또는 적절한 분해
- [ ] **네이밍**: 명확하고 일관된 변수/함수명 사용

## 🧪 테스트 (가능한 경우)
- [ ] 단위 테스트 추가/수정
- [ ] 통합 테스트 추가/수정  
- [ ] E2E 테스트 시나리오 확인
- [ ] 수동 테스트 시나리오 실행

## 🔄 호환성 체크
- [ ] **기존 기능**: Breaking change 없음
- [ ] **모바일 반응형**: 모바일 환경에서 정상 작동
- [ ] **브라우저 호환성**: 주요 브라우저에서 테스트 완료
- [ ] **API 호환성**: 백엔드 API 변경사항과 동기화

## 📱 테스트 환경
<!-- 테스트한 환경을 체크해주세요 -->
- [ ] Chrome (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (Mobile)

## 🚨 Breaking Changes
<!-- Breaking change가 있는 경우 상세히 설명하고 마이그레이션 가이드를 제공해주세요 -->
- [ ] Breaking change 없음
- [ ] Breaking change 있음 (아래에 상세 설명)

<!-- Breaking change 상세 설명
예시:
- `ContentItem` 인터페이스에서 `height` 필드가 `string`에서 `number`로 변경됨
- 마이그레이션: `parseInt(height)` 또는 새로운 타입 정의 사용
-->

## 📝 테스트 시나리오
<!-- 리뷰어가 테스트할 수 있는 시나리오를 제공해주세요 -->
1. 
2. 
3. 

## 📸 스크린샷/영상 (UI 변경 시 필수)
<!-- UI 변경이 있는 경우 Before/After 스크린샷이나 동작 영상을 첨부해주세요 -->

## 🔗 관련 이슈/PR
<!-- 관련된 이슈나 PR이 있다면 링크를 추가해주세요 -->
- Closes #
- Related to #

## 📋 리뷰어 참고사항
<!-- 리뷰어가 특별히 확인해야 할 부분이나 알아야 할 컨텍스트가 있다면 적어주세요 -->

---

## 🏷️ 도메인 태그
<!-- 해당하는 도메인에 x 표시해주세요 (복수 선택 가능) -->
- [ ] 🔐 Auth (인증)
- [ ] 📺 Channels (채널)  
- [ ] 📝 Contents (콘텐츠)
- [ ] 📡 Feeds (피드)
- [ ] 🏗️ Infrastructure (인프라)
- [ ] 🎨 Design System (디자인 시스템)

## ⏱️ 예상 리뷰 소요시간
- [ ] ⚡ Quick (< 15분) - 간단한 수정, 문서 업데이트
- [ ] 🔍 Normal (15-30분) - 일반적인 기능 추가/수정
- [ ] 🧐 Detailed (30-60분) - 복잡한 로직, 아키텍처 변경
- [ ] 🔬 Thorough (> 60분) - 대규모 리팩토링, 핵심 로직 변경