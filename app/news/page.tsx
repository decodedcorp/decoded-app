"use client";

import { useEffect, useState } from "react";
import { FirebaseHelper } from "@/common/firebase";
import { ArticleInfo } from "@/types/model";
import Image from "next/image";
import Link from "next/link";
import { main_font } from "@/components/helpers/util";

function Page() {
  return <NewsView />;
}

function NewsView() {
  return (
    <div>
      <div className="flex flex-col w-full ">
        <div className="fixed flex flex-col w-full" style={{ zIndex: 100 }}>
          <div>
            <h1
              className={`${main_font.className} leading-3 text-9xl`}
              style={{ marginTop: "1.8rem" }}
            >
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
    <div className="grid grid-cols-4 gap-3 mt-80 p-10">
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
            {/* <div className="card-body">
              <h2 className="card-title">{news.title.toUpperCase()}</h2>
            </div> */}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Page;
