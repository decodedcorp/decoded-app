"use client";

import { LoginModal as LoginContent } from '@/components/ui/modal/LoginModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <LoginContent isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
