"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "../../common/firebase";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { main_font, secondary_font } from "@/components/helpers/util";
import {
  ArticleInfo,
  ImageInfo,
  ItemInfo,
  MainImageInfo,
  TaggedItem,
} from "@/types/model";
import {
  getDocs,
  collection,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
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

function MainView() {
  const [urlAndHash, setUrlAndHash] = useState<{ url: string; hash: string }[]>(
    []
  );
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
      const urlAndHash = [];
      let mainImageInfoList: MainImageInfo[] = [];
      try {
        const storage_ref = FirebaseHelper.storageRef("images");
        const res = await listAll(storage_ref);
        const itemsToProcess = res.items.slice(0, 10);
        for (const itemRef of itemsToProcess) {
          try {
            const [metadata, url] = await Promise.all([
              getMetadata(itemRef),
              getDownloadURL(itemRef),
            ]);
            if (metadata.md5Hash) {
              const docRef = doc(
                FirebaseHelper.db(),
                "images",
                metadata.md5Hash
              );
              const imageDocSnap = await getDoc(docRef);
              if (imageDocSnap.exists()) {
                const imageInfo = imageDocSnap.data() as ImageInfo;
                let itemInfoList: ItemInfo[] = [];
                imageInfo.taggedItem?.map(async (item) => {
                  const taggedItem = item as TaggedItem;
                  const docRef = doc(
                    FirebaseHelper.db(),
                    "items",
                    taggedItem.id
                  );
                  const itemDocSnap = await getDoc(docRef);
                  if (itemDocSnap.exists()) {
                    const itemInfo = itemDocSnap.data() as ItemInfo;
                    itemInfoList.push(itemInfo);
                  }
                });
                mainImageInfoList.push({
                  title: imageInfo.title,
                  itemInfoList: itemInfoList,
                  description: imageInfo.description,
                  hyped: imageInfo.hyped,
                });
                urlAndHash.push({ url, hash: metadata.md5Hash });
              }
            }
          } catch (error) {
            console.error("Error processing item:", error);
            continue;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        setUrlAndHash(urlAndHash);
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
          urlAndHash={urlAndHash}
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
      {/* {mainImageInfoList[currentIndex] && (
        <h3 className={`${main_font.className} text-3xl pt-2 pb-2`}>
          {mainImageInfoList[currentIndex].artistName.toUpperCase()}&apos;s
          Items
        </h3>
      )} */}
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-md p-2">
        {mainImageInfoList[currentIndex]?.itemInfoList?.map((item, index) => {
          return (
            <div key={index} className="flex flex-row items-center">
              <Image
                src={item.imageUrl ?? ""}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-lg shadow-lg"
              />
              <div key={index} className="flex flex-col p-2 m-5 w-full">
                <div className={`${secondary_font.className} text-xl`}>
                  {item.name}
                </div>
                {/* TODO: Consider real-time price */}
                {/* <div className={`${secondary_font.className} text-xl`}>
                  {item.price?.[0]} {item.price?.[1] ?? ""}
                </div> */}
                <button
                  className={`${main_font.className} mt-2 bg-[#FF204E] hover:bg-black text-white font-bold py-2 px-4 rounded w-full`}
                  onClick={() =>
                    (window.location.href = item.affiliateUrl ?? "#")
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
  urlAndHash,
  currentIndex,
  setCurrentIndex,
}: {
  urlAndHash: { url: string; hash: string }[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (urlAndHash.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % urlAndHash.length);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentIndex, urlAndHash.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % urlAndHash.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + urlAndHash.length) % urlAndHash.length
    );
  };
  if (urlAndHash.length === 0) {
    return (
      <div className="w-60 carousel rounded-box mx-5" style={{ width: "70vw" }}>
        <div className="flex justify-center items-center h-full w-full aspect-w-5 aspect-h-6"></div>
      </div>
    );
  }

  const itemCount = urlAndHash.length;
  const { url, hash } = urlAndHash[currentIndex];

  return (
    <div
      className="flex flex-col w-60 carousel rounded-box mx-5 p-5"
      style={{ width: "65vw", position: "relative" }}
    >
      <div
        key={hash}
        className="carousel-item w-full relative aspect-w-3 aspect-h-4"
      >
        <ProgressBar
          duration={10000}
          currentIndex={currentIndex}
          totalItems={itemCount}
        />
        <Link
          href={`images/${hash}?imageUrl=${encodeURIComponent(url)}`}
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
      const db = FirebaseHelper.db();
      const querySnapshot = await getDocs(collection(db, "article"));
      const current_timestamp = Timestamp.fromDate(new Date());
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
      <button className="w-full text-align-center mt-4 py-2 px-6 bg-[#FF204E] text-white rounded">
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
