import localFont from "next/font/local";
import { arrayBufferToWebP } from "webp-converter-browser";
import imageCompression from "browser-image-compression";

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

/**
 * Convert image to webp and compress it
 * @param file File
 * @param maxSize number (in MB)
 * @param maxWidthOrHeight number (in pixels)
 * @returns File
 */
export async function ConvertImageAndCompress(
  file: File,
  maxSize: number,
  maxWidthOrHeight: number
): Promise<File> {
  console.log("Trying to convert to webp...");
  const buf = await file.arrayBuffer();
  const blobToFile = (await arrayBufferToWebP(buf)) as File;
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
