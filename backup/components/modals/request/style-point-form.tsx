"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Trash2 } from "lucide-react";
import { Point } from "@/types/model.d";

// 스타일 포인트 인터페이스
export interface StylePoint extends Point {
  brand?: string;
  price?: string;
}

interface StylePointFormProps {
  selectedPoint: number | null;
  points: StylePoint[];
  currentStep: number;
  setPoints: (points: StylePoint[]) => void;
  setSelectedPoint: (point: number | null) => void;
  handleDeleteMarker: () => void;
}

export function StylePointForm({
  selectedPoint,
  points,
  currentStep,
  setPoints,
  setSelectedPoint,
  handleDeleteMarker,
}: StylePointFormProps) {
  const pointData = selectedPoint !== null ? points[selectedPoint] as StylePoint : null;
  const [localBrand, setLocalBrand] = useState("");
  const [localPrice, setLocalPrice] = useState("");
  
  // 선택된 점이 변경될 때마다 로컬 상태를 업데이트
  useEffect(() => {
    if (pointData) {
      setLocalBrand(pointData.brand || "");
      setLocalPrice(pointData.price || "");
    }
  }, [pointData]);
  
  const handleSave = () => {
    if (selectedPoint !== null) {
      const newPoints = [...points];
      newPoints[selectedPoint] = {
        ...newPoints[selectedPoint],
        brand: localBrand,
        price: localPrice
      } as StylePoint;
      setPoints(newPoints);
      setSelectedPoint(null);
    }
  };
  
  if (!pointData) return null;
  
  return (
    <Dialog 
      open={selectedPoint !== null && currentStep === 2} 
      onOpenChange={(open) => {
        // open이 false일 때만 처리하고, 아이템 정보 모달만 닫음
        if (!open) {
          setSelectedPoint(null);
        }
      }}
    >
      <DialogContent 
        className="bg-[#1A1A1A] border border-gray-700 p-5 rounded-lg max-w-xs w-full shadow-xl"
        onInteractOutside={(e) => {
          e.preventDefault();
          // 이벤트 전파 중단하여 부모 모달에 영향 없게 함
          e.stopPropagation();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          // 이벤트 전파 중단하여 부모 모달에 영향 없게 함
          e.stopPropagation();
        }}
        style={{ zIndex: 300000 }}
      >
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-base font-medium text-white">아이템 정보</DialogTitle>
          <button 
            onClick={(e) => {
              // 이벤트 전파 방지
              e.stopPropagation();
              setSelectedPoint(null);
            }}
            className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 block mb-1.5">브랜드</label>
            <input
              type="text"
              value={localBrand}
              onChange={(e) => setLocalBrand(e.target.value)}
              placeholder="브랜드명"
              className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-1.5">가격</label>
            <input
              type="text"
              value={localPrice}
              onChange={(e) => setLocalPrice(e.target.value)}
              placeholder="가격"
              className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
            />
          </div>
          
          <div className="flex space-x-3 mt-5">
            <button
              onClick={handleDeleteMarker}
              className="flex items-center justify-center py-2.5 px-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 rounded-md text-sm font-medium transition-colors"
            >
              <Trash2 size={15} className="mr-1.5" />
              마커 삭제
            </button>
            
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-[#EAFD66] text-[#1A1A1A] rounded-md text-sm font-medium hover:bg-[#EAFD66]/90 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 