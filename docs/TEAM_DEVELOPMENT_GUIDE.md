# 👥 Decoded App 팀 개발 가이드

## 🎯 핵심 원칙

### 성능 우선 (Performance First)
- **LCP < 2.5초** 목표 유지
- 모든 이미지는 Next.js Image 컴포넌트 사용
- 100줄 이상 컴포넌트는 즉시 리팩토링

### 코드 품질 (Code Quality)
- 파일 최대 100줄 (ESLint 강제)
- 함수 최대 복잡도 10
- 함수 매개변수 최대 5개
- 중첩 깊이 최대 4단계

## 🏗️ 아키텍처 가이드라인

### 폴더 구조 및 도메인 경계
```
src/
├── domains/              # 도메인별 기능 (팀별 할당)
│   ├── auth/            # 🔐 인증 팀 전용
│   ├── channels/        # 📺 채널 기능 팀
│   ├── contents/        # 📝 콘텐츠 관리 팀
│   └── feeds/           # 📡 피드 시스템 팀
├── shared/              # ⚠️ 전체 팀 조정 필요
│   ├── components/      # 공유 UI 컴포넌트
│   └── hooks/           # 공유 커스텀 훅
├── lib/                 # ⚠️ 기술 리드 승인 필요
│   ├── utils/           # 공유 유틸리티
│   └── types/           # 글로벌 타입 정의
└── store/              # ⚠️ 전체 팀 조정 필요
    └── *Store.ts        # 글로벌 상태 관리
```

### 컴포넌트 작성 규칙

#### ✅ 권장 패턴
```typescript
// 1. 100줄 이하, 단일 책임
export const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  const { data, loading, error } = useUserData(user.id);
  
  if (loading) return <UserProfileSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  return (
    <ProfileContainer>
      <UserAvatar user={data} />
      <UserDetails user={data} onUpdate={onUpdate} />
    </ProfileContainer>
  );
};

// 2. 성능 최적화 패턴
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const memoizedResult = useMemo(() => 
    heavyCalculation(data), [data]
  );
  
  const handleClick = useCallback(() => {
    onAction(memoizedResult);
  }, [memoizedResult, onAction]);
  
  return <div onClick={handleClick}>{memoizedResult}</div>;
});

// 3. 이미지 최적화 패턴
import Image from 'next/image';

<Image
  src={thumbnailUrl}
  alt={title}
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
/>
```

#### ❌ 금지 패턴
```typescript
// ❌ 거대한 컴포넌트 (100줄 초과)
export const MassiveComponent = () => {
  // 수백 줄의 로직...
  return <div>...</div>; // ESLint에서 차단됨
};

// ❌ 인라인 함수 (성능 저해)
<button onClick={() => doSomething(id)}>  // ❌
<button onClick={handleClick}>            // ✅

// ❌ 일반 img 태그 (LCP 저해)  
<img src={url} alt={alt} />              // ❌ ESLint에서 차단됨
<Image src={url} alt={alt} />            // ✅
```

## 🔄 개발 워크플로

### 브랜치 전략
```bash
# 브랜치 명명 규칙
feature/auth/login-form          # 인증팀 로그인 폼
feature/channels/modal-redesign  # 채널팀 모달 리디자인
feature/contents/upload-flow     # 콘텐츠팀 업로드 플로우
feature/feeds/infinite-scroll    # 피드팀 무한스크롤

hotfix/performance/image-lazy-loading  # 긴급 성능 수정
hotfix/security/auth-validation        # 긴급 보안 수정
```

### PR 프로세스
```markdown
## PR 체크리스트 (필수)

### 성능 영향도
- [ ] 새로운 대용량 파일 없음 (>100줄)
- [ ] 이미지 최적화 적용
- [ ] 번들 사이즈 확인
- [ ] LCP 성능 테스트 완료

### 코드 품질
- [ ] ESLint 통과 (0 에러)
- [ ] 타입 안전성 확보
- [ ] 테스트 작성 (가능한 경우)
- [ ] 문서 업데이트

### 호환성
- [ ] 기존 기능 정상 작동
- [ ] Breaking change 없음 (또는 마이그레이션 가이드 제공)
- [ ] 모바일 반응형 테스트
```

## ⚡ 성능 가이드라인

### Critical Web Vitals 목표
```typescript
const PERFORMANCE_TARGETS = {
  LCP: 2500,      // Largest Contentful Paint < 2.5s
  FID: 100,       // First Input Delay < 100ms  
  CLS: 0.1,       // Cumulative Layout Shift < 0.1
  TBT: 200,       // Total Blocking Time < 200ms
  FCP: 1800,      // First Contentful Paint < 1.8s
};

// 현재 상태 (긴급 개선 필요)
const CURRENT_PERFORMANCE = {
  LCP: 43700,     // ❌ 43.7초 (17x 초과)
  TBT: 1430,      // ❌ 1.43초 (7x 초과)  
  FCP: 1900,      // ⚠️ 1.9초 (약간 초과)
};
```

### 필수 최적화 패턴
```typescript
// 1. 동적 임포트로 코드 스플리팅
const HeavyModal = dynamic(() => import('./HeavyModal'), {
  loading: () => <ModalSkeleton />,
  ssr: false
});

// 2. 이미지 지연 로딩
<Image
  src={imageUrl}
  loading="lazy"
  onLoad={() => setImageLoaded(true)}
/>

// 3. 교차 관찰자로 애니메이션 최적화
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

return (
  <div ref={ref}>
    {inView && <ExpensiveAnimation />}
  </div>
);
```

## 🔧 개발 도구 설정

### 필수 VS Code 확장
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint"
  ]
}
```

### 필수 패키지 스크립트
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "lint:fix": "next lint --fix", 
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true next build"
  }
}
```

## 🚨 에러 해결 가이드

### 자주 발생하는 문제들

#### ESLint 위반
```bash
# 파일 크기 초과
Error: File has too many lines (150). Maximum allowed is 100.
→ 해결: 컴포넌트를 여러 파일로 분리

# 복잡도 초과  
Error: Function has a complexity of 15. Maximum allowed is 10.
→ 해결: 함수를 작은 단위로 분해

# 사용하지 않는 변수
Warning: 'unusedVar' is defined but never used.
→ 해결: 변수 제거 또는 언더스코어 접두사 사용
```

#### 성능 문제
```bash
# img 태그 사용
Error: Using `<img>` could result in slower LCP
→ 해결: Next.js Image 컴포넌트로 교체

# 번들 크기 초과
Warning: Bundle size exceeds recommended limits
→ 해결: 동적 임포트 및 코드 스플리팅 적용
```

## 📚 참고 자료

### 내부 문서
- [`CLAUDE.md`](../CLAUDE.md) - 프로젝트 코딩 가이드라인
- [`HANDOFF_STATUS.md`](./HANDOFF_STATUS.md) - 현재 작업 상태
- [`.taskmaster/`](../.taskmaster/) - Task Master AI 작업 히스토리

### 외부 참조
- [Next.js Performance](https://nextjs.org/docs/basic-features/image-optimization)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)

## 🎯 팀별 담당 영역

### 🔐 인증 팀 (`/domains/auth/`)
- 로그인/회원가입 플로우
- 세션 관리 및 토큰 처리
- OAuth 연동 (Google, 기타)
- 권한 관리 및 보안

### 📺 채널 기능 팀 (`/domains/channels/`)  
- 채널 그리드 및 카드 컴포넌트
- 채널 상세 모달
- 채널 생성/편집 기능
- 구독 관리

### 📝 콘텐츠 관리 팀 (`/domains/contents/`)
- 콘텐츠 업로드 폼
- 콘텐츠 프리뷰 및 편집
- 미디어 처리 파이프라인
- 콘텐츠 메타데이터 관리

### 📡 피드 시스템 팀 (`/domains/feeds/`)
- 메인 피드 그리드
- 무한 스크롤 구현
- 피드 알고리즘 연동
- 실시간 업데이트

---

**💡 팁**: 궁금한 사항이나 도움이 필요한 경우, 각 도메인의 README.md 파일을 확인하거나 팀 리드에게 문의하세요.