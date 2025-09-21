import React from 'react';
import { FormattedDescription, HTMLDescription, TextDescription } from './FormattedDescription';

/**
 * Description 포맷팅 훅 사용 예시 컴포넌트
 * 실제 백엔드에서 받아온 description 데이터를 시뮬레이션
 */
export function DescriptionExample() {
  // 실제 백엔드에서 받아온 description 예시
  const sampleDescription = '3줄 요약\n\n1. 이더리움 L1을 ZK로 "스너키파이(snarkify)"해 기가 가스 프런티어(초당 10억 가스)로 밀고 가며, 검증 분산화는 라즈베리파이 피코급(7달러) 디바이스까지 낮추겠다는 청사진이 제시됐다.\n \n2. 기관 수요의 핵심은 프라이버시와 포스트퀀텀 보안. L1 \'프라이버시 웜홀\'과 해시 기반 서명+SNARK 집계를 통한 BLS/KZG 대체, 그리고 PSE의 프라이버시 전담 리브랜딩이 본격화된다.\n \n3. 마지막 10배 스케일 업은 "협업형 증명 네트워크"가 관건. 10kW 전력 제한 아래 여러 프로버 클러스터가 한 증명에 동시 협업해 100M gas/s → 1G gas/s 도약을 노린다.';

  return (
    <div className="p-6 space-y-8 bg-zinc-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Description 포맷팅 예시</h1>
      
      {/* 원본 텍스트 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-yellow-400">원본 텍스트 (백엔드에서 받은 그대로)</h2>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <pre className="whitespace-pre-wrap text-sm text-gray-300">
            {sampleDescription}
          </pre>
        </div>
      </div>

      {/* HTML로 렌더링 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-green-400">HTML 렌더링 (줄바꿈이 <br /> 태그로 변환됨)</h2>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <HTMLDescription 
            description={sampleDescription}
            className="text-gray-300 leading-relaxed"
          />
        </div>
      </div>

      {/* 텍스트로 렌더링 (줄바꿈 제거) */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-blue-400">텍스트 렌더링 (줄바꿈 제거, 3줄 제한)</h2>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <TextDescription 
            description={sampleDescription}
            maxLines={3}
            className="text-gray-300 leading-relaxed"
          />
        </div>
      </div>

      {/* 유연한 포맷팅 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-purple-400">유연한 포맷팅 (HTML, 2줄 제한)</h2>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <FormattedDescription 
            description={sampleDescription}
            variant="html"
            maxLines={2}
            className="text-gray-300 leading-relaxed line-clamp-2"
          />
        </div>
      </div>

      {/* 사용법 안내 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-orange-400">사용법</h2>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
{`// 1. HTML로 렌더링 (줄바꿈 유지)
<HTMLDescription 
  description={content.description}
  className="prose prose-invert"
/>

// 2. 텍스트로 렌더링 (줄바꿈 제거, 줄 수 제한)
<TextDescription 
  description={content.description}
  maxLines={3}
  className="line-clamp-3"
/>

// 3. 유연한 포맷팅
<FormattedDescription 
  description={content.description}
  variant="html" // 또는 "text"
  maxLines={2}
  className="custom-styles"
/>

// 4. 훅 직접 사용
const htmlDescription = useDescriptionJSX(description);
const textDescription = usePlainTextDescription(description);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
