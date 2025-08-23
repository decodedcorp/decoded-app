/**
 * Banner-specific image utilities
 */
import { compressImage, validateImageFile } from './imageCompression';
import { fileToBase64 } from './imageBase64';

/**
 * Banner image dimensions and constraints
 */
export const BANNER_CONSTRAINTS = {
  // Recommended banner dimensions (16:9 aspect ratio)
  RECOMMENDED_WIDTH: 1920,
  RECOMMENDED_HEIGHT: 1080,

  // Minimum dimensions
  MIN_WIDTH: 800,
  MIN_HEIGHT: 450,

  // Maximum file size (5MB)
  MAX_SIZE_BYTES: 5 * 1024 * 1024,

  // Compression settings for banners
  COMPRESSION: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    format: 'jpeg' as const,
  },

  // Allowed file types
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

/**
 * Validate banner image file
 */
export const validateBannerFile = (file: File) => {
  const baseValidation = validateImageFile(file, {
    maxSizeBytes: BANNER_CONSTRAINTS.MAX_SIZE_BYTES,
    allowedTypes: [...BANNER_CONSTRAINTS.ALLOWED_TYPES],
  });

  if (!baseValidation.isValid) {
    return baseValidation;
  }

  return { isValid: true };
};

/**
 * Process banner image for upload
 * @param file - Banner image file
 * @returns Promise<string> - Base64 encoded banner image
 */
export const processBannerImage = async (file: File): Promise<string> => {
  // Validate file first
  const validation = validateBannerFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid banner file');
  }

  // Compress image if needed
  const base64 = await compressImage(file, {
    maxSizeBytes: BANNER_CONSTRAINTS.MAX_SIZE_BYTES,
    maxWidth: BANNER_CONSTRAINTS.COMPRESSION.maxWidth,
    maxHeight: BANNER_CONSTRAINTS.COMPRESSION.maxHeight,
    quality: BANNER_CONSTRAINTS.COMPRESSION.quality,
    format: BANNER_CONSTRAINTS.COMPRESSION.format,
    includeDataPrefix: false,
  });

  return base64;
};

/**
 * Get banner image dimensions from file
 */
export const getBannerDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for dimension analysis'));
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Check if image dimensions meet banner requirements
 */
export const validateBannerDimensions = async (file: File) => {
  try {
    const dimensions = await getBannerDimensions(file);
    const { width, height } = dimensions;

    if (width < BANNER_CONSTRAINTS.MIN_WIDTH || height < BANNER_CONSTRAINTS.MIN_HEIGHT) {
      return {
        isValid: false,
        error: `Banner image must be at least ${BANNER_CONSTRAINTS.MIN_WIDTH}x${BANNER_CONSTRAINTS.MIN_HEIGHT} pixels`,
        dimensions,
      };
    }

    // Check aspect ratio (should be close to 16:9)
    const aspectRatio = width / height;
    const targetAspectRatio = 16 / 9;
    const aspectRatioTolerance = 0.2;

    if (Math.abs(aspectRatio - targetAspectRatio) > aspectRatioTolerance) {
      return {
        isValid: false,
        error: 'Banner image should have a 16:9 aspect ratio (recommended: 1920x1080)',
        dimensions,
        aspectRatio,
        recommendedAspectRatio: targetAspectRatio,
      };
    }

    return {
      isValid: true,
      dimensions,
      aspectRatio,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Failed to validate banner dimensions',
    };
  }
};

/**
 * Get banner preview URL from file
 */
export const getBannerPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to create preview URL'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
