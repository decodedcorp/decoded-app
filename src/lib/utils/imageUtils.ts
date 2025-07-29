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
