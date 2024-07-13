import { Dispatch, SetStateAction } from "react";

function SearchBar({
  setSearch,
}: {
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-1 w-full bg-white rounded-md top-14 md:top-24 sticky z-20 justify-center">
      <input
        type="text"
        placeholder="Search.."
        className="flex-1 w-full p-2 md:p-4 bg-white rounded-md border-none outline-none"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
