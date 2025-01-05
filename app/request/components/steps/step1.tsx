import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface Step1Props {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  setImageFile: (file: File | null) => void;
}

export function Step1({ selectedImage, setSelectedImage, setImageFile }: Step1Props) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    setImageFile(file);
    const fileUrl = URL.createObjectURL(file);
    setSelectedImage(fileUrl);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-400">
          사진을 업로드해주세요
        </h2>
        <p className="text-gray-500">
          아이템 식별에 도움이 될 만한 선명한 사진을 올려주세요
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {!selectedImage ? (
          <div
            className={`
              relative
              aspect-[3/4]
              rounded-lg
              border-gray-700
              transition-all
              ${
                dragActive
                  ? 'border-yellow-400 bg-[#1A1A1A]'
                  : 'border-gray-700 bg-[#1A1A1A]'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFiles(e.target.files[0]);
                }
              }}
              accept="image/*"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#1A1A1A]">
              <div className="mb-4">
                <svg
                  className={`w-12 h-12 mb-3 ${
                    dragActive ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <p
                className={`mb-2 text-lg ${
                  dragActive ? 'text-yellow-600' : 'text-gray-600'
                }`}
              >
                {dragActive
                  ? '여기에 놓아주세요!'
                  : '이미지를 드래그하여 업로드하거나'}
              </p>

              <button
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-700 rounded-lg hover:bg-gray-100"
              >
                컴퓨터에서 선택
              </button>

              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG, GIF (최대 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Selected preview"
                fill
                className="object-cover"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="max-w-md mx-auto">
        <div className="bg-[#1A1A1A] rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">업로드 팁</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>선명하고 깨끗한 사진일수록 아이템 식별이 쉬워요</li>
                  <li>가능한 전신 사진을 올려주시면 좋아요</li>
                  <li>컨텍스트 정보는 아이템을 찾는데 큰 도움이 됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 