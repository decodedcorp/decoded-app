# 📑 PRD 업데이트: Background & Benchmarking

## Background (배경)

Decoded는 현재 **단순 카드 기반 무한 스크롤 그리드**를 구현해 둔 상태입니다 (SimpleThiingsGrid).  
이는 1단계 기본 형태로, 콘텐츠를 일정한 규칙에 따라 나열하고, 끝없이 이어지는 스크롤 경험을 제공합니다.

하지만 사용자 경험 차원에서 한계가 있습니다. 긴 세션에서 성능 저하가 발생하거나, 단조로운 카드 나열로 인해  
**“스크롤 그 자체가 UX가 되는 경험”**을 제공하기 어렵습니다.

이를 극복하기 위해, Decoded는 [**Thiings Grid**](https://www.thiings.co/things)를 벤치마킹합니다.  
Thiings는 GPU 가속, Skyline 기반 배치, 뷰포트 가상화, Seamless Preloading 등 고급 최적화 기법을 결합하여,  
수천 개의 콘텐츠도 매끄럽게 탐색할 수 있는 **콘텐츠 스트림 시스템**을 구현한 사례입니다.

Decoded의 목표는 단순 “무한 스크롤 그리드”가 아닌, **“콘텐츠 스트림(Content Stream) 플랫폼”**을 제공하는 것입니다.

---

## Benchmarking (벤치마킹)

### Thiings Grid 주요 기능

1. **GPU 가속 스크롤** – transform3d 기반 GPU 렌더링으로 DOM repaint 최소화
2. **뷰포트 가상화** – 보이는 콘텐츠만 렌더링, 화면 밖 요소는 언마운트
3. **Skyline 배치 알고리즘** – 가변 크기 셀(1×1, 1×2, 2×1, 2×2)을 빈틈없이 배치
4. **Seamless Preloading** – 스크롤 도달 전에 데이터를 미리 불러와 끊김 없는 UX 보장
5. **반응형 열 계산** – 화면 크기/기기 해상도에 따라 열 개수 자동 조정

---

## Decoded Infinity Quilt Grid – 구현 방향성

### 🎯 최우선 구현 목표 (Phase 2)

- GPU 가속 스크롤 (transform3d)
- 뷰포트 가상화 (Virtualization)
- Skyline 배치 알고리즘 (1×1, 1×2, 2×1, 2×2 지원)
- Seamless Preloading (끊김 없는 콘텐츠 스트림)
- 반응형 열 계산 (디바이스별 최적화)

---

### 추가 차별화 포인트

- 풍부한 메타데이터 지원 (작성자, 태그, 상호작용 데이터)
- API 기반 확장성 (Cursor pagination, CDN 최적화)
- 접근성 & SEO (WCAG 2.1 AA, SSR 기반 퍼포먼스)
- 상호작용 UX 강화 (좋아요, 공유, 저장 등)

---

👉 이로써, Decoded는 단순 카드 리스트가 아닌 **“Thiings-style 콘텐츠 스트림”**으로 진화하며, 무한 스크롤 UX 자체를 핵심 경쟁력으로 삼습니다.
