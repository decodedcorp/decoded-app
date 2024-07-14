"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "../../common/firebase";
import { main_font, secondary_font } from "@/components/helpers/util";
import {
  ImageInfo,
  BrandInfo,
  ArtistInfo,
  ItemInfo,
  MainImageInfo,
  TaggedItem,
} from "@/types/model";
import ProgressBar from "@/components/ui/progress-bar";
import Pin from "@/components/ui/pin";
import Carousel from "@/components/ui/carousel";

function Home() {
  const [mainImageInfoList, setMainImageInfoList] = useState<
    MainImageInfo[] | null
  >(null);
  useEffect(() => {
    const fetchAllImages = async () => {
      const storageItems = await FirebaseHelper.listAllStorageItems("images");
      const imageStorage = storageItems.items;
      const images = await Promise.all(
        imageStorage.map(async (image) => {
          try {
            const [metadata, url] = await Promise.all([
              FirebaseHelper.metadata(image),
              FirebaseHelper.downloadUrl(image),
            ]);
            const imageDocId = metadata.customMetadata?.id;
            if (!imageDocId) {
              return;
            }
            const imageDoc = await FirebaseHelper.doc("images", imageDocId);
            if (imageDoc.exists()) {
              const imageInfo = imageDoc.data() as ImageInfo;
              var artistInfoList: ArtistInfo[] | undefined;
              var artistsTags = imageInfo.tags?.["artists"];
              if (artistsTags) {
                const artistPromises = artistsTags.map(async (artist) => {
                  const artistDoc = await FirebaseHelper.doc("artists", artist);
                  if (artistDoc.exists()) {
                    return artistDoc.data() as ArtistInfo;
                  }
                });
                const res = await Promise.all(artistPromises);
                artistInfoList = res.filter(
                  (artist): artist is ArtistInfo => artist !== undefined
                );
              }
              var itemInfoList = new Map<ItemInfo, BrandInfo[]>();
              if (imageInfo.taggedItem) {
                const itemPromises = imageInfo.taggedItem.map(async (item) => {
                  const taggedItem = item as TaggedItem;
                  const itemDoc = await FirebaseHelper.doc(
                    "items",
                    taggedItem.id
                  );
                  if (itemDoc.exists()) {
                    const itemInfo = itemDoc.data() as ItemInfo;
                    let brandInfo: BrandInfo[] = [];
                    const brandTags = itemInfo.tags?.["brands"];
                    if (brandTags) {
                      const brandPromises = brandTags.map(async (b) => {
                        const doc = await FirebaseHelper.doc("brands", b);
                        if (doc.exists()) {
                          return doc.data() as BrandInfo;
                        }
                        return undefined;
                      });
                      const res = await Promise.all(brandPromises);
                      brandInfo = res.filter(
                        (brand): brand is BrandInfo => brand !== undefined
                      );
                    }
                    itemInfoList.set(itemInfo, brandInfo);
                  }
                });

                await Promise.all(itemPromises);
              }
              let mainImageInfo: MainImageInfo = {
                imageUrl: url,
                docId: imageDocId,
                title: imageInfo.title,
                itemInfoList,
                artistInfoList,
                description: imageInfo.description,
                hyped: imageInfo.hyped,
              };
              return mainImageInfo;
            }
          } catch (error) {
            console.error("Error processing item:", error);
            return;
          }
        })
      );
      let filtered = images.filter(
        (image): image is MainImageInfo => image !== undefined
      );
      setMainImageInfoList(filtered);
    };
    fetchAllImages();
  }, []);
  return (
    <div>
      <CarouselView images={mainImageInfoList} />
      <PinView images={mainImageInfoList} />
    </div>
  );
}

function CarouselView({ images }: { images: MainImageInfo[] | null }) {
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    setCurrentDateTime(new Date().toLocaleTimeString());
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);
  return (
    <div>
      <div
        className={`flex flex-col ${main_font.className} text-6xl font-bold mb-4 p-2`}
      >
        NOW
        {/* <p>{currentDateTime}</p> */}
      </div>
      <div className="p-2">
        <Carousel images={images} />
      </div>
    </div>
  );
}

function PinView({ images }: { images: MainImageInfo[] | null }) {
  if (!images) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-10 gap-10 md:gap-32 lg:gap-16 w-full justify-center items-center md:p-32 lg:p-12">
        {images.map((image, index) => (
          <Pin key={index} image={image} />
        ))}
      </div>
    </div>
  );
}

export default Home;
