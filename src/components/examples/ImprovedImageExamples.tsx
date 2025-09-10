'use client';

import React, { useState } from 'react';
import { SuperiorImage, HighQualityNewsImage, PremiumAvatarImage } from '@/components/SuperiorImage';
import { EnhancedImage } from '@/components/EnhancedImage';
import { UltraRobustImage, BulletproofNewsImage, FailsafeAvatarImage } from '@/components/UltraRobustImage';

const ImprovedImageExamples: React.FC = () => {
  const [testUrls] = useState({
    // 테스트용 이미지 URLs
    validImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    invalidImage: 'https://invalid-domain.com/broken-image.jpg',
    downloadedImage: '/api/proxy/image?url=https://images.unsplash.com/photo-1506905925346-21bda4d32df4&quality=max&format=webp',
    slowImage: 'https://picsum.photos/800/600',
    // 실제 문제 이미지들
    problematicImages: [
      'https://image.imnews.imbc.com/news/2023/enter/article/__icsFiles/afieldfile/2023/07/17/20230717001616_631d1740-e506-4a25-a6ad-51251ff2d63f.jpg',
      'https://cdn.kstarfashion.com/news/photo/202404/214685_129499_4325.jpg',
      'https://scontent-ssn1-1.cdninstagram.com/v/t39.30808-6/491848071_649964987831959_2355055744669522860_n.png'
    ]
  });

  const [upgradeLog, setUpgradeLog] = useState<string[]>([]);

  const handleQualityUpgrade = (upgraded: any, original: any) => {
    const logEntry = `Quality upgraded: ${original.source} → ${upgraded.source} (${new Date().toLocaleTimeString()})`;
    setUpgradeLog(prev => [...prev, logEntry]);
  };

  const clearLog = () => setUpgradeLog([]);

  return (
    <div className="p-8 bg-zinc-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          이미지 로딩 시스템 개선 테스트
        </h1>

        {/* 품질 업그레이드 로그 */}
        <div className="mb-8 p-4 bg-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">품질 업그레이드 로그</h3>
            <button
              onClick={clearLog}
              className="px-3 py-1 text-sm bg-zinc-700 text-white rounded hover:bg-zinc-600"
            >
              로그 지우기
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {upgradeLog.length === 0 ? (
              <p className="text-zinc-400 text-sm">품질 업그레이드가 감지되면 여기에 표시됩니다.</p>
            ) : (
              upgradeLog.map((log, index) => (
                <p key={index} className="text-green-400 text-sm font-mono">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>

        {/* SuperiorImage vs EnhancedImage 비교 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            SuperiorImage vs EnhancedImage 비교
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SuperiorImage */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">SuperiorImage (개선됨)</h3>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="text-white mb-2">다운로드된 이미지 우선 + 품질 업그레이드</h4>
                <SuperiorImage
                  src={testUrls.validImage}
                  downloadedSrc={testUrls.downloadedImage}
                  alt="Superior Image with downloaded source"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  imageType="news"
                  showQualityIndicator={true}
                  onQualityUpgrade={handleQualityUpgrade}
                  onSourceChange={(source) => console.log('SuperiorImage source:', source)}
                />
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="text-white mb-2">스마트 재시도 (실패 → 복구)</h4>
                <SuperiorImage
                  src={testUrls.invalidImage}
                  downloadedSrc={testUrls.validImage} // fallback으로 작동
                  alt="Smart retry example"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  maxRetries={4}
                  showRetryButton={true}
                  onError={(error) => console.log('SuperiorImage error:', error)}
                />
              </div>
            </div>

            {/* EnhancedImage */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">EnhancedImage (기존)</h3>
              
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="text-white mb-2">기존 시스템</h4>
                <EnhancedImage
                  src={testUrls.validImage}
                  downloadedSrc={testUrls.downloadedImage}
                  alt="Enhanced Image"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  imageType="news"
                  onSourceChange={(source) => console.log('EnhancedImage source:', source)}
                />
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="text-white mb-2">기본 재시도</h4>
                <EnhancedImage
                  src={testUrls.invalidImage}
                  downloadedSrc={testUrls.validImage}
                  alt="Basic retry example"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  maxRetries={3}
                  showRetryButton={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 문제 이미지 테스트 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">문제 이미지 테스트 (403/500 에러 발생)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testUrls.problematicImages.map((problemUrl, index) => (
              <div key={index} className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="text-white mb-3 text-sm">에러 이미지 {index + 1} - UltraRobustImage</h4>
                <UltraRobustImage
                  src={problemUrl}
                  alt={`Problematic image ${index + 1}`}
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                  imageType="news"
                  enableDomainRotation={true}
                  enableFormatFallback={true}
                  enableCorsWorkaround={true}
                  showSourceIndicator={true}
                  onError={(error) => console.log(`Problem image ${index + 1} error:`, error)}
                  onSourceChange={(source) => console.log(`Problem image ${index + 1} loaded from:`, source)}
                />
                <p className="text-xs text-zinc-400 mt-2 break-all">
                  {problemUrl.substring(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 특화된 컴포넌트들 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">특화된 이미지 컴포넌트</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h4 className="text-white mb-3">방탄 뉴스 이미지</h4>
              <BulletproofNewsImage
                src={testUrls.validImage}
                alt="Bulletproof news image"
                width={300}
                height={200}
                className="rounded-lg w-full"
                showSourceIndicator={true}
              />
              <p className="text-sm text-zinc-400 mt-2">
                도메인 대안, CORS 우회, 커스텀 fallback
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg">
              <h4 className="text-white mb-3">내장성 아바타</h4>
              <FailsafeAvatarImage
                src={testUrls.validImage}
                alt="Failsafe avatar"
                width={150}
                height={150}
                className="rounded-full mx-auto"
                showSourceIndicator={true}
              />
              <p className="text-sm text-zinc-400 mt-2 text-center">
                최강 안정성, 자동 fallback
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg">
              <h4 className="text-white mb-3">원래 고품질 이미지</h4>
              <HighQualityNewsImage
                src={testUrls.validImage}
                alt="High quality news image"
                width={300}
                height={200}
                className="rounded-lg w-full"
                onQualityUpgrade={handleQualityUpgrade}
              />
              <p className="text-sm text-zinc-400 mt-2">
                품질: 98%, HD 표시, 고우선순위
              </p>
            </div>
          </div>
        </section>

        {/* 로딩 상태 테스트 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">로딩 상태 및 에러 처리</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h4 className="text-white mb-3">느린 이미지 로딩</h4>
              <SuperiorImage
                src={`${testUrls.slowImage}?slow=3000`}
                alt="Slow loading image"
                width={400}
                height={300}
                className="rounded-lg"
                showLoadingSpinner={true}
              />
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg">
              <h4 className="text-white mb-3">에러 처리 및 재시도</h4>
              <SuperiorImage
                src="https://nonexistent-domain.com/image.jpg"
                downloadedSrc={testUrls.validImage}
                alt="Error handling example"
                width={400}
                height={300}
                className="rounded-lg"
                showRetryButton={true}
                maxRetries={2}
              />
            </div>
          </div>
        </section>

        {/* 성능 비교 정보 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">주요 개선사항</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-900/20 border border-green-700/30 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">품질 향상</h4>
              <ul className="text-sm text-green-300 space-y-1">
                <li>• WebP → Original 포맷</li>
                <li>• 95% 기본 품질</li>
                <li>• Max 품질 프록시</li>
                <li>• 실시간 품질 업그레이드</li>
              </ul>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">안정성 향상</h4>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• 4회 재시도 (기존 3회)</li>
                <li>• 스마트 재시도 로직</li>
                <li>• 네트워크 상태 감지</li>
                <li>• 다중 소스 fallback</li>
              </ul>
            </div>

            <div className="bg-purple-900/20 border border-purple-700/30 p-4 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">사용자 경험</h4>
              <ul className="text-sm text-purple-300 space-y-1">
                <li>• 품질 업그레이드 표시</li>
                <li>• 향상된 로딩 UI</li>
                <li>• 자동 품질 개선</li>
                <li>• 상세한 상태 정보</li>
              </ul>
            </div>

            <div className="bg-orange-900/20 border border-orange-700/30 p-4 rounded-lg">
              <h4 className="text-orange-400 font-semibold mb-2">개발자 도구</h4>
              <ul className="text-sm text-orange-300 space-y-1">
                <li>• 실시간 디버깅 정보</li>
                <li>• 소스 추적</li>
                <li>• 성능 메트릭</li>
                <li>• 품질 업그레이드 로그</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 사용법 예제 */}
        <section className="bg-zinc-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">사용법 예제</h2>
          
          <pre className="bg-zinc-900 p-4 rounded text-sm text-green-400 overflow-x-auto">
{`// 기본 사용법
<SuperiorImage
  src={imageUrl}
  downloadedSrc={downloadedImageUrl}
  alt="설명"
  width={400}
  height={300}
  onQualityUpgrade={(upgraded, original) => {
    console.log('Quality upgraded:', upgraded.source);
  }}
/>

// 고품질 뉴스 이미지
<HighQualityNewsImage
  src={newsImageUrl}
  downloadedSrc={downloadedNewsImageUrl}
  alt="뉴스 이미지"
  width={600}
  height={400}
  showQualityIndicator={true}
/>

// 커스텀 설정
<SuperiorImage
  src={imageUrl}
  alt="이미지"
  maxRetries={5}
  showRetryButton={true}
  enableQualityUpgrade={true}
  onError={(error) => console.error(error)}
/>`}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default ImprovedImageExamples;