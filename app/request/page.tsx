"use client";

import { networkManager } from "@/common/network";
import { arrayBufferToBase64 } from "@/common/util";
import React, { useState, useEffect, useRef } from "react";
import { Position, Point, RequestedItem, RequestImage } from "@/types/model";
import Image from "next/image";

const RequestSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  // State of navigation
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // State of step2
  const [imageFile, setImageFile] = useState<File | null>(null);
  // State of step3
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    switch (currentStep) {
      case 1:
        setIsStepComplete(!!selectedImage);
        break;
      case 2:
        setIsStepComplete(points.length > 0);
        break;
      default:
        setIsStepComplete(false);
    }
  }, [currentStep, selectedImage, points]);

  const defaultState = () => {
    setCurrentStep(1);
    setSelectedImage(null);
    setImageFile(null);
    setPoints([]);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("Please select a celebrity and upload an image");
      return;
    }
    const items: RequestedItem[] = [];
    for (const point of points) {
      items.push({
        position: {
          top: point.y.toString(),
          left: point.x.toString(),
        },
        context: point.context,
      });
    }
    const buffer = await imageFile?.arrayBuffer();
    const base64Image = arrayBufferToBase64(buffer);
    const requestBy = window.sessionStorage.getItem("USER_DOC_ID");
    if (!requestBy) {
      alert("로그인이 필요합니다.");
      return;
    }
    const requestImage: RequestImage = {
      requestedItems: items,
      requestBy: requestBy,
      imageFile: base64Image,
      metadata: {},
    };
    networkManager
      .request("image/request", "POST", requestImage)
      .then(() => {
        alert("요청이 완료되었습니다.");
        defaultState();
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.description || "요청 중 오류가 발생했습니다.";
        console.error("요청 실패:", errorMessage);
        alert(errorMessage);
      });
  };

  // Next Button Component
  const NextButton = () => (
    <button
      onClick={() => setCurrentStep((prev) => prev + 1)}
      disabled={!isStepComplete}
      className={`
        px-6 py-2 rounded-md text-sm font-medium
        transition-all duration-200
        ${
          isStepComplete
            ? "bg-[#1A1A1A] text-gray-400 hover:bg-black/50"
            : "bg-[#1A1A1A] text-gray-400 cursor-not-allowed"
        }
      `}
    >
      다음
    </button>
  );

  // Previous Button Component
  const PrevButton = () => (
    <button
      onClick={() => setCurrentStep((prev) => prev - 1)}
      className="px-6 py-2 rounded-md text-sm font-medium text-gray-400 bg-[#1A1A1A] hover:bg-black/50"
    >
      이전
    </button>
  );

  const StepIndicator = () => (
    <div className="w-full mb-20">
      <div className="relative pt-1">
        {/* 프로그레스 바 컨테이너 - 너비 제한 */}
        <div className="max-w-[120px] mx-auto relative">
          {/* 프로그레스 바 */}
          <div className="absolute top-[11px] w-full">
            <div className="h-[2px] bg-[#070707]">
              <div
                className="h-[2px] bg-[#EAFD66] transition-all duration-500 relative"
                style={{
                  width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* 스텝 마커들 */}
          <div className="flex items-center justify-between">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="relative">
                {/* 현재 스텝의 링 애니메이션 */}
                {currentStep === index + 1 && (
                  <>
                    <div className="absolute -inset-1 rounded-full border-2 border-[#EAFD66]/30 animate-ping" />
                    <div className="absolute -inset-1 rounded-full border-2 border-[#EAFD66]/30" />
                  </>
                )}

                {/* 스텝 마커 */}
                <div
                  className={`
                    w-5 h-5 rounded-full 
                    ${
                      index + 1 < currentStep
                        ? "bg-[#EAFD66]" // 완료된 스텝
                        : index + 1 === currentStep
                        ? "bg-[#EAFD66]" // 현재 스텝
                        : "border-[2.5px] border-[#333333] bg-transparent" // 미완료 스텝
                    }
                  `}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Step1 = () => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
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
                    ? "border-yellow-400 bg-[#1A1A1A]"
                    : "border-gray-700 bg-[#1A1A1A]"
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
                      dragActive ? "text-yellow-400" : "text-gray-400"
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
                    dragActive ? "text-yellow-600" : "text-gray-600"
                  }`}
                >
                  {dragActive
                    ? "여기에 놓아주세요!"
                    : "이미지를 드래그하여 업로드하거나"}
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
                <h3 className="text-sm font-medium text-yellow-800">
                  업로드 팁
                </h3>
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
  };

  const Step2 = () => {
    const imageRef = useRef<HTMLDivElement>(null);

    const handleImageClick = (e: React.MouseEvent) => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setPoints([...points, { x, y }]);
    };

    const updatePointContext = (index: number, context: string) => {
      setPoints(
        points.map((point, i) => (i === index ? { ...point, context } : point))
      );
    };

    const removePoint = (index: number) => {
      setPoints(points.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-400 text-center mb-8">
          궁금한 아이템을 선택해주세요
        </h2>

        <div className="max-w-2xl mx-auto space-y-2 text-gray-600">
          <p className="text-sm">
            이미지를 클릭하여 궁금한 아이템의 위치를 표시해주세요
          </p>
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <p className="font-medium text-gray-400">필수 입력사항</p>
            <div className="mt-2 flex items-start space-x-2">
              <div className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-400">아이템 선택</p>
                <p className="text-gray-600 text-sm">
                  최소 1개 이상의 아이템을 선택해주세요
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-3 text-sm text-gray-400">
            <p className="font-medium">주의사항</p>
            <ul className="mt-1 text-xs space-y-1 list-disc list-inside">
              <li>최소 1개 이상의 아이템을 선택해야 합니다</li>
              <li>
                선택한 위치를 삭제하려면 마커에 마우스를 올린 후 X 버튼을
                클릭하세요
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {selectedImage && (
            <div
              ref={imageRef}
              className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-crosshair"
              onClick={handleImageClick}
            >
              <Image
                src={selectedImage}
                alt="Selected preview"
                fill
                className="object-cover"
              />

              {points.map((point, index) => (
                <div
                  key={index}
                  className="absolute w-6 h-6 -ml-3 -mt-3 group"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <div className="relative">
                    <div className="absolute w-4 h-4 animate-ping rounded-full bg-[#EAFD66] opacity-75"></div>
                    <div className="relative w-4 h-4 rounded-full bg-[#EAFD66] flex items-center justify-center">
                      <span className="text-xs text-black font-bold">
                        {index + 1}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePoint(index);
                      }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white 
                        flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Point List */}
          {points.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-gray-900">선택한 아이템</h3>
              <div className="space-y-3">
                {points.map((point, index) => (
                  <div
                    key={index}
                    className="bg-[#1A1A1A] rounded-lg overflow-hidden"
                  >
                    {/* 헤더 부분 */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 rounded-full bg-[#EAFD66] flex items-center justify-center">
                          <span className="text-xs text-black font-bold rounded-full p-1">
                            {index + 1}
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={() => removePoint(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <svg
                          className="w-5 h-5"
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

                    {/* 컨텍스트 입력 영역 */}
                    <div className="p-3">
                      <textarea
                        rows={2}
                        value={point.context || ""}
                        onChange={(e) =>
                          updatePointContext(index, e.target.value)
                        }
                        className="w-full text-sm p-2 rounded-md bg-[#1A1A1A] text-gray-400"
                        placeholder="이 아이템에 대한 추가 정보를 입력해주세요 (선택사항)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {points.length === 0 && (
            <div className="mt-6 text-center text-gray-500">
              이미지를 클릭하여 궁금한 아이템을 선택해주세요
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative mt-20 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 pb-24">
        <StepIndicator />
        <div className="mt-8">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <div>{currentStep > 1 && <PrevButton />}</div>
          <div>
            {currentStep < totalSteps && <NextButton />}
            {currentStep === totalSteps && (
              <button
                onClick={handleSubmit}
                disabled={!isStepComplete}
                className={`
                  px-6 py-2 rounded-md text-sm font-medium
                  transition-all duration-200
                  ${
                    isStepComplete
                      ? "bg-[#1A1A1A] text-[#EAFD66] hover:bg-black/50"
                      : "bg-[#1A1A1A] text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                완료
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestSection;
