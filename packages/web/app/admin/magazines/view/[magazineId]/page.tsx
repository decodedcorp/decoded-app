"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMagazine } from "@/lib/hooks/admin/useMagazines";
import { MagazineViewPanel } from "@/lib/components/admin/magazine/MagazineViewPanel";

export default function MagazineViewPage() {
  const params = useParams();
  const magazineId = params.magazineId as string;
  const { data: magazine, isLoading, error } = useMagazine(magazineId);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="space-y-4">
        <p className="text-destructive text-sm">매거진을 불러올 수 없습니다.</p>
        <Link href="/admin/magazines" className="text-sm text-primary hover:underline">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/magazines"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-serif text-lg font-semibold text-foreground flex-1 truncate">
          {magazine.title || "제목 없음"}
        </h1>
      </div>
      <div className="flex-1 min-h-0 rounded-xl border border-border overflow-hidden">
        <MagazineViewPanel magazine={magazine} />
      </div>
    </div>
  );
}
