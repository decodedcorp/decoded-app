/**
 * Image processing utilities - Re-export from modular components
 * 
 * This file maintains backward compatibility while the codebase is
 * gradually refactored to use the new modular structure.
 */

// Base64 conversion utilities
export {
  arrayBufferToBase64,
  fileToBase64,
  fileToBase64Legacy,
} from './imageBase64';

// Image compression and validation
export {
  compressImage,
  validateImageFile,
} from './imageCompression';

// Image analysis and logging
export {
  getImageDimensions,
  analyzeBase64Size,
  logBase64Analysis,
} from './imageAnalysis';

// Validation and recommendations
export {
  getCompressionRecommendations,
  isValidImageUrl,
  handleImageError,
} from './imageValidation';