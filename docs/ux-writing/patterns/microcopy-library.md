# Microcopy Patterns Library (마이크로카피 패턴 라이브러리)

모든 예시는 **키·한국어·영어** 세 줄 구성. 실제 구현 시 ICU/변수 포함.

## 5.1 Buttons (CTAs) - 버튼

### Primary Actions (주요 액션)

```json
{
  "channels.create.cta": {
    "ko": "채널 만들기",
    "en": "Create channel"
  },
  "content.upload.cta": {
    "ko": "업로드",
    "en": "Upload"
  },
  "auth.login.cta": {
    "ko": "로그인",
    "en": "Log in"
  },
  "auth.signup.cta": {
    "ko": "회원가입",
    "en": "Sign up"
  },
  "common.save": {
    "ko": "저장",
    "en": "Save"
  },
  "common.continue": {
    "ko": "계속",
    "en": "Continue"
  }
}
```

### Secondary Actions (보조 액션)

```json
{
  "common.cancel": {
    "ko": "취소",
    "en": "Cancel"
  },
  "common.back": {
    "ko": "뒤로",
    "en": "Back"
  },
  "common.skip": {
    "ko": "건너뛰기",
    "en": "Skip"
  },
  "common.learn_more": {
    "ko": "더 알아보기",
    "en": "Learn more"
  },
  "common.edit": {
    "ko": "편집",
    "en": "Edit"
  },
  "common.close": {
    "ko": "닫기",
    "en": "Close"
  }
}
```

### Destructive Actions (파괴적 액션)

```json
{
  "common.delete": {
    "ko": "삭제",
    "en": "Delete"
  },
  "common.remove": {
    "ko": "제거",
    "en": "Remove"
  },
  "common.discard": {
    "ko": "버리기",
    "en": "Discard"
  },
  "common.clear_all": {
    "ko": "모두 지우기",
    "en": "Clear all"
  }
}
```

## 5.2 Form Labels & Help Text - 폼 라벨 및 도움말

### Channel Forms (채널 폼)

```json
{
  "form.channel.name.label": {
    "ko": "채널 이름",
    "en": "Channel name"
  },
  "form.channel.name.help": {
    "ko": "채널의 주제를 한눈에 드러내 주세요.",
    "en": "Make the topic clear at a glance."
  },
  "form.channel.description.label": {
    "ko": "채널 설명",
    "en": "Channel description"
  },
  "form.channel.description.help": {
    "ko": "채널에 대해 간단히 설명해 주세요. (선택사항)",
    "en": "Briefly describe your channel. (Optional)"
  }
}
```

### Content Forms (콘텐츠 폼)

```json
{
  "form.content.title.label": {
    "ko": "제목",
    "en": "Title"
  },
  "form.content.title.help": {
    "ko": "콘텐츠의 제목을 입력해 주세요.",
    "en": "Enter a title for your content."
  },
  "form.content.url.label": {
    "ko": "링크",
    "en": "Link"
  },
  "form.content.url.help": {
    "ko": "공유하고 싶은 링크를 입력해 주세요.",
    "en": "Enter the link you want to share."
  }
}
```

### Authentication Forms (인증 폼)

```json
{
  "form.auth.email.label": {
    "ko": "이메일 주소",
    "en": "Email address"
  },
  "form.auth.email.help": {
    "ko": "로그인에 사용할 이메일 주소를 입력해 주세요.",
    "en": "Enter the email address you'll use to sign in."
  },
  "form.auth.password.label": {
    "ko": "비밀번호",
    "en": "Password"
  },
  "form.auth.password.help": {
    "ko": "8자 이상의 안전한 비밀번호를 입력해 주세요.",
    "en": "Enter a secure password with at least 8 characters."
  }
}
```

## 5.3 Validation & Errors - 검증 및 오류

### Required Field Errors (필수 필드 오류)

```json
{
  "error.required": {
    "ko": "필수 항목이에요.",
    "en": "This field is required."
  },
  "error.required.field": {
    "ko": "{field}은(는) 필수 항목이에요.",
    "en": "{field} is required."
  }
}
```

### Format Validation Errors (형식 검증 오류)

```json
{
  "error.email.invalid": {
    "ko": "올바른 이메일 주소를 입력해 주세요.",
    "en": "Please enter a valid email address."
  },
  "error.password.too_short": {
    "ko": "비밀번호는 최소 8자 이상이어야 해요.",
    "en": "Password must be at least 8 characters long."
  },
  "error.url.invalid": {
    "ko": "올바른 링크를 입력해 주세요.",
    "en": "Please enter a valid link."
  }
}
```

### Network Errors (네트워크 오류)

```json
{
  "error.network": {
    "ko": "네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
    "en": "A network error occurred. Please try again shortly."
  },
  "error.network.connection": {
    "ko": "인터넷 연결을 확인하고 다시 시도해 주세요.",
    "en": "Please check your internet connection and try again."
  },
  "error.network.timeout": {
    "ko": "요청 시간이 초과되었어요. 다시 시도해 주세요.",
    "en": "Request timed out. Please try again."
  }
}
```

### File Upload Errors (파일 업로드 오류)

```json
{
  "error.file.too_large": {
    "ko": "파일이 너무 커요. 최대 {limit}MB까지 업로드할 수 있어요.",
    "en": "File is too large. You can upload up to {limit} MB."
  },
  "error.file.invalid_type": {
    "ko": "지원하지 않는 파일 형식이에요. JPG, PNG, GIF만 업로드할 수 있어요.",
    "en": "Unsupported file type. Only JPG, PNG, and GIF files are allowed."
  },
  "error.file.upload_failed": {
    "ko": "파일 업로드에 실패했어요. 다시 시도해 주세요.",
    "en": "File upload failed. Please try again."
  }
}
```

## 5.4 Empty States - 빈 상태

### Channel Empty States (채널 빈 상태)

```json
{
  "empty.channel": {
    "ko": "아직 채널이 없어요. 채널 만들기로 시작해 보세요.",
    "en": "No channels yet. Start with Create channel."
  },
  "empty.channel.content": {
    "ko": "이 채널에 콘텐츠가 없어요. 첫 번째 콘텐츠를 업로드해 보세요.",
    "en": "This channel has no content yet. Upload your first content."
  }
}
```

### Content Empty States (콘텐츠 빈 상태)

```json
{
  "empty.content": {
    "ko": "아직 콘텐츠가 없어요. 링크나 이미지를 공유해 보세요.",
    "en": "No content yet. Share a link or image to get started."
  },
  "empty.search": {
    "ko": "검색 결과가 없어요. 다른 키워드로 시도해 보세요.",
    "en": "No search results. Try different keywords."
  }
}
```

### General Empty States (일반 빈 상태)

```json
{
  "empty.general": {
    "ko": "아직 항목이 없어요.",
    "en": "No items yet."
  },
  "empty.general.cta": {
    "ko": "첫 번째 항목을 추가해 보세요.",
    "en": "Add your first item."
  }
}
```

## 5.5 Loading & Skeleton - 로딩 및 스켈레톤

### General Loading (일반 로딩)

```json
{
  "loading.default": {
    "ko": "불러오는 중…",
    "en": "Loading…"
  },
  "loading.saving": {
    "ko": "저장하는 중…",
    "en": "Saving…"
  },
  "loading.uploading": {
    "ko": "업로드하는 중…",
    "en": "Uploading…"
  },
  "loading.processing": {
    "ko": "처리하는 중…",
    "en": "Processing…"
  }
}
```

### Progress Loading (진행률 로딩)

```json
{
  "loading.progress": {
    "ko": "업로드 중… {current}/{total}",
    "en": "Uploading… {current}/{total}"
  },
  "loading.progress.percent": {
    "ko": "업로드 중… {percent}%",
    "en": "Uploading… {percent}%"
  }
}
```

## 5.6 Toast & In-App Notifications - 토스트 및 인앱 알림

### Success Messages (성공 메시지)

```json
{
  "toast.upload.success": {
    "ko": "업로드했어요.",
    "en": "Upload complete."
  },
  "toast.save.success": {
    "ko": "저장했어요.",
    "en": "Saved successfully."
  },
  "toast.delete.success": {
    "ko": "삭제했어요.",
    "en": "Deleted successfully."
  },
  "toast.channel.created": {
    "ko": "채널을 만들었어요.",
    "en": "Channel created."
  }
}
```

### Error Messages (오류 메시지)

```json
{
  "toast.error.general": {
    "ko": "오류가 발생했어요. 다시 시도해 주세요.",
    "en": "Something went wrong. Please try again."
  },
  "toast.error.network": {
    "ko": "네트워크 오류가 발생했어요.",
    "en": "Network error occurred."
  },
  "toast.error.upload": {
    "ko": "업로드에 실패했어요.",
    "en": "Upload failed."
  }
}
```

### Undo Actions (실행 취소 액션)

```json
{
  "toast.delete.undo": {
    "ko": "삭제했어요. 실수하셨나요? {undo}로 되돌릴 수 있어요.",
    "en": "Deleted. Changed your mind? Use {undo} to restore."
  },
  "toast.undo.action": {
    "ko": "실행 취소",
    "en": "Undo"
  }
}
```

## 5.7 Dialogs & Confirmations - 다이얼로그 및 확인

### Delete Confirmations (삭제 확인)

```json
{
  "dialog.delete.title": {
    "ko": "정말 삭제할까요?",
    "en": "Delete this item?"
  },
  "dialog.delete.body": {
    "ko": "이 작업은 되돌릴 수 없어요.",
    "en": "This action can't be undone."
  },
  "dialog.delete.confirm": {
    "ko": "삭제",
    "en": "Delete"
  },
  "dialog.delete.cancel": {
    "ko": "취소",
    "en": "Cancel"
  }
}
```

### Save Confirmations (저장 확인)

```json
{
  "dialog.save.title": {
    "ko": "변경사항을 저장할까요?",
    "en": "Save changes?"
  },
  "dialog.save.body": {
    "ko": "저장하지 않으면 변경사항이 사라져요.",
    "en": "Your changes will be lost if you don't save."
  },
  "dialog.save.confirm": {
    "ko": "저장",
    "en": "Save"
  },
  "dialog.save.discard": {
    "ko": "버리기",
    "en": "Discard"
  }
}
```

## 5.8 Onboarding & Guide - 온보딩 및 가이드

### Welcome Messages (환영 메시지)

```json
{
  "onboarding.welcome": {
    "ko": "Decoded에 오신 걸 환영해요 👋",
    "en": "Welcome to Decoded 👋"
  },
  "onboarding.welcome.subtitle": {
    "ko": "관심사를 모아보고 공유해 보세요.",
    "en": "Collect and share what you love."
  }
}
```

### Feature Introductions (기능 소개)

```json
{
  "onboarding.channels.intro": {
    "ko": "채널을 만들어 관심사를 정리해 보세요.",
    "en": "Create channels to organize your interests."
  },
  "onboarding.content.intro": {
    "ko": "링크나 이미지를 업로드해 콘텐츠를 공유해 보세요.",
    "en": "Upload links or images to share content."
  },
  "onboarding.explore.intro": {
    "ko": "다른 사람들의 채널을 둘러보고 좋아요를 눌러보세요.",
    "en": "Explore other channels and like what you find."
  }
}
```

### Help & Support (도움말 및 지원)

```json
{
  "help.title": {
    "ko": "도움말",
    "en": "Help"
  },
  "help.contact": {
    "ko": "문의하기",
    "en": "Contact us"
  },
  "help.feedback": {
    "ko": "피드백 보내기",
    "en": "Send feedback"
  }
}
```

## 5.9 AI & Transparency - AI 및 투명성

### AI Disclosure (AI 고지)

```json
{
  "ai.disclosure.inline": {
    "ko": "이 요약은 AI가 생성했어요. 부정확할 수 있어요.",
    "en": "This summary is generated by AI and may be inaccurate."
  },
  "ai.disclosure.detailed": {
    "ko": "AI가 자동으로 생성한 내용이에요. 정확성을 보장하지 않습니다.",
    "en": "This content is automatically generated by AI. Accuracy is not guaranteed."
  }
}
```

### AI Actions (AI 액션)

```json
{
  "ai.retry": {
    "ko": "다시 생성",
    "en": "Regenerate"
  },
  "ai.feedback.prompt": {
    "ko": "도움이 되었나요? 의견을 알려 주세요.",
    "en": "Was this helpful? Share feedback."
  },
  "ai.feedback.positive": {
    "ko": "도움이 되었어요",
    "en": "Helpful"
  },
  "ai.feedback.negative": {
    "ko": "도움이 안 되었어요",
    "en": "Not helpful"
  }
}
```

## 5.10 Accessibility - 접근성

### Screen Reader Support (스크린 리더 지원)

```json
{
  "a11y.button.upload": {
    "ko": "파일 업로드 버튼",
    "en": "Upload file button"
  },
  "a11y.button.delete": {
    "ko": "삭제 버튼",
    "en": "Delete button"
  },
  "a11y.image.alt": {
    "ko": "채널 프로필 이미지",
    "en": "Channel profile image"
  }
}
```

### Loading States (로딩 상태)

```json
{
  "a11y.loading": {
    "ko": "로딩 중입니다. 잠시만 기다려 주세요.",
    "en": "Loading. Please wait."
  },
  "a11y.loading.complete": {
    "ko": "로딩이 완료되었습니다.",
    "en": "Loading complete."
  }
}
```

## Implementation Notes (구현 메모)

### ICU MessageFormat Examples

```json
{
  "file.upload.progress": {
    "ko": "업로드 중… {current, number} / {total, number}",
    "en": "Uploading… {current, number} / {total, number}"
  },
  "likes.count": {
    "ko": "좋아요 {count, number}개",
    "en": "{count, plural, one {1 like} other {# likes}}"
  }
}
```

### React Implementation Example

```tsx
import { useTranslations } from 'next-intl';

export default function CreateChannelCTA() {
  const t = useTranslations('channels.create');
  return <button aria-label={t('cta')}>{t('cta')}</button>;
}
```

## Review Checklist (검토 체크리스트)

Before using any microcopy, verify:

- [ ] Is the key naming consistent with our pattern?
- [ ] Does the Korean text use appropriate honorifics?
- [ ] Is the English text clear and concise?
- [ ] Does it match our brand voice?
- [ ] Is it accessible to all users?
- [ ] Does it work well in both languages?
- [ ] Are variables properly formatted for ICU?
