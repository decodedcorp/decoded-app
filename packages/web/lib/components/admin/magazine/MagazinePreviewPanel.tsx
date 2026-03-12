"use client";

import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { MagazineSession } from "@/lib/hooks/admin/useMagazineSessions";

gsap.registerPlugin(ScrollTrigger);

type OutlineData = {
  title?: string;
  tone?: string;
  plan_summary?: string;
  outline?: { title?: string; description?: string }[];
};

type LayoutImage = { url?: string; alt?: string };

type LayoutCSS = {
  display?: string;
  gridTemplateColumns?: string;
  gap?: string;
  padding?: string;
  height?: string;
  alignItems?: string;
  maxWidth?: string;
  margin?: string;
  position?: string;
  overflow?: string;
};

type LayoutAnimation = {
  type?: string;
  gsap_props?: Record<string, unknown>;
};

type LayoutSection = {
  id?: string;
  intent?: string;
  css?: LayoutCSS;
  content?: {
    headline?: string;
    body?: string;
    images?: LayoutImage[];
    spots?: { spot_id?: string }[];
    products?: { url?: string; title?: string; brand?: string }[];
  };
  animation?: LayoutAnimation;
};

const TONE_LABELS: Record<string, string> = {
  editorial_luxury: "에디토리얼 럭셔리",
  minimal: "미니멀",
  street: "스트릿",
  romantic: "로맨틱",
};

const ANIMATION_LABELS: Record<string, string> = {
  parallax: "Parallax",
  fade_up: "Fade Up",
  split_reveal: "Split Reveal",
  stagger: "Stagger",
};

/** GSAP scroll-triggered animation presets per spec animation.type */
const ANIMATION_PRESETS: Record<
  string,
  { from: gsap.TweenVars; to: gsap.TweenVars; delay?: number }
> = {
  parallax: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" } },
  fade_up: { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" } },
  split_reveal: { from: { opacity: 0, scale: 0.98 }, to: { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" } },
  stagger: { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, delay: 0.08 },
};

function AnimatedSection({
  children,
  index,
  animationType,
}: {
  children: React.ReactNode;
  index: number;
  animationType?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isAboveFold = index < 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const animName = animationType && ANIMATION_PRESETS[animationType] ? animationType : "fade_up";
    const preset = ANIMATION_PRESETS[animName] ?? ANIMATION_PRESETS.fade_up;

    if (isAboveFold) {
      gsap.fromTo(el, preset.from, { ...preset.to, delay: 0 });
      return;
    }

    const delay = preset.delay ? (index - 1) * preset.delay : 0;
    gsap.fromTo(el, preset.from, {
      ...preset.to,
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [index, animationType, isAboveFold]);

  return <div ref={ref}>{children}</div>;
}

function formatTone(tone?: string): string {
  if (!tone) return "";
  return TONE_LABELS[tone] ?? tone;
}

/**
 * Designer css.gridTemplateColumns (e.g. "6fr 4fr") -> scaled preview style.
 * Converts fr units to minmax(0, Nfr) for proper CSS Grid behavior.
 */
function buildGridStyle(css?: LayoutCSS): React.CSSProperties | undefined {
  if (!css?.gridTemplateColumns) return undefined;
  const cols = css.gridTemplateColumns
    .split(/\s+/)
    .map((col) => {
      const match = col.match(/^(\d+)fr$/);
      return match ? `minmax(0, ${match[1]}fr)` : col;
    })
    .join(" ");

  return {
    display: "grid",
    gridTemplateColumns: cols,
    gap: css.gap ?? "0",
    alignItems: (css.alignItems as React.CSSProperties["alignItems"]) ?? "stretch",
  };
}

interface MagazinePreviewPanelProps {
  session: MagazineSession;
  /** true면 섹션 메타 배지(번호, 애니메이션 타입, grid 등) 숨김. 저장된 매거진 조회 시 사용 */
  hideDebugBadges?: boolean;
}

/**
 * Magazine Editor Pipeline - 우측 Preview 패널.
 * 단계별로 누적된 컨텐츠를 magazine 스타일로 미리보기.
 */
export function MagazinePreviewPanel({ session, hideDebugBadges = false }: MagazinePreviewPanelProps) {
  const outline = session.outline as OutlineData | undefined;
  const outlineSections = outline?.outline ?? [];
  const hasOutline = outlineSections.length > 0;
  const writerSections = (session.sections ?? []) as { section_title?: string; body?: string; pullquote?: string }[];
  const layoutSpec = session.layout_spec as { sections?: unknown[]; creative_direction?: { concept?: string } } | undefined;
  const layoutSections = (layoutSpec?.sections ?? []) as LayoutSection[];

  if (!hasOutline && writerSections.length === 0 && layoutSections.length === 0) {
    return (
      <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
        <FileText className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">매거진 미리보기</p>
        <p className="text-xs mt-1">단계가 진행될수록 여기에 결과가 표시됩니다</p>
      </div>
    );
  }

  const hasLayout = layoutSections.length > 0;

  return (
    <div className="h-full overflow-y-auto rounded-xl border border-border bg-card">
      {/* Planner: 아웃라인 */}
      {hasOutline && !hasLayout && (
        <section className="p-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            기획
          </h3>
          <div className="space-y-3">
            {outline?.title && (
              <h2 className="font-serif text-xl font-semibold text-foreground">{outline.title}</h2>
            )}
            {outline?.tone && (
              <p className="text-xs text-muted-foreground">톤 · {formatTone(outline.tone)}</p>
            )}
            {outline?.plan_summary && (
              <p className="text-sm text-muted-foreground leading-relaxed">{outline.plan_summary}</p>
            )}
            <ul className="space-y-2 pt-2 border-t border-border">
              {outlineSections.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-muted-foreground font-mono">{i + 1}.</span>
                  <div>
                    <span className="font-medium">{s.title}</span>
                    {s.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Writer only (Designer 결과 없을 때) */}
      {writerSections.length > 0 && !hasLayout && (
        <section className="p-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            본문
          </h3>
          <article className="prose prose-sm dark:prose-invert prose-headings:font-serif prose-p:font-serif prose-p:leading-relaxed max-w-none [&>section]:mb-8">
            {writerSections.map((sec, i) => (
              <section key={i} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                {sec.section_title && (
                  <h4 className="font-serif text-base font-semibold text-foreground mb-2">
                    {sec.section_title}
                  </h4>
                )}
                {sec.body && (
                  <div
                    className="prose prose-sm dark:prose-invert prose-p:font-serif prose-p:leading-relaxed max-w-none
                      [&>p:first-of-type]:first-letter:text-4xl [&>p:first-of-type]:first-letter:font-serif
                      [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:mr-2
                      [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:text-foreground"
                  >
                    <ReactMarkdown>{sec.body}</ReactMarkdown>
                  </div>
                )}
              </section>
            ))}
          </article>
        </section>
      )}

      {/* Designer layout + Writer 본문 결합 프리뷰 */}
      {hasLayout && (
        <div className="divide-y divide-border">
          {/* 매거진 헤더 */}
          {(session.writer_headline || outline?.title) && (
            <div className="px-6 py-8 text-center space-y-2 bg-background">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {session.writer_headline || outline?.title}
              </h2>
              {session.writer_subheadline && (
                <p className="text-sm text-muted-foreground">{session.writer_subheadline}</p>
              )}
              {session.writer_standfirst && (
                <p className="text-xs text-muted-foreground/80 max-w-md mx-auto leading-relaxed mt-3">
                  {session.writer_standfirst}
                </p>
              )}
            </div>
          )}

          {layoutSections.map((sec, i) => {
            const writerSec = writerSections[i];
            const gridStyle = buildGridStyle(sec.css);
            const images = sec.content?.images?.filter((img) => img.url) ?? [];
            const products = sec.content?.products?.filter((p) => p.url) ?? [];
            const animType = sec.animation?.type;
            const hasImages = images.length > 0;
            const isFullbleed = sec.css?.gridTemplateColumns?.includes("12fr") || sec.css?.gridTemplateColumns?.includes("0fr");

            return (
              <AnimatedSection key={sec.id ?? i} index={i} animationType={animType}>
              <div className="relative bg-background overflow-hidden">
                {/* 섹션 메타 배지 (애니메이션 미구현이므로 hideDebugBadges 시 숨김) */}
                {!hideDebugBadges && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                    <span className="bg-foreground/80 text-background text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {i + 1}
                    </span>
                    {animType && (
                      <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded">
                        {ANIMATION_LABELS[animType] ?? animType}
                      </span>
                    )}
                    {sec.css?.gridTemplateColumns && (
                      <span className="bg-muted text-muted-foreground text-[9px] font-mono px-1.5 py-0.5 rounded">
                        {sec.css.gridTemplateColumns}
                      </span>
                    )}
                  </div>
                )}

                {/* Grid 레이아웃 적용 */}
                {gridStyle && hasImages ? (
                  <div style={gridStyle} className="min-h-[180px]">
                    {/* 이미지 열 */}
                    <div className={`bg-muted ${isFullbleed ? "relative" : ""}`}>
                      {images.length === 1 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={images[0].url}
                          alt={images[0].alt ?? ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`grid ${images.length <= 2 ? "grid-rows-2" : "grid-rows-3"} h-full`}>
                          {images.map((img, j) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={j}
                              src={img.url}
                              alt={img.alt ?? ""}
                              className="w-full h-full object-cover"
                            />
                          ))}
                        </div>
                      )}
                      {isFullbleed && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      )}
                    </div>

                    {/* 텍스트 열 (0fr이 아닌 경우만) */}
                    {!isFullbleed && (
                      <div className="p-5 flex flex-col justify-center space-y-3">
                        {sec.intent && (
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{sec.intent}</p>
                        )}
                        {(writerSec?.section_title || sec.content?.headline) && (
                          <h4 className="font-serif text-base font-semibold text-foreground">
                            {writerSec?.section_title || sec.content?.headline}
                          </h4>
                        )}
                        {writerSec?.body ? (
                          <div className="prose prose-sm dark:prose-invert prose-p:font-serif prose-p:leading-relaxed max-w-none text-sm">
                            <ReactMarkdown>{writerSec.body}</ReactMarkdown>
                          </div>
                        ) : sec.content?.body ? (
                          <p className="text-xs text-muted-foreground">{sec.content.body}</p>
                        ) : null}
                        {writerSec?.pullquote && (
                          <blockquote className="border-l-2 border-primary pl-3 text-xs italic text-muted-foreground mt-2">
                            {writerSec.pullquote}
                          </blockquote>
                        )}
                        {products.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
                            {products.map((p, j) => (
                              <div key={j} className="text-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.url} alt={p.title ?? ""} className="w-full aspect-square object-cover rounded" />
                                {p.title && <p className="text-[9px] text-muted-foreground mt-1 line-clamp-1">{p.title}</p>}
                                {p.brand && <p className="text-[8px] text-muted-foreground/70">{p.brand}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* 이미지 없는 섹션 or CSS 없는 경우 */
                  <div className="p-5 pt-8 space-y-3">
                    {sec.intent && (
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{sec.intent}</p>
                    )}
                    {(writerSec?.section_title || sec.content?.headline) && (
                      <h4 className="font-serif text-base font-semibold text-foreground">
                        {writerSec?.section_title || sec.content?.headline}
                      </h4>
                    )}
                    {writerSec?.body ? (
                      <div className="prose prose-sm dark:prose-invert prose-p:font-serif prose-p:leading-relaxed max-w-none text-sm">
                        <ReactMarkdown>{writerSec.body}</ReactMarkdown>
                      </div>
                    ) : sec.content?.body ? (
                      <p className="text-xs text-muted-foreground">{sec.content.body}</p>
                    ) : null}
                    {writerSec?.pullquote && (
                      <blockquote className="border-l-2 border-primary pl-3 text-xs italic text-muted-foreground mt-2">
                        {writerSec.pullquote}
                      </blockquote>
                    )}
                    {products.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
                        {products.map((p, j) => (
                          <div key={j} className="text-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.url} alt={p.title ?? ""} className="w-full aspect-square object-cover rounded" />
                            {p.title && <p className="text-[9px] text-muted-foreground mt-1 line-clamp-1">{p.title}</p>}
                            {p.brand && <p className="text-[8px] text-muted-foreground/70">{p.brand}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* fullbleed 오버레이 텍스트 */}
                {isFullbleed && gridStyle && hasImages && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    {(writerSec?.section_title || sec.content?.headline) && (
                      <h4 className="font-serif text-lg font-bold drop-shadow-lg">
                        {writerSec?.section_title || sec.content?.headline}
                      </h4>
                    )}
                    {writerSec?.body && (
                      <p className="text-xs mt-1 opacity-90 line-clamp-3 drop-shadow-md">
                        {writerSec.body.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").slice(0, 200)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              </AnimatedSection>
            );
          })}
        </div>
      )}
    </div>
  );
}
