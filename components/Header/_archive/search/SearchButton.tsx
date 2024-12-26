'use client';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface SearchButtonProps {
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

function SearchButton({ isSearchOpen, toggleSearch }: SearchButtonProps) {
  return (
    <>
      {isSearchOpen ? (
        <CloseIcon
          className="cursor-pointer text-white mr-4"
          onClick={toggleSearch}
        />
      ) : (
        <SearchIcon
          className="cursor-pointer text-white mr-4"
          onClick={toggleSearch}
        />
      )}
    </>
  );
}

export default SearchButton;
