"use client";
import { useEffect, useState } from "react";
import { FirebaseHelper } from "../../common/firebase";
import {
  ImageInfo,
  BrandInfo,
  ArtistInfo,
  ItemInfo,
  MainImage,
  TaggedItem,
  Position,
} from "@/types/model";
import Carousel from "@/components/ui/carousel";

function Home() {
  const [mainImages, setMainImages] = useState<MainImage[] | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    setCurrentDateTime(new Date().toLocaleTimeString());
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);
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
              var itemInfoList = new Map<ItemInfo, [Position, BrandInfo[]]>();
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
                    itemInfoList.set(itemInfo, [taggedItem.pos, brandInfo]);
                  }
                });

                await Promise.all(itemPromises);
              }
              let mainImage: MainImage = {
                imageUrl: url,
                docId: imageDocId,
                title: imageInfo.title,
                itemInfoList,
                artistInfoList,
                description: imageInfo.description,
              };
              return mainImage;
            }
          } catch (error) {
            console.error("Error processing item:", error);
            return;
          }
        })
      );
      let filtered = images.filter(
        (image): image is MainImage => image !== undefined
      );
      setMainImages(filtered);
    };
    fetchAllImages();
  }, []);
  return (
    <div>
      <div className="p-10 text-center text-2xl">{currentDateTime}</div>
      <CarouselView images={mainImages} />
      <div className="p-10 text-center text-2xl">FEATURED</div>
    </div>
  );
}

function CarouselView({ images }: { images: MainImage[] | null }) {
  return (
    <div className="border-b border-black">
      <Carousel images={images} />
    </div>
  );
}

export default Home;
