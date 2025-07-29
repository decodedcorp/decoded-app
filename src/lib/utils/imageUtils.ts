/**
 * Image processing utilities for the application
 */

/**
 * Convert ArrayBuffer to Base64 string
 * @param buffer - ArrayBuffer to convert
 * @returns Base64 encoded string
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Convert File to Base64 string using ArrayBuffer
 * @param file - File to convert
 * @param includeDataPrefix - Whether to include data URL prefix
 * @returns Promise<string> - Base64 encoded string
 */
export const fileToBase64 = async (
  file: File,
  includeDataPrefix: boolean = false,
): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);

  if (includeDataPrefix) {
    const mimeType = file.type || 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  }

  return base64;
};

/**
 * Convert File to Base64 string using FileReader (legacy method)
 * @param file - File to convert
 * @returns Promise<string> - Base64 encoded string
 */
export const fileToBase64Legacy = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64String = result.split(',')[1]; // Remove data URL prefix
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image with quality and size optimization
 * @param file - Image file to compress
 * @param options - Compression options
 * @returns Promise<string> - Compressed Base64 string
 */
export const compressImage = async (
  file: File,
  options: {
    maxSizeBytes?: number;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
    includeDataPrefix?: boolean;
  } = {},
): Promise<string> => {
  const {
    maxSizeBytes = 2 * 1024 * 1024, // 2MB
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.9,
    format = 'jpeg',
    includeDataPrefix = false,
  } = options;

  // If file is already small enough, return as-is
  if (file.size <= maxSizeBytes) {
    return fileToBase64(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const mimeType = `image/${format}`;
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          const base64String = compressedDataUrl.split(',')[1];

          if (includeDataPrefix) {
            resolve(compressedDataUrl);
          } else {
            resolve(base64String);
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 */
export const validateImageFile = (
  file: File,
  options: {
    maxSizeBytes?: number;
    allowedTypes?: string[];
  } = {},
): { isValid: boolean; error?: string } => {
  const {
    maxSizeBytes = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  } = options;

  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type ${file.type} is not supported` };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image size must be less than ${Math.round(maxSizeBytes / 1024 / 1024)}MB`,
    };
  }

  return { isValid: true };
};

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
    console.warn(`⚠️ 주의사항:`);
    analysis.warnings.forEach((warning) => {
      console.warn(`  - ${warning}`);
    });
  }

  if (showRecommendations) {
    if (analysis.isOptimal) {
      console.log(`✅ ${analysis.recommendation}`);
    } else {
      console.warn(`💡 ${analysis.recommendation}`);
    }
  }

  // 네트워크 전송 크기 추정 (gzip 압축 고려)
  const networkSizeKB = Math.ceil((analysis.base64Length * 1.1) / 1024);
  console.log(`🌐 네트워크 전송 크기: ${networkSizeKB} KB (gzip 압축 고려)`);

  console.groupEnd();

  return analysis;
};

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
    recommendations.reasons.push('1MB 초과로 압축 필요');
  }

  if (analysis.base64Length > 2700000) {
    recommendations.needsCompression = true;
    recommendations.suggestedQuality = 0.6;
    recommendations.suggestedMaxWidth = 600;
    recommendations.suggestedMaxHeight = 400;
    recommendations.reasons.push('2MB 초과로 강력한 압축 필요');
  }

  if (analysis.base64Length > 4000000) {
    recommendations.needsCompression = true;
    recommendations.suggestedQuality = 0.5;
    recommendations.suggestedMaxWidth = 400;
    recommendations.suggestedMaxHeight = 300;
    recommendations.reasons.push('4MB 초과로 극한 압축 필요');
  }

  return recommendations;
};
