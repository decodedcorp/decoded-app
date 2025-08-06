'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  progress?: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export default function LoadingAnimation({
  progress = 0,
  size = 'md',
  showProgress = true,
  className = '',
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* 차오르는 로딩 바 */}
      <div className={`relative ${sizeClasses[size]} rounded-full bg-zinc-800/50 border border-zinc-700/50 overflow-hidden`}>
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        
        {/* 차오르는 애니메이션 */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500"
          style={{
            height: `${progress}%`,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />
        
        {/* 중앙 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* 진행률 텍스트 */}
      {showProgress && (
        <div className="text-center">
          <motion.div
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {progress}%
          </motion.div>
          <motion.div
            className="text-sm text-zinc-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            AI가 콘텐츠를 생성하고 있습니다...
          </motion.div>
        </div>
      )}
    </div>
  );
}
