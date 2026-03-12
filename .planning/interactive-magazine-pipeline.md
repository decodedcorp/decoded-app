# Interactive Magazine Editor Pipeline

두 리포지토리 모두 수정:
- `decoded-agent` (Python/FastAPI, `../../decoded-agent/`)
- `decoded-app` (Next.js, 현재 워크스페이스)

---

## Phase 1: decoded-agent - step_messages 생성

### 1-1. metadata 구조 확장

`src/api/magazine_sessions.py`의 `_empty_metadata()`에 추가:

```python
def _empty_metadata() -> dict[str, Any]:
    return {
        # ... 기존 필드 유지 ...
        "step_messages": {},   # step별 Agent 생성 메시지
        "conversation": [],    # [{"role": "user"|"agent", "content": "..."}]
    }
```

### 1-2. step 완료 시 메시지 생성

각 `_do_*_step` 함수에서 `step_status = "pending_confirm"` 직전에, 결과 데이터 기반 메시지를 생성하여 `step_messages[step]`에 저장한다.

기존 intent agent (`src/intent/agent.py`)에 있는 Groq 기반 LLM 호출 패턴을 활용하여 새 함수 `generate_step_message(step, context)`를 만든다.

`src/api/magazine_sessions.py`에 추가:

```python
def _generate_step_message(step: str, meta: dict) -> str:
    """step 완료 후 사용자에게 보여줄 메시지 생성 (Groq, low latency)."""
    # context 추출 (step별로 다름)
    # Groq LLM 호출 → 한국어 1~2문장 반환
    # 실패 시 fallback 템플릿 반환
```

적용 위치 (5곳):
- `_do_vision_step`: images_json 저장 후 → `step_messages["vision"]`
- `_do_planner_step`: outline 저장 후 → `step_messages["planner"]`
- `_do_solution_search_step`: external_solutions 저장 후 → `step_messages["solution_search"]`
- `_do_writer_step`: sections 저장 후 → `step_messages["writer"]`
- `_do_designer_step`: layout_spec 저장 후 → `step_messages["designer"]`

---

## Phase 2: decoded-agent - 메시지 엔드포인트

### 2-1. POST /{session_id}/message 라우트

`src/api/magazine_sessions.py`에 새 엔드포인트 추가:

```python
class MessageRequest(BaseModel):
    content: str

@router.post("/{session_id}/message")
async def send_message(session_id: str, req: MessageRequest):
    """유저 메시지를 받아 intent 분류 후 적절한 처리."""
```

### 2-2. Intent 분류 + 라우팅

기존 `src/intent/agent.py`의 `classify_intent()`를 재활용.
Magazine pipeline 컨텍스트에 맞게 라우팅:

```
유저 메시지
    |
    v
classify_intent(message, conversation_history)
    |
    ├── "confirm"   → confirm_step 호출 → 다음 step 진행
    ├── "reject"    → revise_step 호출 → step_status = "revising"
    ├── "edit_magazine" → 현재 step 데이터 수정 (metadata 직접 수정)
    ├── "question"  → LLM으로 컨텍스트 기반 답변 생성
    └── "unclear"   → 의도 파악 불가 안내 메시지
```

### 2-3. 대화 기록

요청/응답을 `metadata.conversation`에 저장:

```python
conversation.append({"role": "user", "content": req.content})
conversation.append({"role": "agent", "content": agent_reply})
meta["conversation"] = conversation
```

Supabase Realtime이 metadata 변경을 감지하여 프론트가 자동 갱신됨.

### 2-4. edit_magazine intent 처리

현재 step에 따라 수정 가능 범위 결정:
- vision 단계: celebrity_name, group_name, item 정보 수정
- planner 단계: outline 수정
- solution_search 단계: 솔루션 추가/제거
- writer 단계: 섹션 수정
- designer 단계: 레이아웃 수정

LLM에 현재 metadata + 유저 요청을 전달하여 수정된 JSON을 반환받고 metadata에 반영.

---

## Phase 3: decoded-app - API 프록시

### 3-1. 새 프록시 라우트

`packages/web/app/api/v1/admin/magazine-sessions/[sessionId]/message/route.ts` 생성:

기존 `confirm/route.ts` 패턴을 따름 (ensureAdmin + AGENT_URL 프록시).

```typescript
// POST - decoded-agent /magazine-sessions/{sessionId}/message 프록시
export async function POST(request, { params }) {
  // ensureAdmin() + body 전달 + AGENT_URL 프록시
}
```

---

## Phase 4: decoded-app - 프론트엔드 연동

### 4-1. 타입 + Hook 추가

`packages/web/lib/hooks/admin/useMagazineSessions.ts`:

```typescript
// MagazineSession 타입에 추가
step_messages: Record<string, string>;
conversation: { role: "user" | "agent"; content: string }[];

// 새 hook
export function useSendMagazineMessage(sessionId: string) {
  // POST /api/v1/admin/magazine-sessions/{sessionId}/message
  // onSuccess: invalidateQueries
}
```

### 4-2. BotBubble 텍스트 교체

`packages/web/app/admin/magazines/[sessionId]/page.tsx`:

하드코딩 문구를 `step_messages` 기반으로 교체 (fallback 유지):

```tsx
// Before
<BotBubble>분석 결과를 확인해 주세요. 셀럽명과 아이템 정보를 수정할 수 있어요...</BotBubble>

// After  
<BotBubble>
  {session.step_messages?.vision ?? "분석 결과를 확인해 주세요. 셀럽명과 아이템 정보를 수정할 수 있어요..."}
</BotBubble>
```

적용 대상 (약 10곳의 하드코딩 문구).

### 4-3. 채팅 연동

`handleChatSubmit`을 백엔드 연동으로 변경:

```tsx
// Before: 프론트 state에만 저장
setUserMessages(prev => [...prev, text]);

// After: 백엔드로 전송 + Agent 응답 표시
sendMessage.mutate({ content: text }, {
  onSuccess: (data) => {
    // Agent 응답은 Realtime으로 session 갱신 시 conversation에서 읽음
  }
});
```

### 4-4. conversation 기반 대화 표시

기존 `userMessages` state를 `session.conversation`으로 교체:

```tsx
// Before
{userMessages.map((msg, i) => <UserBubble key={i}>{msg}</UserBubble>)}

// After
{(session.conversation ?? []).map((msg, i) => 
  msg.role === "user" 
    ? <UserBubble key={i}>{msg.content}</UserBubble>
    : <BotBubble key={i}>{msg.content}</BotBubble>
)}
```

---

## 변경 파일 요약

decoded-agent:
- `src/api/magazine_sessions.py` - step_messages 생성 + POST /message 엔드포인트
- `src/intent/agent.py` - 변경 없음 (기존 classify_intent 재활용)

decoded-app:
- `packages/web/app/api/v1/admin/magazine-sessions/[sessionId]/message/route.ts` - 신규 프록시
- `packages/web/lib/hooks/admin/useMagazineSessions.ts` - 타입 + useSendMagazineMessage hook
- `packages/web/app/admin/magazines/[sessionId]/page.tsx` - 채팅 연동 + Agent 응답 표시

---

## TODO (추적용)

- [ ] decoded-agent: _empty_metadata 확장 + _generate_step_message 함수 + 5개 step에 적용
- [ ] decoded-agent: POST /{session_id}/message 엔드포인트 (intent 분류 + 라우팅 + conversation 저장)
- [ ] decoded-app: /api/v1/admin/magazine-sessions/[sessionId]/message/route.ts 프록시 생성
- [ ] decoded-app: MagazineSession 타입 확장 + useSendMagazineMessage hook 추가
- [ ] decoded-app: BotBubble 텍스트 교체 + 채팅 백엔드 연동 + conversation 기반 대화 표시
