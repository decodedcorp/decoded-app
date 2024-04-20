import { useState } from "react";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { custom_font } from "./helpers/util";

function Search() {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <div className="flex bg-gray-200 rounded-full w-full ml-10 mr-16 relative">
      <form
        className={`flex items-center px-2 w-full ${custom_font.className}`}
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none p-2 rounded-full bg-gray-200"
          value={searchValue}
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

export default Search;
