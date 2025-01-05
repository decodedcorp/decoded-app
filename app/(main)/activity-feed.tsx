'use client';

import { cn } from '@/lib/utils/style';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Link, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { networkManager } from '@/lib/network/network';
import { ImageDocument } from '@/types/model';
import { convertKeysToCamelCase } from '@/lib/utils/string';
interface Activity {
  type: 'request_image';
  data: {
    image_url: string;
    image_doc_id: string;
    item_len: number;
  };
  timestamp: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialActivities() {
      try {
        const response = await networkManager.request('images', 'GET');

        if (!response.data?.images || !Array.isArray(response.data.images)) {
          console.error('Invalid response format:', response);
          return;
        }

        const initialActivities = convertKeysToCamelCase(response.data.images).map(
          (image: ImageDocument) => ({
            type: 'request_image' as const,
            data: {
              image_url: image.imgUrl,
              image_doc_id: image.docId,
              item_len: Object.values(image.items).reduce(
                (sum, items) => sum + items.length,
                0
              ),
            },
            timestamp: image.uploadBy || new Date().toISOString(),
          })
        );

        if (initialActivities.length > 0) {
          setActivities(initialActivities);
        }
      } catch (error) {
        console.error('Failed to fetch initial activities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialActivities();
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://dev.decoded.style/subscribe/decoded/events');

    ws.onopen = () => {
      console.log('WebSocket Connected');
    }; // isLoading은 초기 데이터 로딩에만 사용

    ws.onmessage = (event) => {
      try {
        const newActivity = JSON.parse(event.data) as Activity;
        setActivities((prev) => [newActivity, ...prev.slice(0, 7)]);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div
      className={cn(
        'relative h-[600px] overflow-hidden rounded-2xl',
        'border border-zinc-800/50',
        'bg-zinc-900/30 backdrop-blur-sm'
      )}
    >
      {/* 그라데이션 오버레이 */}
      <div
        className={cn(
          'absolute inset-0 z-20 pointer-events-none',
          'bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900'
        )}
      />

      {/* 활동 피드 */}
      <div className="relative p-4 space-y-4 mt-14">
        <AnimatePresence initial={false}>
          {activities.map((activity) => (
            <motion.div
              key={activity.timestamp}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                opacity: { duration: 0.3 },
                height: { duration: 0.3 },
                y: { duration: 0.3 },
              }}
            >
              <ActivityCard activity={activity} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 상단 헤더 */}
      <div
        className={cn(
          'absolute top-0 inset-x-0 z-30',
          'p-4 border-b border-zinc-800/50',
          'bg-zinc-900/50 backdrop-blur-sm'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                'bg-[#EAFD66]',
                !isLoading && 'animate-pulse'
              )}
            />
            <span className="text-sm font-medium text-zinc-400">
              {isLoading ? '연결 중...' : '실시간 요청'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Search className="w-4 h-4" />
            <span>{activities.length} 검색 요청</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  const { data, timestamp } = activity;

  return (
    <div
      className={cn(
        'bg-zinc-800/30 backdrop-blur-sm',
        'border border-zinc-700/30 rounded-xl',
        'p-4 transition-all duration-300',
        'hover:bg-zinc-700/30 hover:border-zinc-600/30'
      )}
    >
      <div className="flex gap-4">
        {/* 요청 이미지 */}
        <div
          className={cn(
            'w-16 h-16 rounded-lg overflow-hidden',
            'border border-zinc-700/50'
          )}
        >
          <img
            src={data.image_url}
            alt={`Image ${data.image_doc_id}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 요청 정보 */}
        <div className="flex-1">
          <div className="flex items-center justify-between h-full">
            <div className="space-y-1">
              <p className="text-sm text-white leading-snug">
                <span
                  className={data.item_len ? 'text-[#EAFD66]' : 'text-blue-400'}
                >
                  {data.item_len}
                </span>
                개의 아이템이 요청되었습니다
              </p>
            </div>

            <button
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium',
                'border border-[#EAFD66]/20',
                'bg-[#EAFD66]/10 text-[#EAFD66]',
                'hover:bg-[#EAFD66]/20 transition-colors',
                'flex items-center gap-1'
              )}
              onClick={() => {
                // TODO: 제공 기능 구현
                console.log('Provide items for:', data.image_doc_id);
              }}
            >
              <span>제공하기</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityFeed;
