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
      {/* <HypedTaggedView /> */}
    </div>
  );
}

interface UrlAndId {
  url: string;
  docId: string;
}

function MainView() {
  const [urlAndId, setUrlAndId] = useState<UrlAndId[]>([]);
  const [mainImageInfoList, setMainImageInfoList] = useState<MainImageInfo[]>(
    []
  );
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
        console.log("mainImageInfoList", mainImageInfoList);
        setUrlAndId(urlAndId);
        setMainImageInfoList(mainImageInfoList);
      }
    };
    fetchAllImages();
  }, []);
  return (
    <div className="rounded-md border-l-2 border-r-2 border-b-2 border-black">
      <div className="flex flex-col sm:flex-row items-center md:items-start">
        <div className="flex flex-col w-full">
          <h1 className={`${main_font.className} text-7xl md:text-8xl p-2`}>
            TODAY&apos;S NEW TAGGED
          </h1>
          <h2 className={`${main_font.className} text-7xl md:text-8xl p-2`}>
            {currentDateTime}
          </h2>
          <ImageDescriptionView
            mainImageInfoList={mainImageInfoList}
            currentIndex={currentIndex}
          />
          {/* 모바일에서 숨기고 데스크탑에서 보이는 ItemDetailView */}
          <div className="hidden sm:block">
            <ItemDetailView
              mainImageInfoList={mainImageInfoList}
              currentIndex={currentIndex}
            />
          </div>
        </div>
        <ImageCarouselView
          urlAndId={urlAndId}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
      {/* 데스크탑에서 숨기고 모바일에서 보이는 ItemDetailView */}
      <div className="sm:hidden">
        <ItemDetailView
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
  mainImageInfoList: MainImageInfo[];
  currentIndex: number;
}) {
  return mainImageInfoList.length !== 0 ? (
    <div className="flex flex-col h-full p-2">
      <h1 className={`${main_font.className} text-3xl`}>
        {mainImageInfoList[currentIndex].title}
      </h1>
      <h2 className={`${main_font.className} text-sm pt-4`}>
        {mainImageInfoList[currentIndex].tags?.map((tag, index) => (
          <span
            key={index}
            className="shadow-custom border border-[#FF204E] text-black px-2 py-1 rounded-xl mr-2"
          >
            {/* TODO: */}
            {tag.replace(/_/g, " ").toUpperCase()}
          </span>
        ))}
      </h2>
      <h3 className={`${main_font.className} text-md pt-5 pb-5`}>
        {mainImageInfoList[currentIndex].description}
      </h3>
    </div>
  ) : (
    <h1
      className={`${main_font.className} text-4xl md:text-5xl loading-text p-5`}
    >
      Loading
    </h1>
  );
}

function ItemDetailView({
  mainImageInfoList,
  currentIndex,
}: {
  mainImageInfoList: MainImageInfo[];
  currentIndex: number;
}) {
  return (
    <div className="p-2 m-2 justify-start w-full">
      <div className={`flex flex-row ${main_font.className} text-2xl`}>
        {mainImageInfoList[currentIndex]?.artistInfoList?.map(
          (artist, index, array) => {
            return (
              <div key={index} className="bg-gray-500 w-full">
                {artist.name.toUpperCase()}&apos;s
                {index < array.length - 1 && " &"}
              </div>
            );
          }
        )}
        {mainImageInfoList.length > 0 && <p className="mx-2">Items</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-md p-2">
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
                <div key={index} className="flex flex-col p-2 m-5 w-full">
                  {/* TODO: Consider real-time price */}
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
    </div>
  );
}

function ImageCarouselView({
  urlAndId,
  currentIndex,
  setCurrentIndex,
}: {
  urlAndId: UrlAndId[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (urlAndId.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % urlAndId.length);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentIndex, urlAndId.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % urlAndId.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + urlAndId.length) % urlAndId.length
    );
  };
  if (urlAndId.length === 0) {
    return (
      <div className="w-60 carousel rounded-box mx-5" style={{ width: "70vw" }}>
        <div className="flex justify-center items-center h-full w-full aspect-w-5 aspect-h-6"></div>
      </div>
    );
  }

  const itemCount = urlAndId.length;
  const { url, docId } = urlAndId[currentIndex];

  return (
    <div
      className="flex flex-col w-60 carousel rounded-box mx-5 p-5"
      style={{ width: "65vw", position: "relative" }}
    >
      <div
        key={docId}
        className="carousel-item w-full relative aspect-w-3 aspect-h-4"
      >
        <ProgressBar
          duration={10000}
          currentIndex={currentIndex}
          totalItems={itemCount}
        />
        <Link
          href={`images/${docId}?imageUrl=${encodeURIComponent(url)}`}
          prefetch={false}
        >
          <Image
            alt="Image"
            className="w-full h-auto rounded-lg"
            layout="fill"
            src={url}
            quality={80}
            fill={true}
            objectFit="cover"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,..."
          />
        </Link>
      </div>
      <div className="flex justify-around m-3 items-center">
        <button className="rounded-md p-1 mr-2" onClick={handlePrev}>
          <ArrowLeftCircleIcon className="w-6 h-6" />
        </button>
        <button className=" rounded-md p-1" onClick={handleNext}>
          <ArrowRightCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
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
    <div className="rounded-md border-l-2 border-r-2 border-black p-3">
      <h1
        className={`${main_font.className} text-5xl sm:text-6xl font-bold mb-4`}
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
      <button
        className={`${main_font.className} w-full text-align-center mt-4 py-2 px-6 bg-[#FF204E] text-white rounded`}
      >
        See More
      </button>
    </div>
  );
}

function HypedTaggedView() {
  return (
    <div className="rounded-md border-2 border-black p-3">
      <div className="text-center mb-6">
        <h1 className={`${main_font.className} text-2xl sm:text-6xl font-bold`}>
          HYPED TAGGED
        </h1>
        <h2 className="text-2xl font-bold">JENNIE 24SS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-3">
          <Image
            src="path/to/jennie-main.jpg"
            alt="Jennie Main"
            className="w-full"
          />
        </div>
        <div className="col-span-1">
          <Image src="path/to/product.jpg" alt="Product" className="w-full" />
          <p className="text-center mt-2">
            Baby Fox Patch Cardigan
            <br />
            $415
          </p>
        </div>
        <div className="col-span-1">
          <Image src="path/to/jennie-1.jpg" alt="Jennie 1" className="w-full" />
        </div>
        <div className="col-span-1">
          <Image src="path/to/jennie-2.jpg" alt="Jennie 2" className="w-full" />
        </div>
        <div className="col-span-1">
          <Image src="path/to/jennie-3.jpg" alt="Jennie 3" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default Home;
