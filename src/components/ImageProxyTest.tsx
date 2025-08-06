'use client';

import { useState } from 'react';
import { ProxiedImage } from './ProxiedImage';
import { getProxiedImageUrl } from '@/lib/utils/imageProxy';

export function ImageProxyTest() {
  const [imageUrl, setImageUrl] = useState('');
  const [proxiedUrl, setProxiedUrl] = useState('');

  const testImages = [
    'https://ogp.me/logo.png',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Test+Image',
  ];

  // 실제 콘텐츠 데이터 시뮬레이션
  const mockContentData = {
    id: '689328a086ac8b77429fe584',
    type: 'link',
    title: 'Winner 콘서트 관련 뉴스',
    description: 'YG Entertainment의 보이그룹 Winner가 3년 만에 콘서트를 개최합니다.',
    linkUrl:
      'https://biz.chosun.com/entertainment/enter_general/2023/07/02/QRZ27DPCCIDKEWGTLX7SFLP6EI/',
    linkPreview: {
      title: "[사진]에스파 카리나,'공항 런웨이'",
      description: '사진에스파 카리나,공항 런웨이',
      imageUrl:
        'https://biz.chosun.com/resizer/v2/4D6BAORRMMPQIZD547LLGILZPA.jpg?auth=8ab5fd9df540a5fab7c63a3f292d4da2ab5824e6fb09c1fbe454ba6d58cf3d4f&width=530&height=278&smart=true',
      siteName: '조선비즈',
    },
    aiSummary:
      "YG Entertainment's boy group Winner to hold first concert in over 3 years this July, featuring Kang Seung-yoon, Kim Jin-woo, and Lee Seung-hoon, excluding Song Min-ho due to ongoing police investigation over military service violations.",
    status: 'active',
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setProxiedUrl(getProxiedImageUrl(url));
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Image Proxy Test</h2>

      {/* URL 입력 테스트 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom URL Test</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {proxiedUrl && (
          <div className="text-sm text-gray-600">
            <strong>Proxied URL:</strong> {proxiedUrl}
          </div>
        )}
        {imageUrl && (
          <div className="border rounded-lg p-4">
            <ProxiedImage
              src={imageUrl}
              alt="Test image"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      {/* 미리 정의된 테스트 이미지들 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Predefined Test Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testImages.map((url, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="text-sm text-gray-600 truncate">{url}</div>
              <ProxiedImage
                src={url}
                alt={`Test image ${index + 1}`}
                width={300}
                height={200}
                className="rounded-lg w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 실제 콘텐츠 데이터 테스트 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Real Content Data Test</h3>
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 원본 이미지 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Original Image (Direct URL)
              </h4>
              <div className="border rounded-lg p-2">
                <img
                  src={mockContentData.linkPreview.imageUrl}
                  alt={mockContentData.linkPreview.title}
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    console.error(
                      'Original image failed to load:',
                      mockContentData.linkPreview.imageUrl,
                    );
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {mockContentData.linkPreview.imageUrl}
              </p>
            </div>

            {/* 프록시 이미지 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Proxied Image (Safe)</h4>
              <div className="border rounded-lg p-2">
                <ProxiedImage
                  src={mockContentData.linkPreview.imageUrl}
                  alt={mockContentData.linkPreview.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {getProxiedImageUrl(mockContentData.linkPreview.imageUrl)}
              </p>
            </div>
          </div>

          {/* 콘텐츠 정보 */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Content Information</h4>
            <div className="text-xs space-y-1">
              <p>
                <strong>Title:</strong> {mockContentData.linkPreview.title}
              </p>
              <p>
                <strong>Site:</strong> {mockContentData.linkPreview.siteName}
              </p>
              <p>
                <strong>Description:</strong> {mockContentData.linkPreview.description}
              </p>
              <p>
                <strong>AI Summary:</strong> {mockContentData.aiSummary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 프록시 URL 정보 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <ul className="text-sm space-y-1">
          <li>
            • External image URLs are automatically proxied through <code>/api/image-proxy</code>
          </li>
          <li>• Images are cached for 24 hours</li>
          <li>• Supports all image formats (JPEG, PNG, WebP, etc.)</li>
          <li>• Includes timeout protection (10 seconds)</li>
          <li>• CORS headers are automatically handled</li>
        </ul>
      </div>
    </div>
  );
}
