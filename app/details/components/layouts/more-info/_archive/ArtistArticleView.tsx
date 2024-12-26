import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { pretendardRegular, pretendardSemiBold } from '@/lib/constants/fonts';
import { ArticleInfo } from '@/types/model.d';
import Pagination from '@/components/ui/Pagination';

export default function ArtistArticleView({
  articleList,
}: {
  articleList: ArticleInfo[] | undefined;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize(); // 초기 설정
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const totalPages = Math.ceil((articleList?.length || 0) / itemsPerPage);
  const currentItems = articleList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    articleList && (
      <div className="flex flex-col mt-10 justify-center w-full">
        <h2 className={`${pretendardRegular.className} text-xl text-center`}>
          Related Articles
        </h2>
        <div className="grid grid-cols-1 items-center justify-center p-4 md:p-20 gap-4">
          {currentItems?.map((article, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full"
            >
              <Link
                key={index}
                href={(article.src as string) ?? ''}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col w-full h-[90vh] justify-center items-center"
              >
                <Image
                  src={article.imageUrl ?? ''}
                  alt={article.title ?? ''}
                  fill={true}
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
              </Link>
              <p
                className={`${pretendardSemiBold.className} text-2xl text-white hover:underline cursor-pointer mt-10 `}
              >
                {article.title}
              </p>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    )
  );
}
