"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { main_font, handleMagnifyIn } from "@/components/helpers/util";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ImageInfo,
  ArtistInfo,
  HoverItem,
  ItemInfo,
  ColorInfo,
} from "@/types/model";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  /**
   * Extracted color info from image
   */
  colorInfo?: ColorInfo;
}

function DetailPage() {
  const pointTriggerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId") ?? "";
  const imageUrl = searchParams.get("imageUrl") ?? "";
  const [zoomStyle, setZoomStyle] = useState<CSSProperties>({});
  const zoomRef = useRef(null);
  if (!imageId || !imageUrl) {
    notFound();
  }
  // Detail page state
  let [detailPageState, setDetailPageState] = useState<DetailPageState>({});

  // Independent state
  let [hoverItem, setHoverItem] = useState<HoverItem | null>(null);
  let [isFetching, setIsFetching] = useState(false);

  const handleMagnifyOut = () => {
    setZoomStyle({});
  };

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

    if (detailPageState.img) {
      gsap.to("#image-detail-wrapper", {
        backgroundColor: `${
          detailPageState?.colorInfo?.background ?? "#FFFFFF"
        }`,
        scrollTrigger: {
          trigger: "#image-detail-wrapper",
          start: "top top",
          end: "-=500",
          scrub: 1,
        },
        ease: "power1.inOut",
      });
      gsap.to(".image-detail", {
        scale: 0.7,
        scrollTrigger: {
          trigger: ".image-detail",
          start: "top-=10 top",
          end: "+=1000",
          endTrigger: ".end-anim",
          pin: true,
          pinSpacing: true,
          markers: true,
          scrub: 1,
        },
      });
      points.forEach((point, index) => {
        gsap.fromTo(
          point,
          { opacity: 0.5, scale: 0.5 },
          {
            opacity: 1,
            scale: 2,
            scrollTrigger: {
              trigger: `#item-${index}`,
              start: `top+=${index * 200} top+=100`,
              end: "bottom bottom",
              scrub: true,
              markers: false,
            },
          }
        );
      });
      items.forEach((item, index) => {
        const scale = 0.8 + 0.025 * index;
        gsap.fromTo(
          item,
          { opacity: 0, x: 300, scale: 1 },
          {
            x: 50 * index,
            y: 100 * index,
            scale: scale,
            opacity: 1,
            scrollTrigger: {
              trigger: item,
              start: `top+=${index * 200} top+=100`,
              end: "bottom bottom",
              scrub: 1,
              pin: true,
              pinSpacing: false,
              markers: true,
            },
            ease: "power1.inOut",
          }
        );
      });
    }
  }, [
    detailPageState.itemList,
    detailPageState.colorInfo?.background,
    detailPageState.img,
  ]);

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
        colorInfo: colorInfo,
      });
      setIsFetching(false);
    };
    setIsFetching(true);
    fetchData();
  }, [imageId]);

  return (
    <div className="flex-col rounded-lg justify-center items-center z-0">
      <div className="flex flex-col text-center">
        {/* DESCRIPTION */}
        {detailPageState.img ? (
          <div className="flex flex-col w-full text-center my-10 pl-10 pr-10">
            <h2
              className={`${main_font.className} text-4xl md:text-6xl font-bold mb-4 mt-36`}
            >
              {detailPageState.img.title}
            </h2>
            <p className="text-xl md:text-2xl mt-20">
              {detailPageState.img.description}
            </p>
            {/* DETAILS */}
            <div className="flex flex-col text-center justify-center items-center my-10">
              <div className="flex flex-col mt-20 items-center">
                <p className={`${main_font.className} text-2xl md:text-4xl`}>
                  ARTIST:
                </p>
                {detailPageState.artistList?.map((name, index) => (
                  <Link
                    key={index}
                    href={`/artists?name=${encodeURIComponent(name)}`}
                    className={`${main_font.className} text-xl font-bold rounded-lg mx-2`}
                  >
                    <p className="underline">{name.toUpperCase()}</p>
                  </Link>
                ))}
              </div>

              {/* List all brands */}
              <div className="flex flex-col mt-10">
                <p className={`${main_font.className} text-2xl md:text-4xl`}>
                  BRANDS:{" "}
                </p>
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
                  <div key={category} className="flex flex-col">
                    <p
                      className={`${main_font.className} text-2xl md:text-4xl mt-10`}
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
              <div className="items-center justify-center mt-10">
                <p className={`${main_font.className} text-2xl md:text-4xl`}>
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
          <div
            id="image-detail-wrapper"
            className="bg-white mt-20 custom-shadow z-10"
          >
            <div className="image-detail flex flex-row rounded-lg">
              <div className="grid grid-cols-2 justify-center items-center w-full sm:h-auto">
                <div
                  className="rounded-lg shadow-lg overflow-hidden"
                  style={{
                    height: "auto",
                    aspectRatio: "3/4",
                  }}
                >
                  <div className="relative w-full h-full ">
                    <div
                      className="flex w-full h-full"
                      onMouseMove={(e) => handleMagnifyIn(e, setZoomStyle)}
                      onMouseLeave={handleMagnifyOut}
                    >
                      <Image
                        src={imageUrl}
                        alt="Featured fashion"
                        fill={true}
                        style={{ objectFit: "cover" }}
                      />
                      {/* Magnifying */}
                      <div
                        ref={zoomRef}
                        className="absolute w-[400px] h-[200px] border-2 border-black bg-cover hidden cursor-none"
                        style={{
                          ...zoomStyle,
                          backgroundImage: `url(${imageUrl})`,
                          display: zoomStyle.backgroundPosition
                            ? "block"
                            : "none",
                        }}
                      ></div>
                      <div className="points" ref={pointTriggerRef}>
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
                <div
                  className="relative text-black flex flex-col w-full"
                  style={{
                    aspectRatio: "3/4",
                  }}
                >
                  {detailPageState.itemList
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
                      <div
                        key={item.info.name}
                        id={`item-${index}`}
                        className="item flex flex-col absolute w-[80%] h-[60%]"
                        style={{
                          transform: `translate(${index * 10}px, ${
                            index * 10
                          }px)`,
                          zIndex:
                            (detailPageState.itemList?.length || 0) + index,
                        }}
                      >
                        <Image
                          src={item.info.imageUrl ?? ""}
                          alt={item.info.name}
                          fill={true}
                          style={{ objectFit: "cover" }}
                          className="rounded-2xl shadow-custom"
                        />
                        <div className="flex flex-col items-center justify-center p-2 rounded-b-xl absolute bottom-0 translate-y-full w-full">
                          <p
                            className={`${main_font.className} text-3xl text-[#FF204E] dark:text-white font-bold`}
                          >
                            {item.info.brands
                              ?.map((brandName) =>
                                brandName.replace(/_/g, " ").toUpperCase()
                              )
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
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
              <h2 className={`${main_font.className} text-5xl font-bold my-20`}>
                MORE TAGGED
              </h2>
              <div className="grid grid-cols-3 gap-1 items-center place-items-center">
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
