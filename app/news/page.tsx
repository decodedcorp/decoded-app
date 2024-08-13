"use client";

import { useEffect, useState } from "react";
import { FirebaseHelper } from "@/common/firebase";
import { ArticleInfo } from "@/types/model";
import Image from "next/image";
import Link from "next/link";
import { regular_font, bold_font } from "@/components/helpers/util";
import { LoadingView } from "@/components/ui/loading";

function Page() {
  return (
    <div className="justify-center">
      <NewsList />
    </div>
  );
}

function NewsList() {
  const [articleInfoList, setArticleInfoList] = useState<ArticleInfo[] | null>(
    null
  );
  const ItemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((articleInfoList?.length || 0) / ItemsPerPage);
  const currentItems = articleInfoList?.slice(
    (currentPage - 1) * ItemsPerPage,
    currentPage * ItemsPerPage
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

  return articleInfoList ? (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 lg:gap-8 p-5 lg:p-20 w-full mt-20">
        {currentItems?.map((news, index) => (
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
              <div className="text-lg w-full mt-2">
                {news.source && (
                  <h2 className={`${bold_font.className} text-sm`}>
                    {news.source.toUpperCase()}
                  </h2>
                )}
                <h2 className={`${regular_font.className} mt-2`}>
                  {news.title.toUpperCase()}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 text-lg">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  ) : (
    <LoadingView />
  );
}

export default Page;
