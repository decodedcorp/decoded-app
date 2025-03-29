"use client";

import { useEffect, useRef, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import type { ItemDoc, ImageDoc } from "@/lib/api/types";

interface FloatingBoxProps {
  resource: ItemDoc | ImageDoc;
  initialDelay: number;
  depthLevel: number;
  position: { x: number; y: number };
  onHover?: (isHovered: boolean, event?: React.MouseEvent) => void;
}

function FloatingBoxComponent({
  resource,
  initialDelay,
  depthLevel,
  position,
  onHover,
}: FloatingBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline>();
  const hoverTimelineRef = useRef<gsap.core.Timeline>();
  const isImage = "requested_items" in resource;

  // 깊이에 따른 효과 계산
  const depthEffect = {
    scale: 1 - (depthLevel - 1) * 0.15,
    blur: Math.max(2, (depthLevel - 1) * 3),
    opacity: 1 - (depthLevel - 1) * 0.15,
  };

  useEffect(() => {
    const element = boxRef.current;
    if (!element) return;

    // 이전 애니메이션 정리
    if (animationRef.current) {
      animationRef.current.kill();
    }
    if (hoverTimelineRef.current) {
      hoverTimelineRef.current.kill();
    }

    // 초기 상태 설정
    gsap.set(element, {
      opacity: 0,
      scale: depthEffect.scale * 0.9,
      x: position.x,
      y: position.y + 50,
      filter: `blur(${depthEffect.blur}px)`,
    });

    // 등장 애니메이션
    animationRef.current = gsap.timeline({
      delay: initialDelay / 1000,
    });

    // 랜덤 floating 값 생성
    const floatX = gsap.utils.random(-15, 15);
    const floatY = gsap.utils.random(-15, 15);
    const floatDuration = gsap.utils.random(3, 5);
    const floatDelay = gsap.utils.random(0, 2);

    // 등장 및 floating 애니메이션
    animationRef.current
      .to(element, {
        opacity: depthEffect.opacity,
        scale: depthEffect.scale,
        y: position.y,
        duration: 1,
        ease: "power3.out",
      })
      .to(element, {
        x: position.x + floatX,
        y: position.y + floatY,
        duration: floatDuration,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: floatDelay,
      });

    // hover 효과 설정
    hoverTimelineRef.current = gsap.timeline({ paused: true });
    hoverTimelineRef.current.to(element, {
      scale: depthEffect.scale * 1.1,
      filter: "blur(0px)",
      duration: 0.3,
      ease: "power2.out",
    });

    // Hover 이벤트 리스너
    const handleMouseEnter = (event: React.MouseEvent) => {
      hoverTimelineRef.current?.play();
      onHover?.(true, event);
      // hover 시 floating 애니메이션 일시 중지
      animationRef.current?.pause();
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
      hoverTimelineRef.current?.reverse();
      onHover?.(false, event);
      // hover 해제 시 floating 애니메이션 재개
      animationRef.current?.resume();
    };

    element.addEventListener("mouseenter", handleMouseEnter as any);
    element.addEventListener("mouseleave", handleMouseLeave as any);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter as any);
      element.removeEventListener("mouseleave", handleMouseLeave as any);
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.kill();
      }
    };
  }, [depthEffect, initialDelay, onHover, position]);

  const href = isImage ? `/details/${resource._id}` : "#";

  const title = isImage ? resource.title : resource.metadata?.name;

  const boxSize = isImage
    ? {
        width: "128px",
        height: "192px",
      }
    : {
        width: "96px",
        height: "96px",
      };

  return (
    <Link href={href} prefetch={false}>
      <div
        ref={boxRef}
        className={`
          absolute
          rounded-lg overflow-hidden
          shadow-lg backdrop-blur-sm
          cursor-pointer
          ${!isImage && !resource.img_url ? "bg-white/10" : ""}
        `}
        style={{
          ...boxSize,
          willChange: "transform, opacity, filter",
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
        }}
      >
        {resource.img_url ? (
          <div className="relative w-full h-full">
            <Image
              src={resource.img_url}
              alt={title || ""}
              fill
              sizes={isImage ? "128px" : "96px"}
              className="object-cover"
              loading="eager"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-white/80/70">
            {title}
          </div>
        )}
      </div>
    </Link>
  );
}

export const FloatingBox = memo(FloatingBoxComponent);
