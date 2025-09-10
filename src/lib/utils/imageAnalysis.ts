/**
 * Image analysis and logging utilities
 */
import i18n from '../i18n/config';

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
    analysis.sizeCategory = i18n.t('images:analysis.categories.smallOptimal');
    analysis.isOptimal = true;
    analysis.recommendation = i18n.t('images:analysis.recommendations.optimal');
  } else if (base64Length <= 675000) {
    analysis.sizeCategory = i18n.t('images:analysis.categories.mediumOptimal');
    analysis.isOptimal = true;
    analysis.recommendation = i18n.t('images:analysis.recommendations.recommended');
  } else if (base64Length <= 1350000) {
    analysis.sizeCategory = i18n.t('images:analysis.categories.largeWarning');
    analysis.isOptimal = false;
    analysis.recommendation = i18n.t('images:analysis.recommendations.slowMobile');
    analysis.warnings.push(i18n.t('images:analysis.warnings.mobilePerformance'));
  } else if (base64Length <= 2700000) {
    analysis.sizeCategory = i18n.t('images:analysis.categories.veryLargeWarning');
    analysis.isOptimal = false;
    analysis.recommendation = i18n.t('images:analysis.recommendations.serverLimit');
    analysis.warnings.push(i18n.t('images:analysis.warnings.serverLimitRisk'));
    analysis.warnings.push(i18n.t('images:analysis.warnings.networkPerformance'));
  } else {
    analysis.sizeCategory = i18n.t('images:analysis.categories.tooLarge');
    analysis.isOptimal = false;
    analysis.recommendation = i18n.t('images:analysis.recommendations.compressionNeeded');
    analysis.warnings.push(i18n.t('images:analysis.warnings.serverOverLimit'));
    analysis.warnings.push(i18n.t('images:analysis.warnings.networkTimeout'));
    analysis.warnings.push(i18n.t('images:analysis.warnings.userExperience'));
  }

  // 컨텍스트별 추가 권장사항
  if (context === 'thumbnail' && base64Length > 675000) {
    analysis.recommendation += ' ' + i18n.t('images:analysis.recommendations.thumbnailLimit');
  } else if (context === 'profile' && base64Length > 1350000) {
    analysis.recommendation += ' ' + i18n.t('images:analysis.recommendations.profileLimit');
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

  console.group(`${i18n.t('images:analysis.logging.sizeAnalysisTitle')} (${context})`);

  if (showDetails) {
    console.log(`${i18n.t('images:analysis.logging.sizeInfo')}:`);
    console.log(`  - ${i18n.t('images:analysis.logging.base64Length')}: ${analysis.base64Length.toLocaleString()} chars`);
    console.log(`  - ${i18n.t('images:analysis.logging.estimatedSize')}: ${analysis.estimatedKB} KB (${analysis.estimatedMB} MB)`);
    console.log(`  - ${i18n.t('images:analysis.logging.category')}: ${analysis.sizeCategory}`);
  }

  if (showWarnings && analysis.warnings.length > 0) {
    console.warn(`${i18n.t('images:analysis.logging.warningsTitle')}:`, analysis.warnings);
  }

  if (showRecommendations) {
    console.log(`${i18n.t('images:analysis.logging.recommendation')}: ${analysis.recommendation}`);
  }

  console.groupEnd();
};