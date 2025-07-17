import { useState } from 'react';

export function useImageCompression() {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = async (
    imageFile: File,
    maxWidth = 2500,
    maxHeight = 3125,
    quality = 1.0
  ): Promise<string> => {
    setIsCompressing(true);
    
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const img = new Image();
          
          img.onload = () => {
            const originalWidth = img.width;
            const originalHeight = img.height;
            const targetRatio = 4 / 5;
            const originalRatio = originalWidth / originalHeight;

            let newWidth = originalWidth;
            let newHeight = originalHeight;

            if (originalRatio > targetRatio) {
              newWidth = originalHeight * targetRatio;
              newHeight = originalHeight;
            } else if (originalRatio < targetRatio) {
              newWidth = originalWidth;
              newHeight = originalWidth / targetRatio;
            }

            if (newWidth > maxWidth || newHeight > maxHeight) {
              if (newWidth > maxWidth) {
                const scale = maxWidth / newWidth;
                newWidth = maxWidth;
                newHeight = newHeight * scale;
              }
              
              if (newHeight > maxHeight) {
                const scale = maxHeight / newHeight;
                newHeight = maxHeight;
                newWidth = newWidth * scale;
              }
            }

            newWidth = Math.round(newWidth);
            newHeight = Math.round(newHeight);

            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext("2d");
            
            let sx = 0;
            let sy = 0;
            let sWidth = originalWidth;
            let sHeight = originalHeight;

            if (originalRatio > targetRatio) {
              sx = (originalWidth - (originalHeight * targetRatio)) / 2;
              sWidth = originalHeight * targetRatio;
            } else if (originalRatio < targetRatio) {
              sy = (originalHeight - (originalWidth / targetRatio)) / 2;
              sHeight = originalWidth / targetRatio;
            }

            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, newWidth, newHeight);
            }

            try {
              const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
              if (!compressedBase64 || !compressedBase64.startsWith("data:image/jpeg;base64,")) {
                throw new Error("Invalid base64 format");
              }
              resolve(compressedBase64.split(",")[1]);
            } catch (err) {
              reject(err);
            }
          };

          img.onerror = (err) => {
            reject(new Error("Failed to load image"));
          };

          img.src = event.target?.result as string;
        };

        reader.onerror = (err) => {
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(imageFile);
      });
    } finally {
      setIsCompressing(false);
    }
  };

  return {
    compressImage,
    isCompressing
  };
} 