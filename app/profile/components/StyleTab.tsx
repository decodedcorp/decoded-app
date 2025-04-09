"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { pretendardMedium } from "@/lib/constants/fonts";
import { useRequestModal } from "@/components/modals/request/hooks/use-request-modal";

interface StyleTabProps {
  userDocId: string;
}

interface UserStyle {
  id: string;
  imageUrl: string;
  name: string;
  createdAt: string;
}

export function StyleTab({ userDocId }: StyleTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [styles, setStyles] = useState<UserStyle[]>([]);
  const { onOpen: openRequestModal, RequestModal } = useRequestModal();

  useEffect(() => {
    const fetchUserStyles = async () => {
      try {
        setTimeout(() => {
          const userStyles: UserStyle[] = [];
          setStyles(userStyles);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("사용자 스타일 데이터 로딩 오류:", error);
        setIsLoading(false);
      }
    };

    fetchUserStyles();
  }, [userDocId]);

  const handleAddStyle = () => {
    console.log("내 스타일 추가 기능 실행");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (styles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-xl font-semibold text-white">
            등록한 스타일이 없습니다
          </h3>
          <p className="text-white/60">
            자신만의 스타일 이미지를 업로드하고 다른 사용자들과 공유해보세요.
          </p>
        </div>

        <Button
          onClick={openRequestModal}
          className="flex items-center space-x-2 bg-[#eafd66] hover:bg-[#d6e85c] text-black"
        >
          <Upload className="h-4 w-4" />
          <span className={pretendardMedium.className}>내 스타일 등록하기</span>
        </Button>
        {RequestModal}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">내 스타일</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={openRequestModal}
          className="text-white/70 hover:text-white border-gray-700 hover:border-white/40"
        >
          <Upload className="h-4 w-4 mr-1" />
          스타일 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {styles.map((style) => (
          <Card
            key={style.id}
            className="bg-[#1A1A1A] border-white/5 overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={style.imageUrl}
                alt={style.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                unoptimized
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-medium">{style.name}</h3>
                <p className="text-white/70 text-xs mt-1">
                  {new Date(style.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
