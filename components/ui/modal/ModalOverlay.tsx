'use client';

interface ModalOverlayProps {
  onClose: () => void;
  children: React.ReactNode;
  isClosing: boolean;
}

export function ModalOverlay({
  onClose,
  children,
  isClosing,
}: ModalOverlayProps) {
  return (
    <div
      className={`
        fixed inset-0 z-overlay
        transition-all duration-300 ease-in-out cursor-pointer
        ${isClosing ? 'opacity-0' : 'opacity-100'}
        bg-black/60
      `}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cursor-default">
        {children}
      </div>
    </div>
  );
}
