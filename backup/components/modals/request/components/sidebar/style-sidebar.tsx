import { Link, X } from "lucide-react";
import { cn } from "@/lib/utils/style";
import { StylePoint } from "../../types";
import { useState } from "react";

interface StyleSidebarProps {
  currentStep: number;
  points: StylePoint[];
  selectedPoint: number | null;
  onPointSelect: (index: number | null) => void;
  onPointUpdate: (index: number, point: StylePoint) => void;
  onPointDelete: (index: number) => void;
}

export function StyleSidebar({
  currentStep,
  points,
  selectedPoint,
  onPointSelect,
  onPointUpdate,
  onPointDelete
}: StyleSidebarProps) {
  const [newUrl, setNewUrl] = useState("");
  const [inspirationLinks, setInspirationLinks] = useState<{ id: string; url: string }[]>([]);

  const handleAddInspirationLink = () => {
    if (newUrl.trim()) {
      setInspirationLinks([...inspirationLinks, { id: Date.now().toString(), url: newUrl }]);
      setNewUrl("");
    }
  };

  const handleRemoveInspirationLink = (id: string) => {
    setInspirationLinks(prev => prev.filter(link => link.id !== id));
  };

  if (currentStep === 2) {
    return (
      <div className="p-5 flex flex-col h-full flex-1">
        <h3 className="text-base font-medium text-white mb-4">아이템 정보</h3>
        {points.length === 0 ? (
          <EmptyState
            icon={<div className="w-6 h-6 border-2 border-[#EAFD66] rounded-full" />}
            title="마커를 추가해주세요"
            description="이미지에 원하는 위치를 클릭하여 마커를 추가하고, 브랜드와 가격 정보를 입력해주세요."
          />
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {points.map((point, index) => (
              <StylePointItem
                key={index}
                point={point}
                index={index}
                isSelected={selectedPoint === index}
                onSelect={() => onPointSelect(selectedPoint === index ? null : index)}
                onUpdate={(updatedPoint) => onPointUpdate(index, updatedPoint)}
                onDelete={() => onPointDelete(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="p-5 flex flex-col h-full flex-1">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-base font-medium text-white">스타일 참고 링크</h3>
          <InfoTooltip text="이 스타일을 만들 때 참고한 이미지나 영상의 링크를 추가해주세요. 다른 사용자들이 스타일의 영감을 얻는데 도움이 됩니다." />
        </div>
        
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL을 입력하세요"
            className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
          />
          <button
            onClick={handleAddInspirationLink}
            disabled={!newUrl.trim()}
            className={cn(
              "w-full py-2.5 text-sm rounded-md transition-colors font-medium",
              newUrl.trim()
                ? "bg-[#EAFD66] text-[#1A1A1A] hover:bg-[#EAFD66]/90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            )}
          >
            링크 추가
          </button>
        </div>

        {inspirationLinks.length === 0 ? (
          <EmptyState
            icon={<Link className="w-6 h-6 text-[#EAFD66]" />}
            title="참고 링크를 추가해주세요"
            description="이 스타일을 만들 때 참고한 이미지나 영상의 링크를 추가하면 다른 사용자들에게 도움이 됩니다."
          />
        ) : (
          <div className="mt-4 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 pr-1">
              {inspirationLinks.map((link) => (
                <InspirationLinkItem
                  key={link.id}
                  url={link.url}
                  onRemove={() => handleRemoveInspirationLink(link.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// 하위 컴포넌트들
function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <div className="w-12 h-12 rounded-full bg-[#232323] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-base font-medium text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400 max-w-[280px]">{description}</p>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative">
      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center cursor-help">
        <span className="text-[10px] font-medium text-gray-400">i</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-[#232323] border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {text}
      </div>
    </div>
  );
}

function StylePointItem({
  point,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}: {
  point: StylePoint;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (point: StylePoint) => void;
  onDelete: () => void;
}) {
  return (
    <div
      id={`marker-${index}`}
      className={cn(
        "p-3 border rounded-lg transition-all",
        !point.brand || !point.price
          ? "bg-[#2A1A1A] border-red-500/20"
          : "bg-[#232323] border-gray-700/50",
        isSelected
          ? "border-[#EAFD66] bg-[#232323]/80"
          : "hover:border-[#EAFD66]/20"
      )}
    >
      {/* 아이템 헤더 */}
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer flex-1"
          onClick={onSelect}
        >
          <div className="w-5 h-5 flex items-center justify-center bg-[#EAFD66] text-[#1A1A1A] rounded-full text-[10px] font-bold">
            {index + 1}
          </div>
          <span className="text-sm text-white">아이템 {index + 1}</span>
        </div>

        <div className="flex items-center gap-3">
          <SecretCheckbox
            checked={point.isSecret || false}
            onChange={(checked) => onUpdate({ ...point, isSecret: checked })}
          />
          <DeleteButton onClick={onDelete} />
        </div>
      </div>

      {/* 아이템 상세 정보 */}
      {isSelected && (
        <div className="mt-3 space-y-2 pt-3 border-t border-gray-700/50">
          <InputField
            label="브랜드"
            value={point.brand || ""}
            onChange={(value) => onUpdate({ ...point, brand: value })}
            placeholder="브랜드명"
          />
          <InputField
            label="가격"
            value={point.price || ""}
            onChange={(value) => onUpdate({ ...point, price: value })}
            placeholder="가격"
          />
        </div>
      )}
    </div>
  );
}

function SecretCheckbox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div 
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-600 bg-[#2A2A2A] text-[#EAFD66] focus:ring-[#EAFD66] focus:ring-offset-0 focus:ring-2 accent-[#EAFD66]"
      />
      <label className="text-xs text-[#EAFD66] cursor-pointer whitespace-nowrap">
        찔러보기
      </label>
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-red-400 transition-colors"
    >
      <X size={14} />
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 bg-[#2A2A2A] border border-gray-700 rounded text-sm text-white focus:border-[#EAFD66] focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function InspirationLinkItem({ url, onRemove }: { url: string; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between p-2 bg-[#232323] border border-gray-700 rounded-md hover:border-gray-600 transition-colors">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs text-[#EAFD66] hover:text-[#EAFD66]/80 hover:underline truncate"
      >
        <Link size={14} className="flex-shrink-0" />
        <span className="truncate">{url}</span>
      </a>
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
} 