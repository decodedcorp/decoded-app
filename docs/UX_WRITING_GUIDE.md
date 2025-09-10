# UX Writing Guide - Localization Implementation Plan

## Current State Analysis

### Korean Text Audit Summary
After analyzing the codebase, I found **~150+ hardcoded Korean strings** across multiple domains:

#### Text Categories by Domain:
- **Authentication**: Login errors, status messages
- **Channel Management**: Creation, updates, validation messages  
- **Content Display**: Metadata, loading states, error handling
- **User Interactions**: Like/unlike feedback, form validation
- **Image Processing**: Size analysis, compression recommendations
- **Navigation**: Button labels, tooltips, sidebar labels

#### Text Type Classification:
1. **User-facing Messages** (85%): Buttons, alerts, form placeholders
2. **System Feedback** (10%): Loading states, error messages  
3. **Developer Logs** (5%): Console messages, debug info

## UX Writing Standards

### Voice & Tone Guidelines

#### Korean Voice Characteristics:
- **Respectful but Friendly**: 존댓말 with warmth (요 ending)
- **Clear & Concise**: Direct communication without excessive formality
- **Helpful**: Solution-oriented error messages
- **Consistent**: Same tone across all user touchpoints

#### Examples:
```javascript
// ❌ Current inconsistent patterns
"로그인에 실패했습니다" (formal)
"채널 업데이트" (informal)
"잠시 후 다시 시도해 주세요" (polite)

// ✅ Standardized tone
"로그인할 수 없어요" (consistent friendly tone)
"채널을 업데이트해요" 
"잠시 후 다시 시도해주세요"
```

### Message Categories & Patterns

#### 1. Interactive Elements
```javascript
// Buttons
create: "만들기"
update: "수정하기" 
delete: "삭제하기"
save: "저장하기"
cancel: "취소하기"

// Navigation
back: "뒤로가기"
next: "다음"
close: "닫기"
```

#### 2. Status Messages
```javascript
// Loading states
loading: "불러오는 중이에요..."
uploading: "업로드하고 있어요..."
processing: "처리하고 있어요..."

// Success states  
success: "완료되었어요!"
saved: "저장되었어요!"
updated: "수정되었어요!"

// Error states
error: "문제가 발생했어요"
networkError: "네트워크 연결을 확인해주세요"
tryAgain: "다시 시도해주세요"
```

#### 3. Form & Validation
```javascript
// Placeholders
channelName: "채널 이름을 입력해주세요"
description: "설명을 입력해주세요"
searchPlaceholder: "검색어를 입력해주세요"

// Validation
required: "필수 입력 항목이에요"
invalidFormat: "형식이 올바르지 않아요"
tooLong: "너무 길어요"
tooShort: "너무 짧아요"
```

#### 4. Content Metadata
```javascript
// Time expressions
justNow: "방금 전"
hoursAgo: (hours) => `${hours}시간 전`
yesterday: "어제"
daysAgo: (days) => `${days}일 전`

// Content states
noTitle: "제목 없음"
noDescription: "설명 없음"
noContent: "콘텐츠가 없어요"
```

## Localization Implementation Strategy

### Phase 1: Infrastructure Setup

#### 1.1 Install i18n Dependencies
```bash
yarn add next-i18next react-i18next i18next
```

#### 1.2 Directory Structure
```
src/
├── locales/
│   ├── ko/
│   │   ├── common.json       # Buttons, navigation
│   │   ├── auth.json         # Authentication
│   │   ├── channels.json     # Channel management
│   │   ├── content.json      # Content display
│   │   ├── forms.json        # Form validation
│   │   └── errors.json       # Error messages
│   └── en/
│       ├── common.json
│       ├── auth.json
│       ├── channels.json
│       ├── content.json
│       ├── forms.json
│       └── errors.json
├── lib/
│   └── i18n/
│       ├── config.ts         # i18n configuration
│       ├── resources.ts      # Resource loading
│       └── hooks.ts          # Custom hooks
```

#### 1.3 Configuration Files
```typescript
// src/lib/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    common: require('@/locales/ko/common.json'),
    auth: require('@/locales/ko/auth.json'),
    channels: require('@/locales/ko/channels.json'),
    content: require('@/locales/ko/content.json'),
    forms: require('@/locales/ko/forms.json'),
    errors: require('@/locales/ko/errors.json'),
  },
  en: {
    // English translations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
```

### Phase 2: Text Extraction & Organization

#### 2.1 Priority Order (High → Low Impact)
1. **Authentication Flow** (15 strings)
2. **Channel Management** (25 strings)  
3. **Content Display** (35 strings)
4. **Form Validation** (20 strings)
5. **Navigation & UI** (30 strings)
6. **Error Handling** (25 strings)

#### 2.2 JSON Structure Example
```json
// locales/ko/channels.json
{
  "actions": {
    "create": "채널 만들기",
    "update": "채널 수정하기",
    "delete": "채널 삭제하기"
  },
  "placeholders": {
    "name": "채널 이름을 입력해주세요",
    "description": "채널 설명을 입력해주세요"
  },
  "status": {
    "creating": "채널을 만들고 있어요...",
    "updating": "채널을 수정하고 있어요...",
    "success": "채널이 {{action}}되었어요!",
    "error": "채널 {{action}} 중 문제가 발생했어요"
  },
  "validation": {
    "nameRequired": "채널 이름을 입력해주세요",
    "nameTooLong": "채널 이름이 너무 길어요 (최대 {{max}}자)",
    "descriptionTooLong": "설명이 너무 길어요 (최대 {{max}}자)"
  }
}
```

### Phase 3: Component Migration Strategy

#### 3.1 Custom Hook Pattern
```typescript
// src/lib/i18n/hooks.ts
import { useTranslation } from 'react-i18next';

export const useChannelTranslation = () => {
  const { t } = useTranslation('channels');
  
  return {
    actions: {
      create: () => t('actions.create'),
      update: () => t('actions.update'),
      delete: () => t('actions.delete'),
    },
    status: {
      creating: () => t('status.creating'),
      success: (action: string) => t('status.success', { action }),
      error: (action: string) => t('status.error', { action }),
    },
    validation: {
      nameRequired: () => t('validation.nameRequired'),
      nameTooLong: (max: number) => t('validation.nameTooLong', { max }),
    }
  };
};
```

#### 3.2 Component Migration Example
```typescript
// Before: hardcoded Korean
const ChannelForm = () => {
  return (
    <button>
      {isUpdating ? '업데이트 중...' : '채널 업데이트'}
    </button>
  );
};

// After: localized
const ChannelForm = () => {
  const { status, actions } = useChannelTranslation();
  
  return (
    <button>
      {isUpdating ? status.creating() : actions.update()}
    </button>
  );
};
```

## File-by-File Migration Plan

### High Priority Files (Week 1)
1. **`src/domains/auth/components/LoginForm.tsx`**
   - 5 hardcoded strings
   - Critical user flow
   
2. **`src/store/authStore.ts`**
   - 2 error messages
   - Core authentication

3. **`src/domains/channels/components/modal/channel/EditableImage.tsx`**
   - 2 button labels
   - Frequently used component

### Medium Priority Files (Week 2)
4. **`src/domains/channels/components/trending/`**
   - Loading states, error messages
   - 8 strings across 3 files

5. **`src/domains/channels/components/common/LoadingStates.tsx`**
   - Reusable component
   - 4 strings

6. **`src/lib/utils/toastUtils.ts`**
   - Error handling utility
   - 1 fallback message

### Lower Priority Files (Week 3-4)
7. **Test and development files**
8. **Console logs and debug messages**
9. **Placeholder content**

## Quality Assurance Guidelines

### 1. Translation Quality Checklist
- [ ] Consistent tone across all text
- [ ] Proper Korean grammar and spacing
- [ ] Context-appropriate formality level
- [ ] No truncation in UI elements
- [ ] Proper interpolation for dynamic content

### 2. Technical Validation
- [ ] All keys follow naming convention
- [ ] No missing translations
- [ ] Fallback language works
- [ ] Dynamic interpolation functions correctly
- [ ] No hardcoded strings remain

### 3. User Experience Testing
- [ ] Text fits in UI elements
- [ ] Error messages are helpful
- [ ] Loading states are clear
- [ ] Success feedback is satisfying
- [ ] Navigation is intuitive

## Implementation Timeline

### Week 1: Foundation
- Set up i18n infrastructure
- Create translation files structure
- Migrate authentication flow

### Week 2: Core Features  
- Channel management components
- Content display components
- Form validation messages

### Week 3: Polish
- Navigation and UI elements
- Error handling improvements
- Edge case coverage

### Week 4: Quality Assurance
- Comprehensive testing
- User feedback collection
- Performance optimization

## Future Considerations

### English Localization Prep
- Keep key names descriptive and logical
- Use interpolation for dynamic content
- Design flexible layouts for longer text
- Plan for RTL languages if needed

### Maintenance Strategy
- Translation key linting rules
- Automated missing key detection
- Regular UX writing review cycles
- Community contribution guidelines

---

*This guide ensures consistent, user-friendly Korean text while preparing for future multilingual support.*