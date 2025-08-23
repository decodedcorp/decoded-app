'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { GeneratedContent } from '@/store/contentUploadStore';

import TiltedCard from './TiltedCard';

interface ContentPreviewCardProps {
  content: GeneratedContent;
  onClose?: () => void;
  className?: string;
}

export default function ContentPreviewCard({
  content,
  onClose,
  className = '',
}: ContentPreviewCardProps) {
  const defaultImage = '/api/placeholder/400/300'; // 기본 이미지 URL

  return (
    <motion.div
      className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">생성된 콘텐츠</h3>
          <p className="text-sm text-zinc-400">AI가 생성한 콘텐츠입니다</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 콘텐츠 카드 */}
      <div className="space-y-4">
        {/* TiltedCard */}
        <div className="flex justify-center">
          <TiltedCard
            imageSrc={content.image_url || defaultImage}
            altText={content.title}
            captionText={content.title}
            containerHeight="300px"
            containerWidth="100%"
            imageHeight="300px"
            imageWidth="400px"
            scaleOnHover={1.05}
            rotateAmplitude={8}
            showMobileWarning={false}
            showTooltip={true}
          />
        </div>

        {/* 콘텐츠 정보 */}
        <div className="space-y-3">
          <div>
            <h4 className="text-lg font-medium text-white mb-1">{content.title}</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">{content.description}</p>
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>생성 시간: {new Date(content.created_at).toLocaleString('ko-KR')}</span>
            <span>ID: {content.id}</span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-center space-x-3 pt-4">
          <motion.button
            className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 border border-zinc-700 hover:border-zinc-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            다시 생성
          </motion.button>
          <motion.button
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            채널에 추가
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
