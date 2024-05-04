"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { main_font } from "@/components/helpers/util";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";

import { ImageDetail, HoverItem } from "@/types/model";
interface PageProps {
  params: {
    imageId: string;
  };
}

function Page({ params: { imageId } }: PageProps) {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") ?? "";
  console.log("Page for => ", imageId, "URL => ", imageUrl);
  if (!imageUrl) {
    notFound();
  }
  let [imageDetail, setImageDetail] = useState<ImageDetail | null>(null);
  let [tags, setTags] = useState<HoverItem[]>([]);
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
      const decoded = decodeURIComponent(imageId);
      const imageDetail = (await FirebaseHelper.getImageDetail(
        "images",
        decoded
      )) as ImageDetail;
      if (imageDetail !== undefined) {
        setImageDetail(imageDetail);
        setTags(imageDetail.taggedItem as HoverItem[]);
        setIsFetching(false);
      } else {
        setIsFetching(false);
      }
    };
    setIsFetching(true);
    fetchData();
  }, []);

  return (
    <div className="container flex-col mx-auto p-4 justify-center items-center z-0">
      <div className="flex flex-row">
        <div className="container flex mx-auto p-4 justify-center items-center sm:w-full sm:h-auto">
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
                    tags.map((item) => (
                      <a
                        key={imageId}
                        href={item.metadata.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          position: "absolute",
                          top: item.position.top,
                          left: item.position.left,
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
                  className={`absolute bg-black border border-gray-600 rounded-lg shadow-lg p-2 flex items-center gap-2 transform -translate-x-1/2 -translate-y-full transition-opacity duration-300 ease-in-out ${
                    hoverItem ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    top: hoverItem.position.top,
                    left: hoverItem.position.left,
                    zIndex: 50, // Ensure it's above other elements
                  }}
                  onMouseOut={handleMouseOut}
                >
                  <div className="relative bg-black bg-opacity-80 rounded-lg shadow-lg p-2 flex items-center gap-2">
                    <div className="text-white">
                      <p className="text-sm font-bold">
                        {hoverItem.metadata.name}
                      </p>
                      <p className="text-xs">{hoverItem.metadata.price}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="my-4 w-full text-center">
        <h2
          className={`text-lg text-blacktext-lg font-bold my-2 pt-3 ${main_font.className}`}
        >
          More to explore
        </h2>
        <div className="grid grid-cols-2 gap-4"></div>
      </div>
    </div>
  );
}

export default Page;
