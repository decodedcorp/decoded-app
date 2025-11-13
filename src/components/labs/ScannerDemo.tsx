'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './ScannerDemo.module.css';

export default function ScannerDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      !rootRef.current ||
      !cardStreamRef.current ||
      !cardLineRef.current ||
      !speedRef.current ||
      !particleCanvasRef.current ||
      !scannerCanvasRef.current
    )
      return;

    const scannerAPI: { setActive?: (active: boolean) => void } = {};

    class CardStreamController {
      container: HTMLDivElement;
      cardLine: HTMLDivElement;
      speedIndicator: HTMLSpanElement;
      position: number;
      velocity: number;
      direction: number;
      isAnimating: boolean;
      isDragging: boolean;
      lastTime: number;
      lastMouseX: number;
      mouseVelocity: number;
      friction: number;
      minVelocity: number;
      containerWidth: number;
      cardLineWidth: number;

      constructor(
        container: HTMLDivElement,
        cardLine: HTMLDivElement,
        speedIndicator: HTMLSpanElement,
      ) {
        this.container = container;
        this.cardLine = cardLine;
        this.speedIndicator = speedIndicator;

        this.position = 0;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;

        this.lastTime = performance.now();
        this.lastMouseX = 0;
        this.mouseVelocity = 0;
        this.friction = 0.95;
        this.minVelocity = 30;

        this.containerWidth = 0;
        this.cardLineWidth = 0;

        this.init();
      }

      init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateCardPosition();
        this.animate();
        this.startPeriodicUpdates();
      }

      calculateDimensions() {
        this.containerWidth = this.container.offsetWidth;
        const cardWidth = 400;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
      }

      setupEventListeners() {
        this.cardLine.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        this.cardLine.addEventListener(
          'touchstart',
          (e) => this.startDrag((e as TouchEvent).touches[0] as unknown as MouseEvent),
          { passive: false },
        );
        document.addEventListener(
          'touchmove',
          (e) => this.onDrag((e as TouchEvent).touches[0] as unknown as MouseEvent),
          { passive: false },
        );
        document.addEventListener('touchend', () => this.endDrag());

        this.cardLine.addEventListener('wheel', (e) => this.onWheel(e));
        this.cardLine.addEventListener('selectstart', (e) => e.preventDefault());
        this.cardLine.addEventListener('dragstart', (e) => e.preventDefault());

        window.addEventListener('resize', () => this.calculateDimensions());
      }

      startDrag(e: MouseEvent) {
        e.preventDefault();
        this.isDragging = true;
        this.isAnimating = false;
        this.lastMouseX = e.clientX;
        this.mouseVelocity = 0;

        const transform = window.getComputedStyle(this.cardLine).transform;
        if (transform !== 'none') {
          const matrix = new DOMMatrix(transform);
          this.position = matrix.m41;
        }
        this.cardLine.style.animation = 'none';
        this.cardLine.classList.add(styles.dragging);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
      }

      onDrag(e: MouseEvent) {
        if (!this.isDragging) return;
        e.preventDefault();
        const deltaX = e.clientX - this.lastMouseX;
        this.position += deltaX;
        this.mouseVelocity = deltaX * 60;
        this.lastMouseX = e.clientX;
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.cardLine.classList.remove(styles.dragging);
        if (Math.abs(this.mouseVelocity) > this.minVelocity) {
          this.velocity = Math.abs(this.mouseVelocity);
          this.direction = this.mouseVelocity > 0 ? 1 : -1;
        } else {
          this.velocity = 120;
        }
        this.isAnimating = true;
        this.updateSpeedIndicator();
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }

      animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        if (this.isAnimating && !this.isDragging) {
          if (this.velocity > this.minVelocity) {
            this.velocity *= this.friction;
          } else {
            this.velocity = Math.max(this.minVelocity, this.velocity);
          }
          this.position += this.velocity * this.direction * deltaTime;
          this.updateCardPosition();
          this.updateSpeedIndicator();
        }
        requestAnimationFrame(() => this.animate());
      }

      updateCardPosition() {
        const containerWidth = this.containerWidth;
        const cardLineWidth = this.cardLineWidth;
        if (this.position < -cardLineWidth) {
          this.position = containerWidth;
        } else if (this.position > containerWidth) {
          this.position = -cardLineWidth;
        }
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      updateSpeedIndicator() {
        this.speedIndicator.textContent = String(Math.round(this.velocity));
      }

      toggleAnimation() {
        this.isAnimating = !this.isAnimating;
      }

      resetPosition() {
        this.position = this.containerWidth;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;
        this.cardLine.style.animation = 'none';
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.cardLine.classList.remove(styles.dragging);
        this.updateSpeedIndicator();
      }

      changeDirection() {
        this.direction *= -1;
        this.updateSpeedIndicator();
      }

      onWheel(e: WheelEvent) {
        e.preventDefault();
        const scrollSpeed = 20;
        const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;
        this.position += delta;
        this.updateCardPosition();
        this.updateCardClipping();
      }

      generateCode(width: number, height: number) {
        const randInt = (min: number, max: number) =>
          Math.floor(Math.random() * (max - min + 1)) + min;
        const pick = <T,>(arr: T[]) => arr[randInt(0, arr.length - 1)];
        const header = [
          '// compiled preview • scanner demo',
          '/* generated for visual effect – not executed */',
          'const SCAN_WIDTH = 8;',
          'const FADE_ZONE = 35;',
          'const MAX_PARTICLES = 2500;',
          'const TRANSITION = 0.05;',
        ];
        const helpers = [
          'function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }',
          'function lerp(a, b, t) { return a + (b - a) * t; }',
          'const now = () => performance.now();',
          'function rng(min, max) { return Math.random() * (max - min) + min; }',
        ];
        const particleBlock = (idx: number) => [
          `class Particle${idx} {`,
          '  constructor(x, y, vx, vy, r, a) {',
          '    this.x = x; this.y = y;',
          '    this.vx = vx; this.vy = vy;',
          '    this.r = r; this.a = a;',
          '  }',
          '  step(dt) { this.x += this.vx * dt; this.y += this.vy * dt; }',
          '}',
        ];
        const scannerBlock = [
          'const scanner = {',
          '  x: Math.floor(window.innerWidth / 2),',
          '  width: SCAN_WIDTH,',
          '  glow: 3.5,',
          '};',
          '',
          'function drawParticle(ctx, p) {',
          '  ctx.globalAlpha = clamp(p.a, 0, 1);',
          '  ctx.drawImage(gradient, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);',
          '}',
        ];
        const loopBlock = ['function tick(t) {', '  const dt = 0.016;', '}'];
        const misc = [
          'const state = { intensity: 1.2, particles: MAX_PARTICLES };',
          'const bounds = { w: window.innerWidth, h: 300 };',
          "const gradient = document.createElement('canvas');",
          "const ctx = gradient.getContext('2d');",
          "ctx.globalCompositeOperation = 'lighter';",
        ];
        const library: string[] = [];
        header.forEach((l) => library.push(l));
        helpers.forEach((l) => library.push(l));
        for (let b = 0; b < 3; b++) particleBlock(b).forEach((l) => library.push(l));
        scannerBlock.forEach((l) => library.push(l));
        loopBlock.forEach((l) => library.push(l));
        misc.forEach((l) => library.push(l));
        for (let i = 0; i < 40; i++) {
          const n1 = randInt(1, 9);
          const n2 = randInt(10, 99);
          library.push(`const v${i} = (${n1} + ${n2}) * 0.${randInt(1, 9)};`);
        }
        for (let i = 0; i < 20; i++) {
          library.push(`if (state.intensity > ${1 + (i % 3)}) { scanner.glow += 0.01; }`);
        }
        let flow = library.join(' ');
        flow = flow.replace(/\s+/g, ' ').trim();
        const totalChars = width * height;
        while (flow.length < totalChars + width) {
          const extra = pick(library).replace(/\s+/g, ' ').trim();
          flow += ' ' + extra;
        }
        let out = '';
        let offset = 0;
        for (let row = 0; row < height; row++) {
          let line = flow.slice(offset, offset + width);
          if (line.length < width) line = line + ' '.repeat(width - line.length);
          out += line + (row < height - 1 ? '\n' : '');
          offset += width;
        }
        return out;
      }

      calculateCodeDimensions(cardWidth: number, cardHeight: number) {
        const fontSize = 11;
        const lineHeight = 13;
        const charWidth = 6;
        const width = Math.floor(cardWidth / charWidth);
        const height = Math.floor(cardHeight / lineHeight);
        return { width, height, fontSize, lineHeight };
      }

      createCardWrapper(index: number) {
        const wrapper = document.createElement('div');
        wrapper.className = styles.cardWrapper;
        const normalCard = document.createElement('div');
        normalCard.className = `${styles.card} ${styles.cardNormal}`;
        const cardImages = [
          'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png',
          'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png',
          'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png',
          'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png',
          'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png',
        ];
        const cardImage = document.createElement('img');
        cardImage.className = styles.cardImage;
        cardImage.src = cardImages[index % cardImages.length];
        cardImage.alt = 'Credit Card';
        cardImage.onerror = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 250;
          const ctx = canvas.getContext('2d')!;
          const gradient = ctx.createLinearGradient(0, 0, 400, 250);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 250);
          cardImage.src = canvas.toDataURL();
        };
        normalCard.appendChild(cardImage);
        const asciiCard = document.createElement('div');
        asciiCard.className = `${styles.card} ${styles.cardAscii}`;
        const asciiContent = document.createElement('div');
        asciiContent.className = styles.asciiContent;
        const { width, height, fontSize, lineHeight } = this.calculateCodeDimensions(400, 250);
        asciiContent.setAttribute('style', `font-size:${fontSize}px;line-height:${lineHeight}px;`);
        asciiContent.textContent = this.generateCode(width, height);
        asciiCard.appendChild(asciiContent);
        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);
        return wrapper;
      }

      updateCardClipping() {
        const scannerX = window.innerWidth / 2;
        const scannerWidth = 8;
        const scannerLeft = scannerX - scannerWidth / 2;
        const scannerRight = scannerX + scannerWidth / 2;
        let anyScanningActive = false;
        this.cardLine.querySelectorAll(`.${styles.cardWrapper}`).forEach((wrapper) => {
          const rect = (wrapper as HTMLDivElement).getBoundingClientRect();
          const cardLeft = rect.left;
          const cardRight = rect.right;
          const cardWidth = rect.width;
          const normalCard = (wrapper as HTMLDivElement).querySelector(
            `.${styles.cardNormal}`,
          ) as HTMLDivElement;
          const asciiCard = (wrapper as HTMLDivElement).querySelector(
            `.${styles.cardAscii}`,
          ) as HTMLDivElement;
          if (cardLeft < scannerRight && cardRight > scannerLeft) {
            anyScanningActive = true;
            const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
            const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);
            const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
            const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;
            normalCard.style.setProperty('--clip-right', `${normalClipRight}%`);
            asciiCard.style.setProperty('--clip-left', `${asciiClipLeft}%`);
            if (
              !(wrapper as HTMLDivElement).hasAttribute('data-scanned') &&
              scannerIntersectLeft > 0
            ) {
              (wrapper as HTMLDivElement).setAttribute('data-scanned', 'true');
              const scanEffect = document.createElement('div');
              scanEffect.className = styles.scanEffect;
              (wrapper as HTMLDivElement).appendChild(scanEffect);
              setTimeout(() => {
                scanEffect.parentNode && scanEffect.parentNode.removeChild(scanEffect);
              }, 600);
            }
          } else {
            if (cardRight < scannerLeft) {
              normalCard.style.setProperty('--clip-right', '100%');
              asciiCard.style.setProperty('--clip-left', '100%');
            } else if (cardLeft > scannerRight) {
              normalCard.style.setProperty('--clip-right', '0%');
              asciiCard.style.setProperty('--clip-left', '0%');
            }
            (wrapper as HTMLDivElement).removeAttribute('data-scanned');
          }
        });
        scannerAPI.setActive && scannerAPI.setActive(anyScanningActive);
      }

      updateAsciiContent() {
        this.cardLine.querySelectorAll(`.${styles.asciiContent}`).forEach((content) => {
          if (Math.random() < 0.15) {
            const { width, height } = this.calculateCodeDimensions(400, 250);
            (content as HTMLDivElement).textContent = this.generateCode(width, height);
          }
        });
      }

      populateCardLine() {
        this.cardLine.innerHTML = '';
        const cardsCount = 30;
        for (let i = 0; i < cardsCount; i++) {
          const cardWrapper = this.createCardWrapper(i);
          this.cardLine.appendChild(cardWrapper);
        }
      }

      startPeriodicUpdates() {
        const asciiInterval = setInterval(() => {
          if (!document.body.contains(this.cardLine)) {
            clearInterval(asciiInterval);
            return;
          }
          this.updateAsciiContent();
        }, 200);
        const updateClipping = () => {
          if (!document.body.contains(this.cardLine)) return;
          this.updateCardClipping();
          requestAnimationFrame(updateClipping);
        };
        updateClipping();
      }
    }

    class ParticleSystem {
      scene: THREE.Scene | null = null;
      camera: THREE.OrthographicCamera | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      particles: THREE.Points | null = null;
      particleCount = 400;
      canvas: HTMLCanvasElement;
      velocities!: Float32Array;
      alphas!: Float32Array;
      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.init();
      }
      init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
          -window.innerWidth / 2,
          window.innerWidth / 2,
          125,
          -125,
          1,
          1000,
        );
        this.camera.position.z = 100;
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          alpha: true,
          antialias: true,
        });
        this.renderer.setSize(window.innerWidth, 250);
        this.renderer.setClearColor(0x000000, 0);
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
      }
      createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const velocities = new Float32Array(this.particleCount);
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d')!;
        const half = canvas.width / 2;
        const hue = 217;
        const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0.025, '#fff');
        gradient.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
        gradient.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(half, half, half, 0, Math.PI * 2);
        ctx.fill();
        const texture = new THREE.CanvasTexture(canvas);
        for (let i = 0; i < this.particleCount; i++) {
          positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
          positions[i * 3 + 2] = 0;
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1;
          const orbitRadius = Math.random() * 200 + 100;
          sizes[i] = (Math.random() * (orbitRadius - 60) + 60) / 8;
          velocities[i] = Math.random() * 60 + 30;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        this.velocities = velocities;
        const alphas = new Float32Array(this.particleCount);
        for (let i = 0; i < this.particleCount; i++) alphas[i] = (Math.random() * 8 + 2) / 10;
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        this.alphas = alphas;
        const material = new THREE.ShaderMaterial({
          uniforms: { pointTexture: { value: texture }, size: { value: 15.0 } },
          vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            varying vec3 vColor;
            uniform float size;
            void main() {
              vAlpha = alpha;
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform sampler2D pointTexture;
            varying float vAlpha;
            varying vec3 vColor;
            void main() {
              gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexColors: true,
        });
        this.particles = new THREE.Points(geometry, material);
        this.scene!.add(this.particles);
      }
      animate() {
        requestAnimationFrame(() => this.animate());
        if (this.particles) {
          const positions = (this.particles.geometry as THREE.BufferGeometry).attributes.position
            .array as Float32Array;
          const alphas = (this.particles.geometry as THREE.BufferGeometry).attributes.alpha
            .array as Float32Array;
          const time = Date.now() * 0.001;
          for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] += this.velocities[i] * 0.016;
            if (positions[i * 3] > window.innerWidth / 2 + 100) {
              positions[i * 3] = -window.innerWidth / 2 - 100;
              positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
            }
            positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;
            const twinkle = Math.floor(Math.random() * 10);
            if (twinkle === 1 && alphas[i] > 0) alphas[i] -= 0.05;
            else if (twinkle === 2 && alphas[i] < 1) alphas[i] += 0.05;
            alphas[i] = Math.max(0, Math.min(1, alphas[i]));
          }
          (this.particles.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
          (this.particles.geometry as THREE.BufferGeometry).attributes.alpha.needsUpdate = true;
        }
        this.renderer!.render(this.scene!, this.camera!);
      }
      onWindowResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.left = -window.innerWidth / 2;
        this.camera.right = window.innerWidth / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, 250);
      }
      destroy() {
        if (this.renderer) this.renderer.dispose();
        if (this.particles && this.scene) {
          this.scene.remove(this.particles);
          (this.particles.geometry as THREE.BufferGeometry).dispose();
          (this.particles.material as THREE.Material).dispose();
        }
      }
    }

    class ParticleScanner {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      animationId: number | null = null;
      w: number;
      h: number;
      particles: any[] = [];
      count = 0;
      maxParticles = 800;
      intensity = 0.8;
      lightBarX: number;
      lightBarWidth = 3;
      fadeZone = 60;
      scanTargetIntensity = 1.8;
      scanTargetParticles = 2500;
      scanTargetFadeZone = 35;
      scanningActive = false;
      baseIntensity = this.intensity;
      baseMaxParticles = this.maxParticles;
      baseFadeZone = this.fadeZone;
      currentIntensity = this.intensity;
      currentMaxParticles = this.maxParticles;
      currentFadeZone = this.fadeZone;
      transitionSpeed = 0.05;
      currentGlowIntensity = 1;
      gradientCanvas!: HTMLCanvasElement;
      gradientCtx!: CanvasRenderingContext2D;
      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.w = window.innerWidth;
        this.h = 300;
        this.lightBarX = this.w / 2;
        this.setupCanvas();
        this.createGradientCache();
        this.initParticles();
        this.animate();
        window.addEventListener('resize', () => this.onResize());
      }
      setupCanvas() {
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.width = this.w + 'px';
        this.canvas.style.height = this.h + 'px';
        this.ctx.clearRect(0, 0, this.w, this.h);
      }
      onResize() {
        this.w = window.innerWidth;
        this.lightBarX = this.w / 2;
        this.setupCanvas();
      }
      createGradientCache() {
        this.gradientCanvas = document.createElement('canvas');
        this.gradientCtx = this.gradientCanvas.getContext('2d')!;
        this.gradientCanvas.width = 16;
        this.gradientCanvas.height = 16;
        const half = this.gradientCanvas.width / 2;
        const gradient = this.gradientCtx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(196, 181, 253, 0.8)');
        gradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.4)');
        gradient.addColorStop(1, 'transparent');
        this.gradientCtx.fillStyle = gradient;
        this.gradientCtx.beginPath();
        this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
        this.gradientCtx.fill();
      }
      randomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }
      createParticle() {
        const intensityRatio = this.intensity / this.baseIntensity;
        const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
        const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;
        return {
          x: this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
          y: this.randomFloat(0, this.h),
          vx: this.randomFloat(0.2, 1.0) * speedMultiplier,
          vy: this.randomFloat(-0.15, 0.15) * speedMultiplier,
          radius: this.randomFloat(0.4, 1) * sizeMultiplier,
          alpha: this.randomFloat(0.6, 1),
          decay: this.randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
          originalAlpha: 0,
          life: 1.0,
          time: 0,
          startX: 0,
          twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
          twinkleAmount: this.randomFloat(0.1, 0.25),
        };
      }
      initParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
          const p = this.createParticle();
          p.originalAlpha = p.alpha;
          p.startX = p.x;
          this.count++;
          this.particles[this.count] = p;
        }
      }
      updateParticle(p: any) {
        p.x += p.vx;
        p.y += p.vy;
        p.time++;
        p.alpha = p.originalAlpha * p.life + Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
        p.life -= p.decay;
        if (p.x > this.w + 10 || p.life <= 0) {
          this.resetParticle(p);
        }
      }
      resetParticle(p: any) {
        p.x = this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
        p.y = this.randomFloat(0, this.h);
        p.vx = this.randomFloat(0.2, 1.0);
        p.vy = this.randomFloat(-0.15, 0.15);
        p.alpha = this.randomFloat(0.6, 1);
        p.originalAlpha = p.alpha;
        p.life = 1.0;
        p.time = 0;
        p.startX = p.x;
      }
      drawParticle(p: any) {
        if (p.life <= 0) return;
        let fadeAlpha = 1;
        if (p.y < this.fadeZone) fadeAlpha = p.y / this.fadeZone;
        else if (p.y > this.h - this.fadeZone) fadeAlpha = (this.h - p.y) / this.fadeZone;
        fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));
        this.ctx.globalAlpha = p.alpha * fadeAlpha;
        this.ctx.drawImage(
          this.gradientCanvas,
          p.x - p.radius,
          p.y - p.radius,
          p.radius * 2,
          p.radius * 2,
        );
      }
      drawLightBar() {
        const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
        verticalGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        verticalGradient.addColorStop(this.fadeZone / this.h, 'rgba(255, 255, 255, 1)');
        verticalGradient.addColorStop(1 - this.fadeZone / this.h, 'rgba(255, 255, 255, 1)');
        verticalGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.globalCompositeOperation = 'lighter';
        const targetGlowIntensity = this.scanningActive ? 3.5 : 1;
        this.currentGlowIntensity +=
          (targetGlowIntensity - this.currentGlowIntensity) * this.transitionSpeed;
        const glowIntensity = this.currentGlowIntensity;
        const lineWidth = this.lightBarWidth;
        const coreGradient = this.ctx.createLinearGradient(
          this.lightBarX - lineWidth / 2,
          0,
          this.lightBarX + lineWidth / 2,
          0,
        );
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        coreGradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
        coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
        coreGradient.addColorStop(0.7, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
        coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = coreGradient;
        const radius = 15;
        this.ctx.beginPath();
        // @ts-ignore modern canvas API
        this.ctx.roundRect(this.lightBarX - lineWidth / 2, 0, lineWidth, this.h, radius);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'destination-in';
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = verticalGradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
      }
      render() {
        const targetIntensity = this.scanningActive ? this.scanTargetIntensity : this.baseIntensity;
        const targetMaxParticles = this.scanningActive
          ? this.scanTargetParticles
          : this.baseMaxParticles;
        const targetFadeZone = this.scanningActive ? this.scanTargetFadeZone : this.baseFadeZone;
        this.currentIntensity += (targetIntensity - this.currentIntensity) * this.transitionSpeed;
        this.currentMaxParticles +=
          (targetMaxParticles - this.currentMaxParticles) * this.transitionSpeed;
        this.currentFadeZone += (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;
        this.intensity = this.currentIntensity;
        this.maxParticles = Math.floor(this.currentMaxParticles);
        this.fadeZone = this.currentFadeZone;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.drawLightBar();
        this.ctx.globalCompositeOperation = 'lighter';
        for (let i = 1; i <= this.count; i++) {
          const p = this.particles[i];
          if (p) {
            this.updateParticle(p);
            this.drawParticle(p);
          }
        }
        const currentIntensity = this.intensity;
        const currentMaxParticles = this.maxParticles;
        if (Math.random() < currentIntensity && this.count < currentMaxParticles) {
          const p = this.createParticle();
          p.originalAlpha = p.alpha;
          p.startX = p.x;
          this.count++;
          this.particles[this.count] = p;
        }
        const intensityRatio = this.intensity / this.baseIntensity;
        if (intensityRatio > 1.1 && Math.random() < (intensityRatio - 1.0) * 1.2) {
          const p = this.createParticle();
          p.originalAlpha = p.alpha;
          p.startX = p.x;
          this.count++;
          this.particles[this.count] = p;
        }
        if (this.count > currentMaxParticles + 200) {
          const excessCount = Math.min(15, this.count - currentMaxParticles);
          for (let i = 0; i < excessCount; i++) delete this.particles[this.count - i];
          this.count -= excessCount;
        }
      }
      animate() {
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
      }
      setScanningActive(active: boolean) {
        this.scanningActive = active;
      }
      destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.particles = [];
        this.count = 0;
      }
    }

    const stream = new CardStreamController(
      cardStreamRef.current,
      cardLineRef.current,
      speedRef.current,
    );
    const ps = new ParticleSystem(particleCanvasRef.current);
    const scanner = new ParticleScanner(scannerCanvasRef.current);
    scannerAPI.setActive = (active) => scanner.setScanningActive(active);

    (rootRef.current as any).__scannerDemo = {
      toggle: () => stream.toggleAnimation(),
      reset: () => stream.resetPosition(),
      direction: () => stream.changeDirection(),
    };

    return () => {
      ps.destroy();
      scanner.destroy();
      if (rootRef.current) {
        (rootRef.current as any).__scannerDemo = undefined;
      }
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.controls}>
        <button
          className={styles.controlBtn}
          onClick={() => (rootRef.current as any)?.__scannerDemo?.toggle?.()}
        >
          ⏸️ Pause
        </button>
        <button
          className={styles.controlBtn}
          onClick={() => (rootRef.current as any)?.__scannerDemo?.reset?.()}
        >
          🔄 Reset
        </button>
        <button
          className={styles.controlBtn}
          onClick={() => (rootRef.current as any)?.__scannerDemo?.direction?.()}
        >
          ↔️ Direction
        </button>
      </div>
      <div className={styles.speedIndicator}>
        Speed: <span ref={speedRef}>120</span> px/s
      </div>
      <div className={styles.container}>
        <canvas ref={particleCanvasRef} className={styles.particleCanvas} />
        <canvas ref={scannerCanvasRef} className={styles.scannerCanvas} />
        <div className={styles.scanner} />
        <div className={styles.cardStream} ref={cardStreamRef}>
          <div className={styles.cardLine} ref={cardLineRef} />
        </div>
      </div>
      <div className={styles.credit}>
        Inspired by{' '}
        <a href="https://evervault.com/" target="_blank" rel="noreferrer">
          @evervault.com
        </a>
      </div>
    </div>
  );
}
