/**
 * Image validation and compression recommendation utilities
 */
import React from 'react';
import i18n from '../i18n/config';

import { analyzeBase64Size } from './imageAnalysis';

/**
 * Get compression recommendations based on Base64 size
 * @param base64String - Base64 encoded image string
 * @returns Compression recommendations
 */
export const getCompressionRecommendations = (base64String: string) => {
  const analysis = analyzeBase64Size(base64String);

  const recommendations = {
    needsCompression: false,
    suggestedQuality: 0.9,
    suggestedMaxWidth: 1200,
    suggestedMaxHeight: 800,
    suggestedFormat: 'jpeg' as 'jpeg' | 'png' | 'webp',
    reasons: [] as string[],
  };

  if (analysis.base64Length > 1350000) {
    recommendations.needsCompression = true;
    recommendations.suggestedQuality = 0.7;
    recommendations.suggestedMaxWidth = 800;
    recommendations.suggestedMaxHeight = 600;
    recommendations.reasons.push(i18n.t('images:validation.reasons.over1MB'));
  }

  if (analysis.base64Length > 2700000) {
    recommendations.needsCompression = true;
    recommendations.suggestedQuality = 0.6;
    recommendations.suggestedMaxWidth = 600;
    recommendations.suggestedMaxHeight = 400;
    recommendations.reasons.push(i18n.t('images:validation.reasons.over2MB'));
  }

  if (analysis.base64Length > 4000000) {
    recommendations.needsCompression = true;
    recommendations.suggestedQuality = 0.5;
    recommendations.suggestedMaxWidth = 400;
    recommendations.suggestedMaxHeight = 300;
    recommendations.reasons.push(i18n.t('images:validation.reasons.over4MB'));
  }

  return recommendations;
};

/**
 * 이미지 URL 유효성 검사
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const validProtocols = ['http:', 'https:'];
    
    // 프로토콜 검사
    if (!validProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // 확장자가 없어도 유효할 수 있음 (API 응답 등)
    return true;
  } catch {
    return false;
  }
};

/**
 * 이미지 로딩 에러 처리
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) => {
  const target = event.target as HTMLImageElement;
  
  if (fallbackUrl && target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  } else {
    // 이미지를 숨기고 에러 상태 표시
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.classList.add('image-error');
    }
  }
};