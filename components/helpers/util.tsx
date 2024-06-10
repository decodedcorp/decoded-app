import localFont from "next/font/local";
import { arrayBufferToWebP } from "webp-converter-browser";
import imageCompression from "browser-image-compression";
import { removeBackground } from "@imgly/background-removal";
import { extractColors } from "extract-colors";
import { sha256 } from "js-sha256";

export const main_font = localFont({
  src: "../../fonts/Blinker-Bold.ttf",
});

export const secondary_font = localFont({
  src: "../../fonts/Blinker-SemiBold.ttf",
});

export const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

export function getByteSize(str: string) {
  return new Blob([str]).size;
}

export function create_doc_id(name: string): string {
  return sha256(name);
}

export async function extractColorsFromImage(image: File): Promise<string[]> {
  console.log("Extracting colors from image...");
  try {
    const img = await convertFileToHTMLImageElement(image);
    const colors = await extractColors(img);
    console.log("Extracted colors:", colors);
    return colors.map((color) => color.hex);
  } catch (error) {
    console.error("Error extracting colors:", error);
    return [];
  }
}

function convertFileToHTMLImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        resolve(img); // 이미지 로딩이 완료되면 HTMLImageElement 반환
      };
      img.onerror = () => {
        reject(new Error("이미지를 로드할 수 없습니다."));
      };
      img.src = event?.target?.result as string; // FileReader 결과를 이미지 소스로 설정
    };
    reader.onerror = () => {
      reject(new Error("파일을 읽는 데 실패했습니다."));
    };
    reader.readAsDataURL(file); // 파일을 Data URL로 읽어들임
  });
}

/**
 * Convert image to webp and compress it
 * @param file File
 * @param maxSize number (in MB)
 * @param maxWidthOrHeight number (in pixels)
 * @param isRemoveBackground boolean
 * @returns File
 */
export async function ConvertImageAndCompress(
  file: File,
  maxSize: number,
  maxWidthOrHeight: number,
  isRemoveBackground: boolean
): Promise<File> {
  console.log("Trying to convert to webp...");
  const buf = await file.arrayBuffer();
  var blobToFile: File;
  if (isRemoveBackground) {
    const blob = await (await removeBackground(buf)).arrayBuffer();
    blobToFile = (await arrayBufferToWebP(blob)) as File;
  } else {
    blobToFile = (await arrayBufferToWebP(buf)) as File;
  }
  const hoverFileOptions = {
    maxSizeMB: maxSize,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
  };
  const compressedHoverFile = await imageCompression(
    blobToFile,
    hoverFileOptions
  );
  return compressedHoverFile;
}
