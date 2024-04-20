// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

// Helper function for handling image scaling needed for SAM
const handleImageScale = (image: HTMLImageElement) => {
  // Input images to SAM must be resized so the longest side is 1024
  const LONG_SIDE_LENGTH = 1024;
  image.classList.add("rounded-lg", "shadow-lg", "overflow-hidden");
  // 스타일 적용
  image.style.width = "100%";
  image.style.maxWidth = "200px";
  image.style.height = "auto";
  image.style.aspectRatio = "3 / 4";
  let w = image.naturalWidth;
  let h = image.naturalHeight;
  // image.style에 적용된 사항을 반영하여 최종 너비와 높이 계산
  const maxWidth = parseFloat(image.style.maxWidth);
  const aspectRatio = parseFloat(image.style.aspectRatio);
  // maxWidth가 적용되는 경우, 최종 너비를 maxWidth로 설정하고, 높이를 aspectRatio에 맞게 조정
  if (!isNaN(maxWidth) && maxWidth < w) {
    w = maxWidth;
    h = maxWidth / aspectRatio;
  }
  const samScale = LONG_SIDE_LENGTH / Math.max(h, w);
  return { height: h, width: w, samScale };
};

export { handleImageScale };
