'use client';

import React from 'react';

const capsules = [
  { name: 'Kazimir Malevich', img: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { name: 'Alexander Bogomazov', img: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { name: 'Ilya Chashnik', img: 'https://randomuser.me/api/portraits/men/13.jpg' },
  { name: 'Moisey Feigin', img: 'https://randomuser.me/api/portraits/men/14.jpg' },
  { name: 'Naum Gabo', img: 'https://randomuser.me/api/portraits/men/15.jpg' },
  { name: 'El Lissitzky', img: 'https://randomuser.me/api/portraits/men/16.jpg' },
  { name: 'Aristarkh Lentulov', img: 'https://randomuser.me/api/portraits/men/17.jpg' },
  { name: 'Ivan Puni', img: 'https://randomuser.me/api/portraits/men/18.jpg' },
  { name: 'Varvara Stepanova', img: 'https://randomuser.me/api/portraits/women/19.jpg' },
  { name: 'Nadezhda Udaltsova', img: 'https://randomuser.me/api/portraits/women/20.jpg' },
  { name: 'Adolf Milman', img: 'https://randomuser.me/api/portraits/men/21.jpg' },
  { name: 'Paul Mansouroff', img: 'https://randomuser.me/api/portraits/men/22.jpg' },
  // ... 더 추가 가능
];

function Capsule({ name, img }: { name: string; img?: string }) {
  return (
    <div className="flex items-center border border-zinc-700 rounded-full px-5 py-2 mr-3 min-w-[160px] max-w-xs">
      {img && <img src={img} alt={name} className="w-7 h-7 rounded-full object-cover mr-2" />}
      <span className="text-white font-thin text-lg whitespace-nowrap truncate">{name}</span>
    </div>
  );
}

function shuffle(arr: any[]) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function getRandomOffset(rowIdx: number) {
  const offsets = [-8, -4, 0, 4, 8];
  return offsets[rowIdx % offsets.length];
}

const marqueeStyles = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
`;

// Hydration 에러 방지: row별로 capsules 배열을 그대로 복제해서 사용 (shuffle 제거)
const HERO_ROWS = 4;
const CAPSULES_PER_ROW = capsules.length * 2;
const HERO_CAPSULE_ROWS = Array.from({ length: HERO_ROWS }).map(() =>
  capsules.concat(capsules).slice(0, CAPSULES_PER_ROW),
);

export function ChannelHero() {
  // const rows = 4;
  // const capsulesPerRow = capsules.length * 2;
  return (
    <section className="py-6 px-0 bg-black w-full relative overflow-x-hidden">
      <style>{marqueeStyles}</style>
      <div className="flex flex-col gap-1 w-full">
        {HERO_CAPSULE_ROWS.map((rowCapsules, rowIdx) => {
          const isReverse = rowIdx % 2 === 1;
          const animation = isReverse
            ? 'marquee-reverse 48s linear infinite'
            : 'marquee 48s linear infinite';
          return (
            <div
              key={rowIdx}
              className="relative w-full overflow-x-hidden h-[46px]"
              style={{ transform: `translateY(${getRandomOffset(rowIdx)}px)` }}
            >
              <div className="flex flex-nowrap w-max" style={{ animation }}>
                {rowCapsules.map((c, i) => (
                  <Capsule key={c.name + i + rowIdx} name={c.name} img={c.img} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
