"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "../../common/firebase";
import { main_font, secondary_font } from "@/components/helpers/util";
import {
  ArticleInfo,
  ImageInfo,
  BrandInfo,
  ArtistInfo,
  ItemInfo,
  MainImageInfo,
  TaggedItem,
} from "@/types/model";
import ProgressBar from "@/components/ui/progress-bar";
import { InstagramEmbed, YouTubeEmbed } from "react-social-media-embed";
import { InstaMockUrls, YoutubeMockUrls } from "@/components/helpers/mock";

function Home() {
  const [mainImageInfoList, setMainImageInfoList] = useState<
    MainImageInfo[] | null
  >(null);
  useEffect(() => {
    const fetchAllImages = async () => {
      const urlAndId: UrlAndId[] = [];
      var mainImageInfoList: MainImageInfo[] = [];
      try {
        const storageItems = await FirebaseHelper.listAllStorageItems("images");
        const imageStorage = storageItems.items.slice(0, 10);
        imageStorage.forEach(async (image) => {
          try {
            const [metadata, url] = await Promise.all([
              FirebaseHelper.metadata(image),
              FirebaseHelper.downloadUrl(image),
            ]);
            const imageDocId = metadata.customMetadata?.id;
            if (!imageDocId) {
              console.log("Image Doc Id not existed");
              return;
            }
            const imageDoc = await FirebaseHelper.doc("images", imageDocId);
            if (imageDoc.exists()) {
              const imageInfo = imageDoc.data() as ImageInfo;
              var itemInfoList: [ItemInfo?, BrandInfo[]?][] = [];
              var artistInfo: ArtistInfo[] = [];
              var artistsTags = imageInfo.tags?.["artists"];
              if (artistsTags) {
                artistsTags.map(async (artist) => {
                  const artistDoc = await FirebaseHelper.doc("artists", artist);
                  if (artistDoc.exists()) {
                    const artist = artistDoc.data() as ArtistInfo;
                    artistInfo.push(artist);
                  }
                });
              }
              imageInfo.taggedItem?.map(async (item) => {
                const taggedItem = item as TaggedItem;
                const itemDoc = await FirebaseHelper.doc(
                  "items",
                  taggedItem.id
                );
                if (itemDoc.exists()) {
                  const itemInfo = itemDoc.data() as ItemInfo;
                  var brandInfo: BrandInfo[] = [];
                  const brandTags = itemInfo.tags?.["brands"];
                  if (brandTags) {
                    brandTags.map(async (b) => {
                      const doc = await FirebaseHelper.doc("brands", b);
                      if (doc.exists()) {
                        const data = doc.data() as BrandInfo;
                        brandInfo.push(data);
                      }
                    });
                  }
                  itemInfoList.push([itemInfo, brandInfo]);
                }
              });
              mainImageInfoList.push({
                imageUrl: url,
                docId: imageDocId,
                title: imageInfo.title,
                itemInfoList: itemInfoList,
                artistInfoList: artistInfo,
                description: imageInfo.description,
                hyped: imageInfo.hyped,
              });
              urlAndId.push({ url, docId: imageDocId });
            }
          } catch (error) {
            console.error("Error processing item:", error);
            return;
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        setMainImageInfoList(mainImageInfoList);
      }
    };
    fetchAllImages();
  }, []);
  return (
    <div>
      <MainView mainImageInfoList={mainImageInfoList} />
      <AllTaggedView mainImageInfoList={mainImageInfoList} />
    </div>
  );
}

interface UrlAndId {
  url: string;
  docId: string;
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
    <div className="grid grid-cols-1 lg:grid-cols-2 mb-20">
      <div className="items-start ml-2">
        <div className="sticky flex flex-col mb-5 lg:mb-0 lg:w-full top-2 lg:top-5 bg-white">
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
        mainImageInfoList={mainImageInfoList}
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
        {mainImageInfoList[currentIndex]?.itemInfoList
          ?.slice(0, 4)
          .map(([item, brands], index) => {
            return (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-center mt-5"
              >
                <Image
                  src={item?.imageUrl ?? ""}
                  alt={item?.name ?? ""}
                  width={100}
                  height={100}
                  className="rounded-lg shadow-lg"
                />
                <div
                  key={index}
                  className="flex flex-col m-5 w-full lg:block items-center"
                >
                  <div className={`flex ${secondary_font.className} text-xs`}>
                    {brands && brands.length > 0 && (
                      <div
                        key={index}
                        className="flex items-center space-x-2 w-full justify-center lg:justify-start"
                      >
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
                      (window.location.href = item?.affiliateUrl ?? "#")
                    }
                  >
                    구매하기
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    )
  );
}

function ImageCarouselView({
  mainImageInfoList,
  currentIndex,
  setCurrentIndex,
}: {
  mainImageInfoList: MainImageInfo[] | null;
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

function ArticleView() {
  const [articles, setArticles] = useState<ArticleInfo[]>([]);

  useEffect(() => {
    const fetchAllArticles = async () => {
      let articleInfoList: ArticleInfo[] = [];
      const querySnapshot = await FirebaseHelper.docs("articles");
      const current_timestamp = FirebaseHelper.currentTimestamp();
      querySnapshot.forEach((doc) => {
        const articleInfo = doc.data() as ArticleInfo;
        // if (article.time !== undefined) {
        //   const dateOnly = article.time.split("T")[0];
        //   console.log("Article Date", dateOnly);
        // }
        // console.log("current_timestamp", current_timestamp.toString());
        articleInfoList.push(articleInfo);
      });
      setArticles(articleInfoList);
    };
    fetchAllArticles();
  }, []);

  return (
    <div className="flex flex-col p-2 mb-20">
      <div className="sticky top-16 lg:top-24 flex mb-10 bg-white">
        <h1 className={`${main_font.className} text-6xl lg:text-7xl`}>
          LATEST NEWS
        </h1>
      </div>
      {articles.length === 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-300 h-32 rounded-md"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <div key={index} className="news-item">
              {article.src && (
                <a href={article.src as string}>
                  <Image
                    src={article.imageUrl?.split(" ")[0] ?? ""}
                    alt={article.title}
                    className="w-full h-auto"
                    width={100}
                    height={100}
                  />
                </a>
              )}
              <div className="text-sm bg-black text-white p-2">
                {article.title}
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href={"/news"} className={`${main_font.className} w-full`}>
        <div className="w-full mt-4 py-2 px-6 bg-[#FF204E] text-white text-center rounded-lg">
          See More
        </div>
      </Link>
    </div>
  );
}

function AllTaggedView({
  mainImageInfoList,
}: {
  mainImageInfoList: MainImageInfo[] | null;
}) {
  console.log("mainImageInfoList => ", mainImageInfoList);
  return (
    <div className="grid grid-cols-1 w-full bg-red-500">
      {mainImageInfoList?.map((image, index) => (
        <div key={index}>{image.title}</div>
      ))}
    </div>
  );
}

// function RunwayView() {
//   return (
//     <div>
//       <div className="sticky top-16 lg:top-24 flex mb-10 bg-white justify-end">
//         <h1 className={`${main_font.className} text-6xl lg:text-7xl`}>
//           Runway 25SS
//         </h1>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2">
//         {YoutubeMockUrls.map((url, index) => (
//           <YouTubeEmbed key={index} url={url} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function SocialMediaView() {
//   return (
//     <div>
//       <div className="sticky top-16 lg:top-24 flex mb-10 bg-white">
//         <h1 className={`${main_font.className} text-6xl lg:text-7xl`}>
//           Curation
//         </h1>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2">
//         {InstaMockUrls.map((url, index) => (
//           <InstagramEmbed key={index} url={url} />
//         ))}
//       </div>
//     </div>
//   );
// }

export default Home;
