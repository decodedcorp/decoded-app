'use client';

import SearchBar from '@/components/Header/search/SearchBar';
import { ModalOverlay } from './ModalOverlay';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isScrolled: boolean;
  isClosing: boolean;
}

export function SearchModal({
  isOpen,
  onClose,
  isScrolled,
  isClosing,
}: SearchModalProps) {
  if (!isOpen && !isClosing) return null;

  return (
    <ModalOverlay onClose={onClose} isClosing={isClosing}>
      <SearchBar
        isOpen={!isClosing}
        setIsOpen={onClose}
        isScrolled={isScrolled}
      />
    </ModalOverlay>
  );
}
