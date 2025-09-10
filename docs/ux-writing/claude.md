# Decoded UX Writing System - Claude Integration Guide

## Overview

This document provides a comprehensive overview of the Decoded App's UX writing system, designed for AI assistant integration. The system establishes consistent, accessible, and user-friendly text standards for Korean/English bilingual interfaces.

## Core Philosophy

### 1. User-Centered Communication

- Write from the user's perspective, not the system's
- Anticipate user questions and provide clear answers
- Use language that matches the user's mental model

### 2. Clarity Above All

- Use simple, everyday words
- Avoid jargon and technical terms when possible
- Be specific rather than vague
- One idea per sentence

### 3. Consistency

- Use the same words for the same concepts
- Follow established patterns
- Maintain consistent tone across all touchpoints

### 4. Trust & Honesty

- Be transparent about limitations and costs
- Avoid unfounded confidence
- Provide clear information about AI usage

## Brand Voice & Tone

### Korean Voice

- **Style**: "명확하고 공손한 안내자" (Clear and polite guide)
- **Honorifics**: Use -요체 consistently, avoid excessive 존댓말
- **Tone**: Calm, professional, warm helper
- **Avoid**: Complex Chinese characters, excessive honorifics, casual speech

### English Voice

- **Style**: "Friendly expert"
- **Tone**: Short, direct, positive
- **Grammar**: Use Oxford comma, allow contractions, active voice
- **Avoid**: Jargon, passive voice, overly formal language

## Terminology Standards

### Core Terms (Single Source of Truth)

| Korean   | English  | Notes                        |
| -------- | -------- | ---------------------------- |
| 로그인   | Log in   | Not "Sign in"                |
| 회원가입 | Sign up  | Not "Register"               |
| 계정     | Account  | For user data                |
| 프로필   | Profile  | For user information display |
| 저장     | Save     | Not "Store"                  |
| 취소     | Cancel   | Not "Discard"                |
| 계속     | Continue | Not "Proceed"                |
| 이미지   | Image    | Not "Picture"                |
| 파일     | File     | For generic uploads          |
| 업로드   | Upload   | Not "Add"                    |
| 다운로드 | Download | Not "Save"                   |

### Product-Specific Terms

| Korean      | English        | Context               |
| ----------- | -------------- | --------------------- |
| 채널        | Channel        | Community unit        |
| 채널 만들기 | Create channel | Button/title          |
| 콘텐츠      | Content        | Images/links included |
| 링크        | Link           | URL-based content     |
| 요약        | Summary        | AI-generated result   |
| 좋아요      | Like           | Heart icon            |
| 탐색        | Explore        | Browse more           |

## Text Length Guidelines

### Buttons and Actions

- **Primary actions**: 1-3 words
- **Secondary actions**: 1-4 words
- **Destructive actions**: 1-3 words
- **Icon buttons**: 1-2 words (if text present)

### Form Elements

- **Field labels**: 1-2 words
- **Help text**: 1-2 sentences
- **Error messages**: 1-2 sentences

### Messages and Feedback

- **Success messages**: 1-2 sentences
- **Warning messages**: 1-2 sentences
- **Info messages**: 1-2 sentences

## Common Patterns

### Error Handling Pattern

```
Problem + Cause (optional) + Solution + Action

Korean: "업로드에 실패했어요. 파일을 확인하고 다시 시도해 주세요."
English: "Upload failed. Check your file and try again."
```

### Success Message Pattern

```
Confirmation + Impact + Next step

Korean: "변경사항이 저장되었어요. 프로필이 업데이트되었어요."
English: "Changes saved successfully. Your profile has been updated."
```

### Empty State Pattern

```
Situation + One-sentence help + Main CTA

Korean: "아직 채널이 없어요. 관심사를 모아보세요. 채널 만들기"
English: "No channels yet. Gather what you love. Create channel"
```

### Loading State Pattern

```
Specific action + Progress (optional) + Expected time (optional)

Korean: "업로드하는 중… 3개 중 2개 완료"
English: "Uploading… 2 of 3 complete"
```

## Button Text Guidelines

### Primary Actions

- "저장" / "Save"
- "계속" / "Continue"
- "시작하기" / "Get Started"
- "로그인" / "Log in"
- "채널 만들기" / "Create channel"

### Secondary Actions

- "취소" / "Cancel"
- "뒤로" / "Back"
- "건너뛰기" / "Skip"
- "더 알아보기" / "Learn More"

### Destructive Actions

- "삭제" / "Delete"
- "제거" / "Remove"
- "모두 지우기" / "Clear All"

### Avoid These Patterns

- Generic terms: "제출" / "Submit", "확인" / "OK"
- Technical terms: "실행" / "Execute", "처리" / "Process"
- Ambiguous terms: "가기" / "Go", "하기" / "Do"

## Form Text Guidelines

### Field Labels

- Be specific: "이메일 주소" not "이메일" / "Email address" not "Email"
- Be clear: "전체 이름" not "이름" / "Full name" not "Name"
- Be consistent: Use the same label style throughout
- Be helpful: "비밀번호 (최소 8자)" not "비밀번호" / "Password (minimum 8 characters)" not "Password"

### Required/Optional Indicators

- **Required**: Use asterisk (\*) or "필수" / "Required"
- **Optional**: Use "(선택사항)" or "(비워두어도 됨)" / "(Optional)" or "(Leave blank if not applicable)"
- **Placement**: After the label
- **Consistency**: Use the same indicator throughout

### Help Text Guidelines

- **Length**: 1-2 sentences maximum
- **Purpose**: Explain what's needed and why
- **Examples**: Provide examples when helpful
- **Context**: Explain why the information is needed

## Error Message Guidelines

### Structure Requirements

1. **Problem**: What went wrong
2. **Cause**: Why it happened (if helpful)
3. **Solution**: What the user can do
4. **Action**: Specific steps to fix it

### Message Patterns

- **Validation**: "올바른 [필드명]을(를) 입력해 주세요" / "Please enter a valid [field name]"
- **Network**: "[액션]할 수 없어요. 연결을 확인해 주세요" / "Unable to [action]. Please check your connection"
- **Permission**: "[액션]할 권한이 없어요" / "You don't have permission to [action]"
- **System**: "문제가 발생했어요. 다시 시도해 주세요" / "Something went wrong. Please try again"

### Avoid These Patterns

- Generic messages: "오류" / "Error", "잘못된 입력" / "Invalid input"
- Technical jargon: "HTTP 500" / "HTTP 500", "데이터베이스 연결 실패" / "Database connection failed"
- Blaming language: "잘못된 비밀번호를 입력하셨습니다" / "You entered the wrong password"

## Accessibility Guidelines

### Screen Reader Support

- Use descriptive alt text for images
- Provide context for interactive elements
- Use proper heading hierarchy
- Include ARIA labels when necessary

### Language Accessibility

- Use simple sentence structures
- Avoid complex vocabulary
- Provide clear instructions
- Use consistent terminology

### Visual Accessibility

- Ensure sufficient color contrast
- Use clear, readable fonts
- Provide text alternatives for icons
- Use meaningful link text

## AI & Transparency Guidelines

### AI Disclosure Patterns

- **Inline**: "이 요약은 AI가 생성했어요. 부정확할 수 있어요." / "This summary is generated by AI and may be inaccurate."
- **Detailed**: "AI가 자동으로 생성한 내용이에요. 정확성을 보장하지 않습니다." / "This content is automatically generated by AI. Accuracy is not guaranteed."

### AI Action Patterns

- **Regeneration**: "다시 생성" / "Regenerate"
- **Feedback**: "도움이 되었나요? 의견을 알려 주세요." / "Was this helpful? Share feedback."
- **Settings**: "AI 기능 사용" / "Enable AI features"

### Privacy & Data Usage

- Always provide links to privacy policy
- Specify data usage scope
- Explain data retention periods
- Offer user control options

## Microcopy Library Structure

### Key Naming Convention

```
area.feature.element.state

Examples:
- channels.create.cta
- auth.login.cta
- error.file.too_large
- toast.upload.success
```

### Implementation Format

```json
{
  "key.name": {
    "ko": "한국어 텍스트",
    "en": "English text"
  }
}
```

### ICU MessageFormat Support

```json
{
  "likes.count": {
    "ko": "좋아요 {count}개",
    "en": "{count, plural, one {1 like} other {# likes}}"
  }
}
```

## Quality Assurance

### Review Checklist

Before publishing any user-facing text, verify:

- [ ] Is the terminology consistent with our bilingual glossary?
- [ ] Are button texts clear and actionable in both languages?
- [ ] Do form labels provide clear guidance to users?
- [ ] Are error messages specific and helpful?
- [ ] Is the text accessible to all users?
- [ ] Does the tone match our brand voice guidelines?
- [ ] Are text lengths appropriate for their context?
- [ ] Does the Korean text use appropriate honorifics?
- [ ] Does the English text use sentence case and active voice?
- [ ] Do both languages convey the same meaning and tone?

### Testing Guidelines

- Test with real users to ensure clarity
- Verify that button text matches user expectations
- Check that actions are clear and unambiguous
- Test with screen readers for accessibility
- Validate keyboard navigation
- Check color contrast and readability

## Implementation Notes

### React Integration Example

```tsx
import { useTranslations } from 'next-intl';

export default function CreateChannelCTA() {
  const t = useTranslations('channels.create');
  return <button aria-label={t('cta')}>{t('cta')}</button>;
}
```

### Git Workflow

```bash
# New copy work
git checkout -b feature/ux-copy-channels-empty-state

# Commit changes
git commit -m "feat(ux-copy): add empty state for channels

- Add Korean/English empty state messages
- Update i18n keys for channel empty states
- Include accessibility labels

[ux-copy] [i18n]"
```

## Key Resources

### Documentation Files

- `guidelines.md` - Core UX writing principles and tone
- `terminology.md` - Korean/English terminology glossary
- `patterns/microcopy-library.md` - Microcopy pattern library
- `components/buttons.md` - Button-specific guidelines
- `components/forms.md` - Form-specific guidelines
- `patterns/error-handling.md` - Error message patterns
- `accessibility.md` - Accessibility-focused writing guide
- `ai-transparency.md` - AI-related disclosure guidelines
- `process-governance.md` - Process and governance structure

### External Resources

- **Korean**: 국립국어원, 표준국어대사전
- **English**: AP Stylebook, Chicago Manual of Style
- **Accessibility**: WCAG 2.1, Section 508
- **Localization**: Unicode, CLDR

## Success Metrics

### Short-term Goals

- Copy consistency score: 95%+
- User feedback score: 4.0/5.0+
- Accessibility score: 90%+
- Error reduction rate: 20%+

### Long-term Goals

- Conversion rate improvement: 15%
- User satisfaction improvement: 25%
- Development efficiency improvement: 30%
- Brand recognition improvement: 40%

## Continuous Improvement

### Feedback Loops

1. **User Feedback**: Regular user surveys
2. **Team Feedback**: Quarterly team retrospectives
3. **Data Analysis**: Monthly performance analysis
4. **External Review**: Annual expert review

### Learning & Development

- **Education**: Quarterly UX writing workshops
- **Research**: Annual user behavior studies
- **Benchmarking**: Competitor analysis and benchmarking
- **Innovation**: New tools and methodology adoption

---

This guide serves as the foundation for all UX writing decisions in the Decoded App. It should be referenced whenever creating, reviewing, or updating user-facing text to ensure consistency, accessibility, and user-centered communication across both Korean and English interfaces.
