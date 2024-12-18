'use client';

import Image from 'next/image';
import AddIcon from '@mui/icons-material/Add';
import { DetailPageState } from '@/types/model.d';
import { pretendardRegular, pretendardSemiBold } from '@/lib/constants/fonts';

interface ImagePopupProps {
  detailPageState: DetailPageState;
  currentIndex: number | null;
  isTouch: boolean;
  hoveredItem: number | null;
  setHoveredItem: (index: number | null) => void;
}

const itemPopupClasses = `absolute bg-white text-black p-2 rounded-md shadow-lg z-10 w-64 left-full ml-2 top-1/2 -translate-y-1/2`;
const mobilePopupClasses = `absolute border border-black backdrop-blur-sm text-black p-2 rounded-md shadow-lg w-52 left-0 md:hidden 
  transition-all duration-300 ease-out overflow-x-hidden`;

export function ImagePopup({
  detailPageState,
  currentIndex,
  isTouch,
  hoveredItem,
  setHoveredItem,
}: ImagePopupProps) {
  return (
    <div className="w-full">
      {detailPageState.img &&
        detailPageState.itemList?.map((item, index) => (
          <a
            key={item.info.name}
            href={item.info?.affiliateUrl ?? ''}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              top: item.pos.top,
              left: item.pos.left,
              cursor: 'pointer',
            }}
            className="point"
          >
            <div className="relative bg-red-500 w-3 h-3 flex justify-center items-center group">
              <AddIcon style={{ width: '15px', height: '15px' }} />
              {/* Desktop Popup */}
              <div
                className={`${itemPopupClasses} ${
                  currentIndex === index ? 'block' : 'hidden'
                }`}
              >
                <div className="flex">
                  <div className="relative w-[100px] h-[100px]">
                    <Image
                      src={item.info.imageUrl ?? ''}
                      alt={item.info.name}
                      fill={true}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-black p-2 w-48 mb-2 text-center items-center justify-center">
                    <p
                      className={`${pretendardSemiBold.className} text-sm mb-1`}
                    >
                      {item.info.name}
                    </p>
                    <p className={`${pretendardRegular.className} text-xs`}>
                      {item.info.brands?.[0].replace(/_/g, ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
              {/* Mobile Popup */}
              <div
                className={`${mobilePopupClasses} ${
                  isTouch
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                } ${hoveredItem === index ? 'z-50' : 'z-10'}
                  ${hoveredItem === index ? 'bg-white' : 'bg-white/60'}`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex justify-center items-center">
                  <div className="relative w-[50px] h-[50px]">
                    <Image
                      src={item.info.imageUrl ?? ''}
                      alt={item.info.name}
                      fill={true}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-black w-48 text-center items-center justify-center ml-2">
                    <p
                      className={`${pretendardSemiBold.className} text-xs mb-1`}
                    >
                      {item.info.name}
                    </p>
                    <p className={`${pretendardRegular.className} text-xs`}>
                      {item.info.brands?.[0].replace(/_/g, ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
    </div>
  );
}
