'use client';

import React, { useState } from 'react';
import { ChannelUpdateTest } from '../../../domains/channels/components/modal/add-channel/ChannelUpdateTest';

export default function ChannelUpdateTestPage() {
  const [channelId, setChannelId] = useState('68a8abfec2052dc81884b700');
  const [currentName, setCurrentName] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          PUT /channels/68a8abfec2052dc81884b700 API 테스트
        </h1>

        {/* 설정 섹션 */}
        <div className="mb-8 p-6 bg-zinc-900 rounded-lg border border-zinc-700">
          <h2 className="text-xl font-semibold text-white mb-4">테스트 설정</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">채널 ID *</label>
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="68a8abfec2052dc81884b700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">현재 채널 이름</label>
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="현재 채널 이름 (선택사항)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">현재 채널 설명</label>
              <input
                type="text"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="현재 채널 설명 (선택사항)"
              />
            </div>
          </div>
        </div>

        {/* 테스트 컴포넌트 */}
        <ChannelUpdateTest
          channelId={channelId}
          currentName={currentName}
          currentDescription={currentDescription}
        />

        {/* 사용법 안내 */}
        <div className="mt-8 p-6 bg-zinc-900 rounded-lg border border-zinc-700">
          <h2 className="text-xl font-semibold text-white mb-4">사용법</h2>

          <div className="space-y-4 text-zinc-300">
            <div>
              <h3 className="font-medium text-white mb-2">1. 채널 ID 입력</h3>
              <p className="text-sm text-zinc-400">
                업데이트할 채널의 ID를 입력하세요. 실제 존재하는 채널 ID여야 합니다.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white mb-2">2. 테스트 데이터 입력</h3>
              <p className="text-sm text-zinc-400">
                채널 이름, 설명, 썸네일, 배너 중 원하는 항목만 입력하세요. 모든 필드는
                선택사항입니다.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white mb-2">3. API 호출 테스트</h3>
              <p className="text-sm text-zinc-400">
                "채널 업데이트" 버튼을 클릭하면 PUT /channels/{'{channel_id}'} API가 호출됩니다.
                콘솔에서 요청/응답 로그를 확인할 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white mb-2">4. 인증 확인</h3>
              <p className="text-sm text-zinc-400">
                이 API는 액세스 토큰이 필요합니다. 로그인이 되어 있어야 하며, 해당 채널의 소유자여야
                합니다.
              </p>
            </div>
          </div>
        </div>

        {/* API 스펙 */}
        <div className="mt-8 p-6 bg-zinc-900 rounded-lg border border-zinc-700">
          <h2 className="text-xl font-semibold text-white mb-4">API 스펙</h2>

          <div className="space-y-4">
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="font-medium text-white mb-2">PUT /channels/{'{channel_id}'}</h3>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>
                  <strong>Method:</strong> PUT
                </p>
                <p>
                  <strong>URL:</strong> /channels/{'{channel_id}'}
                </p>
                <p>
                  <strong>Headers:</strong> Authorization: Bearer {'{access_token}'}
                </p>
                <p>
                  <strong>Content-Type:</strong> application/json
                </p>
              </div>
            </div>

            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="font-medium text-white mb-2">Request Body</h3>
              <pre className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded overflow-x-auto">
                {`{
  "name": "string | null | undefined",
  "description": "string | null | undefined", 
  "thumbnail_base64": "string | null | undefined",
  "banner_base64": "string | null | undefined"
}`}
              </pre>
            </div>

            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="font-medium text-white mb-2">Response</h3>
              <div className="text-sm text-zinc-400">
                <p>
                  <strong>Success:</strong> 200 OK - ChannelResponse
                </p>
                <p>
                  <strong>Error:</strong> 401 Unauthorized, 403 Forbidden, 404 Not Found, 422
                  Validation Error
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
