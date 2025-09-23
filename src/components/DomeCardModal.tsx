'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DomeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    src: string;
    alt: string;
    id?: string;
    url?: string;
    channelName?: string;
    title?: string;
    description?: string;
  } | null;
}

export function DomeCardModal({ isOpen, onClose, item }: DomeCardModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-zinc-800/90 hover:bg-zinc-800 rounded-full shadow-lg transition-colors"
        >
          <X className="w-5 h-5 text-zinc-300" />
        </button>

        {/* Image Section with Overlay */}
        <div className="relative h-80">
          <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Channel Name - Top Left */}
          {item.channelName && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[#EAFD66] text-[#111111] text-sm font-medium rounded-full shadow-lg">
                {item.channelName}
              </span>
            </div>
          )}

          {/* Title - Bottom with Background */}
          <div className="absolute bottom-0 left-0 right-0">
            {/* Background for better readability */}
            <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
              <h2 className="text-lg font-bold text-white line-clamp-2 drop-shadow-lg">
                {item.title || item.alt || 'Untitled'}
              </h2>
              {item.description && (
                <p className="text-white/90 text-sm mt-1 line-clamp-2 drop-shadow-lg">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
