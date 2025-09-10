/**
 * Image compression utilities
 */
import { fileToBase64 } from './imageBase64';

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
    return fileToBase64(file, includeDataPrefix);
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
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  return { isValid: true };
};
