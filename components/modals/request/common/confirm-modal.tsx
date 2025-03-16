import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "변경사항을 취소하시겠습니까?",
  message = "페이지를 나가면 변경사항이 저장되지 않습니다.",
  confirmText = "종료하기",
  cancelText = "계속 편집",
  isDestructive = true
}: ConfirmModalProps) {
  // ESC 키 처리
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // 외부 클릭 처리 추가
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      onClose();
    }
  };
  
  // 확인 버튼 처리
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };
  
  // 취소 버튼 처리 
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };
  
  // 모달이 열려 있지 않으면 렌더링하지 않음
  if (!isOpen) return null;
  
  // Portal을 사용하여 DOM 최상위에 렌더링
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999999]"
      onClick={handleBackdropClick}
      style={{
        backdropFilter: 'blur(2px)',
        pointerEvents: 'auto',
      }}
    >
      <div 
        className="bg-[#222222] text-white rounded-lg w-[90%] max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        {/* 내용 영역 */}
        <div className="px-7 py-6 text-center">
          <h3 className="text-xl font-medium text-white mb-3">
            {title}
          </h3>
          <p className="text-[15px] text-gray-400 mx-auto">
            {message}
          </p>
        </div>
        
        {/* 구분선 */}
        <div className="h-[1px] bg-gray-800 w-full"></div>
        
        {/* 종료하기 버튼 (빨간색) */}
        <button
          className="w-full text-center py-4 text-[#f44336] hover:bg-[#2a2a2a] transition-colors font-medium text-[15px] cursor-pointer"
          onClick={handleConfirm}
          type="button"
        >
          {confirmText}
        </button>
        
        {/* 구분선 */}
        <div className="h-[1px] bg-gray-800 w-full"></div>
        
        {/* 계속 편집 버튼 (흰색) */}
        <button
          className="w-full text-center py-4 text-white hover:bg-[#2a2a2a] transition-colors font-medium text-[15px] cursor-pointer"
          onClick={handleCancel}
          type="button"
        >
          {cancelText}
        </button>
      </div>
    </div>,
    document.body
  );
} 