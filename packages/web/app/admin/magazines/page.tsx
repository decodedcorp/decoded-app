"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMagazineSessions, useDeleteMagazineSession, useCreateMagazineSession } from "@/lib/hooks/admin/useMagazineSessions";
import { Plus, Trash2, Send, Eye } from "lucide-react";
import { DropZone } from "@/lib/components/request/DropZone";

const MAGAZINE_MAX_IMAGES = 10;

function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!src) return null;
  return (
    <div className="relative group rounded-lg overflow-hidden w-16 h-16 border border-border">
      <img src={src} alt={file.name} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
      >
        삭제
      </button>
    </div>
  );
}

interface CreateMagazineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateMagazineModal({ isOpen, onClose }: CreateMagazineModalProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const createMutation = useCreateMagazineSession();

  const handleFilesSelected = useCallback((files: File[]) => {
    setImages((prev) => {
      const combined = [...prev, ...files];
      return combined.slice(0, MAGAZINE_MAX_IMAGES);
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("이미지를 1장 이상 추가해주세요.");
      return;
    }
    try {
      const result = await createMutation.mutateAsync({ topic, images });
      onClose();
      router.push(`/admin/magazines/${result.session_id}`);
    } catch (err) {
      console.error(err);
      alert("세션 생성 실패");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-xl font-semibold text-foreground">
          새 매거진
        </h2>
        <p className="text-sm text-muted-foreground">
          매거진 주제나 방향을 입력해주세요.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: S/S 2026 레더 트렌드, 미니멀 스타일룩 등"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              이미지 추가 (드래그 또는 클릭)
            </p>
            <DropZone
              onFilesSelected={handleFilesSelected}
              disabled={createMutation.isPending}
              maxImages={MAGAZINE_MAX_IMAGES}
              className="min-h-[120px]"
            />
          </div>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((file, i) => (
                <ImagePreview key={`${file.name}-${i}`} file={file} onRemove={() => removeImage(i)} />
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending || images.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending ? (
                "생성 중..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  매거진 제작하기
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Magazines list page - Magazine Editor Pipeline sessions.
 */
export default function MagazinesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: sessions, isLoading } = useMagazineSessions();
  const deleteMutation = useDeleteMagazineSession();

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    if (!confirm("세션을 삭제하시겠습니까? Storage 이미지도 함께 삭제됩니다.")) return;
    deleteMutation.mutate(sessionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            매거진
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            매거진 편집 세션 생성 및 관리
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 매거진
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          로딩 중...
        </div>
      ) : sessions && sessions.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center">
              <Link
                href={`/admin/magazines/${s.id}`}
                className="flex-1 block px-4 py-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {s.topic || "제목 없음"}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {s.current_step}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {s.thread_id}
                </p>
              </Link>
              {s.magazine_id && (
                <Link
                  href={`/admin/magazines/view/${s.magazine_id}`}
                  className="px-3 py-3 text-muted-foreground hover:text-primary transition-colors"
                  title="저장된 매거진 보기"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={(e) => handleDelete(e, s.id)}
                disabled={deleteMutation.isPending}
                className="px-3 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                title="세션 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">
            아직 매거진 세션이 없습니다
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 매거진 만들기
          </button>
        </div>
      )}

      <CreateMagazineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
