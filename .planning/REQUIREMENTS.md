# Requirements: decoded-app v3.0

**Defined:** 2026-02-19
**Core Value:** 완전한 사용자 경험 — 모든 페이지가 실제 데이터로 동작하며 일관된 디자인 시스템 적용

## v3.0 Requirements

Requirements for Admin Panel — AI Management. 목업 데이터 우선, 백엔드 연결은 후속 마일스톤.

### Admin Auth

- [x] **AAUTH-01**: 관리자 권한 체크 미들웨어 (`is_admin` 기반)
- [x] **AAUTH-02**: `/admin` 라우트 보호 (비관리자 접근 차단)
- [x] **AAUTH-03**: 관리자 전용 레이아웃 (사이드바 네비게이션)

### Dashboard

- [x] **DASH-01**: KPI 통계 카드 (DAU, MAU, 총 유저, 포스트, 솔루션)
- [x] **DASH-02**: 트래픽 차트 (일별 DAU, 검색, 클릭 추이)
- [x] **DASH-03**: 오늘 요약 (오늘 포스트, 솔루션, 클릭)

### AI Audit

- [ ] **AUDIT-01**: AI 분석 요청 목록 (이미지, 상태, 결과 요약)
- [ ] **AUDIT-02**: 개별 분석 결과 상세 뷰 (감지된 아이템, 신뢰도)
- [ ] **AUDIT-03**: 분석 결과 수정 기능 (아이템 추가/삭제/수정)
- [ ] **AUDIT-04**: 분석 상태 필터링 (대기/완료/오류/수정됨)

### AI Cost

- [ ] **COST-01**: AI API 호출 통계 (일별/월별 호출 수)
- [ ] **COST-02**: 토큰 사용량 차트 (입력/출력 토큰)
- [ ] **COST-03**: 비용 추정 대시보드 (모델별, 기간별)

### Pipeline Log

- [ ] **PIPE-01**: 파이프라인 실행 목록 (업로드→분석→감지 플로우)
- [ ] **PIPE-02**: 단계별 상세 로그 (각 단계 소요 시간, 결과)
- [ ] **PIPE-03**: 에러 파이프라인 필터링 및 재시도 UI

### Server Log

- [ ] **SLOG-01**: API 요청 로그 뷰어 (엔드포인트, 상태코드, 응답시간)
- [ ] **SLOG-02**: 에러 로그 필터링 (에러 레벨, 기간, 검색)
- [ ] **SLOG-03**: 실시간 로그 스트리밍 UI (tail -f 스타일)

## Future Requirements

### Tag Management (A-01) — v3.1
- **TAG-01**: 태그 목록 (필터링, 검색, 페이지네이션)
- **TAG-02**: Media/Cast 추가/편집 폼
- **TAG-03**: 태그 요청 검토/승인/거부
- **TAG-04**: 대량 작업 (병합, 상위 변경)

### Content Moderation (A-02) — v3.1
- **MOD-01**: 콘텐츠 모더레이션 큐
- **MOD-02**: Post/Solution 상태 변경
- **MOD-03**: 신고 관리

### Payments (A-03) — v3.1
- **PAY-01**: 지급 관리 대시보드
- **PAY-02**: 정산 처리
- **PAY-03**: 수익 리포트

## Out of Scope

| Feature | Reason |
|---------|--------|
| 태그/키워드 관리 (A-01) | v3.1로 미루기 — AI 관리 우선 |
| 콘텐츠 모더레이션 (A-02) | v3.1로 미루기 |
| 지급 관리 (A-03) | v3.1로 미루기 |
| 실시간 알림 | 별도 마일스톤 |
| 실제 백엔드 연결 (AI audit/pipeline) | 백엔드 API 설계 후 연결 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AAUTH-01 | v3-01 | Pending |
| AAUTH-02 | v3-01 | Pending |
| AAUTH-03 | v3-01 | Pending |
| DASH-01 | v3-02 | Pending |
| DASH-02 | v3-02 | Pending |
| DASH-03 | v3-02 | Pending |
| AUDIT-01 | v3-03 | Pending |
| AUDIT-02 | v3-03 | Pending |
| AUDIT-03 | v3-03 | Pending |
| AUDIT-04 | v3-03 | Pending |
| COST-01 | v3-04 | Pending |
| COST-02 | v3-04 | Pending |
| COST-03 | v3-04 | Pending |
| PIPE-01 | v3-05 | Pending |
| PIPE-02 | v3-05 | Pending |
| PIPE-03 | v3-05 | Pending |
| SLOG-01 | v3-05 | Pending |
| SLOG-02 | v3-05 | Pending |
| SLOG-03 | v3-05 | Pending |

**Coverage:**
- v3.0 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0 (100% coverage)

---
*Requirements defined: 2026-02-19*
*Last updated: 2026-02-19 after roadmap creation (traceability filled)*
