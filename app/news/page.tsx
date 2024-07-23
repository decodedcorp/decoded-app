"use client";

import { useEffect, useState } from "react";
import { FirebaseHelper } from "@/common/firebase";
import { ArticleInfo } from "@/types/model";
import Image from "next/image";
import Link from "next/link";
import { bold_font } from "@/components/helpers/util";

function Page() {
  return <NewsView />;
}

function NewsView() {
  return (
    <div>
      <div className="flex flex-col w-full">
        <div
          className="sticky flex flex-col w-full top-14 lg:top-20 ml-2"
          style={{ zIndex: 100 }}
        >
          <div className="bg-white">
            <h1 className={`${bold_font.className} text-6xl lg:text-8xl`}>
              NEWS
            </h1>
          </div>
        </div>
        <NewsList />
      </div>
    </div>
  );
}

function NewsList() {
  const [articleInfoList, setArticleInfoList] = useState<ArticleInfo[] | null>(
    null
  );

  useEffect(() => {
    const fetchArticleInfoList = async () => {
      const docs = await FirebaseHelper.docs("articles");
      const articleInfoList: ArticleInfo[] = [];
      docs.forEach((doc) => {
        const newsData = doc.data() as ArticleInfo;
        if (newsData.src) {
          articleInfoList.push(newsData);
        }
      });
      setArticleInfoList(articleInfoList);
    };
    fetchArticleInfoList();
  }, []);

  const handleMouseOver = (index: number) => {
    document.querySelectorAll(".news-item").forEach((item, idx) => {
      if (idx !== index) {
        item.classList.add("blur");
      }
    });
  };

  const handleMouseOut = () => {
    document.querySelectorAll(".news-item").forEach((item) => {
      item.classList.remove("blur");
    });
  };

  return (
    <div className="grid grid-cols-4 gap-2 lg:gap-8 mt-10 lg:mt-40 p-5 lg:p-20">
      {articleInfoList?.map((news, index) => (
        <Link key={index} href={news.src as string}>
          <div
            className="news-item"
            onMouseOver={() => handleMouseOver(index)}
            onMouseOut={handleMouseOut}
          >
            <Image
              src={(news.imageUrl as string) ?? ""}
              alt="Album"
              width={300}
              height={300}
              style={{ objectFit: "cover" }}
            />
            <div className="hidden lg:block text-lg w-full">
              <h2 className="">{news.title.toUpperCase()}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Page;
