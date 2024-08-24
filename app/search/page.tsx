"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "@/common/firebase";
import { ArtistInfo } from "@/types/model";
import { regular_font, semi_bold_font } from "@/components/helpers/util";

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState<ArtistInfo[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      const artistsSnapshot = await FirebaseHelper.docs("artists");
      const artistResults: ArtistInfo[] = [];

      artistsSnapshot.forEach((doc) => {
        const artist = doc.data() as ArtistInfo;
        const searchableFields = [
          artist.name,
          ...(artist.also_known_as || []),
          ...Object.values(artist.group || {}),
        ]
          .filter(Boolean)
          .map((field) => field.toLowerCase());

        if (
          searchableFields.some((field) => field.includes(query.toLowerCase()))
        ) {
          artistResults.push(artist);
        }
      });

      setSearchResults(artistResults);
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className={`${semi_bold_font.className} text-3xl mb-8`}>
        Search Results for "{query}"
      </h1>
      {searchResults.length === 0 ? (
        <p className={`${regular_font.className} text-xl`}>
          현재 검색 결과가 없습니다.
        </p>
      ) : (
        <>
          {/* Artists Section */}
          {searchResults.length > 0 && (
            <div className="mb-12">
              <h2 className={`${semi_bold_font.className} text-2xl mb-6`}>
                Artists
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {searchResults.map((artist, index) => (
                  <Link
                    href={`/artists?name=${encodeURIComponent(artist.name)}`}
                    key={index}
                    className="block"
                  >
                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative w-full pb-[100%]">
                        <Image
                          src={artist.profileImgUrl || "/placeholder.jpg"}
                          alt={artist.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="p-3">
                        <h2
                          className={`${semi_bold_font.className} text-sm mb-1 truncate`}
                        >
                          {artist.name}
                        </h2>
                        {artist.group && (
                          <p
                            className={`${regular_font.className} text-gray-400 text-xs truncate`}
                          >
                            {Object.values(artist.group).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPage;
