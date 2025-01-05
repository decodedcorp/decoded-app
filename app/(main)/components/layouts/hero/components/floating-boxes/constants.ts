import { BoxContent, BoxPosition } from "./types";

export const BOX_CONTENTS: Record<string, BoxContent> = {
  LEFT_TOP: {
    icon: 'P',
    title: 'Get100',
    subtitle: '포인트를 받아보세요',
  },
  LEFT_BOTTOM: {
    icon: 'P',
    title: 'Get200',
    subtitle: '친구와 함께',
  },
  RIGHT_TOP: {
    icon: 'P',
    title: 'Get300',
    subtitle: '매일매일',
  },
  RIGHT_BOTTOM: {
    icon: 'P',
    title: 'Get200',
    subtitle: '친구와 함께',
  },
};

export const BOX_POSITION_SETS: BoxPosition[] = [
  // Set 1 - 왼쪽 2개, 오른쪽 1개(큰 박스)
  {
    LEFT_TOP: { top: 15, left: 15 },
    LEFT_BOTTOM: { top: 55, left: 22 },
    RIGHT_TOP: { top: 32, right: 15 },
  },
  // Set 2 - 왼쪽 1개(큰 박스), 오른쪽 2개
  {
    LEFT_TOP: { top: 32, left: 15 },
    RIGHT_TOP: { top: 15, right: 18 },
    RIGHT_BOTTOM: { top: 55, right: 22 },
  },
]; 