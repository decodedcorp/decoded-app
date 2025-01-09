'use client';

import useModalClose from '@/lib/hooks/common/useModalClose';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode | ((props: { isClosing: boolean; handleClose: () => void }) => React.ReactNode);
}

export function AnimatedModal({
  isOpen,
  onClose,
  children,
}: AnimatedModalProps) {
  const { isClosing, handleClose } = useModalClose({ onClose });

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-overlay
        transition-all duration-300 ease-in-out cursor-pointer
        ${isClosing ? 'opacity-0' : 'opacity-100'}
        bg-black/60
      `}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="cursor-default">
        {typeof children === 'function'
          ? children({ isClosing, handleClose })
          : children}
      </div>
    </div>
  );
}
