/**
 * Image analysis and logging utilities
 */

/**
 * Get image dimensions from file
 * @param file - Image file
 * @returns Promise with image dimensions
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Analyze Base64 image size and provide recommendations
 * @param base64String - Base64 encoded image string
 * @param context - Context for logging (e.g., 'thumbnail', 'profile', 'content')
 * @returns Analysis result with recommendations
 */
export const analyzeBase64Size = (base64String: string, context: string = 'image') => {
  const base64Length = base64String.length;
  const estimatedBytes = Math.round((base64Length * 3) / 4);
  const estimatedKB = (estimatedBytes / 1024).toFixed(2);
  const estimatedMB = (estimatedBytes / (1024 * 1024)).toFixed(2);

  // 실무 기준별 평가
  const analysis = {
    base64Length,
    estimatedBytes,
    estimatedKB,
    estimatedMB,
    sizeCategory: '' as string,
    recommendation: '' as string,
    isOptimal: false,
    warnings: [] as string[],
  };

  // 크기 카테고리 분류
  if (base64Length <= 135000) {
    analysis.sizeCategory = 'Small (≤100KB)';
    analysis.isOptimal = true;
    analysis.recommendation = '✅ 최적 크기입니다.';
  } else if (base64Length <= 675000) {
    analysis.sizeCategory = 'Medium (≤500KB)';
    analysis.isOptimal = true;
    analysis.recommendation = '✅ 권장 크기입니다.';
  } else if (base64Length <= 1350000) {
    analysis.sizeCategory = 'Large (≤1MB)';
    analysis.isOptimal = false;
    analysis.recommendation = '⚠️ 모바일에서 로딩이 느릴 수 있습니다.';
    analysis.warnings.push('모바일 성능 고려 필요');
  } else if (base64Length <= 2700000) {
    analysis.sizeCategory = 'Very Large (≤2MB)';
    analysis.isOptimal = false;
    analysis.recommendation = '⚠️ 서버 제한에 근접합니다.';
    analysis.warnings.push('서버 제한 위험');
    analysis.warnings.push('네트워크 성능 저하');
  } else {
    analysis.sizeCategory = 'Too Large (>2MB)';
    analysis.isOptimal = false;
    analysis.recommendation = '❌ 압축이 필요합니다.';
    analysis.warnings.push('서버 제한 초과 위험');
    analysis.warnings.push('네트워크 타임아웃 가능성');
    analysis.warnings.push('사용자 경험 저하');
  }

  // 컨텍스트별 추가 권장사항
  if (context === 'thumbnail' && base64Length > 675000) {
    analysis.recommendation += ' 썸네일은 500KB 이하 권장.';
  } else if (context === 'profile' && base64Length > 1350000) {
    analysis.recommendation += ' 프로필 이미지는 1MB 이하 권장.';
  }

  return analysis;
};

/**
 * Log Base64 size analysis with detailed information
 * @param base64String - Base64 encoded image string
 * @param context - Context for logging
 * @param options - Logging options
 */
export const logBase64Analysis = (
  base64String: string,
  context: string = 'image',
  options: {
    showDetails?: boolean;
    showWarnings?: boolean;
    showRecommendations?: boolean;
  } = {},
) => {
  const { showDetails = true, showWarnings = true, showRecommendations = true } = options;

  const analysis = analyzeBase64Size(base64String, context);

  console.group(`📊 Base64 크기 분석 (${context})`);

  if (showDetails) {
    console.log(`📏 크기 정보:`);
    console.log(`  - Base64 길이: ${analysis.base64Length.toLocaleString()} chars`);
    console.log(`  - 예상 파일 크기: ${analysis.estimatedKB} KB (${analysis.estimatedMB} MB)`);
    console.log(`  - 카테고리: ${analysis.sizeCategory}`);
  }

  if (showWarnings && analysis.warnings.length > 0) {
    console.warn('⚠️ 경고사항:', analysis.warnings);
  }

  if (showRecommendations) {
    console.log(`💡 권장사항: ${analysis.recommendation}`);
  }

  console.groupEnd();
};