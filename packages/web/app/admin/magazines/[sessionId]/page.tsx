"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Check, X, Sparkles, ChevronRight, Pencil, Send, MessageSquare, Eye, ExternalLink } from "lucide-react";
import { MagazinePreviewPanel } from "@/lib/components/admin/magazine/MagazinePreviewPanel";
import {
  useMagazineSession,
  useRunMagazineStep,
  useConfirmMagazineStep,
  useReviseMagazineStep,
  useMagazineSessionRealtime,
  useStepTimer,
  useRemoveSolution,
} from "@/lib/hooks/admin/useMagazineSessions";

// ─── 타입 ───────────────────────────────────────────────────────────────────

interface BBox {
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
}

interface ItemDraft {
  category: string;
  brand: string;
  name: string;
  price: string;
  currency: string;
  worn_on_person?: BBox; // 드래그 수정용
}

interface ImageDraft {
  celebrity_name: string;
  group_name: string;
  items: ItemDraft[];
}

// ─── 작은 컴포넌트들 ─────────────────────────────────────────────────────────

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3 max-w-[85%] text-sm text-foreground">
        {children}
      </div>
    </div>
  );
}

const LOADING_LABELS: Record<string, string> = {
  vision: "분석중",
  planner: "기획중",
  solution_search: "검색중",
  writer: "작성중",
  designer: "디자인중",
};

const TONE_LABELS: Record<string, string> = {
  editorial_luxury: "에디토리얼 럭셔리",
  minimal: "미니멀",
  street: "스트릿",
  romantic: "로맨틱",
};

function formatTone(tone?: string): string {
  if (!tone) return "";
  return TONE_LABELS[tone] ?? tone;
}

type OutlineData = { title?: string; tone?: string; plan_summary?: string; outline?: { title?: string; description?: string }[] };

function OutlineBubbleContent({
  outline,
  label,
  showConfirmReject,
  isMuted,
  onConfirm,
  onReject,
  confirmResult,
  isConfirmPending,
}: {
  outline: OutlineData;
  label: string;
  showConfirmReject: boolean;
  isMuted?: boolean;
  onConfirm?: () => void;
  onReject?: () => void;
  confirmResult?: "confirmed" | "rejected" | null;
  isConfirmPending?: boolean;
}) {
  const sections = outline?.outline ?? [];
  const title = outline?.title;
  const tone = outline?.tone;
  const planSummary = outline?.plan_summary;
  const hasMeta = !!(title || tone || planSummary);
  return (
    <BotBubble>
      <div className={isMuted ? "opacity-75" : ""}>
        <p className="mb-2">{label}</p>
        {hasMeta ? (
          <div className="mb-3 space-y-1 rounded-lg bg-muted/40 p-2.5 text-xs">
            {title && <p><span className="text-muted-foreground">매거진:</span> <span className="font-medium">{title}</span></p>}
            {tone && <p><span className="text-muted-foreground">톤:</span> {formatTone(tone)}</p>}
            {planSummary && <p><span className="text-muted-foreground">기획 요약:</span> {planSummary}</p>}
          </div>
        ) : null}
        <ul className="space-y-1.5">
          {sections.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground text-xs mt-0.5">{i + 1}.</span>
              <div>
                <span className="font-medium">{s.title}</span>
                {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showConfirmReject && onConfirm && onReject && (
        <ConfirmRejectInline
          result={confirmResult ?? null}
          isPending={isConfirmPending ?? false}
          onConfirm={onConfirm}
          onReject={onReject}
        />
      )}
    </BotBubble>
  );
}

function formatElapsed(s: number): string {
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function ThinkingBubble({ label, elapsed }: { label: string; elapsed?: number }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3 max-w-[85%]">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        </div>
        <span className="text-xs text-muted-foreground animate-fade-in-out pl-1">
          {label}{elapsed !== undefined && elapsed > 0 ? ` · ${formatElapsed(elapsed)}` : ""}
        </span>
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-3 max-w-[85%] text-sm text-foreground">
        {children}
      </div>
    </div>
  );
}

const STEPS: { key: string; label: string }[] = [
  { key: "vision", label: "비전 분석" },
  { key: "planner", label: "기획" },
  { key: "solution_search", label: "솔루션 검색" },
  { key: "writer", label: "본문 작성" },
  { key: "designer", label: "레이아웃 디자인" },
  { key: "done", label: "완료" },
];

function StepIndicator({ currentStep }: { currentStep: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-xs">
      {STEPS.map((step, i) => (
        <span key={step.key} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground/60">-</span>}
          <span
            className={
              currentStep === step.key
                ? "font-medium text-primary"
                : "text-muted-foreground"
            }
          >
            {step.label}
          </span>
        </span>
      ))}
    </div>
  );
}

function InlineInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-transparent border-b border-border focus:border-primary outline-none text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors ${className}`}
    />
  );
}

function ActionButton({
  onClick,
  disabled,
  loading,
  loadingLabel,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const base = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? `${base} bg-primary text-primary-foreground hover:bg-primary/90`
      : `${base} border border-border text-foreground hover:bg-accent`;
  return (
    <button onClick={onClick} disabled={disabled || loading} className={styles}>
      {loading ? loadingLabel ?? "처리 중..." : children}
    </button>
  );
}

function ConfirmRejectInline({
  result,
  isPending,
  onConfirm,
  onReject,
}: {
  result: "confirmed" | "rejected" | null;
  isPending: boolean;
  onConfirm: () => void;
  onReject: () => void;
}) {
  if (result === "confirmed") {
    return (
      <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-1.5 text-xs text-primary">
        <Check className="w-3.5 h-3.5" /> 확인됨
      </div>
    );
  }
  if (result === "rejected") {
    return (
      <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-1.5 text-xs text-destructive">
        <X className="w-3.5 h-3.5" /> 거절됨
      </div>
    );
  }
  return (
    <div className="mt-3 pt-3 border-t border-border/30 flex gap-2">
      <button
        onClick={onConfirm}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        <Check className="w-3.5 h-3.5" /> 확인
      </button>
      <button
        onClick={onReject}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
      >
        거절
      </button>
    </div>
  );
}

// 아이템 색상 팔레트 (최대 8개)
const SPOT_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

function ImageWithSpots({
  src,
  alt,
  items,
  personBBox,
  onBBoxChange,
}: {
  src: string;
  alt: string;
  items: ItemDraft[];
  personBBox?: BBox;
  onBBoxChange: (itemIdx: number, bbox: BBox) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState<{ w: number; h: number; left: number; top: number } | null>(null);

  const updateSize = useCallback(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    if (!img.naturalWidth || !img.naturalHeight) {
      setImgSize({ w: rect.width, h: rect.height, left: 0, top: 0 });
      return;
    }
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = rect.width / rect.height;
    let renderW: number, renderH: number, offsetLeft: number, offsetTop: number;
    if (naturalRatio > containerRatio) {
      renderW = rect.width;
      renderH = rect.width / naturalRatio;
      offsetLeft = 0;
      offsetTop = (rect.height - renderH) / 2;
    } else {
      renderH = rect.height;
      renderW = rect.height * naturalRatio;
      offsetTop = 0;
      offsetLeft = (rect.width - renderW) / 2;
    }
    setImgSize({ w: renderW, h: renderH, left: offsetLeft, top: offsetTop });
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    img.addEventListener("load", updateSize);
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => { img.removeEventListener("load", updateSize); ro.disconnect(); };
  }, [updateSize]);

  // worn_on_person 좌표를 크롭 이미지 기준 중심점(%)으로 변환
  const toCenterPercent = (wop: BBox): { cx: number; cy: number } => {
    const centerX = wop.x_percent + wop.width_percent / 2;
    const centerY = wop.y_percent + wop.height_percent / 2;
    if (!personBBox) return { cx: centerX, cy: centerY };
    const px = personBBox.x_percent, py = personBBox.y_percent;
    const pw = Math.max(0.1, personBBox.width_percent);
    const ph = Math.max(0.1, personBBox.height_percent);
    return {
      cx: ((centerX - px) / pw) * 100,
      cy: ((centerY - py) / ph) * 100,
    };
  };

  // 크롭 이미지 기준 중심점(%) → 원본 좌표 BBox로 역변환
  const fromCenterPercent = (cxRel: number, cyRel: number, itemIdx: number): BBox => {
    const base = items[itemIdx]?.worn_on_person ?? { x_percent: 0, y_percent: 0, width_percent: 10, height_percent: 10 };
    if (!personBBox) {
      return { ...base, x_percent: cxRel - base.width_percent / 2, y_percent: cyRel - base.height_percent / 2 };
    }
    const px = personBBox.x_percent, py = personBBox.y_percent;
    const pw = Math.max(0.1, personBBox.width_percent);
    const ph = Math.max(0.1, personBBox.height_percent);
    const origCx = px + (cxRel / 100) * pw;
    const origCy = py + (cyRel / 100) * ph;
    return {
      x_percent: origCx - base.width_percent / 2,
      y_percent: origCy - base.height_percent / 2,
      width_percent: base.width_percent,
      height_percent: base.height_percent,
    };
  };

  const handleSpotDrag = (itemIdx: number, spotCx: number, spotCy: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = rect.width / rect.height;
    let renderW: number, renderH: number, oLeft: number, oTop: number;
    if (naturalRatio > containerRatio) {
      renderW = rect.width;
      renderH = rect.width / naturalRatio;
      oLeft = 0;
      oTop = (rect.height - renderH) / 2;
    } else {
      renderH = rect.height;
      renderW = rect.height * naturalRatio;
      oTop = 0;
      oLeft = (rect.width - renderW) / 2;
    }

    const spotPxX = (spotCx / 100) * renderW;
    const spotPxY = (spotCy / 100) * renderH;
    const dragOffsetX = e.clientX - (rect.left + oLeft) - spotPxX;
    const dragOffsetY = e.clientY - (rect.top + oTop) - spotPxY;

    const onMove = (mv: MouseEvent) => {
      const r = img.getBoundingClientRect();
      const cx = Math.min(100, Math.max(0, ((mv.clientX - (r.left + oLeft) - dragOffsetX) / renderW) * 100));
      const cy = Math.min(100, Math.max(0, ((mv.clientY - (r.top + oTop) - dragOffsetY) / renderH) * 100));
      onBBoxChange(itemIdx, fromCenterPercent(cx, cy, itemIdx));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div ref={containerRef} className="relative bg-muted/20 select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={src} alt={alt} className="w-full max-h-72 object-contain block" />
      {imgSize && items.map((item, j) => {
        if (!item.worn_on_person) return null;
        const { cx, cy } = toCenterPercent(item.worn_on_person);
        const color = SPOT_COLORS[j % SPOT_COLORS.length];
        return (
          <div
            key={j}
            onMouseDown={(e) => handleSpotDrag(j, cx, cy, e)}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group"
            style={{
              left: `calc(${imgSize.left}px + ${cx / 100} * ${imgSize.w}px)`,
              top: `calc(${imgSize.top}px + ${cy / 100} * ${imgSize.h}px)`,
            }}
          >
            {/* 바깥 링 */}
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-md"
              style={{ borderColor: color, background: `${color}22` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            </div>
            {/* 라벨 툴팁 */}
            <div
              className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: color, color: "#fff" }}
            >
              {j + 1}. {item.category || "item"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function MagazineSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const { data: session, isLoading, error } = useMagazineSession(sessionId);
  const runStep = useRunMagazineStep(sessionId);
  const confirmStep = useConfirmMagazineStep(sessionId);
  const reviseStep = useReviseMagazineStep(sessionId);
  const removeSolution = useRemoveSolution(sessionId);

  // 거절 후 피드백 입력 시 재실행할 step (planner | writer | designer)
  const [rejectedStep, setRejectedStep] = useState<string | null>(null);

  // 백그라운드 실행 중 여부 (202 반환 후 isPending 해제되므로 별도 state)
  const [runningStep, setRunningStep] = useState<string | null>(null);
  // solution_search confirm 후 백엔드 저장 상태
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string | undefined>();
  const [savedPostCount, setSavedPostCount] = useState<number | undefined>();
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [savedSpotIds, setSavedSpotIds] = useState<string[]>([]);
  const [savedSolutionIds, setSavedSolutionIds] = useState<string[]>([]);

  const stepStatus = runningStep
    ? "running"
    : (session?.step_status ?? "");
  const isStepRunning = stepStatus === "running";
  const elapsed = useStepTimer(isStepRunning);
  const saveElapsed = useStepTimer(saveStatus === "saving");

  // Realtime 구독: step 완료/에러 시 자동 갱신
  useMagazineSessionRealtime(sessionId);

  // step_status가 "running"에서 다른 값으로 바뀔 때만 runningStep 리셋
  // (클릭 직후 session이 아직 갱신되기 전 step_status로 즉시 리셋되는 현상 방지)
  const prevStepStatusRef = useRef<string | undefined>(session?.step_status);
  useEffect(() => {
    const current = session?.step_status;
    if (
      prevStepStatusRef.current === "running" &&
      current !== "running" &&
      current !== undefined
    ) {
      setRunningStep(null);
    }
    prevStepStatusRef.current = current;
  }, [session?.step_status]);

  // solution_search confirm 성공 후 step이 writer로 넘어가면 saveStatus 리셋
  useEffect(() => {
    if (session?.current_step === "writer" && saveStatus !== "idle") {
      setSaveStatus("idle");
      setSaveError(undefined);
      setSavedPostCount(undefined);
      setSavedPostIds([]);
      setSavedSpotIds([]);
      setSavedSolutionIds([]);
    }
  }, [session?.current_step, saveStatus]);

  // 편집 상태: 이미지별 celebrity_name + items
  const [drafts, setDrafts] = useState<ImageDraft[]>([]);
  const [draftsInitialized, setDraftsInitialized] = useState(false);
  // 대화 입력 (UI만 구현, 추후 백엔드 연동) — step별로 저장하여 대화 순서 유지
  const [chatInput, setChatInput] = useState("");
  const [userMessages, setUserMessages] = useState<{ step: string; text: string }[]>([]);
  const chatInputRef = useRef<HTMLInputElement>(null);
  // 확인/거절 결과 (BotBubble 내 결과 표시용)
  const [confirmResults, setConfirmResults] = useState<Record<string, "confirmed" | "rejected" | null>>({});
  // 모바일: 채팅 | 미리보기 탭
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");

  const handleConfirm = (step: string) => {
    setConfirmResults((prev) => ({ ...prev, [step]: "confirmed" }));
    setUserMessages((prev) => [...prev, { step, text: "확인했어요" }]);
    if (step === "solution_search") {
      setSaveStatus("saving");
      setSaveError(undefined);
      confirmStep.mutate(undefined, {
        onSuccess: (data) => {
          setSaveStatus("success");
          setSavedPostCount(data?.saved_post_count);
          setSavedPostIds(data?.saved_post_ids ?? []);
          setSavedSpotIds(data?.saved_spot_ids ?? []);
          setSavedSolutionIds(data?.saved_solution_ids ?? []);
        },
        onError: (err) => {
          setSaveStatus("error");
          setSaveError(err instanceof Error ? err.message : String(err));
        },
      });
    } else {
      confirmStep.mutate();
    }
  };

  const handleReject = (step: string) => {
    setConfirmResults((prev) => ({ ...prev, [step]: "rejected" }));
    setRejectedStep(step);
    setTimeout(() => chatInputRef.current?.focus(), 100);
  };

  const handleChatSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = chatInput.trim();
      if (!text) return;
      if (rejectedStep) {
        const stepToRerun = rejectedStep;
        setUserMessages((prev) => [...prev, { step: stepToRerun, text: `수정이 필요해요 (피드백: ${text})` }]);
        setChatInput("");
        reviseStep.mutate(
          { feedback: text },
          {
            onSuccess: () => {
              setRejectedStep(null);
              setConfirmResults((prev) => {
                const next = { ...prev };
                Object.keys(next).forEach((k) => {
                  if (next[k] === "rejected") next[k] = null;
                });
                return next;
              });
              runStep.mutate(stepToRerun);
              setRunningStep(stepToRerun);
            },
          }
        );
        return;
      }
      setUserMessages((prev) => [...prev, { step: session?.current_step ?? "vision", text }]);
      setChatInput("");
      setConfirmResults((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] === "rejected") next[k] = null;
        });
        return next;
      });
    },
    [chatInput, rejectedStep, reviseStep, runStep, session?.current_step]
  );

  // Vision 결과가 로드되면 drafts 초기화
  useEffect(() => {
    if (draftsInitialized || !session?.images_json?.length) return;
    const initial = (session.images_json as {
      person?: { celebrity_name?: string; group_name?: string; description?: string };
      items?: {
        category?: string;
        worn_on_person?: BBox;
        product?: { brand?: string; name?: string; price?: string; currency?: string };
      }[];
    }[]).map((img) => ({
      celebrity_name: img.person?.celebrity_name ?? "",
      group_name: img.person?.group_name ?? "",
      items: (img.items ?? []).map((it) => ({
        category: it.category ?? "",
        brand: it.product?.brand ?? "",
        name: it.product?.name ?? "",
        price: it.product?.price ?? "",
        currency: it.product?.currency ?? "",
        worn_on_person: it.worn_on_person,
      })),
    }));
    setDrafts(initial);
    setDraftsInitialized(true);
  }, [session?.images_json, draftsInitialized]);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="space-y-4">
        <p className="text-destructive text-sm">세션을 불러올 수 없습니다.</p>
        <Link href="/admin/magazines" className="text-sm text-primary hover:underline">
          목록으로
        </Link>
      </div>
    );
  }

  const currentStep = session.current_step;
  const STEP_ORDER = ["vision", "planner", "solution_search", "writer", "designer", "done"];
  const currentStepIdx = STEP_ORDER.indexOf(currentStep);
  const isPendingConfirm = stepStatus === "pending_confirm";
  const isError = stepStatus === "error";
  const stepError = (session as { step_error?: string }).step_error;
  const imageCount = session.image_count ?? session.image_urls?.length ?? 0;
  const hasImagesJson = (session.images_json?.length ?? 0) > 0;
  const hasOutline = !!(session.outline as { outline?: unknown[] })?.outline?.length;
  const hasExternalSolutions =
    ((session as { external_solutions?: unknown[] }).external_solutions?.length ?? 0) > 0;
  const hasSections = (session.sections?.length ?? 0) > 0;

  const canRunCurrentStep =
    (imageCount > 0 && currentStep === "vision" && !hasImagesJson) ||
    (hasImagesJson && currentStep === "planner") ||
    (hasImagesJson && hasOutline && currentStep === "solution_search") ||
    (hasOutline && hasExternalSolutions && currentStep === "writer") ||
    (hasSections && currentStep === "designer");

  const updateDraftCelebrity = (idx: number, field: "celebrity_name" | "group_name", value: string) => {
    setDrafts((prev) => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const updateDraftItem = (imgIdx: number, itemIdx: number, field: keyof ItemDraft, value: string) => {
    setDrafts((prev) =>
      prev.map((d, i) =>
        i === imgIdx
          ? { ...d, items: d.items.map((it, j) => j === itemIdx ? { ...it, [field]: value } : it) }
          : d
      )
    );
  };

  const updateDraftItemBBox = (imgIdx: number, itemIdx: number, bbox: BBox) => {
    setDrafts((prev) =>
      prev.map((d, i) =>
        i === imgIdx
          ? { ...d, items: d.items.map((it, j) => j === itemIdx ? { ...it, worn_on_person: bbox } : it) }
          : d
      )
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] min-h-0 overflow-hidden w-full max-w-6xl">
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-1 gap-4 w-full">
      {/* ── 좌측: 채팅 패널 ── */}
      <div
        className={`flex flex-col min-w-0 h-full ${mobileTab === "chat" ? "flex" : "hidden"} md:flex`}
      >
        <div className="flex-1 overflow-auto space-y-4 pb-4 min-h-0">
        {/* Sticky 헤더 */}
        <div className="sticky top-0 z-10 bg-background pt-2 pb-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/magazines"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-serif text-lg font-semibold text-foreground flex-1 truncate">
              {session.topic || "제목 없음"}
            </h1>
          </div>
          <div className="pt-2">
            <StepIndicator currentStep={currentStep} />
          </div>
          {/* 모바일: 채팅 | 미리보기 탭 */}
          <div className="md:hidden flex border-t border-border pt-3 -mb-2">
            <button
              type="button"
              onClick={() => setMobileTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                mobileTab === "chat"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              채팅
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                mobileTab === "preview"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-4 h-4" />
              미리보기
            </button>
          </div>
        </div>

      {/* ── STEP 1: Vision 전 ── */}
      <BotBubble>
        <p>
          <span className="font-medium">{session.topic || "매거진"}</span> 프로젝트가 생성됐어요.
          이미지 <span className="font-medium">{imageCount}장</span>을 분석할게요.
        </p>
      </BotBubble>

      {/* Vision 분석 전: 로딩 버블 (별도) */}
      {isStepRunning && runningStep === "vision" && !hasImagesJson && (
        <ThinkingBubble label={LOADING_LABELS.vision} elapsed={elapsed} />
      )}
      {/* Vision 분석 전: 시작 버튼 또는 에러 */}
      {!hasImagesJson && !isStepRunning && (
        isError && currentStep === "vision" ? (
          <BotBubble>
            <p className="text-destructive text-sm">Vision 분석 중 오류가 발생했어요. {stepError && `(${stepError})`}</p>
            <button
              className="mt-2 text-xs text-primary underline"
              onClick={() => { setRunningStep("vision"); runStep.mutate("vision"); }}
            >
              다시 시도
            </button>
          </BotBubble>
        ) : canRunCurrentStep && currentStep === "vision" ? (
          <div className="flex justify-end">
            <ActionButton
              onClick={() => { setRunningStep("vision"); runStep.mutate("vision"); }}
              disabled={imageCount === 0}
            >
              <Sparkles className="w-4 h-4" />
              Vision 분석 시작
            </ActionButton>
          </div>
        ) : null
      )}

      {/* Vision 결과: 이미지별 카드 */}
      {hasImagesJson && session.image_urls && session.image_urls.length > 0 && (
        <div className="space-y-4">
          {session.image_urls.map((url, i) => {
            const draft = drafts[i];
            const rawImg = (session.images_json as {
              person?: { bounding_box?: BBox };
              items?: {
                worn_on_person?: BBox;
                product_card?: BBox;
              }[];
            }[])[i];
            const personBBox = rawImg?.person?.bounding_box;
            return (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* 이미지 + spot 오버레이 */}
                <ImageWithSpots
                  src={url}
                  alt={`이미지 ${i + 1}`}
                  items={draft?.items ?? []}
                  personBBox={personBBox}
                  onBBoxChange={(itemIdx, bbox) => updateDraftItemBBox(i, itemIdx, bbox)}
                />

                <div className="p-4 space-y-4">
                  {/* 셀럽명 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 flex-shrink-0">셀럽명</span>
                    {draft ? (
                      <div className="flex items-center gap-1 flex-1">
                        <InlineInput
                          value={draft.celebrity_name}
                          onChange={(v) => updateDraftCelebrity(i, "celebrity_name", v)}
                          placeholder="AI가 인식하지 못했어요 (직접 입력)"
                          className="flex-1"
                        />
                        <Pencil className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* 그룹명 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 flex-shrink-0">그룹명</span>
                    {draft ? (
                      <div className="flex items-center gap-1 flex-1">
                        <InlineInput
                          value={draft.group_name}
                          onChange={(v) => updateDraftCelebrity(i, "group_name", v)}
                          placeholder="그룹명을 적어주세요(선택사항)"
                          className="flex-1"
                        />
                        <Pencil className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* 아이템 목록 */}
                  {draft && draft.items.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">
                        감지된 아이템 {draft.items.length}개
                      </p>
                      {draft.items.map((item, j) => {
                        const pc = rawImg?.items?.[j]?.product_card;
                        return (
                        <div key={j} className="rounded-lg bg-muted/40 p-3 space-y-2">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-12 flex-shrink-0">카테고리</span>
                              <InlineInput
                                value={item.category}
                                onChange={(v) => updateDraftItem(i, j, "category", v)}
                                placeholder="jacket"
                                className="flex-1 min-w-0"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-12 flex-shrink-0">브랜드</span>
                              <InlineInput
                                value={item.brand}
                                onChange={(v) => updateDraftItem(i, j, "brand", v)}
                                placeholder="CELINE"
                                className="flex-1 min-w-0"
                              />
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <span className="text-xs text-muted-foreground w-12 flex-shrink-0">아이템명</span>
                              <InlineInput
                                value={item.name}
                                onChange={(v) => updateDraftItem(i, j, "name", v)}
                                placeholder="Rectangle Jacket"
                                className="flex-1 min-w-0"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-12 flex-shrink-0">가격</span>
                              <InlineInput
                                value={item.price}
                                onChange={(v) => updateDraftItem(i, j, "price", v)}
                                placeholder="2,250"
                                className="flex-1 min-w-0"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-12 flex-shrink-0">통화</span>
                              <InlineInput
                                value={item.currency}
                                onChange={(v) => updateDraftItem(i, j, "currency", v)}
                                placeholder="USD"
                                className="flex-1 min-w-0"
                              />
                            </div>
                          </div>
                          {/* 위치 정보 — 크롭 이미지 기준 중심점 % (DB 저장 값) */}
                          {item.worn_on_person && (() => {
                            const wop = item.worn_on_person;
                            const centerX = wop.x_percent + wop.width_percent / 2;
                            const centerY = wop.y_percent + wop.height_percent / 2;
                            let spotLeft = centerX;
                            let spotTop = centerY;
                            if (personBBox) {
                              const px = personBBox.x_percent, py = personBBox.y_percent;
                              const pw = Math.max(0.1, personBBox.width_percent);
                              const ph = Math.max(0.1, personBBox.height_percent);
                              spotLeft = ((centerX - px) / pw) * 100;
                              spotTop = ((centerY - py) / ph) * 100;
                            }
                            return (
                              <div className="pt-2 border-t border-border/40">
                                <p className="text-[10px] text-muted-foreground font-mono">
                                  spot · left {spotLeft.toFixed(1)}% top {spotTop.toFixed(1)}%
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">아이템이 감지되지 않았어요</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Vision 컨펌: BotBubble 안에 인라인 확인/거절 */}
          {hasImagesJson && (
            <BotBubble>
              분석 결과를 확인해 주세요. 셀럽명과 아이템 정보를 수정할 수 있어요.
              확인이 끝나면 기획 단계로 넘어갑니다.
              {(isPendingConfirm && currentStep === "vision") || confirmResults.vision != null ? (
                <ConfirmRejectInline
                  result={confirmResults.vision ?? null}
                  isPending={confirmStep.isPending}
                  onConfirm={() => handleConfirm("vision")}
                  onReject={() => handleReject("vision")}
                />
              ) : null}
            </BotBubble>
          )}
          {userMessages.filter((m) => m.step === "vision").map((m, i) => (
            <UserBubble key={`vision-${i}`}>{m.text}</UserBubble>
          ))}
        </div>
      )}

      {/* ── STEP 2: Planner ── */}
      {currentStepIdx >= 1 && (
        <>
          <BotBubble>
            Vision 분석이 완료됐어요! 이제 기획을 시작할까요?
          </BotBubble>
          {isStepRunning && runningStep === "planner" && !hasOutline && (
            <ThinkingBubble label={LOADING_LABELS.planner} elapsed={elapsed} />
          )}
          {!hasOutline && !isStepRunning && (
            isError && currentStep === "planner" ? (
              <BotBubble>
                <p className="text-destructive text-sm">기획 중 오류가 발생했어요. {stepError && `(${stepError})`}</p>
                <button
                  className="mt-2 text-xs text-primary underline"
                  onClick={() => { setRunningStep("planner"); runStep.mutate("planner"); }}
                >
                  다시 시도
                </button>
              </BotBubble>
            ) : canRunCurrentStep && currentStep === "planner" ? (
              <div className="flex justify-end">
                <ActionButton onClick={() => { setRunningStep("planner"); runStep.mutate("planner"); }}>
                  <Check className="w-4 h-4" />
                  확인
                </ActionButton>
              </div>
            ) : null
          )}
          {hasOutline && (() => {
            const outlineData = session.outline as OutlineData;
            const outlinePrev = session.outline_prev as OutlineData | null | undefined;
            const hasPrevOutline = outlinePrev?.outline && Array.isArray(outlinePrev.outline) && outlinePrev.outline.length > 0;
            if (hasPrevOutline) {
              return (
                <>
                  <OutlineBubbleContent
                    outline={outlinePrev!}
                    label="처음 작성된 기획 (수정 전)"
                    showConfirmReject={false}
                    isMuted={true}
                  />
                  <OutlineBubbleContent
                    outline={outlineData}
                    label="피드백을 반영해 수정했어요!"
                    showConfirmReject={true}
                    onConfirm={() => handleConfirm("planner")}
                    onReject={() => handleReject("planner")}
                    confirmResult={confirmResults.planner ?? undefined}
                    isConfirmPending={confirmStep.isPending}
                  />
                </>
              );
            }
            return (
              <OutlineBubbleContent
                outline={outlineData}
                label="아웃라인이 완성됐어요!"
                showConfirmReject={true}
                onConfirm={() => handleConfirm("planner")}
                onReject={() => handleReject("planner")}
                confirmResult={confirmResults.planner ?? undefined}
                isConfirmPending={confirmStep.isPending}
              />
            );
          })()}
          {userMessages.filter((m) => m.step === "planner").map((m, i) => (
            <UserBubble key={`planner-${i}`}>{m.text}</UserBubble>
          ))}
        </>
      )}

      {/* ── STEP 3: Solution Search ── */}
      {currentStepIdx >= 2 && (
        <>
          <BotBubble>
            아이템별 구매 링크와 이미지를 검색할게요.
          </BotBubble>
          {isStepRunning && runningStep === "solution_search" && !hasExternalSolutions && (
            <ThinkingBubble label={LOADING_LABELS.solution_search} elapsed={elapsed} />
          )}
          {!hasExternalSolutions && !isStepRunning && (
            isError && currentStep === "solution_search" ? (
              <BotBubble>
                <p className="text-destructive text-sm">솔루션 검색 중 오류가 발생했어요. {stepError && `(${stepError})`}</p>
                <button
                  className="mt-2 text-xs text-primary underline"
                  onClick={() => { setRunningStep("solution_search"); runStep.mutate("solution_search"); }}
                >
                  다시 시도
                </button>
              </BotBubble>
            ) : canRunCurrentStep && currentStep === "solution_search" ? (
              <div className="flex justify-end">
                <ActionButton onClick={() => { setRunningStep("solution_search"); runStep.mutate("solution_search"); }}>
                  <ChevronRight className="w-4 h-4" />
                  검색 시작
                </ActionButton>
              </div>
            ) : null
          )}
          {hasExternalSolutions && (
            <BotBubble>
              <p className="mb-3">
                솔루션 {(session as { external_solutions?: unknown[] }).external_solutions?.length ?? 0}개를 찾았어요.
              </p>
              <div className="space-y-6">
                {(() => {
                  const solutions = (session.external_solutions ?? []) as { brand?: string; title?: string; url?: string; image_url?: string; category?: string }[];
                  const groups = new Map<string, { items: typeof solutions; flatStartIndex: number }>();
                  let flatIdx = 0;
                  for (const s of solutions) {
                    const key = `${(s.brand || "").toLowerCase()}|${(s.title || "").toLowerCase()}`;
                    if (!groups.has(key)) {
                      groups.set(key, { items: [], flatStartIndex: flatIdx });
                    }
                    groups.get(key)!.items.push(s);
                    flatIdx++;
                  }
                  return Array.from(groups.entries()).map(([key, { items, flatStartIndex }]) => {
                    const first = items[0];
                    const label = `${first?.brand || ""} ${first?.title || "—"}`.trim() || "알 수 없음";
                    const category = first?.category;
                    return (
                      <div key={key} className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {label}
                          {category && <span className="ml-1.5 text-[10px] font-normal opacity-80">({category})</span>}
                        </p>
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory">
                          {items.map((s, j) => {
                            const cardFlatIndex = flatStartIndex + j;
                            return (
                              <div key={cardFlatIndex} className="relative flex-shrink-0 w-[160px] sm:w-[200px] snap-start rounded-lg border border-border bg-background overflow-hidden group">
                                <button
                                  type="button"
                                  onClick={() => removeSolution.mutate(cardFlatIndex)}
                                  disabled={removeSolution.isPending}
                                  className="absolute top-1 right-1 z-10 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm disabled:opacity-50"
                                  title="관련없는 상품 삭제"
                                  aria-label="삭제"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                {s.image_url ? (
                                  <div className="aspect-square w-full overflow-hidden bg-muted">
                                    <img
                                      src={s.image_url}
                                      alt={s.title || s.brand || ""}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-square w-full bg-muted/50 flex items-center justify-center">
                                    <span className="text-[10px] text-muted-foreground">이미지 없음</span>
                                  </div>
                                )}
                                <div className="p-2 flex flex-col gap-1.5">
                                  <p className="text-xs font-medium truncate" title={`${s.brand || ""} ${s.title || ""}`.trim()}>
                                    {s.brand ? `${s.brand} ` : ""}{s.title || "—"}
                                  </p>
                                  <div className="flex items-center justify-between gap-2 min-h-[1.25rem]">
                                    {s.category ? (
                                      <span className="text-[10px] text-muted-foreground bg-muted/60 rounded px-1 py-0.5">
                                        {s.category}
                                      </span>
                                    ) : (
                                      <span />
                                    )}
                                    {s.url ? (
                                      <a
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 inline-flex items-center justify-center text-primary hover:opacity-80 transition-opacity"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    ) : (
                                      <span className="flex-shrink-0 text-[10px] text-muted-foreground">링크 없음</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              {stepStatus === "error" && currentStep === "solution_search" && stepError && (
                <p className="mb-2 text-xs text-destructive">저장 실패: {stepError}</p>
              )}
              {(isPendingConfirm && currentStep === "solution_search") ||
              confirmResults.solution_search != null ||
              (currentStep === "solution_search" && stepStatus === "error") ? (
                <ConfirmRejectInline
                  result={confirmResults.solution_search ?? null}
                  isPending={confirmStep.isPending}
                  onConfirm={() => handleConfirm("solution_search")}
                  onReject={() => handleReject("solution_search")}
                />
              ) : null}
            </BotBubble>
          )}
          {userMessages.filter((m) => m.step === "solution_search").map((m, i) => (
            <UserBubble key={`solution_search-${i}`}>{m.text}</UserBubble>
          ))}
          {/* 백엔드 저장 상태 (solution_search confirm 후) */}
          {saveStatus !== "idle" && (
            <BotBubble>
              {saveStatus === "saving" && (
                <ThinkingBubble label="저장 중..." elapsed={saveElapsed} />
              )}
              {saveStatus === "success" && (
                <div className="space-y-1">
                  <p className="text-sm">
                    저장 완료! Post {savedPostCount ?? "—"}개가 등록됐어요.
                  </p>
                  {(savedPostIds.length > 0 || savedSpotIds.length > 0 || savedSolutionIds.length > 0) && (
                    <div className="text-xs text-muted-foreground font-mono space-y-0.5">
                      {savedPostIds.length > 0 && (
                        <p className="break-all">posts: {savedPostIds.join(", ")}</p>
                      )}
                      {savedSpotIds.length > 0 && (
                        <p className="break-all">spots: {savedSpotIds.join(", ")}</p>
                      )}
                      {savedSolutionIds.length > 0 && (
                        <p className="break-all">solutions: {savedSolutionIds.join(", ")}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {saveStatus === "error" && (
                <div className="space-y-2">
                  <p className="text-sm text-destructive">
                    저장 실패: {saveError ?? "Unknown error"}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-primary underline hover:no-underline"
                    onClick={() => {
                      setSaveStatus("saving");
                      setSaveError(undefined);
                      confirmStep.mutate(undefined, {
                        onSuccess: (data) => {
                          setSaveStatus("success");
                          setSavedPostCount(data?.saved_post_count);
                          setSavedPostIds(data?.saved_post_ids ?? []);
                          setSavedSpotIds(data?.saved_spot_ids ?? []);
                          setSavedSolutionIds(data?.saved_solution_ids ?? []);
                        },
                        onError: (err) => {
                          setSaveStatus("error");
                          setSaveError(err instanceof Error ? err.message : String(err));
                        },
                      });
                    }}
                    disabled={confirmStep.isPending}
                  >
                    다시 시도
                  </button>
                </div>
              )}
            </BotBubble>
          )}
        </>
      )}

      {/* ── STEP 4: Writer ── */}
      {currentStepIdx >= 3 && (
        <>
          <BotBubble>아웃라인 기반으로 각 섹션 본문을 작성할게요.</BotBubble>
          {isStepRunning && runningStep === "writer" && !hasSections && (
            <ThinkingBubble label={LOADING_LABELS.writer} elapsed={elapsed} />
          )}
          {!hasSections && !isStepRunning && (
            isError && currentStep === "writer" ? (
              <BotBubble>
                <p className="text-destructive text-sm">본문 작성 중 오류가 발생했어요. {stepError && `(${stepError})`}</p>
                <button
                  className="mt-2 text-xs text-primary underline"
                  onClick={() => { setRunningStep("writer"); runStep.mutate("writer"); }}
                >
                  다시 시도
                </button>
              </BotBubble>
            ) : canRunCurrentStep && currentStep === "writer" ? (
              <div className="flex justify-end">
                <ActionButton onClick={() => { setRunningStep("writer"); runStep.mutate("writer"); }}>
                  <ChevronRight className="w-4 h-4" />
                  본문 작성 시작
                </ActionButton>
              </div>
            ) : null
          )}
          {hasSections && (
            <BotBubble>
              <p className="mb-2">섹션 본문 {session.sections.length}개가 완성됐어요!</p>
              {((session as { writer_headline?: string }).writer_headline ||
                (session as { writer_subheadline?: string }).writer_subheadline ||
                (session as { writer_standfirst?: string }).writer_standfirst) && (
                <div className="mb-3 rounded border border-border/40 bg-muted/30 p-3 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">에디토리얼 개요</p>
                  {(session as { writer_headline?: string }).writer_headline && (
                    <p className="text-sm font-medium">
                      {(session as { writer_headline?: string }).writer_headline}
                    </p>
                  )}
                  {(session as { writer_subheadline?: string }).writer_subheadline && (
                    <p className="text-xs text-muted-foreground">
                      {(session as { writer_subheadline?: string }).writer_subheadline}
                    </p>
                  )}
                  {(session as { writer_standfirst?: string }).writer_standfirst && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                      {(session as { writer_standfirst?: string }).writer_standfirst}
                    </p>
                  )}
                </div>
              )}
              <ul className="space-y-2">
                {(session.sections as { section_title?: string; title?: string; body?: string; pullquote?: string }[]).map((s, i) => {
                  const title = s.section_title ?? s.title ?? `섹션 ${i + 1}`;
                  const preview = s.pullquote || (s.body ? s.body.slice(0, 120).replace(/\n/g, " ") + (s.body.length > 120 ? "…" : "") : "");
                  return (
                    <li key={i} className="text-sm border-l-2 border-muted pl-2.5 py-0.5">
                      <span className="text-muted-foreground text-xs">{i + 1}. </span>
                      <span className="font-medium">{title}</span>
                      {preview && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{preview}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
              {(isPendingConfirm && currentStep === "writer") || confirmResults.writer != null ? (
                <ConfirmRejectInline
                  result={confirmResults.writer ?? null}
                  isPending={confirmStep.isPending}
                  onConfirm={() => handleConfirm("writer")}
                  onReject={() => handleReject("writer")}
                />
              ) : null}
            </BotBubble>
          )}
          {userMessages.filter((m) => m.step === "writer").map((m, i) => (
            <UserBubble key={`writer-${i}`}>{m.text}</UserBubble>
          ))}
        </>
      )}

      {/* ── STEP 5: Designer ── */}
      {currentStepIdx >= 4 && (
        <>
          {currentStep === "designer" && (
            <BotBubble>섹션 본문으로 레이아웃을 디자인할게요.</BotBubble>
          )}
          {isStepRunning && runningStep === "designer" && !(session.layout_spec as { sections?: unknown[] })?.sections?.length && (
            <ThinkingBubble label={LOADING_LABELS.designer} elapsed={elapsed} />
          )}
          {!(session.layout_spec as { sections?: unknown[] })?.sections?.length && !isStepRunning && currentStep === "designer" && (
            isError ? (
              <BotBubble>
                <p className="text-destructive text-sm">디자인 중 오류가 발생했어요. {stepError && `(${stepError})`}</p>
                <button
                  className="mt-2 text-xs text-primary underline"
                  onClick={() => { setRunningStep("designer"); runStep.mutate("designer"); }}
                >
                  다시 시도
                </button>
              </BotBubble>
            ) : canRunCurrentStep ? (
              <div className="flex justify-end">
                <ActionButton onClick={() => { setRunningStep("designer"); runStep.mutate("designer"); }}>
                  <ChevronRight className="w-4 h-4" />
                  디자인 시작
                </ActionButton>
              </div>
            ) : null
          )}
          {isPendingConfirm && currentStep === "designer" && (
            <BotBubble>
              레이아웃 디자인이 완성됐어요. 최종 확인 후 매거진을 저장합니다.
              <ConfirmRejectInline
                result={confirmResults.designer ?? null}
                isPending={confirmStep.isPending}
                onConfirm={() => handleConfirm("designer")}
                onReject={() => handleReject("designer")}
              />
            </BotBubble>
          )}
          {userMessages.filter((m) => m.step === "designer").map((m, i) => (
            <UserBubble key={`designer-${i}`}>{m.text}</UserBubble>
          ))}
        </>
      )}

      {/* 완료 */}
      {currentStep === "done" && (
        <>
          <BotBubble>
            🎉 매거진이 저장됐어요! 수고하셨습니다.
            {session.magazine_id && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <Link
                  href={`/admin/magazines/view/${session.magazine_id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  저장된 매거진 보기
                </Link>
              </div>
            )}
          </BotBubble>
          {userMessages.filter((m) => m.step === "done").map((m, i) => (
            <UserBubble key={`done-${i}`}>{m.text}</UserBubble>
          ))}
        </>
      )}
      
        </div>

        {/* 하단 대화 입력 칸 - done이 아닐 때만 표시 */}
        {currentStep !== "done" && (
          <div className="flex-shrink-0 border-t border-border bg-background p-4">
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={rejectedStep ? "수정이 필요한 부분을 입력해 주세요 (재실행됨)" : "메시지를 입력하세요..."}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── 우측: 매거진 미리보기 패널 (고정 표시, 내부 스크롤) ── */}
      <div
        className={`flex flex-col min-w-0 h-full overflow-hidden ${mobileTab === "preview" ? "flex" : "hidden"} md:flex`}
      >
        {/* 모바일: 미리보기 화면에서도 채팅으로 돌아갈 수 있도록 탭 바 표시 */}
        <div className="md:hidden flex shrink-0 border-b border-border">
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
              mobileTab === "chat"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            채팅
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
              mobileTab === "preview"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-4 h-4" />
            미리보기
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <MagazinePreviewPanel session={session} />
        </div>
      </div>
      </div>
    </div>
  );
}
