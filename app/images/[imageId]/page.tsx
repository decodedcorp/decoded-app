"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { custom_font } from "@/components/helpers/util";
import imglyRemoveBackground from "@imgly/background-removal";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { imageDoc, HoverItem } from "@/types/model";
interface PageProps {
  params: {
    imageId: string;
  };
}

async function Page({ params: { imageId } }: PageProps) {
  console.log(imageId);
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") ?? "";
  console.log(imageUrl);
  // if (!imageUrl) {
  //   notFound();
  // }
  let [hoveredItem, setHoveredItem] = useState<HoverItem | null>(null);

  const handleSaveClick = () => {
    alert("Not ready yet!");
  };

  const handleMouseOver = (item: HoverItem) => {
    setHoveredItem(item);
  };

  const handleMouseOut = () => {
    setHoveredItem(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const doc = await FirebaseHelper.getDoc("images", imageId);
      if (doc !== undefined) {
        console.log("HoverItem => ", doc.hoverItem);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container flex-col mx-auto p-4 justify-center items-center">
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
          ></div>
        </div>
      </div>
      {/* More to explore section */}
      <div className="my-4">
        <h2 className="text-white text-lg font-bold my-2 pt-5">
          More to explore
        </h2>
        <div className="grid grid-cols-2 gap-4"></div>
      </div>
    </div>
  );
}

export default Page;
