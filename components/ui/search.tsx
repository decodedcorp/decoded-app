function SearchBar({ setSearch }: { setSearch: (value: string) => void }) {
  return (
    <div className="flex flex-1 w-full bg-gray-200 justify-center rounded-xl">
      <input
        type="text"
        placeholder="Search"
        className="flex-1 w-full p-3 bg-gray-200 border-none outline-none rounded-full"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
