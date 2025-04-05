"use client";

import { motion } from "framer-motion";
import { Card } from "../../../../components/ui/card";
import { TabType } from "@/components/Header/nav/modal/types/mypage";
import { useRouter } from "next/navigation";

// 게시물 타입 정의
export interface BoardItem {
  id: string;
  title: string;
  updatedAt: string;
  commentCount?: number;
  type?: TabType;
  content?: string;
  content_title?: string;
  content_id?: string;
  board_id?: string;
  file_url?: string;
}

// 게시판 카드 컴포넌트
interface BoardCardProps {
  item: BoardItem;
  index: number;
  filterIcons: Record<TabType, JSX.Element>;
}

export const BoardCard = ({ item, index, filterIcons }: BoardCardProps) => {
  const router = useRouter();
  
  // API 응답에 따라 타이틀과 ID 적절히 가져오기
  const title = item.content_title || item.title || '';
  const boardId = item.board_id || item.content_id || item.id;
  
  // 게시물 상세 페이지로 이동하는 함수
  const handleCardClick = () => {
    router.push(`/community/post/${boardId}`);
  };
  
  return (
    <motion.div
      key={`${item.type}-${item.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card className="p-4 hover:shadow-md transition-all bg-[#1A1A1A] border-white/5">
        <div className="flex items-start gap-2">
          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center whitespace-nowrap">
            {item.type === "board" ? filterIcons.board : 
             item.type === "comment" ? filterIcons.comment : 
             filterIcons.like}
            {item.type === "board" ? "게시글" : 
             item.type === "comment" ? "댓글" : 
             "좋아요"}
          </span>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-medium text-white truncate" title={title}>
              {title}
            </h3>
            {item.content && (
              <p className="text-xs text-white/70 mt-1 line-clamp-2">
                {item.content}
              </p>
            )}
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-white/50">
                {new Date(item.updatedAt).toLocaleDateString()}
              </span>
              {item.commentCount !== undefined && (
                <span className="text-xs text-white/70">
                  댓글: {item.commentCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}; 