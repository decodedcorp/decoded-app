const fs = require("fs");
const sharp = require("sharp");
import {
  srcToWebP,
  blobToWebP,
  arrayBufferToWebP,
} from "webp-converter-browser";

import imageCompression from "browser-image-compression";

async function convertToWebP(inputPath, outputPath) {
  const hoverFile = fs.readFileSync(inputPath);
  const webp = await arrayBufferToWebP(hoverFile.buffer);
  const stats = webp.size;
  fs.writeFileSync(outputPath, webp);
  console.log(`생성된 이미지의 사이즈: ${stats} 바이트`);
}

describe("convertToWebP", () => {
  it("converts an image to WebP format", async () => {
    const inputPath = "/Users/cocoyoon/downloads/request.jpg";
    const outputPath = "/Users/cocoyoon/downloads/output.webp";

    const result = await convertToWebP(inputPath, outputPath);

    expect(result).toBe(true);
    expect(fs.existsSync(outputPath)).toBe(true);

    // 테스트 후 생성된 파일 삭제 (선택적)
    fs.unlinkSync(outputPath);
  });
});
