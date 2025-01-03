'use client';

import { SearchBar } from '@/components/Header/search/SearchBar';
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
  isClosing,
}: SearchModalProps) {
  if (!isOpen && !isClosing) return null;

  return (
    <ModalOverlay onClose={onClose} isClosing={isClosing}>
      <SearchBar
        onSearch={(query) => console.log(query)}
      />
    </ModalOverlay>
  );
}
