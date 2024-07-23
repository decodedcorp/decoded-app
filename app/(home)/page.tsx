"use client";
import { useEffect, useState } from "react";
import { FirebaseHelper } from "../../common/firebase";
import { bold_font, regular_font } from "@/components/helpers/util";
import {
  ImageInfo,
  BrandInfo,
  ArticleInfo,
  ArtistInfo,
  ItemInfo,
  MainImage,
  TaggedItem,
  Position,
  FeaturedInfo,
} from "@/types/model";
import Carousel from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";

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
      <FeaturedSection />
      <div className="p-10 text-center text-2xl font-bold">
        {currentDateTime}
      </div>
      <CarouselView images={mainImages} />
      <div className="p-10 text-center text-2xl border-b border-black font-bold">
        NEWS
      </div>
      <NewsSection />
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

function FeaturedSection() {
  const [featured, setFeatured] = useState<FeaturedInfo[] | null>([]);
  useEffect(() => {
    const featchFeatured = async () => {
      const docs = await FirebaseHelper.docs("featured");
      const featuredInfoList: FeaturedInfo[] = [];
      docs.forEach((doc) => {
        const featuredData = doc.data() as FeaturedInfo;
        console.log(featuredData);
        featuredInfoList.push(featuredData);
      });
      setFeatured(featuredInfoList);
    };
    featchFeatured();
  }, []);

  return (
    <div className="border-b border-black w-[100vw] h-[78vh]">
      {featured?.map((f, i) => {
        return (
          <div
            key={i}
            className="flex relative w-full h-full cursor-pointer overflow-hidden group"
            onClick={() => alert("WIP!")}
          >
            <Image
              src={f.imageUrl}
              alt={f.title}
              fill={true}
              style={{ objectFit: "cover" }}
              className="border border-black transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div className="flex flex-col absolute inset-0 items-center justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h2
                className={`text-white text-6xl md:text-8xl font-bold drop-shadow-lg p-2 md:p-10 leading-snug ${bold_font.className}`}
              >
                {f.title}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NewsSection() {
  const [latestArticles, setLatestArticles] = useState<ArticleInfo[]>([]);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      const docs = await FirebaseHelper.docs("articles");
      const articleInfoList: ArticleInfo[] = [];
      docs.forEach((doc) => {
        const newsData = doc.data() as ArticleInfo;
        if (newsData.src) {
          articleInfoList.push(newsData);
        }
      });
      console.log("Fetched articles data:", articleInfoList);
      const sortedArticles = articleInfoList.sort(
        (a, b) =>
          new Date(b.createdAt ?? "").getTime() -
          new Date(a.createdAt ?? "").getTime()
      );

      setLatestArticles(sortedArticles.slice(0, 4));
    };

    fetchLatestArticles();
  }, [setLatestArticles]);

  const [expandedArticleIndex, setExpandedArticleIndex] = useState<
    number | null
  >(null);

  const handleReadMoreClick = (index: number) => {
    setExpandedArticleIndex(index === expandedArticleIndex ? null : index);
  };

  return (
    <div className="flex flex-col w-full border-b border-black">
      <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {latestArticles.map((article, index) => (
          <div key={index} className="flex flex-col p-4 border border-black">
            <Link
              href={article.src as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={article.imageUrl ?? ""}
                alt={article.title}
                width={375}
                height={250}
                className="border border-black"
              />
            </Link>
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col py-2">
                <p className="text-[8px] text-white bg-black rounded-md w-fit p-1">
                  HYPEBEAST
                </p>
                <a
                  href={article.src as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold py-3"
                >
                  {article.title}
                </a>
              </div>
              {expandedArticleIndex === index && (
                <p className="mt-2 text-gray-700">{article.summary}</p>
              )}
              <button
                onClick={() => handleReadMoreClick(index)}
                className="mt-4 text-blue-500 hover:underline"
              >
                {expandedArticleIndex === index
                  ? "Hide Summary"
                  : "Open Summary"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-10">
        <Link
          href="/news"
          className="text-black border border-black w-full rounded-lg text-center p-2"
        >
          More NEWS
        </Link>
      </div>
    </div>
  );
}

export default Home;
