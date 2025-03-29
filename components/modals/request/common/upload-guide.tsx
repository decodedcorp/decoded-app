import { useLocaleContext } from "@/lib/contexts/locale-context";
import { ImageIcon, UploadIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils/style";

interface UploadGuideProps {
  onFileSelect?: () => void;
  themeColor?: string;
}

export function UploadGuide({
  onFileSelect,
  themeColor = "#EAFD66",
}: UploadGuideProps = {}) {
  const { t } = useLocaleContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFileSelect) {
      onFileSelect();
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-[#1A1A1A]">
      <div className="w-full max-w-[240px] mx-auto text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>

          <h2 className="text-lg font-medium text-white/80 mb-2">
            {t.request.steps.upload.title || "새 게시물 만들기"}
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            {t.request.steps.upload.description ||
              "사진을 끌어다 놓거나 클릭하여 업로드하세요"}
          </p>

          <button
            onClick={handleClick}
            className="w-full py-2 px-3 text-[#1A1A1A] text-sm font-medium rounded-md flex items-center justify-center transition-colors hover:opacity-90"
            style={{
              backgroundColor: themeColor,
              borderColor: themeColor,
            }}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            컴퓨터에서 선택
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <InfoIcon className="w-3 h-3 mr-1 inline flex-shrink-0" />
            <span>인물이 잘 보이는 사진을 업로드하세요</span>
          </p>
        </div>
      </div>
    </div>
  );
}
