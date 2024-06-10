"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { main_font } from "@/components/helpers/util";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ImageInfo,
  ArtistInfo,
  HoverItem,
  ItemInfo,
  BrandInfo,
} from "@/types/model";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PageProps {
  params: {
    imageId: string;
  };
}

interface DetailPageState {
  /**
   * Image info
   */
  img?: ImageInfo;
  /**
   * Hover items
   */
  itemList?: HoverItem[];
  /**
   * Brand names
   */
  brandList?: string[];
  /**
   * Artist names
   */
  artistList?: string[];
  /**
   * [docId, imageUrl]
   */
  artistImgList?: [string, string][];
  /**
   * Artist items
   */
  artistItemList?: ItemInfo[];
}

function DetailPage({ params: { imageId } }: PageProps) {
  const pointTriggerRef = useRef<HTMLDivElement>(null);
  const itemTriggerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") ?? "";
  if (!imageUrl) {
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
    gsap.registerPlugin(ScrollTrigger);

    const points = gsap.utils.toArray(".point") as Element[];
    const items = gsap.utils.toArray(".item") as Element[];
    const infoDiv = document.createElement("div");
    infoDiv.className =
      "info-div absolute bg-gray-500 bg-opacity-80 rounded-lg p-2 flex items-center gap-2 w-[250px]";
    infoDiv.style.opacity = "0";
    infoDiv.style.transition = "opacity 0.5s ease-in-out";
    infoDiv.style.zIndex = "10000"; // 높은 z-index 값으로 설정
    document.body.appendChild(infoDiv);

    points.forEach((point, index) => {
      const item = items[index];
      // 포인트에 대한 애니메이션 설정
      gsap.fromTo(
        point,
        { opacity: 0.5, scale: 0.5 },
        {
          opacity: 1,
          scale: 2,
          scrollTrigger: {
            trigger: point,
            start: "top bottom",
            end: "bottom center",
            scrub: true,
            markers: true,
          },
        }
      );

      // 아이템에 대한 애니메이션 설정 (scale 변화 없음)
      gsap.fromTo(
        item,
        { opacity: 0.5 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: point,
            start: "top bottom",
            end: "bottom center",
            scrub: true,
            markers: true,
          },
        }
      );

      ScrollTrigger.create({
        trigger: point,
        start: "top center+=100", // 뷰포트 중앙보다 100px 위에서 트리거
        end: "bottom center-=100", // 뷰포트 중앙보다 100px 아래에서 트리거 해제
        onEnter: () => {
          const rect = point.getBoundingClientRect();
          infoDiv.style.top = `${
            window.scrollY + rect.top - rect.height - 10
          }px`; // 포인트 위에 위치
          infoDiv.style.left = `${
            rect.left + rect.width / 2 - infoDiv.offsetWidth / 2
          }px`; // 포인트 가운데 정렬

          infoDiv.innerHTML = `
            <div class="relative w-[50px] h-[50px]">
              <img src="${detailPageState?.itemList?.[index]?.info.imageUrl}" alt="${detailPageState?.itemList?.[index]?.info.name}" width="50" height="50" class="rounded-lg" />
            </div>
            <div class="text-white">
              <p class="text-sm font-bold">${detailPageState?.itemList?.[index]?.info.name}</p>
              <p class="text-xs">${detailPageState?.itemList?.[index]?.info.price}</p>
            </div>
          `;
          gsap.to(infoDiv, { opacity: 1, duration: 0.3 });
        },
        onLeave: () => {
          gsap.to(infoDiv, { opacity: 0, duration: 0.3 });
        },
        onEnterBack: () => {
          gsap.to(infoDiv, { opacity: 1, duration: 0.3 });
        },
        onLeaveBack: () => {
          gsap.to(infoDiv, { opacity: 0, duration: 0.3 });
        },
      });
    });
  }, [detailPageState.itemList]); // itemList가 변경될 때마다 useEffect가 재실행됩니다.

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

      // Image brand tags
      const imgBrandTags = img.tags?.brands;
      // Image artist tags
      const imgArtistTags = img.tags?.artists;

      // Update image related brand list if any
      if (imgBrandTags) {
        await Promise.all(
          imgBrandTags.map(async (brand) => {
            const brandInfo = (
              await FirebaseHelper.doc("brands", brand)
            ).data() as BrandInfo;
            brandList = Array.from(new Set([...brandList, brandInfo.name]));
          })
        );
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

            const artistImgDocIdList = a.tags?.images;
            const artistItemDocIdList = a.tags?.items;

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
      });
      setIsFetching(false);
    };
    setIsFetching(true);
    fetchData();
  }, [imageId]);

  return (
    <div className="flex-col rounded-lg justify-center items-center z-0">
      <div className="flex flex-col">
        {/* DESCRIPTION */}
        {detailPageState.img ? (
          <div className="flex flex-col w-full text-center my-10 pl-10 pr-10">
            <h2 className={`${main_font.className} text-4xl font-bold`}>
              {detailPageState.img.title}
            </h2>
            <p className="text-lg my-2 ">{detailPageState.img.description}</p>
            {/* DETAILS */}
            <div className="flex flex-col text-center justify-center items-center my-10">
              <div className="flex flex-col my-2 items-center">
                <p className={`${main_font.className} text-2xl`}>ARTIST:</p>
                {detailPageState.artistList?.map((name, index) => (
                  <Link
                    key={index}
                    href={`/artists/${encodeURIComponent(name)}`}
                    className={`${main_font.className} text-xl font-bold rounded-lg mx-2`}
                  >
                    <p className="underline">{name.toUpperCase()}</p>
                  </Link>
                ))}
              </div>

              {/* List all brands */}
              <div className="flex flex-col my-2">
                <p className={`${main_font.className} text-2xl`}>BRANDS: </p>
                {detailPageState.brandList?.map((brand, index) => (
                  <Link
                    key={index}
                    href={`/brands/${encodeURIComponent(brand)}`}
                    className={`${main_font.className} text-xl font-bold rounded-lg mx-2`}
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
                  <div key={category} className="flex flex-col my-2">
                    <p className={`${main_font.className} text-2xl`}>
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
            </div>
          </div>
        ) : null}
        {/* IMAGE */}
        <div className="flex flex-row">
          <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center w-full sm:h-auto mb-2">
            <div
              className="rounded-lg shadow-lg overflow-hidden"
              style={{
                height: "auto",
                aspectRatio: "3/4",
              }}
            >
              <div className="relative h-full w-full">
                {isFetching ? (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <span className="loading loading-dots loading-md"></span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <>
                      <Image
                        src={imageUrl}
                        alt="Featured fashion"
                        layout="fill"
                        objectFit="cover"
                        className="border-2 border-black rounded-lg"
                      />
                      <div ref={pointTriggerRef}>
                        {detailPageState.img &&
                          detailPageState.itemList?.map((item) => (
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
                    </>
                  </div>
                )}
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
            <div
              className="text-black grid grid-cols-2 w-full"
              style={{
                height: "auto",
                aspectRatio: "3/4",
              }}
              ref={itemTriggerRef}
            >
              {detailPageState.itemList?.map((item) => (
                <div
                  key={item.info.name}
                  className="item relative w-full pb-[100%]"
                >
                  <Image
                    src={item.info.imageUrl ?? ""}
                    alt={item.info.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg border-2 border-black"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 w-full text-center">
        {detailPageState.artistImgList &&
          detailPageState.artistImgList.length > 0 && (
            <div>
              <h2 className={`${main_font.className} text-5xl font-bold my-20`}>
                MORE TAGGED
              </h2>
              <div className="grid grid-cols-3 gap-1 items-center place-items-center">
                {detailPageState.artistImgList.map((image) => (
                  <Link
                    key={image[0]}
                    href={`${image[0]}?imageUrl=${encodeURIComponent(
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
                      className="rounded-xl"
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
