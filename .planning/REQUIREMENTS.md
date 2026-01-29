# Requirements: decoded-app

**Defined:** 2026-01-29
**Core Value:** 완전한 사용자 경험 — 모든 페이지가 실제 데이터로 동작

## v1.1 Requirements

백엔드 API (https://dev.decoded.style/api/v1)를 프론트엔드에 연결.

### Profile

- [ ] **PROF-01**: 사용자 본인 프로필 조회 (GET /users/me)
- [ ] **PROF-02**: 프로필 정보 수정 (PATCH /users/me) - avatar_url, bio, display_name
- [ ] **PROF-03**: 활동 내역 조회 (GET /users/me/activities)
- [ ] **PROF-04**: 통계 조회 (GET /users/me/stats)
- [ ] **PROF-05**: 다른 사용자 프로필 조회 (GET /users/{user_id})

### Posts

- [ ] **POST-01**: 포스트 수정 (PATCH /posts/{post_id})
- [ ] **POST-02**: 포스트 삭제 (DELETE /posts/{post_id})

### Spots

- [ ] **SPOT-01**: 스팟 목록 조회 (GET /posts/{post_id}/spots)
- [ ] **SPOT-02**: 스팟 추가 (POST /posts/{post_id}/spots)
- [ ] **SPOT-03**: 스팟 수정 (PATCH /spots/{spot_id})
- [ ] **SPOT-04**: 스팟 삭제 (DELETE /spots/{spot_id})

### Solutions

- [ ] **SOLN-01**: 솔루션 목록 조회 (GET /spots/{spot_id}/solutions)
- [ ] **SOLN-02**: 솔루션 제출 (POST /spots/{spot_id}/solutions)
- [ ] **SOLN-03**: 솔루션 수정 (PATCH /solutions/{solution_id})
- [ ] **SOLN-04**: 솔루션 삭제 (DELETE /solutions/{solution_id})
- [ ] **SOLN-05**: 메타데이터 추출 (POST /solutions/extract-metadata)
- [ ] **SOLN-06**: 어필리에이트 링크 변환 (POST /solutions/convert-affiliate)

### Votes

- [ ] **VOTE-01**: 투표 현황 조회 (GET /solutions/{solution_id}/votes)
- [ ] **VOTE-02**: 투표하기 (POST /solutions/{solution_id}/votes)
- [ ] **VOTE-03**: 투표 취소 (DELETE /solutions/{solution_id}/votes)
- [ ] **VOTE-04**: 솔루션 채택 (POST /solutions/{solution_id}/adopt)
- [ ] **VOTE-05**: 채택 취소 (DELETE /solutions/{solution_id}/adopt)

### Comments

- [ ] **CMNT-01**: 댓글 목록 조회 (GET /posts/{post_id}/comments)
- [ ] **CMNT-02**: 댓글 작성 (POST /posts/{post_id}/comments)
- [ ] **CMNT-03**: 댓글 수정 (PATCH /comments/{comment_id})
- [ ] **CMNT-04**: 댓글 삭제 (DELETE /comments/{comment_id})

### Rankings

- [ ] **RANK-01**: 글로벌 랭킹 조회 (GET /rankings)
- [ ] **RANK-02**: 내 랭킹 조회 (GET /rankings/me)
- [ ] **RANK-03**: 카테고리별 랭킹 조회 (GET /rankings/{category})

### Badges

- [ ] **BDGE-01**: 전체 배지 목록 (GET /badges)
- [ ] **BDGE-02**: 내 배지 목록 (GET /badges/me)
- [ ] **BDGE-03**: 배지 상세 조회 (GET /badges/{badge_id})

### Earnings

- [x] **EARN-01**: 클릭 통계 조회 (GET /clicks/stats) ✓
- [x] **EARN-02**: 클릭 기록 (POST /clicks) ✓
- [x] **EARN-03**: 수익 요약 조회 (GET /earnings) ✓
- [x] **EARN-04**: 정산 내역 조회 (GET /settlements) ✓
- [x] **EARN-05**: 출금 요청 (POST /settlements/withdraw) ✓

### Search

- [x] **SRCH-01**: 인기 검색어 조회 (GET /search/popular) ✓
- [x] **SRCH-02**: 최근 검색어 조회 (GET /search/recent) ✓

## v2 Requirements

Deferred to future release.

### Admin Dashboard

- **ADMN-01**: 관리자 KPI 대시보드
- **ADMN-02**: 포스트 관리
- **ADMN-03**: 솔루션 관리
- **ADMN-04**: 배지 관리
- **ADMN-05**: 카테고리 관리
- **ADMN-06**: 동의어 관리

### Real-time

- **RTME-01**: 실시간 알림
- **RTME-02**: 실시간 투표 업데이트

## Out of Scope

| Feature | Reason |
|---------|--------|
| Admin 대시보드 | 별도 마일스톤으로 분리 (복잡도 높음) |
| 실시간 알림 | WebSocket 인프라 필요, v2로 미루기 |
| 추가 OAuth 제공자 | 현재 인증 방식 충분 |
| 모바일 앱 | 웹 우선 전략 |

## Traceability

### Phase 6: API Foundation & Profile (Main Branch)

| Requirement | Status |
|-------------|--------|
| PROF-01 | Pending |
| PROF-02 | Pending |
| PROF-03 | Pending |
| PROF-04 | Pending |
| PROF-05 | Pending |

### Track A: Content CRUD (Worktree)

| Requirement | Status |
|-------------|--------|
| POST-01 | Pending |
| POST-02 | Pending |
| SPOT-01 | Pending |
| SPOT-02 | Pending |
| SPOT-03 | Pending |
| SPOT-04 | Pending |
| SOLN-01 | Pending |
| SOLN-02 | Pending |
| SOLN-03 | Pending |
| SOLN-04 | Pending |
| SOLN-05 | Pending |
| SOLN-06 | Pending |

### Track B: Engagement (Worktree)

| Requirement | Status |
|-------------|--------|
| VOTE-01 | Pending |
| VOTE-02 | Pending |
| VOTE-03 | Pending |
| VOTE-04 | Pending |
| VOTE-05 | Pending |
| CMNT-01 | Pending |
| CMNT-02 | Pending |
| CMNT-03 | Pending |
| CMNT-04 | Pending |

### Track C: Gamification (Worktree)

| Requirement | Status |
|-------------|--------|
| RANK-01 | Pending |
| RANK-02 | Pending |
| RANK-03 | Pending |
| BDGE-01 | Pending |
| BDGE-02 | Pending |
| BDGE-03 | Pending |

### Track D: Monetization & Search (Worktree) ✓

| Requirement | Status |
|-------------|--------|
| EARN-01 | **Complete** |
| EARN-02 | **Complete** |
| EARN-03 | **Complete** |
| EARN-04 | **Complete** |
| EARN-05 | **Complete** |
| SRCH-01 | **Complete** |
| SRCH-02 | **Complete** |

**Coverage:**
- v1.1 requirements: 37 total (7 complete)
- Phase 6 (Foundation): 5
- Track A (Content): 12
- Track B (Engagement): 9
- Track C (Gamification): 6
- Track D (Monetization): 7 ✓

---
*Requirements defined: 2026-01-29*
*Last updated: 2026-01-29 (Track D complete)*
