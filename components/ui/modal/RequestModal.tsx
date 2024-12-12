'use client';

import { useState } from "react";
import Image from "next/image";
import { pretendardBold } from "@/lib/constants/fonts";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col w-[50vw] h-[90vh] p-4 rounded-xl bg-[#101011] overflow-y-auto">
        <div className="flex flex-col items-center w-full">
          <ModalHeader />
          <ImageUploadSection
            selectedImage={selectedImage}
            onImageChange={setSelectedImage}
          />
          <ActionButtons
            hasImage={!!selectedImage}
            onClose={() => {
              setSelectedImage(null);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ModalHeader() {
  return (
    <div className="flex flex-col text-center mb-5">
      <h2 className={`${pretendardBold.className} text-lg`}>
        아이템 정보 요청하기
      </h2>
    </div>
  );
}

interface ImageUploadSectionProps {
  selectedImage: File | null;
  onImageChange: (file: File | null) => void;
}

function ImageUploadSection({ selectedImage, onImageChange }: ImageUploadSectionProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {selectedImage && (
        <div className="mb-4">
          <label htmlFor="imageUpload" className="btn cursor-pointer">
            이미지 선택
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center mb-4">
        {selectedImage ? (
          <Image
            src={URL.createObjectURL(selectedImage)}
            fill={true}
            style={{ objectFit: "contain" }}
            alt="업로드된 이미지"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <ImageUploadButton onImageUpload={handleImageUpload} />
        )}
      </div>
    </div>
  );
}

interface ImageUploadButtonProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function ImageUploadButton({ onImageUpload }: ImageUploadButtonProps) {
  return (
    <div>
      <label htmlFor="imageUpload" className="btn cursor-pointer">
        이미지 선택
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </div>
  );
}

interface ActionButtonsProps {
  hasImage: boolean;
  onClose: () => void;
}

function ActionButtons({ hasImage, onClose }: ActionButtonsProps) {
  return (
    <div className="flex flex-1 mt-4 justify-center items-center">
      {hasImage && (
        <button className="btn w-full ml-4">업로드</button>
      )}
      <button
        className="btn w-full ml-4"
        onClick={onClose}
      >
        취소
      </button>
    </div>
  );
} 