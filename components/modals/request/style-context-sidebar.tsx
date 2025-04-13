"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/style";

// 스타일 영감 링크 인터페이스
export interface InspirationLink {
  id: string;
  category: string;
  url: string;
}

// 컨텍스트 응답 인터페이스
export interface ContextAnswer {
  location?: string;
  inspirationLinks?: InspirationLink[];
}

interface StyleContextSidebarProps {
  onAnswerChange: (answer: ContextAnswer) => void;
  onSubmit?: () => void;
  isMobile?: boolean;
}

export function StyleContextSidebar({
  onAnswerChange,
  onSubmit,
  isMobile = false,
}: StyleContextSidebarProps) {
  const [inspirationLinks, setInspirationLinks] = useState<InspirationLink[]>([]);
  const [newUrl, setNewUrl] = useState("");
  
  // 모바일 시트 관련 상태 추가
  const [sheetHeight, setSheetHeight] = useState<number>(isMobile ? 42 : 100);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetPosition, setSheetPosition] = useState<"collapsed" | "middle" | "expanded">("middle");
  
  const handleAddInspirationLink = () => {
    if (newUrl.trim()) {
      const newLinks = [
        ...inspirationLinks,
        {
          id: String(inspirationLinks.length),
          category: "링크",
          url: newUrl.trim(),
        },
      ];
      setInspirationLinks(newLinks);
      setNewUrl("");
      
      // 링크 추가 후 부모에게 바로 알림
      onAnswerChange({
        location: "스타일",
        inspirationLinks: newLinks
      });
    }
  };

  const handleRemoveInspirationLink = (id: string) => {
    const newLinks = inspirationLinks.filter(link => link.id !== id);
    setInspirationLinks(newLinks);
    
    // 링크 삭제 후 부모에게 바로 알림
    onAnswerChange({
      location: "스타일",
      inspirationLinks: newLinks
    });
  };

  // 모바일 시트 드래그 관련 핸들러 추가
  const handleDrag = (info: any) => {
    if (!isMobile) return;

    const newHeight = Math.max(
      20,
      Math.min(90, sheetHeight - info.delta.y * 0.2)
    );
    setSheetHeight(newHeight);
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);

    if (sheetHeight < 25) {
      setSheetHeight(20);
      setSheetPosition("collapsed");
    } else if (sheetHeight > 60) {
      setSheetHeight(80);
      setSheetPosition("expanded");
    } else {
      setSheetHeight(42);
      setSheetPosition("middle");
    }
  };

  const toggleSheetHeight = () => {
    if (sheetPosition !== "expanded") {
      setSheetHeight(80);
      setSheetPosition("expanded");
    } else {
      setSheetHeight(42);
      setSheetPosition("middle");
    }
  };

  const handleBackdropClick = () => {
    if (sheetPosition === "expanded") {
      setSheetHeight(42);
      setSheetPosition("middle");
    } else {
      setSheetHeight(20);
      setSheetPosition("collapsed");
    }
  };

  return (
    <>
      {isMobile && (
        <div
          className="fixed top-16 inset-x-0 bottom-0 bg-black/30 z-30"
          style={{
            opacity: sheetPosition === "collapsed" ? 0 : 0.3,
            transition: "opacity 0.3s ease",
          }}
          onClick={handleBackdropClick}
        />
      )}

      <motion.div
        className={cn(
          "w-full h-full flex flex-col bg-[#1A1A1A]",
          isMobile &&
            "fixed bottom-0 left-0 right-0 rounded-t-2xl shadow-lg z-40"
        )}
        style={
          isMobile
            ? {
                height: `${sheetHeight}vh`,
                transition: isDragging
                  ? "none"
                  : "height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }
            : undefined
        }
        initial={isMobile ? { y: "100%" } : undefined}
        animate={isMobile ? { y: 0 } : undefined}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {isMobile && (
          <motion.div
            className="h-10 w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing py-3 bg-[#1A1A1A]"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDrag={handleDrag}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTap={toggleSheetHeight}
          >
            <div className="w-14 h-1 bg-zinc-600 rounded-full mb-1"></div>
            {sheetPosition !== "expanded" && (
              <span className="text-xs text-zinc-500 mt-1">펼쳐서 보기</span>
            )}
          </motion.div>
        )}
        <div className="p-5 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                영감 링크 추가
              </label>
              
              {/* 링크 입력 폼 */}
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="URL을 입력하세요"
                  className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
                />
                <button
                  onClick={handleAddInspirationLink}
                  disabled={!newUrl.trim()}
                  className={cn(
                    "w-full py-2.5 text-sm rounded-md transition-colors font-medium",
                    newUrl.trim() 
                      ? "bg-[#EAFD66] text-[#1A1A1A] hover:bg-[#EAFD66]/90" 
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  )}
                >
                  링크 추가
                </button>
              </div>
            </div>
            
            {/* 추가된 링크 목록 */}
            {inspirationLinks.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-medium text-white mb-3">추가된 영감 링크</h3>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {inspirationLinks.map(link => (
                    <div 
                      key={link.id} 
                      className="flex items-center justify-between p-3 bg-[#232323] border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center max-w-[90%]">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate"
                        >
                          {link.url}
                        </a>
                      </div>
                      <button
                        onClick={(e) => {
                          // 이벤트 전파 방지
                          e.stopPropagation();
                          handleRemoveInspirationLink(link.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
} 