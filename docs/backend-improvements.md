# Backend API Improvements

## Overview

현재 프론트엔드에서 발생하는 성능 및 사용자 경험 문제들을 해결하기 위한 백엔드 API 개선사항들을 정리합니다.

## ⚠️ AI 콘텐츠 생성과 관련된 요청 배경

- 현재 콘텐츠 생성은 비동기 + 비예측적인 AI 작업이 포함되어 있음
- 프론트에서 완료 시점을 감지할 수 없기 때문에 무조건 3초 폴링을 반복 중
- 유저는 "왜 이건 늦게 뜨는지" 모르는 상태로 대기하게 됨

**➡ 해결방안: 콘텐츠별 status 값을 백엔드에서 명시적으로 제공하면, UX/성능 모두 개선됩니다**

## Current Issues

### 1. Content Status Missing in API Response

**문제**: `ContentsService.getContentsByChannelContentsChannelChannelIdGet` API 응답에 `status`와 `processing_status` 필드가 포함되지 않음

**영향**:

- 프론트엔드에서 콘텐츠 상태를 정확히 표시할 수 없음
- AI 처리 완료 여부를 실시간으로 확인할 수 없음
- 사용자가 콘텐츠 상태를 제대로 인지하지 못함

**현재 임시 해결책**: 프론트엔드에서 `ai_gen_metadata` 존재 여부로 상태를 추론

### 2. Continuous Polling Performance Issues

**문제**: AI 처리 중인 콘텐츠가 있을 때 3초마다 전체 채널 콘텐츠를 폴링

**영향**:

- 불필요한 네트워크 트래픽 증가
- 서버 리소스 낭비
- 프론트엔드 성능 저하
- 사용자 경험 저하 (빈번한 로딩 상태)

### 3. No Real-time Status Updates

**문제**: AI 처리 상태 변경을 실시간으로 알 수 없음

**영향**:

- 사용자가 AI 처리 완료를 기다려야 함
- 수동 새로고침 필요
- 불확실한 대기 시간

## Proposed Solutions

### 1. API Response Enhancement

#### 1.1 Add Status Fields to Content API

```typescript
// Current API Response
{
  "contents": [
    {
      "id": "688b68b6884d91959a9a8df3",
      "channel_id": "688a317213dbcfcd941c85b4",
      "provider_id": "68889a93c623bd789721d101",
      "url": "https://example.com",
      "ai_gen_metadata": { ... },
      "created_at": "2025-07-31T12:59:34.578000",
      "updated_at": "2025-07-31T12:59:40.014000"
    }
  ]
}

// Improved API Response
{
  "contents": [
    {
      "id": "688b68b6884d91959a9a8df3",
      "channel_id": "688a317213dbcfcd941c85b4",
      "provider_id": "68889a93c623bd789721d101",
      "url": "https://example.com",
      "status": "complete", // ✅ 추가
      "processing_status": "completed", // ✅ 추가
      "ai_gen_metadata": { ... },
      "created_at": "2025-07-31T12:59:34.578000",
      "updated_at": "2025-07-31T12:59:40.014000"
    }
  ]
}
```

#### 1.2 Status Field Definitions

```typescript
// Content Status Enum - AI 생성 타이밍 대응을 위한 명확한 상태 구분
enum ContentStatus {
  IDLE = 'idle', // 초기 상태 (업로드 완료, AI 처리 대기)
  GENERATING = 'generating', // AI 생성 중
  COMPLETE = 'complete', // AI 생성 완료
  ERROR = 'error', // AI 생성 실패
}

// Processing Status Enum - 세부 처리 단계 구분
enum ProcessingStatus {
  UPLOADING = 'uploading', // 콘텐츠 업로드 중
  SUMMARIZING = 'summarizing', // AI 요약 생성 중
  QA_GENERATING = 'qa_generating', // AI Q&A 생성 중
  COMPLETED = 'completed', // 모든 처리 완료
  FAILED = 'failed', // 처리 실패
}

// 백엔드 개발자를 위한 명확한 필드 정의
interface ContentStatus {
  status: 'idle' | 'generating' | 'complete' | 'error';
  processing_status?: 'uploading' | 'summarizing' | 'qa_generating' | 'completed' | 'failed';
}
```

### 2. Optimized Polling Strategy

#### 2.1 Dedicated Status Check Endpoint

```typescript
// New API Endpoint
GET /api/contents/{channel_id}/status

// Response - 백엔드가 "무엇을 반환해야 하는지" 빠르게 파악 가능
{
  "processing_contents": [
    {
      "id": "688b68b6884d91959a9a8df3",
      "status": "generating",
      "processing_status": "summarizing",
      "estimated_completion": "2025-07-31T13:00:00.000Z"
    }
  ],
  "completed_contents": [
    {
      "id": "688b68b6884d91959a9a8df4",
      "status": "complete",
      "processing_status": "completed"
    }
  ],
  "has_processing": true,
  "total_processing": 2,
  "total_completed": 1
}

// 간단한 상태 조회 응답 (배치 처리용)
GET /api/contents/{channel_id}/status
→ 응답: [
  { id: string, status: 'idle' | 'generating' | 'complete' | 'error' }
]
```

#### 2.2 Batch Status Update Endpoint

```typescript
// New API Endpoint
POST /api/contents/status/batch

// Request Body
{
  "content_ids": ["688b68b6884d91959a9a8df3", "688b68b6884d91959a9a8df4"]
}

// Response
{
  "statuses": [
    {
      "id": "688b68b6884d91959a9a8df3",
      "status": "complete",
      "processing_status": "completed"
    },
    {
      "id": "688b68b6884d91959a9a8df4",
      "status": "generating",
      "processing_status": "summarizing"
    }
  ]
}
```

### 3. Real-time Updates

#### 3.1 Implementation Feasibility Assessment

**백엔드 기술 스택별 접근법**:

| 백엔드 프레임워크 | WebSocket 지원  | SSE 지원           | 추천 방식                |
| ----------------- | --------------- | ------------------ | ------------------------ |
| FastAPI           | ✅ `websockets` | ✅ `sse-starlette` | WebSocket 우선, SSE 대안 |
| Express.js        | ✅ `socket.io`  | ✅ `express-sse`   | WebSocket 우선, SSE 대안 |
| Django            | ✅ `channels`   | ✅ `django-sse`    | WebSocket 우선, SSE 대안 |
| Spring Boot       | ✅ `WebSocket`  | ✅ `SseEmitter`    | WebSocket 우선, SSE 대안 |

**인프라 요구사항**:

- **WebSocket**: 연결 유지, Redis PubSub 또는 메모리 기반 이벤트 브로드캐스트
- **SSE**: HTTP 기반, 기존 인프라 변경 최소화
- **스케일링**: 동시 연결 수에 따른 서버 리소스 고려

#### 3.2 Hybrid Strategy (단계별 접근)

**Phase 2A: SSE (Server-Sent Events) - 권장 우선 구현**

```typescript
// SSE Endpoint - 구현이 단순하고 인프라 변경 최소화
GET /api/contents/{channel_id}/events

// Response Headers
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

// Event Stream Examples
event: content_status_update
data: {
  "content_id": "688b68b6884d91959a9a8df3",
  "status": "generating",
  "processing_status": "summarizing",
  "timestamp": "2025-07-31T13:00:00.000Z"
}

event: processing_complete
data: {
  "content_id": "688b68b6884d91959a9a8df3",
  "status": "complete",
  "processing_status": "completed",
  "ai_gen_metadata": {
    "summary": "AI 생성된 요약...",
    "qa_list": [...]
  },
  "timestamp": "2025-07-31T13:02:30.000Z"
}

event: processing_error
data: {
  "content_id": "688b68b6884d91959a9a8df3",
  "status": "error",
  "error_message": "AI 처리 중 오류 발생",
  "timestamp": "2025-07-31T13:01:15.000Z"
}
```

**Phase 2B: WebSocket (장기 목표)**

```typescript
// WebSocket Connection
// ws://your-domain/api/contents/{channel_id}/ws

// Connection Message
{
  "type": "subscribe",
  "channel_id": "688a317213dbcfcd941c85b4",
  "user_id": "68889a93c623bd789721d101"
}

// Server Response
{
  "type": "subscribed",
  "channel_id": "688a317213dbcfcd941c85b4",
  "timestamp": "2025-07-31T13:00:00.000Z"
}

// Real-time Events
{
  "type": "content_status_update",
  "data": {
    "content_id": "688b68b6884d91959a9a8df3",
    "status": "generating",
    "processing_status": "summarizing",
    "progress": 45, // 진행률 (0-100)
    "estimated_completion": "2025-07-31T13:02:30.000Z"
  }
}

{
  "type": "processing_complete",
  "data": {
    "content_id": "688b68b6884d91959a9a8df3",
    "status": "complete",
    "processing_status": "completed",
    "ai_gen_metadata": {
      "summary": "AI 생성된 요약...",
      "qa_list": [...]
    },
    "completed_at": "2025-07-31T13:02:30.000Z"
  }
}
```

#### 3.3 Backend Implementation Examples

**FastAPI + SSE 예시**:

```python
from fastapi import FastAPI, Request
from sse_starlette.sse import EventSourceResponse
import asyncio
import json

app = FastAPI()

@app.get("/api/contents/{channel_id}/events")
async def content_events(channel_id: str, request: Request):
    async def event_generator():
        while True:
            if await request.is_disconnected():
                break

            # Redis PubSub 또는 메모리 기반 이벤트 체크
            events = await get_content_events(channel_id)

            for event in events:
                yield {
                    "event": event["type"],
                    "data": json.dumps(event["data"])
                }

            await asyncio.sleep(1)  # 1초마다 체크

    return EventSourceResponse(event_generator())
```

**Express.js + Socket.IO 예시**:

```javascript
const express = require('express');
const { Server } = require('socket.io');
const app = express();

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('subscribe', (data) => {
    const { channel_id, user_id } = data;
    socket.join(`channel:${channel_id}`);

    socket.emit('subscribed', {
      channel_id,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// AI 처리 완료 시 이벤트 브로드캐스트
function broadcastContentUpdate(channel_id, content_id, status, metadata) {
  io.to(`channel:${channel_id}`).emit('content_status_update', {
    content_id,
    status,
    processing_status: status === 'complete' ? 'completed' : 'processing',
    ai_gen_metadata: metadata,
    timestamp: new Date().toISOString(),
  });
}
```

#### 3.4 Frontend Integration Strategy

**React Query + Real-time Updates 통합**:

```typescript
// hooks/useContentEvents.ts
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';

export const useContentEvents = (channelId: string) => {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!channelId) return;

    // SSE 연결
    const eventSource = new EventSource(`/api/contents/${channelId}/events`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // React Query 캐시 업데이트
      queryClient.setQueryData(queryKeys.contents.byChannel(channelId), (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          contents: oldData.contents.map((content: any) =>
            content.id === data.content_id ? { ...content, ...data } : content,
          ),
        };
      });
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      // 재연결 로직
      setTimeout(() => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          // 재연결 시도
        }
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [channelId, queryClient]);

  return { eventSource: eventSourceRef.current };
};

// WebSocket 클라이언트 (장기 목표)
export const useContentWebSocket = (channelId: string) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!channelId) return;

    const socket = new WebSocket(`ws://your-domain/api/contents/${channelId}/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'subscribe',
          channel_id: channelId,
          user_id: getCurrentUserId(),
        }),
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'content_status_update':
          // 캐시 업데이트 로직
          break;
        case 'processing_complete':
          // 완료 시 전체 리페치
          queryClient.invalidateQueries({
            queryKey: queryKeys.contents.byChannel(channelId),
          });
          break;
      }
    };

    return () => {
      socket.close();
    };
  }, [channelId, queryClient]);

  return { socket: socketRef.current };
};
```

#### 3.5 Fallback Strategy (폴링 + Real-time)

```typescript
// hooks/useContentStatus.ts
export const useContentStatus = (channelId: string, enableRealTime = true) => {
  const queryClient = useQueryClient();

  // Real-time 이벤트 구독 (우선)
  const { eventSource } = useContentEvents(channelId);

  // 폴링 (fallback)
  const { data: statusData } = useQuery({
    queryKey: [...queryKeys.contents.byChannel(channelId), 'status'],
    queryFn: () => fetchContentStatus(channelId),
    enabled: !enableRealTime, // Real-time 비활성화 시에만 폴링
    refetchInterval: 5000, // 5초마다 (Real-time 대비 느림)
    refetchIntervalInBackground: false,
  });

  return {
    statusData,
    isRealTime: enableRealTime && !!eventSource,
  };
};
```

#### 3.6 Performance Considerations

**SSE vs WebSocket 비교**:

| 항목            | SSE                          | WebSocket               |
| --------------- | ---------------------------- | ----------------------- |
| 구현 복잡도     | 낮음                         | 중간                    |
| 인프라 요구사항 | HTTP 기반 (기존 인프라 활용) | 연결 유지 (추가 리소스) |
| 방향성          | 서버 → 클라이언트 (단방향)   | 양방향                  |
| 재연결          | 자동 (브라우저 지원)         | 수동 구현 필요          |
| 확장성          | HTTP 로드밸런서 활용 가능    | Sticky session 필요     |

**권장 구현 순서**:

1. **Phase 2A**: SSE 구현 (빠른 성과, 낮은 리스크)
2. **Phase 2B**: WebSocket 도입 (장기적 확장성)
3. **Fallback**: 폴링 + Real-time 하이브리드

#### 3.7 Error Handling & Resilience

```typescript
// Real-time 연결 실패 시 폴링으로 자동 전환
export const useContentStatusWithFallback = (channelId: string) => {
  const [realTimeFailed, setRealTimeFailed] = useState(false);

  const { eventSource } = useContentEvents(channelId);

  useEffect(() => {
    if (eventSource) {
      eventSource.onerror = () => {
        setRealTimeFailed(true);
        console.warn('Real-time connection failed, falling back to polling');
      };
    }
  }, [eventSource]);

  // Real-time 실패 시 폴링 활성화
  const { data: statusData } = useQuery({
    queryKey: [...queryKeys.contents.byChannel(channelId), 'status'],
    queryFn: () => fetchContentStatus(channelId),
    enabled: realTimeFailed,
    refetchInterval: realTimeFailed ? 3000 : false,
  });

  return {
    statusData,
    isRealTime: !realTimeFailed && !!eventSource,
    realTimeFailed,
  };
};
```

### 4. Caching Strategy

#### 4.1 Redis Caching

```typescript
// Cache Keys
const CACHE_KEYS = {
  CHANNEL_CONTENTS: `channel:${channelId}:contents`,
  CONTENT_STATUS: `content:${contentId}:status`,
  PROCESSING_STATUS: `channel:${channelId}:processing`,
};

// Cache TTL
const CACHE_TTL = {
  CONTENTS: 300, // 5 minutes
  STATUS: 30, // 30 seconds
  PROCESSING: 10, // 10 seconds
};
```

#### 4.2 Database Indexing

```sql
-- Add indexes for better query performance
CREATE INDEX idx_contents_channel_status ON contents(channel_id, status);
CREATE INDEX idx_contents_processing_status ON contents(processing_status);
CREATE INDEX idx_contents_updated_at ON contents(updated_at);
```

## Implementation Priority

### Phase 1: Critical (Immediate)

1. **Add status fields to existing API**

   - `status` 필드 추가
   - `processing_status` 필드 추가
   - 기존 API 호환성 유지

2. **Optimize polling strategy**

   - 상태 전용 엔드포인트 생성
   - 배치 상태 업데이트 엔드포인트 생성
   - 폴링 간격 최적화

### Phase 2: Important (Next Sprint)

3. **Implement caching**

   - Redis 캐싱 도입
   - 데이터베이스 인덱싱 최적화
   - 캐시 무효화 전략

### Phase 3: Enhancement (Future)

4. **Real-time updates**

   - WebSocket 또는 SSE 도입
   - 실시간 상태 업데이트
   - 푸시 알림 기능

## API Documentation Updates

### Updated Content API Response Schema

```typescript
interface ContentResponse {
  id: string;
  channel_id: string;
  provider_id: string;
  url?: string;
  img_url?: string;
  video_url?: string;
  title?: string;
  description?: string;
  category?: string;
  status: ContentStatus; // ✅ Required - AI 생성 타이밍 대응
  processing_status: ProcessingStatus; // ✅ Required - 세부 처리 단계
  ai_gen_metadata?: {
    summary?: string;
    qa_list?: Array<{
      question: string;
      answer: string;
    }>;
  };
  link_preview_metadata?: {
    title?: string;
    description?: string;
    image_url?: string;
    site_name?: string;
  };
  created_at: string;
  updated_at: string;
}
```

### New Status Check API

```typescript
// GET /api/contents/{channel_id}/status
interface ChannelStatusResponse {
  processing_contents: Array<{
    id: string;
    status: ContentStatus;
    processing_status: ProcessingStatus;
    estimated_completion?: string;
  }>;
  completed_contents: Array<{
    id: string;
    status: ContentStatus;
    processing_status: ProcessingStatus;
  }>;
  has_processing: boolean;
  total_processing: number;
  total_completed: number;
}
```

## Performance Benefits

### Before Improvements

- **API Calls**: 3초마다 전체 채널 콘텐츠 조회 (25개 항목)
- **Data Transfer**: ~50KB per request
- **Server Load**: 높은 데이터베이스 쿼리 부하
- **User Experience**: 불확실한 대기 시간, 빈번한 로딩

### After Improvements

- **API Calls**: 상태 변경 시에만 최소한의 데이터 조회
- **Data Transfer**: ~2KB per status check
- **Server Load**: 최적화된 캐싱과 인덱싱
- **User Experience**: 실시간 상태 업데이트, 예측 가능한 대기 시간

## Additional Effects: AI Generation Timing Response

### 현재 상황

- AI 생성 데이터가 점진적으로 들어오는 상황
- 사용자가 "왜 이 콘텐츠는 늦게 뜨는지" 모르는 상태로 대기

### 개선 후 효과

- **Status 기반 렌더링**: "이 콘텐츠는 아직 생성 중입니다" 명확한 안내
- **생성 완료 시점 감지**: 완료 시점에만 전체 콘텐츠 리페치
- **사용자 경험 개선**: 예측 가능한 대기 시간과 명확한 상태 표시

## Migration Strategy

### Backward Compatibility

1. 기존 API 응답에 새로운 필드 추가 (기본값 제공)
2. 프론트엔드에서 점진적으로 새로운 필드 사용
3. 구버전 API 지원 유지 (deprecation warning 포함)

### Database Migration

```sql
-- Add new columns with default values
ALTER TABLE contents ADD COLUMN status VARCHAR(20) DEFAULT 'idle';
ALTER TABLE contents ADD COLUMN processing_status VARCHAR(20) DEFAULT 'uploading';

-- Update existing records
UPDATE contents SET status = 'complete' WHERE ai_gen_metadata IS NOT NULL;
UPDATE contents SET processing_status = 'completed' WHERE ai_gen_metadata IS NOT NULL;
```

## Testing Strategy

### Unit Tests

- 상태 매핑 로직 테스트
- 캐싱 동작 테스트
- API 응답 스키마 검증

### Integration Tests

- 폴링 성능 테스트
- 실시간 업데이트 테스트
- 캐시 무효화 테스트

### Load Tests

- 동시 사용자 시나리오
- 대용량 데이터 처리
- 메모리 사용량 모니터링

## Monitoring & Analytics

### Key Metrics

- API 응답 시간
- 캐시 히트율
- 폴링 빈도
- 실시간 업데이트 성공률

### Alerts

- API 응답 시간 임계값 초과
- 캐시 메모리 사용량
- 데이터베이스 연결 풀 부족

---

**Note**: 이 문서는 현재 프론트엔드에서 발생하는 문제들을 기반으로 작성되었습니다. 백엔드 팀과 협의하여 우선순위와 구현 일정을 조정하시기 바랍니다.
