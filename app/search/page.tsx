import { SearchResults } from "@/app/search/components/searchResults";
import { SearchHeader } from "@/app/search/components/searchHeader";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-4">
        <SearchHeader />
        <SearchResults />
      </div>
    </div>
  );
}
