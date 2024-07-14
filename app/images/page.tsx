"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { main_font, secondary_font } from "@/components/helpers/util";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ImageInfo,
  ArtistInfo,
  HoverItem,
  ItemInfo,
  ColorInfo,
  ArticleInfo,
  DetailPageState,
} from "@/types/model";

function DetailPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId") ?? "";
  const imageUrl = searchParams.get("imageUrl") ?? "";
  if (!imageId || !imageUrl) {
    notFound();
  }
  // Detail page state
  let [detailPageState, setDetailPageState] = useState<DetailPageState>({});

  // Independent state
  let [hoverItem, setHoverItem] = useState<HoverItem | null>(null);
  let [isFetching, setIsFetching] = useState(false);

  const handleMouseOver = (item: HoverItem) => {
    setHoverItem(item);
  };

  const handleMouseOut = () => {
    setHoverItem(null);
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
      var artistList: string[] = [];
      var artistItemList: ItemInfo[] = [];
      var artistImgList: [string, string][] = [];
      var artistArticleList: ArticleInfo[] = [];

      const colorInfo = img.colorInfo;

      // Image artist tags
      const imgArtistTags = img.tags?.artists;

      brandList = Array.from(
        new Set(itemList.map((item) => item.info.brands || []).flat())
      );

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

            const artistImgDocIdList = a.tags?.images;
            const artistItemDocIdList = a.tags?.items;
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

            // Get all artist-related items
            // if (artistItemDocIdList) {
            //   const itemList = await Promise.all(
            //     artistItemDocIdList.slice(0, 10).map(async (itemDocId) => {
            //       return (
            //         await FirebaseHelper.doc("items", itemDocId)
            //       ).data() as ItemInfo;
            //     })
            //   );
            //   artistItemList = itemList;
            // }

            // Get all artist-related images
            if (artistImgDocIdList) {
              const images = await FirebaseHelper.listAllStorageItems("images");
              // Since item_doc_id is stored as custom metadata, logic is a bit complicated.
              // After changing item_doc_id as file name, it would be simpler
              await Promise.all(
                images.items.map(async (image) => {
                  const metadata = await FirebaseHelper.metadata(image);
                  const docId = metadata?.customMetadata?.id;
                  if (docId && artistImgDocIdList.includes(docId)) {
                    // Skip if it's the same image
                    if (docId === imgDocId) {
                      return;
                    }
                    const imageUrl = await FirebaseHelper.downloadUrl(image);
                    artistImgList.push([docId, imageUrl]);
                  }
                })
              );
            }
          })
        );
      }
      setDetailPageState({
        img: img,
        itemList: itemList,
        brandList: brandList,
        artistList: artistList,
        artistImgList: artistImgList,
        artistItemList: artistItemList,
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
            <div className="flex flex-col w-full text-center my-10">
              <h2 className={`${main_font.className} text-4xl font-bold mb-4`}>
                {detailPageState.img.title}
              </h2>
              <p className="text-lg md:text-md px-2 md:px-32 mt-5">
                {detailPageState.img.description}
              </p>
              <div className="flex flex-col md:flex-row justify-center mt-10">
                <div
                  className="rounded-lg shadow-lg overflow-hidden"
                  style={{
                    height: "auto",
                    aspectRatio: "3/4",
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt="Featured fashion"
                      fill={true}
                      style={{ objectFit: "cover" }}
                    />
                    <div>
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
                          .map((item) => (
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
                                onMouseOver={() => handleMouseOver(item)}
                                onMouseOut={handleMouseOut}
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "white",
                                  boxShadow: "0 0 2px 2px rgba(0, 0, 0, 0.2)",
                                }}
                              ></div>
                            </a>
                          ))}
                    </div>
                    {/* Display information for the hovered item */}
                    {hoverItem && (
                      <div
                        className={`absolute transform -translate-x-1/2 -translate-y-full transition-opacity duration-300 ease-in-out ${
                          hoverItem ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          top: hoverItem.pos.top,
                          left: hoverItem.pos.left,
                          zIndex: 50,
                        }}
                        onMouseOut={handleMouseOut}
                      >
                        <div className="relative bg-gray-500 bg-opacity-80 rounded-lg p-2 flex items-center gap-2 w-[250px]">
                          <Image
                            src={hoverItem.info.imageUrl ?? ""}
                            alt={hoverItem.info.name}
                            width={30}
                            height={30}
                            className="rounded-lg w-[50px] h-[50px]"
                          />
                          <div className="text-white">
                            <p className="text-sm font-bold">
                              {hoverItem.info.name}
                            </p>
                            <p className="text-xs">{hoverItem.info?.price}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white shadow-lg">
                  {/* DETAILS */}
                  <div className="flex flex-col justify-center p-10">
                    <div className="flex flex-col items-center">
                      <p
                        className={`${main_font.className} text-lg md:text-2xl`}
                      >
                        ARTIST:
                      </p>
                      {detailPageState.artistList?.map((name, index) => (
                        <Link
                          key={index}
                          href={`/artists?name=${encodeURIComponent(name)}`}
                          className={`${main_font.className} text-md font-bold rounded-lg mx-2`}
                        >
                          <p className="underline">{name.toUpperCase()}</p>
                        </Link>
                      ))}
                    </div>

                    {/* List all brands */}
                    <div className="flex flex-col mt-5">
                      <p
                        className={`${main_font.className} text-lg md:text-2xl`}
                      >
                        BRANDS:{" "}
                      </p>
                      {detailPageState.brandList?.map((brand, index) => (
                        <Link
                          key={index}
                          href={`/brands/${encodeURIComponent(brand)}`}
                          className={`${main_font.className} text-md font-bold rounded-lg mx-2`}
                        >
                          <p className="underline">{brand.toUpperCase()}</p>
                        </Link>
                      ))}
                    </div>

                    {/* Categorize with item category */}
                    <div>
                      {Object.entries(
                        detailPageState.itemList?.reduce((acc, tag) => {
                          const category = tag.info.category.toUpperCase();
                          if (!acc[category]) {
                            acc[category] = [];
                          }
                          acc[category].push(tag);
                          return acc;
                        }, {} as Record<string, HoverItem[]>) || []
                      ).map(([category, tags]) => (
                        <div key={category} className="flex flex-col">
                          <p
                            className={`${main_font.className} text-lg md:text-2xl mt-5`}
                          >
                            {category} :
                          </p>
                          {tags.map((tag) => (
                            <Link
                              key={tag.info.name}
                              href={`${tag.info.affiliateUrl}`}
                              className={`${main_font.className} text-xl font-bold rounded-lg mx-2`}
                            >
                              <p className="underline">
                                {tag.info.name.toUpperCase()}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* List all colors */}
                    <div className="items-center justify-center mt-5">
                      <p
                        className={`${main_font.className} text-lg md:text-2xl`}
                      >
                        COLORS:{" "}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/* IMAGE */}
        {isFetching ? (
          <div className="flex justify-center items-center ">
            <h1
              className={`${main_font.className} text-7xl md:text-5xl loading-text p-5`}
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
        <div className="end-anim"></div>
      </div>
      {/** Sub Images */}
      <div className="sub-image-wrapper flex flex-row flex-wrap mt-20 w-full justify-center">
        {detailPageState?.img?.subImageUrls?.map((image, index) => (
          <div key={index} className={"sub-image-container m-2 w-1/2"}>
            <Image
              src={image}
              alt="Sub Image"
              width={300}
              height={300}
              className="rounded-md w-full"
            />
          </div>
        ))}
      </div>
      {/** More tagged */}
      <div className="my-10 w-full text-center">
        {detailPageState.artistImgList &&
          detailPageState.artistImgList.length > 0 && (
            <div>
              <h2 className={`${main_font.className} text-xl`}>
                More to explore
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-center place-items-center my-10">
                {detailPageState.artistImgList.map((image) => (
                  <Link
                    key={image[0]}
                    href={`?imageId=${image[0]}&imageUrl=${encodeURIComponent(
                      image[1]
                    )}`}
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={image[1]}
                      alt="Artist Image"
                      width={300}
                      height={300}
                      className="more-tagged rounded-xl"
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
