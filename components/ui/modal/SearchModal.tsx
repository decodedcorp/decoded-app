'use client';

import SearchBar from '@/components/Header/search/SearchBar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isScrolled: boolean;
}

export function SearchModal({
  isOpen,
  onClose,
  isScrolled,
}: SearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <SearchBar isOpen={isOpen} setIsOpen={onClose} isScrolled={isScrolled} />
    </div>
  );
} 