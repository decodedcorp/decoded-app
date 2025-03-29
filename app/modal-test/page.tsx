"use client";

import { useState } from "react";
import { StatusModal, StatusType } from "@/components/ui/modal/status-modal";

type StatusMessageKey =
  | "request"
  | "provide"
  | "save"
  | "default"
  | "unsavedChanges"
  | "delete"
  | "login";

export default function ModalTestPage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: StatusType;
    messageKey?: StatusMessageKey;
    title?: string;
    message?: string;
  }>({
    isOpen: false,
    type: "success",
  });

  const showModal = (params: {
    type: StatusType;
    messageKey?: StatusMessageKey;
    title?: string;
    message?: string;
  }) => {
    setModalState({
      isOpen: true,
      ...params,
    });
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="mb-8 text-2xl font-bold">상태 모달 테스트</h1>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              showModal({ type: "loading" });
              setTimeout(() => {
                showModal({
                  type: "success",
                  messageKey: "request",
                });
              }, 1000);
            }}
            className="rounded-md bg-green-500 px-4 py-2 text-white/80 hover:bg-green-600"
          >
            요청 성공 모달
          </button>

          <button
            onClick={() => {
              showModal({ type: "loading" });
              setTimeout(() => {
                showModal({
                  type: "success",
                  messageKey: "provide",
                });
              }, 1000);
            }}
            className="rounded-md bg-green-500 px-4 py-2 text-white/80 hover:bg-green-600"
          >
            제공 성공 모달
          </button>

          <button
            onClick={() => {
              showModal({
                type: "error",
                messageKey: "request",
              });
            }}
            className="rounded-md bg-red-500 px-4 py-2 text-white/80 hover:bg-red-600"
          >
            에러 모달
          </button>

          <button
            onClick={() => {
              showModal({
                type: "warning",
                messageKey: "login",
              });
            }}
            className="rounded-md bg-yellow-500 px-4 py-2 text-white/80 hover:bg-yellow-600"
          >
            로그인 경고 모달
          </button>

          <button
            onClick={() => {
              showModal({
                type: "success",
                title: "커스텀 성공",
                message: "직접 작성한 메시지입니다.",
              });
            }}
            className="rounded-md bg-green-500 px-4 py-2 text-white/80 hover:bg-green-600"
          >
            커스텀 메시지 모달
          </button>
        </div>
      </div>

      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        messageKey={modalState.messageKey}
        title={modalState.title}
        message={modalState.message}
      />
    </div>
  );
}
