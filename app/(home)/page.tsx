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
      <MainView mainImageInfoList={mainImageInfoList} />
      <p className={`${secondary_font.className} text-center text-xl`}>
        More to explore
      </p>
      <PinView mainImageInfoList={mainImageInfoList} />
    </div>
  );
}

function MainView({
  mainImageInfoList,
}: {
  mainImageInfoList: MainImageInfo[] | null;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    setCurrentDateTime(new Date().toLocaleTimeString());
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 mb-10">
      <div className="items-start ml-2">
        <div className="sticky flex flex-col mb-5 lg:mb-0 lg:w-full top-2 lg:top-5 bg-white z-10">
          <h1 className={`${main_font.className} text-6xl lg:text-7xl w-[60%]`}>
            TODAY
          </h1>
          <h2 className={`${main_font.className} text-6xl lg:text-7xl`}>
            {currentDateTime}
          </h2>
        </div>
        <ImageDescriptionView
          mainImageInfoList={mainImageInfoList}
          currentIndex={currentIndex}
        />
      </div>
      <ImageCarouselView
        mainImageInfoList={mainImageInfoList?.slice(0, 10)}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}

function ImageDescriptionView({
  mainImageInfoList,
  currentIndex,
}: {
  mainImageInfoList: MainImageInfo[] | null;
  currentIndex: number;
}) {
  return mainImageInfoList ? (
    <div className="flex flex-col mt-5 lg:mt-10 p-10">
      <h2 className={`${main_font.className} text-4xl`}>
        {mainImageInfoList[currentIndex]?.title}
      </h2>
      <h3 className={`${main_font.className} text-md mt-5`}>
        {mainImageInfoList[currentIndex]?.description}
      </h3>
      <ItemDetailView
        mainImageInfoList={mainImageInfoList}
        currentIndex={currentIndex}
      />
    </div>
  ) : (
    <h1
      className={`${main_font.className} text-4xl md:text-5xl loading-text bg-red-500`}
    >
      Loading
    </h1>
  );
}

function ItemDetailView({
  mainImageInfoList,
  currentIndex,
}: {
  mainImageInfoList: MainImageInfo[] | null;
  currentIndex: number;
}) {
  return (
    mainImageInfoList && (
      <div className="grid grid-cols-2 mt-5">
        {Array.from(
          mainImageInfoList[currentIndex]?.itemInfoList.entries()
        ).map(([item, brands], index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center mt-5 "
          >
            <div className="w-52 h-32 relative rounded-lg">
              <Image
                src={item.imageUrl ?? ""}
                alt={item.name ?? ""}
                fill={true}
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col m-5 w-full lg:block items-center">
              <div className={`flex ${secondary_font.className} text-xs`}>
                {brands && brands.length > 0 && (
                  <div className="flex items-center space-x-2 w-full justify-center lg:justify-start">
                    <Image
                      src={brands[0].logoImageUrl ?? ""}
                      alt={brands[0].name}
                      className="rounded-full w-6 h-6 border border-black-opacity-50"
                      width={100}
                      height={100}
                    />
                    <div className="rounded-lg p-1 text-md">
                      {brands[0].name.replace(/_/g, " ").toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
              <button
                className={`${main_font.className} mt-5 bg-[#FF204E] hover:bg-black text-white font-bold rounded w-full h-8 text-sm hidden lg:block`}
                onClick={() =>
                  (window.location.href = item.affiliateUrl ?? "#")
                }
              >
                구매하기
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  );
}

function ImageCarouselView({
  mainImageInfoList,
  currentIndex,
  setCurrentIndex,
}: {
  mainImageInfoList: MainImageInfo[] | undefined;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mainImageInfoList && mainImageInfoList.length > 0) {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % mainImageInfoList.length
        );
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentIndex, mainImageInfoList?.length]);

  return (
    mainImageInfoList && (
      <div className="flex flex-col relative carousel">
        <div
          key={mainImageInfoList[currentIndex]?.docId}
          className="carousel-item w-full relative aspect-w-3 aspect-h-4"
        >
          <ProgressBar
            duration={5000}
            currentIndex={currentIndex}
            totalItems={mainImageInfoList.length}
          />
          <Link
            href={`images?imageId=${
              mainImageInfoList[currentIndex]?.docId
            }&imageUrl=${encodeURIComponent(
              mainImageInfoList[currentIndex]?.imageUrl
            )}`}
            prefetch={false}
          >
            <Image
              alt="Image"
              className="w-full h-auto"
              src={mainImageInfoList[currentIndex]?.imageUrl}
              quality={80}
              fill={true}
              style={{ objectFit: "cover" }}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,..."
            />
          </Link>
        </div>
      </div>
    )
  );
}

function PinView({
  mainImageInfoList,
}: {
  mainImageInfoList: MainImageInfo[] | null;
}) {
  console.log(mainImageInfoList);
  return (
    mainImageInfoList && (
      <div className="grid grid-cols-1 lg:grid-cols-3 p-10 gap-10 md:gap-32 lg:gap-16 w-full justify-center items-center md:p-32 lg:p-12">
        {mainImageInfoList.map((image, index) => (
          <Pin key={index} image={image} />
        ))}
      </div>
    )
  );
}

export default Home;
