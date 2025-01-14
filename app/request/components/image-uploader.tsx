import React, { useRef } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      onClick={() => inputRef.current?.click()}
      className="w-full p-4 rounded-lg text-sm text-gray-400 bg-[#1A1A1A] border border-gray-800 hover:bg-gray-900/50"
    >
      이미지 업로드하기
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
          }
        }}
        accept="image/*"
      />
    </button>
  );
}
