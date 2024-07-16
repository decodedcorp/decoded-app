import { Dispatch, SetStateAction } from "react";

function SearchBar({
  setSearch,
}: {
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-1 w-full bg-white justify-center border-b border-black">
      <input
        type="text"
        placeholder="Search"
        className="flex-1 w-full p-3 bg-white border-none outline-none"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
