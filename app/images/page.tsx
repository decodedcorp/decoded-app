"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  bold_font,
  regular_font,
  semi_bold_font,
} from "@/components/helpers/util";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ImageInfo,
  ArtistInfo,
  BrandInfo,
  HoverItem,
  ArticleInfo,
  DetailPageState,
} from "@/types/model";

function DetailPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId") ?? "";
  const imageUrl = searchParams.get("imageUrl") ?? "";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  if (!imageId || !imageUrl) {
    notFound();
  }
  // Detail page state
  let [detailPageState, setDetailPageState] = useState<DetailPageState>({});
  const totalPages = Math.ceil(
    (detailPageState.itemList?.length || 0) / itemsPerPage
  );
  const currentItems = detailPageState.itemList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Independent state
  let [hoverItem, setHoverItem] = useState<HoverItem | null>(null);
  let [isFetching, setIsFetching] = useState(false);

  const handleCurrentIndex = (index: number) => {
    const curr = itemsPerPage * (currentPage - 1) + index;
    setCurrentIndex(curr);
  };

  useEffect(() => {
    const fetchData = async () => {
      const imgDocId = decodeURIComponent(imageId);
      if (!(await FirebaseHelper.docExists("images", imgDocId))) {
        setIsFetching(false);
        return;
      }
      const img = (
        await FirebaseHelper.doc("images", imgDocId)
      ).data() as ImageInfo;
      const itemList: HoverItem[] = await FirebaseHelper.getHoverItems(
        imgDocId
      );
      var brandList: string[] = [];
      const brandLogo: Map<string, string> = new Map();
      var artistList: string[] = [];
      var artistArticleList: ArticleInfo[] = [];

      const colorInfo = img.colorInfo;

      // Image artist tags
      const imgArtistTags = img.tags?.artists;
      const brandTags = img.tags?.brands;

      brandList = Array.from(
        new Set(itemList.map((item) => item.info.brands || []).flat())
      );

      if (brandTags) {
        const brandInfoList = await Promise.all(
          brandTags.map(async (brandDocId) => {
            return (
              await FirebaseHelper.doc("brands", brandDocId)
            ).data() as BrandInfo;
          })
        );
        brandInfoList.map((brand) => {
          brandLogo.set(brand.name, brand.logoImageUrl ?? "");
        });
      }
      // Update image related artist stuff if any
      if (imgArtistTags) {
        const artistInfoList = await Promise.all(
          imgArtistTags.map(async (artistDocId) => {
            return (
              await FirebaseHelper.doc("artists", artistDocId)
            ).data() as ArtistInfo;
          })
        );
        await Promise.all(
          artistInfoList.map(async (a) => {
            // Update artist name list
            artistList.push(a.name);

            const artistArticleDocIdList = a.tags?.articles;

            if (artistArticleDocIdList) {
              const articles = await Promise.all(
                artistArticleDocIdList.map(async (articleDocId) => {
                  return (
                    await FirebaseHelper.doc("articles", articleDocId)
                  ).data() as ArticleInfo;
                })
              );
              artistArticleList = articles;
            }
          })
        );
      }
      setDetailPageState({
        img: img,
        itemList: itemList,
        brandList: brandList,
        brandImgList: brandLogo,
        artistList: artistList,
        artistArticleList: artistArticleList,
        colorInfo: colorInfo,
      });
      setIsFetching(false);
    };
    setIsFetching(true);
    fetchData();
  }, [imageId]);

  return (
    <div className="flex-col rounded-lg justify-center items-center z-0 p-2">
      <div className="flex flex-col text-center">
        {/* DESCRIPTION */}
        {detailPageState.img ? (
          <div className="flex flex-1">
            <div className="flex flex-col w-full text-center my-40">
              <h2 className={`${bold_font.className} text-4xl font-bold mb-4`}>
                {detailPageState.img.title}
              </h2>
              <p
                className={`${regular_font.className} text-lg md:text-md px-2 md:px-32 mt-2`}
              >
                {detailPageState.img.description}
              </p>
              <div className="flex flex-col items-center mt-10">
                <p className={`${bold_font.className} text-lg md:text-2xl`}>
                  ARTIST:
                </p>
                {detailPageState.artistList?.map((name, index) => (
                  <Link
                    key={index}
                    href={`/artists?name=${encodeURIComponent(name)}`}
                    className={`${semi_bold_font.className} text-md font-bold mx-2`}
                  >
                    <p className="underline">{name.toUpperCase()}</p>
                  </Link>
                ))}
              </div>
              {/* List all colors */}
              {detailPageState.colorInfo?.style?.length && (
                <div className="items-center justify-center my-5">
                  <p className={`${bold_font.className} text-lg md:text-2xl`}>
                    STYLE COLORS:{" "}
                  </p>
                  <div className="flex flex-row w-full justify-center">
                    {detailPageState?.colorInfo?.style?.map((color) => (
                      <div
                        key={color}
                        className="w-10 h-10 rounded-full m-2"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col md:flex-row justify-center px-2 md:px-20 mt-10">
                <div className="w-full">
                  <div className="relative w-full aspect-w-3 aspect-h-4">
                    <Image
                      src={imageUrl}
                      alt="Featured fashion"
                      fill={true}
                      style={{ objectFit: "cover" }}
                    />
                    <div className="w-full">
                      {detailPageState.img &&
                        detailPageState.itemList
                          ?.sort((a, b) => {
                            // top 값 비교
                            const topA = parseInt(a.pos.top || "0%");
                            const topB = parseInt(b.pos.top || "0%");
                            if (topA !== topB) {
                              return topA - topB;
                            }
                            // top 값이 같을 경우 left 값 비교
                            const leftA = parseInt(a.pos.left || "0%");
                            const leftB = parseInt(b.pos.left || "0%");
                            return leftA - leftB;
                          })
                          .map((item, index) => (
                            <a
                              key={item.info.name}
                              href={item.info?.affiliateUrl ?? ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                position: "absolute",
                                top: item.pos.top,
                                left: item.pos.left,
                                cursor: "pointer",
                              }}
                              className="point"
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    currentIndex === index
                                      ? "red"
                                      : "transparent",
                                  boxShadow: "0 0 2px 2px rgba(0, 0, 0, 0.2)",
                                }}
                              ></div>
                            </a>
                          ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col bg-black w-full h-auto justify-between">
                  <div className="grid grid-cols-2 justify-center p-10">
                    {currentItems?.map((item, index) => (
                      <div key={index} className="justify-center">
                        <div className="flex items-center justify-center">
                          <Image
                            src={
                              detailPageState.brandImgList?.get(
                                item.info.brands?.[0] ?? ""
                              ) ?? ""
                            }
                            alt={item.info.brands?.[0] ?? ""}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <p className={`${bold_font.className} text-lg ml-2`}>
                            {item.info.brands?.[0].toUpperCase()}
                          </p>
                        </div>
                        <Link
                          href={item.info.affiliateUrl ?? ""}
                          className="flex flex-col items-center justify-center p-10  hover:scale-105 transition-all duration-300"
                          onMouseOver={() => handleCurrentIndex(index)}
                        >
                          <Image
                            src={item.info.imageUrl ?? ""}
                            alt={item.info.name}
                            width={300}
                            height={300}
                            className="w-full"
                          />
                          <div className="flex flex-col w-full items-center mt-2">
                            <p
                              className={`${regular_font.className} text-sm md:text-md mt-2`}
                            >
                              {item.info.name}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/* IMAGE */}
        {isFetching ? (
          <div className="flex justify-center items-center ">
            <h1
              className={`${bold_font.className} text-7xl md:text-5xl loading-text p-5`}
            >
              LOADING
            </h1>
          </div>
        ) : (
          <div className="bg-white mt-20 custom-shadow z-10">
            <div className="flex flex-row rounded-lg">
              <div className="flex justify-center items-center w-full sm:h-auto"></div>
            </div>
          </div>
        )}
      </div>
      {/** Sub Images */}
      {/* <div className="flex flex-row flex-wrap w-full justify-center">
        {detailPageState?.img?.subImageUrls?.map((image, index) => (
          <div key={index} className={"sub-image-container m-2 w-1/2"}>
            <Image
              src={image}
              alt="Sub Image"
              width={300}
              height={300}
              className="w-full"
            />
          </div>
        ))}
      </div> */}
      {/** More tagged */}
      <div className="w-full text-center">
        {detailPageState.artistImgList &&
          detailPageState.artistImgList.length > 0 && (
            <div>
              <h2 className="text-xl">More to explore</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-0 items-stretch place-items-stretch my-10">
                {detailPageState.artistImgList.map((image) => (
                  <Link
                    key={image[0]}
                    href={`?imageId=${image[0]}&imageUrl=${encodeURIComponent(
                      image[1]
                    )}`}
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full h-[600px]"
                  >
                    <Image
                      src={image[1]}
                      alt="Artist Image"
                      fill={true}
                      style={{ objectFit: "cover" }}
                      className="more-tagged border border-black"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default DetailPage;
