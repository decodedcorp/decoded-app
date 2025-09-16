# Modal System Migration Guide

## 🎯 목표

인라인 스타일 기반의 응급처치를 체계적인 토큰 시스템으로 전환하여 재발 방지, 일관성, 테스트 친화성을 확보합니다.

## 📋 마이그레이션 체크리스트

### Phase 1: 토큰 시스템 구축 ✅

- [x] CSS 변수 기반 토큰 시스템 (`modal-tokens.css`)
- [x] Grid 기반 견고한 센터링 시스템
- [x] 새로운 ModalCore 컴포넌트
- [x] BaseModal 어댑터 (점진적 마이그레이션용)

### Phase 2: 점진적 전환

- [ ] ContentUploadModal을 BaseModalAdapter로 교체
- [ ] GlobalContentUploadModal을 BaseModalAdapter로 교체
- [ ] ContentModal을 새로운 ModalCore로 교체
- [ ] 기존 BaseModal 제거

### Phase 3: 품질 보장

- [ ] E2E 테스트 실행 및 검증
- [ ] 런타임 경고 시스템 활성화
- [ ] ESLint 규칙 추가 (도메인 컴포넌트에서 모달 스타일 직접 수정 금지)

## 🔄 마이그레이션 단계별 가이드

### 1. BaseModalAdapter로 전환

```tsx
// Before (기존)
import { BaseModal } from '../base/BaseModal';

<BaseModal isOpen={isOpen} onClose={handleClose} contentClassName={MODAL_SIZES.WIDE}>
  {/* content */}
</BaseModal>;

// After (새로운 어댑터)
import { BaseModalAdapter } from '@/lib/components/ui/modal/BaseModalAdapter';

<BaseModalAdapter
  isOpen={isOpen}
  onClose={handleClose}
  contentClassName={MODAL_SIZES.WIDE} // 자동으로 size="wide"로 변환
>
  {/* content */}
</BaseModalAdapter>;
```

### 2. 새로운 ModalCore로 완전 전환

```tsx
// After (최종)
import { ModalCore, ModalHeader, ModalBody, ModalFooter } from '@/lib/components/ui/modal';

<ModalCore
  open={isOpen}
  onOpenChange={(open) => !open && handleClose()}
  size="wide"
  ariaLabel="Content Upload Modal"
>
  <ModalHeader onClose={handleClose}>
    <h2>Upload Content</h2>
  </ModalHeader>

  <ModalBody>
    <ContentUploadForm />
  </ModalBody>

  <ModalFooter>
    <Button onClick={handleSubmit}>Upload</Button>
  </ModalFooter>
</ModalCore>;
```

## 🛡️ 품질 보장

### 개발 시 자동 경고

```typescript
// 런타임에 문제가 되는 조상 요소 자동 감지
console.warn('[ModalCore] Ancestor creates containing/stacking context:', element);
```

### E2E 테스트

```bash
# 모달 시스템 테스트 실행
npx playwright test __tests__/e2e/modal-system.spec.ts
```

### ESLint 규칙 (추가 예정)

```json
{
  "rules": {
    "no-inline-styles-in-modal": "error",
    "no-manual-modal-sizing": "error"
  }
}
```

## 🎉 기대 효과

1. **재발 방지**: Portal 분리로 상위 레이아웃 영향 차단
2. **일관성**: CSS 변수 기반 토큰으로 모든 모달 통일
3. **테스트 친화성**: 자동화된 E2E 테스트로 품질 보장
4. **유지보수성**: 한 곳에서 모든 모달 크기/스타일 관리
5. **확장성**: 새로운 모달 추가 시 토큰만 조정하면 됨

## 🚀 다음 단계

1. ContentUploadModal을 BaseModalAdapter로 교체하여 테스트
2. 문제없이 동작하면 다른 모달들도 순차 전환
3. 모든 모달 전환 완료 후 기존 BaseModal 제거
4. ESLint 규칙 추가로 향후 실수 방지
