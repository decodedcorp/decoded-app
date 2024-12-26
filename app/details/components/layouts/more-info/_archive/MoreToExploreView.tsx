import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { pretendardRegular } from '@/lib/constants/fonts';
import Pagination from '@/components/ui/Pagination';

export default function MoreToExploreView({
  imgList,
}: {
  imgList: [string, string][] | undefined;
}) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null
  );
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 3 : 4);
    };

    handleResize(); // 초기 설정
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!imgList?.length) return null;

  const totalPages = Math.ceil(imgList.length / itemsPerPage);
  const currentItems = imgList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full text-center mt-20">
      {imgList && imgList.length > 0 && (
        <div className="items-center justify-center mt-10">
          <h2 className={`${pretendardRegular.className} text-xl`}>
            More to explore
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 items-stretch place-items-stretch my-10 px-7">
            {currentItems?.map((image, index) => (
              <Link
                key={index}
                href={`?imageId=${image[0]}&imageUrl=${encodeURIComponent(
                  image[1]
                )}`}
                prefetch={false}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full h-[300px] md:h-[600px] aspect-w-3 aspect-h-4"
                onMouseOver={() => setHoveredImageIndex(index)}
                onMouseOut={() => setHoveredImageIndex(null)}
              >
                <Image
                  src={image[1]}
                  alt="Artist Image"
                  fill={true}
                  style={{ objectFit: 'cover' }}
                  className="more-tagged rounded-md"
                  loading="lazy"
                />
                {hoveredImageIndex === index && (
                  <div className="flex flex-col absolute inset-0 bg-black bg-opacity-50 items-center justify-center transition-opacity duration-300 ease-in-out">
                    <p
                      className={`${pretendardRegular.className} px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors text-sm`}
                    >
                      아이템 둘러보기
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
