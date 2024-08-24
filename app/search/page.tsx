"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "@/common/firebase";
import { ArtistInfo, ArticleInfo, BrandInfo } from "@/types/model";
import { regular_font, semi_bold_font } from "@/components/helpers/util";

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState<ArtistInfo[]>([]);
  const [articleResults, setArticleResults] = useState<ArticleInfo[]>([]);
  const [brandResults, setBrandResults] = useState<BrandInfo[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      const artistsSnapshot = await FirebaseHelper.docs("artists");
      const articlesSnapshot = await FirebaseHelper.docs("articles");
      const brandsSnapshot = await FirebaseHelper.docs("brands");
      const artistResults: ArtistInfo[] = [];
      const articleResults: ArticleInfo[] = [];
      const brandResults: BrandInfo[] = [];

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

      articlesSnapshot.forEach((doc) => {
        const article = doc.data() as ArticleInfo;
        if (article.title.toLowerCase().includes(query.toLowerCase())) {
          articleResults.push(article);
        }
      });

      brandsSnapshot.forEach((doc) => {
        const brand = doc.data() as BrandInfo;
        if (brand.name.toLowerCase().includes(query.toLowerCase())) {
          console.log(brand, "brand");
          brandResults.push(brand);
        }
      });

      setSearchResults(artistResults);
      setArticleResults(articleResults);
      setBrandResults(brandResults);
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="mx-auto px-4 py-8 mt-20">
      <h1 className={`${semi_bold_font.className} text-3xl md:text-5xl mb-8`}>
        "{query}" 검색 결과
      </h1>
      {searchResults.length === 0 &&
      articleResults.length === 0 &&
      brandResults.length === 0 ? (
        <p className={`${regular_font.className} text-xl`}>
          현재 검색 결과가 없습니다.
        </p>
      ) : (
        <>
          {/* Artists Section */}
          {searchResults.length > 0 && (
            <div className="my-10">
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
                    <div className="relative w-[200px] h-[200px] hover:scale-105 transition-all duration-300">
                      <Image
                        src={artist.profileImgUrl || "/placeholder.jpg"}
                        alt={artist.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-full"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Brands Section */}
          {brandResults.length > 0 && (
            <div className="mb-12">
              <h2 className={`${semi_bold_font.className} text-2xl mb-6`}>
                Brands
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {brandResults.map((brand, index) => (
                  <Link
                    href={`/brands?name=${encodeURIComponent(brand.name)}`}
                    key={index}
                    className="block"
                  >
                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative w-full pb-[100%]">
                        <Image
                          src={brand.logoImageUrl || "/placeholder.jpg"}
                          alt={brand.name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="p-3">
                        <h2
                          className={`${semi_bold_font.className} text-sm mb-1 truncate`}
                        >
                          {brand.name}
                        </h2>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles Section */}
          {articleResults.length > 0 && (
            <div>
              <h2 className={`${semi_bold_font.className} text-2xl mb-6`}>
                Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articleResults.map((article, index) => (
                  <Link
                    key={index}
                    href={article.src as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {article.imageUrl && (
                      <div className="relative w-full pb-[56.25%]">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="p-2">
                      {article.source && (
                        <p
                          className={`${regular_font.className} text-gray-400 text-sm w-fit`}
                        >
                          {article.source.toUpperCase()}
                        </p>
                      )}
                      <h3
                        className={`${semi_bold_font.className} text-lg mt-2 line-clamp-2`}
                      >
                        {article.title}
                      </h3>
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
