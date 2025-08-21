# [Feature Name] - Product Requirements Document
**Version:** [Version Number]  
**Date:** [Date]  
**Authors:** [Authors]  
**Status:** [Draft/Review/Approved/Active/Archived]  

---

## 배경 (Background)

[현재 상황과 문제점 설명]

### 현재 상황
- [현재 시스템의 한계점]
- [사용자 피드백]
- [비즈니스 니즈]

---

## 목표 (Objectives)

### 주요 목표
1. **[목표 1]**: [구체적인 설명]
2. **[목표 2]**: [구체적인 설명]
3. **[목표 3]**: [구체적인 설명]

### 성공 지표
- [정량적 지표 1]
- [정량적 지표 2]
- [정량적 지표 3]

---

## 범위 (Scope)

### In Scope
- **[카테고리 1]**
  - [세부 항목 1]
  - [세부 항목 2]

- **[카테고리 2]**
  - [세부 항목 1]
  - [세부 항목 2]

### Out of Scope
- [제외 항목 1]
- [제외 항목 2]
- [제외 항목 3]

---

## 요구사항 (Requirements)

### Functional Requirements

#### F1. [기능 이름]
- [요구사항 세부 내용]
- [기능 동작 방식]
- [예상 결과]

#### F2. [기능 이름]
- [요구사항 세부 내용]

### Non-Functional Requirements

#### N1. Performance
- [성능 요구사항]

#### N2. Compatibility
- [호환성 요구사항]

#### N3. Accessibility
- [접근성 요구사항]

#### N4. Scalability
- [확장성 요구사항]

---

## 데이터 계약 (Data Contract)

### API Response Structure

```typescript
interface [InterfaceName] {
  // API 스키마 정의
}
```

### API Endpoints

```
[HTTP Method] /api/v1/[endpoint]
Query Parameters:
- [parameter]: [type] ([description])
```

---

## UX/UI 설계

### [섹션 이름]
1. **[동작 1]**: [설명]
2. **[동작 2]**: [설명]

### Visual States
1. **Loading State**: [설명]
2. **Error State**: [설명]
3. **Empty State**: [설명]

### Interaction Patterns
1. **[인터랙션 1]**: [설명]
2. **[인터랙션 2]**: [설명]

---

## 성공 기준 (Success Criteria)

### Performance Metrics
- [ ] [성능 지표 1]
- [ ] [성능 지표 2]

### User Experience Metrics
- [ ] [사용자 경험 지표 1]
- [ ] [사용자 경험 지표 2]

### Technical Metrics
- [ ] [기술 지표 1]
- [ ] [기술 지표 2]

---

## 마일스톤 & 일정 (Timeline & Milestones)

### Phase 1: [단계명] ([기간])
**Week [N-N]**
- [ ] [태스크 1]
- [ ] [태스크 2]

### Phase 2: [단계명] ([기간])
**Week [N-N]**
- [ ] [태스크 1]
- [ ] [태스크 2]

---

## 리스크 & 대응 (Risks & Mitigation)

### Technical Risks

#### R1. [리스크명] ([위험도])
**위험**: [위험 설명]
**대응책**:
- [대응 방안 1]
- [대응 방안 2]

### Business Risks

#### R2. [리스크명] ([위험도])
**위험**: [위험 설명]
**대응책**:
- [대응 방안 1]
- [대응 방안 2]

---

## 버전 관리 & 저장 (Versioning & Archiving)

### 문서 저장 구조
```
/docs/
├── prd/
│   ├── [feature-name]-prd-v1.0.md     # 현재 문서
│   └── archive/                       # 보관 버전
└── prd-templates/
    └── prd-template.md               # 이 템플릿
```

### 파일명 규칙
- **Format**: `{feature-name}-prd-v{major}.{minor}.md`
- **Major Version**: 핵심 기능이나 아키텍처 변경 시 증가
- **Minor Version**: 요구사항 추가/수정, 일정 변경 시 증가

### 변경 이력 관리

#### CHANGELOG
```markdown
## 변경 이력 (Changelog)

### v1.1 (YYYY-MM-DD)
**Changed:**
- [변경 내용]

**Added:**
- [추가 내용]

**Removed:**
- [제거 내용]

### v1.0 (YYYY-MM-DD)
**Added:**
- 초기 PRD 문서 생성
```

---

## 부록

### 참고 자료
- [참고 문서 1]
- [참고 문서 2]

### 용어집
- **[용어 1]**: [정의]
- **[용어 2]**: [정의]

---

**문서 메타데이터**
- 최종 수정일: [날짜]
- 다음 리뷰 예정일: [날짜]
- 담당자: [이름]
- 승인자: [이름]