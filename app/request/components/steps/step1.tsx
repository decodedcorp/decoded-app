"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUploader } from "../image-uploader";

interface Step1Props {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  setImageFile: (file: File | null) => void;
}

export function Step1({
  selectedImage,
  setSelectedImage,
  setImageFile,
}: Step1Props) {
  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const fileUrl = URL.createObjectURL(file);
    setSelectedImage(fileUrl);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-400 text-center">
        이미지를 업로드해주세요
      </h2>

      <div className="flex gap-6 h-[427px]">
        {/* 이미지 영역 */}
        <div className="w-[320px] flex-shrink-0">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt="Selected image"
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full bg-[#1A1A1A] flex items-center justify-center">
                <p className="text-xs text-gray-500">이미지를 업로드해주세요</p>
              </div>
            )}
          </div>
        </div>

        {/* 안내사항 영역 */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#1A1A1A] rounded-lg divide-y divide-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-xs">
                  !
                </span>
                <h3 className="text-xs font-medium text-gray-400">
                  필수 입력사항
                </h3>
              </div>
              <div className="ml-7">
                <p className="text-xs text-gray-500">
                  아이템을 찾고 싶은 이미지를 업로드해주세요
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-gray-900 text-gray-400 flex items-center justify-center text-xs">
                  ?
                </span>
                <h3 className="text-xs font-medium text-gray-400">도움말</h3>
              </div>
              <div className="ml-7">
                <ul className="text-xs space-y-1 text-gray-500">
                  <li>• 이미지는 최대 5MB까지 업로드 가능합니다</li>
                  <li>• jpg, jpeg, png 형식의 이미지만 업로드 가능합니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 업로드 버튼 */}
          <div className="mt-4">
            <ImageUploader onUpload={handleImageUpload} />
          </div>
        </div>
      </div>
    </div>
  );
}
