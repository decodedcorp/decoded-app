"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { main_font } from "@/components/helpers/util";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ImageInfo,
  ArtistInfo,
  TaggedItem,
  HoverItem,
  ItemInfo,
} from "@/types/model";
interface PageProps {
  params: {
    imageId: string;
  };
}

function Page({ params: { imageId } }: PageProps) {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") ?? "";
  if (!imageUrl) {
    notFound();
  }
  let [imageDetail, setImageDetail] = useState<ImageInfo | null>(null);
  let [artistImages, setArtistImages] = useState<[string, string][]>([]);
  let [artistItems, setArtistItems] = useState<ItemInfo[]>([]);
  let [artistName, setArtistName] = useState<string[]>([]);
  let [imageTags, setImageTags] = useState<HoverItem[]>([]);
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
      const imageDocId = decodeURIComponent(imageId);
      const imageInfo = (
        await FirebaseHelper.doc("images", imageDocId)
      ).data() as ImageInfo;
      const artistTags = imageInfo.tags?.artists;
      if (imageInfo !== undefined) {
        const hoverItems = await FirebaseHelper.getHoverItems(imageDocId);
        setImageTags(hoverItems);
        setImageDetail(imageInfo);
      } else {
        setIsFetching(false);
      }
      if (artistTags) {
        const artistInfoList = await Promise.all(
          artistTags.map(async (artist) => {
            const artistInfo = await FirebaseHelper.doc("artists", artist);
            return artistInfo.data() as ArtistInfo;
          })
        );
        const artistNames: string[] = [];
        artistInfoList.map(async (a) => {
          artistNames.push(a.name);
          const imageDocIds = a.tags?.images;
          const itemDocIds = a.tags?.["items"];
          if (itemDocIds) {
            const items = await Promise.all(
              itemDocIds.map(async (docId) => {
                const item = await FirebaseHelper.doc("items", docId);
                return item.data() as ItemInfo;
              })
            );
            setArtistItems(items);
          }
          if (imageDocIds) {
            const allImages = await FirebaseHelper.listAllStorageItems(
              "images"
            );
            allImages.items.map(async (image) => {
              const metadata = await FirebaseHelper.metadata(image);
              const docId = metadata?.customMetadata?.id;
              if (docId && imageDocIds.includes(docId)) {
                if (docId === imageDocId) {
                  return;
                }
                const imageUrl = await FirebaseHelper.downloadUrl(image);
                setArtistImages((prev) => {
                  // Check if the docId already exists in the previous state
                  if (prev.some(([id, _]) => id === docId)) {
                    return prev; // If it exists, return the previous state
                  }
                  return [...prev, [docId, imageUrl]]; // Otherwise, add the new image
                });
              }
            });
          }
        });
        setArtistName(artistNames);
      }
      setIsFetching(false);
    };
    setIsFetching(true);
    fetchData();
  }, [imageId]);

  return (
    <div className="flex-col border-b-2 border-l-2 border-r-2 border-black rounded-lg justify-center items-center z-0">
      <div className="flex flex-row ">
        <div className="flex p-4 justify-center items-center sm:w-full sm:h-auto my-20">
          <div
            className="rounded-lg shadow-lg overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              aspectRatio: "3/4",
            }}
          >
            <div className="relative flex h-full">
              {isFetching ? (
                <div className="absolute inset-0 flex justify-center items-center">
                  <span className="loading loading-dots loading-md"></span>
                </div>
              ) : (
                <>
                  <Image
                    src={imageUrl}
                    alt="Featured fashion"
                    layout="fill"
                    objectFit="cover"
                  />
                  {imageDetail &&
                    imageTags?.map((item) => (
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
                </>
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
                      <p className="text-sm font-bold">{hoverItem.info.name}</p>
                      <p className="text-xs">{hoverItem.info?.price}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 w-full text-center">
        <div className="flex justify-center items-center">
          <h2
            className={`text-7xl text-black font-bold ${main_font.className}`}
          >
            MORE FROM
          </h2>
          <div className="flex flex-wrap">
            {artistName.map((name, index) => (
              <Link
                key={index}
                href={`/artists/${encodeURIComponent(name)}`}
                className={`${main_font.className} text-6xl font-bold bg-[#FF204E] rounded-lg mx-3 p-2 text-center underline`}
              >
                "{name.toUpperCase()}"
              </Link>
            ))}
          </div>
        </div>
        {artistImages.length > 0 && (
          <div>
            <h2 className={`${main_font.className} text-5xl font-bold my-20`}>
              MORE TAGGED
            </h2>
            <div className="grid grid-cols-3 gap-1 items-center place-items-center">
              {artistImages.map((image) => (
                <Link
                  key={image[0]}
                  href={`${image[0]}?imageUrl=${encodeURIComponent(image[1])}`}
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
        {artistItems.length > 0 && (
          <div>
            <h2 className={`${main_font.className} text-5xl font-bold my-20`}>
              MORE ITEMS
            </h2>
            <div className="grid grid-cols-3 gap-2 items-center p-1 place-items-center">
              {artistItems.map((item) => (
                <div
                  key={item?.name}
                  className={`${main_font.className} flex flex-col text-black text-md items-center justify-center rounded-lg border border-black w-full h-[400px]`}
                >
                  <Image
                    src={item?.imageUrl ?? ""}
                    alt={item?.name}
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
