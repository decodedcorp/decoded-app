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
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import ProgressBar from "@/components/ui/progress-bar";

function Home() {
  return (
    <div>
      <MainView />
      <ArticleView />
      <HypedTaggedView />
    </div>
  );
}

interface UrlAndId {
  url: string;
  docId: string;
}

function MainView() {
  const [mainImageInfoList, setMainImageInfoList] = useState<
    MainImageInfo[] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
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
      const urlAndId: UrlAndId[] = [];
      var mainImageInfoList: MainImageInfo[] = [];
      try {
        const storageItems = await FirebaseHelper.listAllStorageItems("images");
        // Up to 10 items will be processed
        const imageStorage = storageItems.items.slice(0, 20);
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
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="items-center md:items-start ml-2">
        <div className="flex flex-col w-full leading-1 -mt-2 lg:-mt-6">
          <h1 className={`${main_font.className} text-7xl md:text-9xl w-[60%]`}>
            TODAY
          </h1>
          <h2 className={`${main_font.className} text-7xl md:text-8xl`}>
            {currentDateTime}
          </h2>
        </div>
        <div className="hidden lg:block">
          <ImageDescriptionView
            mainImageInfoList={mainImageInfoList}
            currentIndex={currentIndex}
          />
        </div>
      </div>
      <ImageCarouselView
        mainImageInfoList={mainImageInfoList}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <div className="lg:hidden">
        <ImageDescriptionView
          mainImageInfoList={mainImageInfoList}
          currentIndex={currentIndex}
        />
      </div>
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
    <div className="flex flex-col mt-20">
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
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
        {mainImageInfoList[currentIndex]?.itemInfoList
          ?.slice(0, 4)
          .map(([item, brands], index) => {
            return (
              <div key={index} className="flex flex-row items-center">
                <Image
                  src={item?.imageUrl ?? ""}
                  alt={item?.name ?? ""}
                  width={100}
                  height={100}
                  className="rounded-lg shadow-lg"
                />
                <div key={index} className="flex flex-col m-5 w-full">
                  <div className={`flex ${secondary_font.className} text-xs`}>
                    {brands && brands.length > 0 && (
                      <div
                        key={brands[0].name}
                        className="flex items-center space-x-2"
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
                  <div className={`${main_font.className} text-sm`}>
                    {item?.name.toUpperCase() ?? ""}
                  </div>
                  <button
                    className={`${main_font.className} mt-5 bg-[#FF204E] hover:bg-black text-white font-bold rounded w-full h-8 text-sm`}
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
    <div className=" p-10">
      <h1
        className={`${main_font.className} text-4xl lg:text-8xl font-bold mb-4`}
      >
        LATEST NEWS
      </h1>
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

function HypedTaggedView() {
  return (
    <div className="rounded-md p-3">
      <div className="mb-6">
        <h1 className={`${main_font.className} text-4xl sm:text-8xl font-bold`}>
          SPOTLIGHT
        </h1>
        <h2 className="text-2xl font-bold bg-red-500">JENNIE 24SS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-3">
          <Image src="" alt="Jennie Main" className="w-full" />
        </div>
        <div className="col-span-1">
          <Image
            src=""
            alt="Product"
            className="w-full border-2 border-black"
          />
          <p className="text-center mt-2">
            Baby Fox Patch Cardigan
            <br />
            $415
          </p>
        </div>
        <div className="col-span-1">
          <Image
            src=""
            alt="Jennie 1"
            className="w-full border-2 border-black"
          />
        </div>
        <div className="col-span-1">
          <Image
            src=""
            alt="Jennie 2"
            className="w-full border-2 border-black"
          />
        </div>
        <div className="col-span-1">
          <Image
            src=""
            alt="Jennie 3"
            className="w-full border-2 border-black"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
