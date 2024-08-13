import { regular_font } from "@/components/helpers/util";

function SearchBar({ setSearch }: { setSearch: (value: string) => void }) {
  return (
    <div
      className={`flex flex-1 w-full bg-[#373737] justify-center rounded-md ${regular_font.className}`}
    >
      <input
        type="text"
        placeholder="검색하기"
        className="flex-1 w-full p-3 bg-[#373737] opacity-60 border-none outline-none rounded-md text-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
