/**
 * Image Base64 conversion utilities
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
      if (result) {
        // Remove data URL prefix if present
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
};