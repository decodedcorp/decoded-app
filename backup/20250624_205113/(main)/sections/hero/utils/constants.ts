import { BoxPosition } from './types';

// Position Types
interface Position {
  x: number;
  y: number;
}

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex?: number;
}

interface BoxArea {
  y: [number, number]; // [min, max]
  x: [number, number]; // [min, max]
  maxBoxes: number;
  name: string;
}

type BoxSizeMode = 'LARGE' | 'SMALL';

// Layout Constants
const LAYOUT = {
  CENTER: { x: 50, y: 50 },
  RADIUS: 30,
  TOTAL_BOXES: 10,
  POSITION_VARIANCE: 10,
  CLUSTER_PROBABILITY: 0.25,
  CLUSTER_OFFSET: 15,
} as const;

// Box Size Configuration
const BOX_SIZES = {
  LARGE: { width: 2.5, height: 2.5 },
  SMALL: { width: 1.5, height: 1.5 },
} as const;

const MIN_GAP = {
  LARGE: 20,
  SMALL: 15,
} as const;

// Area Definitions
const AREAS: BoxArea[] = [
  { y: [-20, 10], x: [-80, 30], maxBoxes: 2, name: 'topLeft' },
  { y: [-20, 15], x: [40, 180], maxBoxes: 3, name: 'topRight' },
  { y: [5, 35], x: [-90, 20], maxBoxes: 1, name: 'upperLeft' },
  { y: [10, 40], x: [70, 190], maxBoxes: 3, name: 'upperRight' },
  { y: [30, 55], x: [-70, 170], maxBoxes: 5, name: 'center' },
  { y: [45, 70], x: [-85, 25], maxBoxes: 2, name: 'lowerLeft' },
  { y: [40, 65], x: [65, 185], maxBoxes: 3, name: 'lowerRight' },
  { y: [60, 85], x: [-75, 45], maxBoxes: 1, name: 'bottomLeft' },
  { y: [55, 80], x: [55, 175], maxBoxes: 1, name: 'bottomRight' },
  { y: [25, 60], x: [-95, 195], maxBoxes: 5, name: 'global' },
];

// 시드 기반 랜덤 생성기
class SeededRandom {
  private seed: number;
  private z: number;

  constructor(seed: number) {
    this.seed = seed;
    this.z = seed % 10000;
  }

  random() {
    const x = Math.sin(this.seed++) * 10000;
    const y = Math.cos(this.z++) * 10000;
    return (x - Math.floor(x) + y - Math.floor(y)) / 2;
  }

  range(min: number, max: number) {
    const r1 = this.random();
    const r2 = this.random();
    const value = (r1 + r2) / 2;
    return Math.floor(value * (max - min + 1) + min);
  }
}

// 랜덤 시드 생성
function getRandomSeed() {
  return Math.floor(Math.random() * 1000000);
}

// 원형 배치 함수
function generateCircularPosition(
  boxIndex: number,
  totalBoxes: number
): Position {
  const angle = (2 * Math.PI * boxIndex) / totalBoxes;
  return {
    x: LAYOUT.CENTER.x + LAYOUT.RADIUS * Math.cos(angle),
    y: LAYOUT.CENTER.y + LAYOUT.RADIUS * Math.sin(angle),
  };
}

// 박스 충돌 감지 함수
function isBoxColliding(box1: Box, box2: Box, minGap: number): boolean {
  return (
    box1.left < box2.left + box2.width + minGap &&
    box1.left + box1.width + minGap > box2.left &&
    box1.top < box2.top + box2.height + minGap &&
    box1.top + box1.height + minGap > box2.top
  );
}

// 유효한 박스 위치 찾기
function findValidPosition(
  newBox: Box,
  existingBoxes: Box[],
  random: SeededRandom,
  area: BoxArea,
  minGap: number,
  attempts: number = 10
): Position | null {
  for (let i = 0; i < attempts; i++) {
    const x = random.range(area.x[0], area.x[1]);
    const y = random.range(area.y[0], area.y[1]);
    
    const testBox = {
      ...newBox,
      left: x,
      top: y,
    };

    if (!existingBoxes.some(box => isBoxColliding(testBox, box, minGap))) {
      return { x, y };
    }
  }
  return null;
}

// 박스 위치 생성 함수
function generateBoxPositions(sizeMode: BoxSizeMode): BoxPosition {
  const positions: BoxPosition = {};
  const random = new SeededRandom(getRandomSeed());

  // LEFT_BOTTOM 위치 설정
  positions.LEFT_BOTTOM = {
    top: random.range(60, 80),
    left: random.range(10, 20),
  };

  // RIGHT_TOP 위치 설정
  positions.RIGHT_TOP = {
    top: random.range(20, 40),
    right: random.range(10, 20),
  };

  // RIGHT_BOTTOM 위치 설정
  positions.RIGHT_BOTTOM = {
    top: random.range(60, 80),
    right: random.range(10, 20),
  };

  return positions;
}

export function getDynamicBoxPositions(sizeMode: BoxSizeMode): BoxPosition {
  return generateBoxPositions(sizeMode);
}
