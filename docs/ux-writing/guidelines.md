# UX Writing Guidelines (UX 라이팅 가이드라인)

## Core Principles (핵심 원칙)

### 1. User-Centered Communication (사용자 중심 소통)

- Write for the user's perspective, not the system's
- Anticipate user questions and provide answers
- Use language that matches the user's mental model

**한국어**: 사용자 관점에서 작성, 사용자의 질문을 예상하고 답변 제공, 사용자의 사고방식에 맞는 언어 사용

### 2. Clarity Above All (명확성 우선)

- Use simple, everyday words
- Avoid jargon and technical terms when possible
- Be specific rather than vague
- One idea per sentence

**한국어**: 간단하고 일상적인 단어 사용, 전문용어와 기술용어 피하기, 모호하지 않고 구체적으로, 한 문장에 하나의 아이디어

### 3. Consistency (일관성)

- Use the same words for the same concepts
- Follow established patterns
- Maintain consistent tone across all touchpoints

**한국어**: 같은 개념에 같은 단어 사용, 정해진 패턴 따르기, 모든 접점에서 일관된 톤 유지

## Voice & Tone (목소리와 톤)

### Brand Voice (브랜드 보이스)

**공통**: 차분함, 전문성, 따뜻한 도움

- **한국어**: "명확하고 공손한 안내자" — "~해요/하세요" 중심, 어려운 한자어 지양
- **English**: "Friendly expert" — short, direct, positive

### Tone Shift Matrix (상황별 톤 조절)

| 상황      | 한국어 톤                                        | English Tone                          |
| --------- | ------------------------------------------------ | ------------------------------------- |
| 성공/완료 | 약간 밝음 (✨ 이모지는 마케팅 영역에서만 제한적) | Slightly brighter                     |
| 오류/경고 | 차분하고 실용적, 해결책 먼저                     | Calm and practical, solution-first    |
| 로딩/대기 | 공감 + 다음 단계/예상 시간                       | Empathetic + next steps/expected time |

## Style Guide (스타일 가이드)

### 3.1 Common Rules (공통 규칙)

- **Sentence case** (영문 UI), 고정된 대문자 사용 금지 (필요시 고유명사만)
- **Numbers**: 1000 단위 구분 (EN: 1,234 / KR: 1,234)
- **날짜/시간**: 사용자의 로컬 타임존 표시, 절대 시각을 우선 (예: 2025-09-10 14:30 KST)
- **Links**: 의미 있는 텍스트로 작성 ("여기 클릭" 금지)

### 3.2 Korean Specific (한국어 세부 규칙)

#### Honorifics (경어체)

- **경어체 -요** / 과도한 존칭(님) 남발 금지
- 사용자 식별명에만 '님' 허용
- 반말 사용 금지

#### Spacing (띄어쓰기)

- **붙임**: '로그인', '로그아웃', '업로드', '다운로드'
- **띄어쓰기**: '이메일 주소', '전화 번호', '사용자 이름'

#### Button Text (버튼 텍스트)

- '업로드하기'보다 '업로드' (동사 명사형) 선호
- 반복 동작은 간결하게

#### Foreign Words (외래어)

- 서비스 핵심 용어는 한글화 우선 (예: 채널, 링크, 요약)
- 고유 브랜드·기술용어는 원어

#### Punctuation (문장부호)

- 느낌표·물결(~) 최소화
- 줄임표 (…) 1회만

### 3.3 English Specific (영어 세부 규칙)

#### Grammar

- Oxford comma 사용
- Contractions 허용: it's, you'll, we're
- Active voice when possible

#### Button Text

- Verb-first: "Create channel", not "Channel create"
- Avoid jargon; explain on first use if needed

## Text Length Guidelines (텍스트 길이 가이드라인)

### Buttons and Actions (버튼 및 액션)

| Type                | Korean    | English   | Example                                                         |
| ------------------- | --------- | --------- | --------------------------------------------------------------- |
| Primary actions     | 1-3 words | 1-3 words | "저장", "계속", "시작하기" / "Save", "Continue", "Get Started"  |
| Secondary actions   | 1-4 words | 1-4 words | "취소", "뒤로", "더 알아보기" / "Cancel", "Back", "Learn More"  |
| Destructive actions | 1-3 words | 1-3 words | "삭제", "제거", "모두 지우기" / "Delete", "Remove", "Clear All" |

### Labels and Form Fields (라벨 및 폼 필드)

| Type         | Korean        | English       | Example                                                                                               |
| ------------ | ------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| Field labels | 1-2 words     | 1-2 words     | "이메일", "비밀번호", "이름" / "Email", "Password", "Name"                                            |
| Help text    | 1-2 sentences | 1-2 sentences | "8자 이상의 안전한 비밀번호를 입력해 주세요." / "Enter a secure password with at least 8 characters." |

### Messages and Feedback (메시지 및 피드백)

| Type             | Korean        | English       | Example                                                                       |
| ---------------- | ------------- | ------------- | ----------------------------------------------------------------------------- |
| Success messages | 1-2 sentences | 1-2 sentences | "변경사항이 저장되었어요." / "Changes saved successfully."                    |
| Error messages   | 1-2 sentences | 1-2 sentences | "올바른 이메일 주소를 입력해 주세요." / "Please enter a valid email address." |
| Warning messages | 1-2 sentences | 1-2 sentences | "이 작업은 되돌릴 수 없어요." / "This action can't be undone."                |

## Common Patterns (일반적인 패턴)

### Error Handling Pattern (에러 처리 패턴)

```
문제 + 원인(선택) + 해결 행동

Korean: "업로드에 실패했어요. 파일을 확인하고 다시 시도해 주세요."
English: "Upload failed. Check your file and try again."
```

### Success Message Pattern (성공 메시지 패턴)

```
확인 + 영향 + 다음 단계

Korean: "변경사항이 저장되었어요. 프로필이 업데이트되었어요. 이제 공유할 수 있어요."
English: "Changes saved successfully. Your profile has been updated. You can now share it."
```

### Empty State Pattern (빈 상태 패턴)

```
상황 + 한 문장 도움 + 주요 CTA

Korean: "아직 채널이 없어요. 관심사를 모아보세요. 채널 만들기"
English: "No channels yet. Gather what you love. Create channel"
```

### Loading State Pattern (로딩 상태 패턴)

```
구체적 행동 + 진행률(선택) + 예상 시간(선택)

Korean: "업로드하는 중… 3개 중 2개 완료"
English: "Uploading… 2 of 3 complete"
```

## Accessibility Considerations (접근성 고려사항)

### Screen Reader Support (스크린 리더 지원)

- Use descriptive alt text for images
- Provide context for interactive elements
- Use proper heading hierarchy
- Include ARIA labels when necessary

**한국어**: 이미지에 대한 설명적 대체 텍스트 사용, 상호작용 요소에 대한 컨텍스트 제공, 적절한 제목 계층 구조 사용, 필요시 ARIA 라벨 포함

### Cognitive Accessibility (인지 접근성)

- Use simple sentence structures
- Avoid complex vocabulary
- Provide clear instructions
- Use consistent terminology

**한국어**: 간단한 문장 구조 사용, 복잡한 어휘 피하기, 명확한 지침 제공, 일관된 용어 사용

### Visual Accessibility (시각적 접근성)

- Ensure sufficient color contrast
- Use clear, readable fonts
- Provide text alternatives for icons
- Use meaningful link text

**한국어**: 충분한 색상 대비 확보, 명확하고 읽기 쉬운 폰트 사용, 아이콘에 대한 텍스트 대안 제공, 의미 있는 링크 텍스트 사용

## Brand Voice Examples (브랜드 보이스 예시)

### Do's (권장사항)

| Korean                                    | English                                       |
| ----------------------------------------- | --------------------------------------------- |
| "다시 오신 걸 환영해요! 로그인해 주세요." | "Welcome back! Let's get you signed in."      |
| "변경사항이 자동으로 저장되었어요."       | "Your changes have been saved automatically." |
| "문제가 발생했어요. 다시 시도해 주세요."  | "Something went wrong. Please try again."     |
| "완벽해요! 모든 설정이 완료되었어요."     | "Perfect! You're all set up."                 |

### Don'ts (피해야 할 것)

| Korean                                       | English                                                    |
| -------------------------------------------- | ---------------------------------------------------------- |
| "인증 실패: 잘못된 자격 증명"                | "Authentication failed due to invalid credentials."        |
| "오류 404: 리소스를 찾을 수 없음"            | "Error 404: Resource not found."                           |
| "지정된 필드에 이메일 주소를 입력해 주세요." | "Please input your email address in the designated field." |
| "시스템 유지보수 진행 중"                    | "System maintenance in progress."                          |

## Review Checklist (검토 체크리스트)

Before publishing any user-facing text, verify:

- [ ] Is the tone appropriate for the context? (상황에 맞는 톤인가?)
- [ ] Is the message clear and actionable? (메시지가 명확하고 실행 가능한가?)
- [ ] Does it follow our established patterns? (정해진 패턴을 따르는가?)
- [ ] Is the terminology consistent? (용어가 일관된가?)
- [ ] Is it accessible to all users? (모든 사용자가 접근 가능한가?)
- [ ] Does it match our brand voice? (브랜드 보이스와 일치하는가?)
- [ ] Does it work well in both Korean and English? (한국어와 영어 모두에서 잘 작동하는가?)
- [ ] Is the text length appropriate for its context? (텍스트 길이가 맥락에 적절한가?)
