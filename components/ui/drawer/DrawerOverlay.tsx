'use client';

interface DrawerOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  isClosing: boolean;
}

export function DrawerOverlay({
  children,
  onClose,
  isClosing,
}: DrawerOverlayProps) {
  return (
    <div className="fixed inset-0 z-max">
      <div
        className={`
          fixed inset-0 bg-black/30
          transition-opacity duration-300 ease-in-out pointer-events-auto cursor-pointer
          ${isClosing ? 'opacity-0' : 'opacity-100'}
        `}
        onClick={onClose}
      />
      {children}
    </div>
  );
}
