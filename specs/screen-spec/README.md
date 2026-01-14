# DECODED 화면 설계서 (Screen Specification)

| 프로젝트명 | DECODED | 작성일 | 2026-01-14 |
|:---|:---|:---|:---|
| 버전 | v1.0 | 작성자 | PM/Planning Team |

---

## 개요

이 문서는 DECODED 프로젝트의 화면 설계서 마스터 인덱스입니다.
개발자와 디자이너가 **"무엇을 그려야 하는지(UI)"**와 **"어떻게 동작해야 하는지(Logic)"**를 명확히 이해할 수 있도록 구성되었습니다.

### 문서 구조
```
specs/screen-spec/
├── README.md                  # 마스터 인덱스 (현재 문서)
├── _templates/                # 템플릿
│   └── screen-template.md     # 화면 설계서 표준 템플릿
├── _common/                   # 공통 컴포넌트
│   ├── CMN-01-header.md
│   ├── CMN-02-footer.md
│   ├── CMN-03-modals.md
│   └── CMN-04-toasts.md
├── 01-user-system/            # Chapter 1: 사용자 시스템
├── 02-discovery/              # Chapter 2: 발견/탐색
├── 03-detail-view/            # Chapter 3: 상세 뷰
├── 04-creation/               # Chapter 4: 콘텐츠 생성
└── 05-admin/                  # Chapter 5: 관리자
```

---

## 화면 목록

### Chapter 1: 사용자 시스템 (User System)
| ID | 화면명 | 경로 | 상태 | 기능 ID |
|:---|:---|:---|:---:|:---|
| [SCR-USER-01](./01-user-system/SCR-USER-01-login.md) | 로그인 | `/login` | Draft | U-01 |
| [SCR-USER-02](./01-user-system/SCR-USER-02-profile.md) | 프로필 대시보드 | `/profile` | Draft | U-03 |
| [SCR-USER-03](./01-user-system/SCR-USER-03-activity.md) | 활동 내역 | `/profile/activity` | Draft | U-04 |
| [SCR-USER-04](./01-user-system/SCR-USER-04-earnings.md) | 수익/출금 | `/profile/earnings` | Draft | U-05 |
| [SCR-USER-05](./01-user-system/SCR-USER-05-settings.md) | 설정 | `/profile/settings` | Draft | U-02 |

### Chapter 2: 발견/탐색 (Discovery)
| ID | 화면명 | 경로 | 상태 | 기능 ID |
|:---|:---|:---|:---:|:---|
| [SCR-DISC-01](./02-discovery/SCR-DISC-01-home.md) | 홈 피드 | `/` | Draft | D-01 |
| [SCR-DISC-02](./02-discovery/SCR-DISC-02-filter.md) | 필터 시스템 | (컴포넌트) | Draft | D-02 |
| [SCR-DISC-03](./02-discovery/SCR-DISC-03-search.md) | 검색 결과 | `/?q=...` | Draft | D-04 |
| [SCR-DISC-04](./02-discovery/SCR-DISC-04-gallery.md) | 미디어 갤러리 | `/images` | Draft | D-03 |

### Chapter 3: 상세 뷰 (Detail View)
| ID | 화면명 | 경로 | 상태 | 기능 ID |
|:---|:---|:---|:---:|:---|
| [SCR-VIEW-01](./03-detail-view/SCR-VIEW-01-detail.md) | 이미지 상세 | `/images/[id]` | Draft | V-01 |
| [SCR-VIEW-02](./03-detail-view/SCR-VIEW-02-pins.md) | 핀 시스템 | (컴포넌트) | Draft | V-02 |
| [SCR-VIEW-03](./03-detail-view/SCR-VIEW-03-items.md) | 아이템 목록 | (컴포넌트) | Draft | V-03, V-05 |
| [SCR-VIEW-04](./03-detail-view/SCR-VIEW-04-related.md) | 관련 이미지 | (컴포넌트) | Draft | V-04 |

### Chapter 4: 콘텐츠 생성 (Creation)
| ID | 화면명 | 경로 | 상태 | 기능 ID |
|:---|:---|:---|:---:|:---|
| [SCR-CREA-01](./04-creation/SCR-CREA-01-upload.md) | 업로드 | `/upload` | Draft | C-01 |
| [SCR-CREA-02](./04-creation/SCR-CREA-02-detect.md) | AI 검출 결과 | `/upload/detect` | Draft | C-02 |
| [SCR-CREA-03](./04-creation/SCR-CREA-03-edit.md) | 태그 편집 | `/upload/edit` | Draft | C-03, C-04 |

### Chapter 5: 관리자 (Admin)
| ID | 화면명 | 경로 | 상태 | 기능 ID |
|:---|:---|:---|:---:|:---|
| [SCR-ADMN-01](./05-admin/SCR-ADMN-01-dashboard.md) | 관리자 대시보드 | `/admin` | Draft | A-01 |
| [SCR-ADMN-02](./05-admin/SCR-ADMN-02-content.md) | 콘텐츠 모더레이션 | `/admin/content` | Draft | A-02 |
| [SCR-ADMN-03](./05-admin/SCR-ADMN-03-payments.md) | 지불 관리 | `/admin/payments` | Draft | A-03 |

### 공통 컴포넌트 (Common)
| ID | 컴포넌트명 | 상태 |
|:---|:---|:---:|
| [CMN-01](./common/CMN-01-header.md) | 헤더 | Draft |
| [CMN-02](./common/CMN-02-footer.md) | 푸터 | Draft |
| [CMN-03](./common/CMN-03-modals.md) | 공통 모달 | Draft |
| [CMN-04](./common/CMN-04-toasts.md) | 토스트/알림 | Draft |

---

## ID 체계

### 화면 ID (Screen ID)
| 접두사 | 의미 | 예시 |
|:---|:---|:---|
| SCR-USER | 사용자 시스템 화면 | SCR-USER-01 |
| SCR-DISC | 발견/탐색 화면 | SCR-DISC-01 |
| SCR-VIEW | 상세 뷰 화면 | SCR-VIEW-01 |
| SCR-CREA | 콘텐츠 생성 화면 | SCR-CREA-01 |
| SCR-ADMN | 관리자 화면 | SCR-ADMN-01 |
| CMN | 공통 컴포넌트 | CMN-01 |

### UI 요소 ID (Element ID)
| 접두사 | 의미 | 예시 |
|:---|:---|:---|
| BTN | Button | BTN-01 |
| INP | Input | INP-01 |
| TXT | Text/Label | TXT-01 |
| IMG | Image | IMG-01 |
| ICON | Icon | ICON-01 |
| TAB | Tab | TAB-01 |
| SEL | Select/Dropdown | SEL-01 |
| CARD | Card | CARD-01 |
| LIST | List | LIST-01 |
| TOAST | Toast/Alert | TOAST-01 |
| MODAL | Modal/Dialog | MODAL-01 |

---

## 문서 상태

| 상태 | 의미 |
|:---|:---|
| Draft | 초안 작성 중 |
| Review | 검토 진행 중 |
| Approved | 승인 완료 |
| Implemented | 구현 완료 |

---

## 관련 문서

- [기능 명세서](../feature-spec/README.md) - 기능 ID 기준 상세 스펙
- [데이터 모델](../feature-spec/data-models.md) - TypeScript 타입 정의
- [워크플로우](../feature-spec/workflows.md) - 사용자 여정 및 화면 전환
- [아키텍처](../../docs/architecture/README.md) - 시스템 아키텍처 개요

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|:---|:---|:---|:---|
| v1.0 | 2026-01-14 | PM | 초기 작성 |
