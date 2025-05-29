"use client";

import { motion } from "framer-motion";
import { Card } from "../../../../components/ui/card";
import { TabType } from "@/components/Header/nav/modal/types/mypage";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// 콘텐츠 아이템 타입 정의
export interface ContentItem {
  id: string;
  imageUrl: string;
  title?: string;
  type?: TabType;
  image_doc_id?: string;
  image_url?: string;
  item_doc_id?: string;
  name?: string;
  item_category?: string;
}

// 각 콘텐츠 카드 컴포넌트
interface ContentCardProps {
  item: ContentItem;
  index: number;
  filterIcons: Record<TabType, React.ReactElement>;
}

export const ContentCard = ({ item, index, filterIcons }: ContentCardProps) => {
  // 라우터 추가
  const router = useRouter();
  
  // API 응답에 따라 이미지 URL을 적절히 가져옵니다
  const imageUrl = item.imageUrl || item.image_url || '';
  const imageId = item.image_doc_id || item.id;
  
  // 이미지 상세 페이지로 이동하는 함수
  const handleCardClick = () => {
    router.push(`/details/${imageId}`);
  };
  
  return (
    <motion.div
      key={`${item.type}-${item.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card className="bg-[#1A1A1A] border-white/5 overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="relative">
          {/* 이미지 컨테이너에 4:5 비율 적용 */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
            <Image 
              src={imageUrl} 
              alt={`이미지 ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="absolute top-2 left-2">
            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
              {item.type === "request" ? filterIcons.request : 
               item.type === "provide" ? filterIcons.provide : 
               filterIcons.like}
              {item.type === "request" ? "요청" : 
               item.type === "provide" ? "제공" : 
               "좋아요"}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <button 
              className="bg-black/50 p-1.5 rounded-full hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                // 북마크 기능은 별도 구현 필요
              }}
            >
              <Bookmark className="h-3 w-3 text-white" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}; 