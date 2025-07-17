"use client";

import { ProvideData } from "@/types/model.d";
import useModalClose from "@/lib/hooks/common/useModalClose";
import {
  StatusModal,
  StatusType,
  StatusMessageKey,
} from "@/components/ui/modal/status-modal";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface LinkFormSectionProps {
  showLinkForm: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onProvideDataChange: (data: ProvideData) => void;
}

export default function LinkFormSection({
  showLinkForm,
  onClose,
  onSubmit,
  onProvideDataChange,
}: LinkFormSectionProps) {
  const [modalConfig, setModalConfig] = useState<{
    type: StatusType;
    messageKey?: StatusMessageKey;
    isOpen: boolean;
    onClose: () => void;
  }>({
    type: "warning",
    messageKey: "login",
    isOpen: false,
    onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
  });

  const [link, setLink] = useState("");
  const { handleClose, isClosing, modalRef } = useModalClose({
    onClose,
  });

  useEffect(() => {
    if (!showLinkForm) {
      setLink("");
      onProvideDataChange({ links: [] });
    }
  }, [showLinkForm, onProvideDataChange]);

  useEffect(() => {
    if (window.sessionStorage.getItem("USER_DOC_ID") === null) {
      setModalConfig({
        type: "warning",
        messageKey: "login",
        isOpen: true,
        onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!showLinkForm) {
      setModalConfig({
        type: "error",
        isOpen: true,
        onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
  }, [showLinkForm]);

  const handleSubmit = () => {
    onSubmit();
    handleClose();
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLink(url);
    onProvideDataChange({
      links: [url],
    });
  };

  if (!showLinkForm) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-[100] bg-black/60
        transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
    >
      <div
        ref={modalRef}
        className={`bg-[#111111] p-6 rounded-lg w-full max-w-md space-y-4 
          transition-transform duration-300 ${
            isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
      >
        <h3 className="text-lg font-medium text-white/80 mb-4">
          링크 제공하기
        </h3>
        <input
          type="url"
          placeholder="아이템과 관련된 링크를 입력하세요"
          value={link}
          className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-white/5 
                  text-white/80 placeholder-gray-500 focus:border-[#EAFD66] 
                  focus:ring-1 focus:ring-[#EAFD66] transition-colors outline-none
                  hover:border-white/10"
          onChange={handleLinkChange}
        />
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium
                      hover:border-gray-400 hover:text-white/80 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!link.trim()}
            className={`
              flex-1 px-6 py-3 rounded-lg font-medium transition-colors
              ${
                link.trim()
                  ? "bg-[#EAFD66] text-black hover:bg-[#d9ec55] shadow-lg"
                  : "bg-[#1A1A1A] text-gray-500 cursor-not-allowed"
              }
            `}
          >
            제출하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
