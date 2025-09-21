'use client';

import React, { ReactNode } from 'react';

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ModalHeader({ children, className = '' }: ModalHeaderProps) {
  return (
    <div className={`flex-shrink-0 border-b border-gray-200 p-4 ${className}`}>{children}</div>
  );
}

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  return <div className={`flex-1 overflow-y-auto p-4 ${className}`}>{children}</div>;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`flex-shrink-0 border-t border-gray-200 p-4 ${className}`}>{children}</div>
  );
}
