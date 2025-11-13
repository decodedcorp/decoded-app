'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Transform, Vec3, Camera } from 'ogl';
import type { LinkPreview } from '@/lib/services/mockLinkPreview';
import { LinkPreviewCard } from '@/domains/channels/components/modal/content-upload/LinkPreviewCard';

type MetaBallCardsProps = {
  cards?: CardData[];
  fixedCardIds?: string[];
  primaryColor?: string;
  hoverColor?: string;
  selectedColor?: string;
  speed?: number;
  enableMouseInteraction?: boolean;
  hoverSmoothness?: number;
  animationSize?: number;
  ballCount?: number;
  clumpFactor?: number;
  onCardClick?: (cardId: string) => void;
  onCardHover?: (cardId: string | null) => void;
  enableTransparency?: boolean;
};

export type CardData = {
  id: string;
  preview: LinkPreview;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isFixed: boolean;
  isHovered: boolean;
  isSelected: boolean;
};

function parseHexColor(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash31(p: number): number[] {
  let r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const r_yzx = [r[1], r[2], r[0]];
  const dotVal = r[0] * (r_yzx[0] + 33.33) + r[1] * (r_yzx[1] + 33.33) + r[2] * (r_yzx[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    r[i] = fract(r[i] + dotVal);
  }
  return r;
}

function hash33(v: number[]): number[] {
  let p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const p_yxz = [p[1], p[0], p[2]];
  const dotVal = p[0] * (p_yxz[0] + 33.33) + p[1] * (p_yxz[1] + 33.33) + p[2] * (p_yxz[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    p[i] = fract(p[i] + dotVal);
  }
  const p_xxy = [p[0], p[0], p[1]];
  const p_yxx = [p[1], p[0], p[0]];
  const p_zyx = [p[2], p[1], p[0]];
  const result: number[] = [];
  for (let i = 0; i < 3; i++) {
    result[i] = fract((p_xxy[i] + p_yxx[i]) * p_zyx[i]);
  }
  return result;
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iPrimaryColor;
uniform vec3 iHoverColor;
uniform vec3 iSelectedColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec4 iMetaBalls[50];
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;

// Rectangular metaball with sharp edges
float getRectMetaBallValue(vec2 center, vec2 size, vec2 pos) {
    vec2 d = abs(pos - center) - size;
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    // Sharper threshold: smoothstep(1.0, 0.0, dist) for tighter edges
    return smoothstep(1.0, 0.0, dist);
}

void main() {
    vec2 fc = gl_FragCoord.xy;
    float scale = iAnimationSize / iResolution.y;
    vec2 coord = (fc - iResolution.xy * 0.5) * scale;
    vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
    
    float m1 = 0.0;
    
    // Fixed cards with actual rectangular sizes
    for (int i = 0; i < 50; i++) {
        if (i >= iBallCount) break;
        vec2 ballCenter = iMetaBalls[i].xy;
        vec2 ballSize = iMetaBalls[i].zw;
        float value = getRectMetaBallValue(ballCenter, ballSize * 0.5, coord);
        m1 += value;
    }
    
    // Mouse cursor ball
    float m2 = getRectMetaBallValue(mouseW, vec2(iCursorBallSize), coord);
    float total = m1 + m2;
    
    // Tighter threshold: (total - 1.0) for sharp edges
    float f = smoothstep(-0.5, 0.5, (total - 1.0) / min(1.0, fwidth(total)));
    
    vec3 cFinal = vec3(0.0);
    if (total > 0.0) {
        float alpha1 = m1 / total;
        float alpha2 = m2 / total;
        cFinal = mix(iColor, iPrimaryColor, alpha1) * alpha1 + iColor * alpha2;
    }
    
    outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}
`;

type BallParams = {
  st: number;
  dtFactor: number;
  baseScale: number;
  toggle: number;
  width: number;
  height: number;
};

type MeasuredCard = {
  id: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

const MetaBallCards: React.FC<MetaBallCardsProps> = ({
  cards = [],
  fixedCardIds = [],
  primaryColor = '#e9fd66',
  hoverColor = '#f0ff80',
  selectedColor = '#d9f54a',
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  ballCount = 10,
  clumpFactor = 1,
  onCardClick,
  onCardHover,
  enableTransparency = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<CardData[]>(cards);
  const cardElementRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [measuredCards, setMeasuredCards] = useState<MeasuredCard[]>([]);

  // Update cards ref when cards prop changes
  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  // Measure card DOM positions and convert to meta space
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measureCards = () => {
      const containerRect = container.getBoundingClientRect();
      const measured: MeasuredCard[] = [];

      cardElementRefs.current.forEach((element, id) => {
        const rect = element.getBoundingClientRect();

        // Convert DOM pixel to meta space
        // Meta space: center at (0,0), unit = animationSize / containerHeight
        const centerX =
          ((rect.left + rect.width / 2 - containerRect.left - containerRect.width / 2) /
            containerRect.height) *
          animationSize;
        const centerY =
          ((-rect.top - rect.height / 2 + containerRect.top + containerRect.height / 2) /
            containerRect.height) *
          animationSize;
        const width = (rect.width / containerRect.height) * animationSize;
        const height = (rect.height / containerRect.height) * animationSize;

        measured.push({ id, centerX, centerY, width, height });
      });

      setMeasuredCards(measured);
    };

    // Initial measurement
    measureCards();

    // Re-measure on resize
    const resizeObserver = new ResizeObserver(() => {
      measureCards();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [cards, animationSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = 1;
    const renderer = new Renderer({
      dpr,
      alpha: true,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, enableTransparency ? 0 : 1);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    });
    camera.position.z = 1;

    const geometry = new Triangle(gl);
    const [r1, g1, b1] = parseHexColor(primaryColor);
    const [r2, g2, b2] = parseHexColor(hoverColor);
    const [r3, g3, b3] = parseHexColor(selectedColor);
    const [r4, g4, b4] = parseHexColor('#ffffff');

    const metaBallsData = new Float32Array(50 * 4);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: new Vec3(r4, g4, b4) },
        iCursorColor: { value: new Vec3(r4, g4, b4) },
        iPrimaryColor: { value: new Vec3(r1, g1, b1) },
        iHoverColor: { value: new Vec3(r2, g2, b2) },
        iSelectedColor: { value: new Vec3(r3, g3, b3) },
        iAnimationSize: { value: animationSize },
        iBallCount: { value: ballCount },
        iCursorBallSize: { value: 2 },
        iMetaBalls: { value: metaBallsData },
        iClumpFactor: { value: clumpFactor },
        enableTransparency: { value: enableTransparency },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    // Generate ball parameters for floating metaballs
    const maxBalls = 50;
    const effectiveBallCount = Math.min(ballCount, maxBalls);
    const ballParams: BallParams[] = [];
    const fixedCardCount = cards.filter((c) => c.isFixed).length;

    // Only generate params for floating metaballs (after fixed cards)
    for (let i = fixedCardCount; i < effectiveBallCount; i++) {
      const idx = i + 1;
      const h1 = hash31(idx);
      const st = h1[0] * (2 * Math.PI);
      const dtFactor = 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI);
      const baseScale = 5.0 + h1[1] * (10.0 - 5.0);
      const h2 = hash33(h1);
      const toggle = Math.floor(h2[0] * 2.0);
      const widthVal = 1.5 + h2[1] * (3.5 - 1.5);
      const heightVal = 1.0 + h2[2] * (2.5 - 1.0);
      ballParams.push({ st, dtFactor, baseScale, toggle, width: widthVal, height: heightVal });
    }

    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function onPointerMove(e: PointerEvent) {
      if (!enableMouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerX = (px / rect.width) * gl.canvas.width;
      pointerY = (1 - py / rect.height) * gl.canvas.height;
    }

    function onPointerClick(e: PointerEvent) {
      if (!enableMouseInteraction || !container || !onCardClick) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const currentCards = cardsRef.current;
      for (const card of currentCards) {
        if (card.isFixed) {
          const element = cardElementRefs.current.get(card.id);
          if (!element) continue;

          const cardRect = element.getBoundingClientRect();
          if (
            px >= cardRect.left - rect.left &&
            px <= cardRect.left - rect.left + cardRect.width &&
            py >= cardRect.top - rect.top &&
            py <= cardRect.top - rect.top + cardRect.height
          ) {
            onCardClick(card.id);
            break;
          }
        }
      }
    }

    function onPointerEnter() {
      if (!enableMouseInteraction) return;
      pointerInside = true;
    }

    function onPointerLeave() {
      if (!enableMouseInteraction) return;
      pointerInside = false;
      if (onCardHover) {
        onCardHover(null);
      }
    }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);
    if (onCardClick) {
      container.addEventListener('click', onPointerClick);
    }

    const startTime = performance.now();
    let animationFrameId: number;
    function update(t: number) {
      animationFrameId = requestAnimationFrame(update);
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      const currentCards = cardsRef.current;

      // First: Fixed cards with measured positions
      for (let i = 0; i < fixedCardCount; i++) {
        const measured = measuredCards[i];
        if (measured) {
          metaBallsData[i * 4 + 0] = measured.centerX;
          metaBallsData[i * 4 + 1] = measured.centerY;
          metaBallsData[i * 4 + 2] = measured.width;
          metaBallsData[i * 4 + 3] = measured.height;
        }
      }

      // Then: Floating metaballs
      for (let i = fixedCardCount; i < effectiveBallCount; i++) {
        const p = ballParams[i - fixedCardCount];
        const dt = elapsed * speed * p.dtFactor;
        const th = p.st + dt;
        const x = Math.cos(th);
        const y = Math.sin(th + dt * p.toggle);
        const posX = x * p.baseScale * clumpFactor;
        const posY = y * p.baseScale * clumpFactor;
        metaBallsData[i * 4 + 0] = posX;
        metaBallsData[i * 4 + 1] = posY;
        metaBallsData[i * 4 + 2] = p.width;
        metaBallsData[i * 4 + 3] = p.height;
      }

      let targetX: number, targetY: number;
      if (pointerInside) {
        targetX = pointerX;
        targetY = pointerY;
      } else {
        const cx = gl.canvas.width * 0.5;
        const cy = gl.canvas.height * 0.5;
        const rx = gl.canvas.width * 0.15;
        const ry = gl.canvas.height * 0.15;
        targetX = cx + Math.cos(elapsed * speed) * rx;
        targetY = cy + Math.sin(elapsed * speed) * ry;
      }
      mouseBallPos.x += (targetX - mouseBallPos.x) * hoverSmoothness;
      mouseBallPos.y += (targetY - mouseBallPos.y) * hoverSmoothness;
      program.uniforms.iMouse.value.set(mouseBallPos.x, mouseBallPos.y, 0);

      renderer.render({ scene, camera });
    }
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      if (onCardClick) {
        container.removeEventListener('click', onPointerClick);
      }
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    primaryColor,
    hoverColor,
    selectedColor,
    speed,
    enableMouseInteraction,
    hoverSmoothness,
    animationSize,
    ballCount,
    clumpFactor,
    enableTransparency,
    onCardClick,
    onCardHover,
    measuredCards,
  ]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Render LinkPreviewCard as overlay for fixed cards */}
      {cards.map((card) => {
        if (!card.isFixed) return null;

        return (
          <div
            key={card.id}
            ref={(el) => {
              if (el) {
                cardElementRefs.current.set(card.id, el);
              } else {
                cardElementRefs.current.delete(card.id);
              }
            }}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              transform: `translate(${card.position.x}px, ${card.position.y}px)`,
              opacity: card.isHovered || card.isSelected ? 1 : 0.85,
              transition: 'opacity 0.2s ease',
              zIndex: card.isSelected ? 10 : card.isHovered ? 5 : 1,
              pointerEvents: 'auto',
            }}
          >
            <div
              className="cursor-pointer"
              onMouseEnter={() => onCardHover?.(card.id)}
              onMouseLeave={() => onCardHover?.(null)}
              style={{
                filter: card.isHovered
                  ? 'drop-shadow(0 0 20px rgba(233, 253, 102, 0.5))'
                  : card.isSelected
                  ? 'drop-shadow(0 0 15px rgba(217, 245, 74, 0.3))'
                  : 'none',
                transform: card.isSelected
                  ? 'scale(1.05)'
                  : card.isHovered
                  ? 'scale(1.02)'
                  : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
            >
              <LinkPreviewCard preview={card.preview} isLoading={false} error={null} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetaBallCards;
