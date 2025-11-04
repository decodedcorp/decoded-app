# Decoded UX Writing System (KO/EN)

**목적**: 한국어/영어 이중 언어 기준으로 일관된 UX 라이팅을 구축해 제품 전반의 품질과 전환율을 높인다.

**Purpose**: Establish consistent UX writing standards for Korean/English bilingual interface to improve product quality and conversion rates.

## Quick Start

### 우선순위 (Priority)

1. **명확성** (Clarity) - 한 문장 한 의미
2. **간결성** (Conciseness) - 필요한 단어만
3. **신뢰감** (Trust) - 정직하고 투명한 소통
4. **브랜드 톤** (Brand Tone) - 차분하고 전문적

### 톤 가이드 (Tone Guide)

- **한국어**: 반말 금지, 존댓말 -요체, 과한 사족·감탄/의성어 자제
- **English**: Friendly & concise, sentence case, active voice, contractions OK

### 상태 관리 (Status Management)

- **Draft** → **Review** → **Approved** → **Shipped**
- **소유자**: PM(요구사항) · UX Writer(문안) · FE(문자열 키/릴리즈)
- **Git 태그**: `[ux-copy]`

## Structure

- [`guidelines.md`](./guidelines.md) - 핵심 UX writing 원칙과 톤앤매너
- [`terminology.md`](./terminology.md) - 한국어/영어 용어집 (Single Source of Truth)
- [`patterns/`](./patterns/) - 마이크로카피 패턴 라이브러리
- [`components/`](./components/) - 컴포넌트별 텍스트 가이드라인
- [`accessibility.md`](./accessibility.md) - 접근성 중심의 텍스트 작성 가이드
- [`ai-transparency.md`](./ai-transparency.md) - AI 관련 고지 가이드라인

## Key Principles

### 1. 명확성 (Clarity)

- 한 문장 한 의미
- 모호한 표현 피하기
- 사용자 관점에서 작성

### 2. 간결성 (Conciseness)

- 필요한 단어만 사용
- 중복·군더더기 제거
- 버튼은 동사 우선

### 3. 일관성 (Consistency)

- 용어집 우선 사용
- 동일한 패턴 유지
- 브랜드 톤 통일

### 4. 신뢰와 정직 (Trust & Honesty)

- 제약·비용·AI 한계 투명하게 표기
- 근거 없는 확신 금지

## Implementation

이 가이드라인은 다음을 통해 적용됩니다:

1. Cursor rules를 통한 자동 검증
2. 코드 리뷰 체크리스트
3. 디자인 시스템 통합
4. 정기적인 팀 리뷰

## Getting Started

1. [가이드라인](./guidelines.md)을 읽어 전체 접근법 이해
2. [용어집](./terminology.md)에서 일관된 용어 확인
3. [패턴 라이브러리](./patterns/)에서 템플릿 활용
4. [컴포넌트별 규칙](./components/)에서 세부 가이드라인 확인
