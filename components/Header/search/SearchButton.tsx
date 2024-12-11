'use client';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function SearchButton({
  isSearchOpen,
  toggleSearch,
}: {
  isSearchOpen: boolean;
  toggleSearch: () => void;
}) {
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
