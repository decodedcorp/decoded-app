# Process & Governance (프로세스 및 거버넌스)

## Overview (개요)

UX writing 시스템의 효과적인 운영을 위한 프로세스, 역할, 그리고 품질 관리 방법을 정의합니다.

## Roles & Responsibilities (역할 및 책임)

### PM (Product Manager)

- **요구사항 정의**: 사용자 스토리와 기능 요구사항 명세
- **성공 지표 설정**: 전환율, 사용자 만족도 등 측정 가능한 목표
- **우선순위 결정**: 카피 개선 작업의 우선순위 설정

### UX Writer

- **문안 작성**: 모든 사용자 대면 텍스트 작성 및 검토
- **가이드라인 유지**: 일관된 톤앤매너와 용어 사용
- **사용자 테스트**: 카피의 효과성 검증

### Frontend Developer

- **문자열 키 관리**: i18n 키 구조 및 구현
- **릴리즈 관리**: 카피 변경사항의 배포
- **기술적 제약**: 화면 크기, 성능 등 고려

## Workflow Process (워크플로우 프로세스)

### 1. Copy Brief Creation (카피 브리프 작성)

#### Template (템플릿)

```markdown
## Copy Brief

### 목적/지표 (Purpose/Metrics)

- 목표: 업로드 전환율 +5%
- 측정 방법: A/B 테스트, 사용자 피드백

### 사용자/상황 (User/Context)

- 대상: 신규 사용자, 복귀 사용자, 파워 유저
- 상황: 첫 업로드, 대량 업로드, 오류 상황

### 톤 (Tone)

- 차분하고 격려하는 톤
- 전문적이지만 친근함

### 제약 (Constraints)

- 길이: 버튼 텍스트 3단어 이내
- 화면: 모바일 우선
- 법적: 개인정보처리방침 링크 필수

### 성공 정의 (Success Definition)

- CTR 증가
- 오류 감소
- 사용자 만족도 향상
```

### 2. Copy Creation (카피 작성)

#### Steps (단계)

1. **용어집 확인**: 기존 용어와 일관성 검토
2. **패턴 적용**: 마이크로카피 패턴 라이브러리 활용
3. **이중 언어 작성**: 한국어/영어 동시 작성
4. **접근성 검토**: 스크린 리더, 키보드 네비게이션 고려

#### Tools (도구)

- **용어집**: `terminology.md` 참조
- **패턴 라이브러리**: `patterns/microcopy-library.md` 활용
- **가이드라인**: `guidelines.md` 준수

### 3. Review Process (검토 프로세스)

#### Internal Review (내부 검토)

1. **UX Writer 검토**: 톤앤매너, 일관성 확인
2. **PM 검토**: 요구사항 충족, 성공 지표 달성 가능성
3. **FE Developer 검토**: 기술적 구현 가능성, i18n 구조

#### External Review (외부 검토)

1. **사용자 테스트**: 실제 사용자 대상 카피 테스트
2. **네이티브 스피커 검토**: 언어별 자연스러움 확인
3. **접근성 전문가 검토**: 장애인 사용자 접근성 확인

### 4. Approval & Implementation (승인 및 구현)

#### Approval Criteria (승인 기준)

- [ ] 용어집 준수
- [ ] 버튼이 행동을 명확히 표현
- [ ] 에러가 해결책을 제시
- [ ] 접근성 가이드라인 준수
- [ ] 이중 언어 일관성
- [ ] 브랜드 보이스 일치

#### Implementation (구현)

1. **i18n 키 생성**: `area.feature.element.state` 패턴
2. **문자열 파일 업데이트**: `ko/`, `en/` 폴더
3. **컴포넌트 적용**: React 컴포넌트에 번역 함수 적용
4. **테스트**: 의사현지화, 스냅샷, e2e 테스트

## Quality Assurance (품질 보증)

### LQA Checklist (현지화 품질 보증 체크리스트)

#### Content Quality (콘텐츠 품질)

- [ ] 숫자/날짜/통화 로컬라이즈
- [ ] 자리표시자/복수형 정상 작동
- [ ] 문화적 부자연스러움 없음
- [ ] 브랜드 보이스 일치

#### Technical Quality (기술적 품질)

- [ ] i18n 키 구조 일관성
- [ ] ICU MessageFormat 정상 작동
- [ ] 변수 치환 오류 없음
- [ ] 성능 영향 없음

#### Accessibility Quality (접근성 품질)

- [ ] 스크린 리더 호환성
- [ ] 키보드 네비게이션 지원
- [ ] 색상 대비 충분
- [ ] 의미 있는 링크 텍스트

### Testing Methods (테스트 방법)

#### Automated Testing (자동화 테스트)

- **의사현지화**: UI 깨짐 사전 점검
- **스냅샷 테스트**: 컴포넌트 렌더링 일관성
- **e2e 테스트**: 버튼 라벨 기준 사용자 플로우

#### Manual Testing (수동 테스트)

- **사용자 테스트**: 실제 사용자 대상 카피 효과성 검증
- **접근성 테스트**: 스크린 리더, 키보드 사용자 테스트
- **다국어 테스트**: 각 언어별 자연스러움 확인

## Change Management (변경 관리)

### Change Process (변경 프로세스)

#### 1. Change Request (변경 요청)

- **형식**: GitHub Issue 또는 Notion 페이지
- **내용**: 변경 이유, 영향 범위, 예상 효과
- **승인**: PM, UX Writer, FE Developer 합의

#### 2. Implementation (구현)

- **브랜치**: `feature/ux-copy-[description]`
- **커밋**: `feat(ux-copy): add empty state for channels`
- **태그**: `[ux-copy]`, `[i18n]`

#### 3. Review (검토)

- **PR 템플릿**: 스크린샷 + 키 diff + 스펙 링크
- **검토자**: 최소 2명 (UX Writer + FE Developer)
- **승인**: 모든 검토자 승인 후 머지

### Version Control (버전 관리)

#### Git Workflow (Git 워크플로우)

```bash
# 새 카피 작업 시작
git checkout -b feature/ux-copy-channels-empty-state

# 변경사항 커밋
git add .
git commit -m "feat(ux-copy): add empty state for channels

- Add Korean/English empty state messages
- Update i18n keys for channel empty states
- Include accessibility labels

[ux-copy] [i18n]"

# PR 생성
git push origin feature/ux-copy-channels-empty-state
```

#### Commit Message Format (커밋 메시지 형식)

```
feat(ux-copy): [description]

- [Korean changes]
- [English changes]
- [Technical changes]

[ux-copy] [i18n]
```

## Monitoring & Analytics (모니터링 및 분석)

### Key Metrics (핵심 지표)

#### User Engagement (사용자 참여)

- **CTR**: 버튼 클릭률
- **Conversion**: 전환율 (업로드, 가입 등)
- **Error Rate**: 오류 발생률
- **User Satisfaction**: 사용자 만족도

#### Content Performance (콘텐츠 성능)

- **A/B Test Results**: 카피 변형 테스트 결과
- **User Feedback**: 사용자 피드백 점수
- **Accessibility Score**: 접근성 점수
- **Load Time**: 텍스트 로딩 시간

### Analytics Implementation (분석 구현)

#### Event Tracking (이벤트 추적)

```javascript
// 카피 키 기준 이벤트 로깅
analytics.track('copy_interaction', {
  copy_key: 'channels.create.cta',
  language: 'ko',
  action: 'click',
  context: 'empty_state',
});
```

#### Performance Monitoring (성능 모니터링)

```javascript
// i18n 로딩 시간 측정
performance.mark('i18n-load-start');
await loadTranslations(locale);
performance.mark('i18n-load-end');
performance.measure('i18n-load', 'i18n-load-start', 'i18n-load-end');
```

## Governance Structure (거버넌스 구조)

### Decision Making (의사결정)

#### Copy Council (카피 위원회)

- **구성**: PM 1명, UX Writer 1명, FE Developer 1명
- **역할**: 용어집 변경, 가이드라인 업데이트, 분쟁 해결
- **회의**: 주간 정기 회의, 필요시 임시 회의
- **의사결정**: 합의제 (2/3 이상 동의)

#### Escalation Process (에스컬레이션 프로세스)

1. **Level 1**: 팀 내 논의 (UX Writer + FE Developer)
2. **Level 2**: Copy Council 검토
3. **Level 3**: Product Owner 최종 결정

### Documentation Maintenance (문서 유지보수)

#### Update Schedule (업데이트 일정)

- **용어집**: 변경 즉시 업데이트
- **가이드라인**: 분기별 검토 및 업데이트
- **패턴 라이브러리**: 신규 패턴 발견 시 즉시 추가
- **프로세스**: 반기별 검토 및 개선

#### Ownership (소유권)

- **용어집**: UX Writer
- **가이드라인**: UX Writer + PM
- **패턴 라이브러리**: UX Writer + FE Developer
- **프로세스**: PM + UX Writer

## Tools & Resources (도구 및 리소스)

### Development Tools (개발 도구)

- **i18n**: react-intl 또는 i18next
- **Testing**: Jest, Playwright, Storybook
- **Analytics**: Mixpanel, Google Analytics
- **Collaboration**: Notion, GitHub, Slack

### Reference Materials (참고 자료)

- **용어집**: `terminology.md`
- **패턴 라이브러리**: `patterns/microcopy-library.md`
- **가이드라인**: `guidelines.md`
- **접근성**: `accessibility.md`
- **AI 투명성**: `ai-transparency.md`

### External Resources (외부 리소스)

- **한국어**: 국립국어원, 표준국어대사전
- **영어**: AP Stylebook, Chicago Manual of Style
- **접근성**: WCAG 2.1, Section 508
- **현지화**: Unicode, CLDR

## Success Metrics (성공 지표)

### Short-term (단기)

- 카피 일관성 점수 95% 이상
- 사용자 피드백 점수 4.0/5.0 이상
- 접근성 점수 90% 이상
- 오류 감소율 20% 이상

### Long-term (장기)

- 전환율 15% 향상
- 사용자 만족도 25% 향상
- 개발 효율성 30% 향상
- 브랜드 인지도 40% 향상

## Continuous Improvement (지속적 개선)

### Feedback Loops (피드백 루프)

1. **사용자 피드백**: 정기적인 사용자 설문조사
2. **팀 피드백**: 분기별 팀 회고
3. **데이터 분석**: 월간 성과 분석
4. **외부 검토**: 연간 전문가 검토

### Learning & Development (학습 및 개발)

- **교육**: 분기별 UX writing 워크샵
- **연구**: 연간 사용자 행동 연구
- **벤치마킹**: 경쟁사 분석 및 벤치마킹
- **혁신**: 새로운 도구 및 방법론 도입
