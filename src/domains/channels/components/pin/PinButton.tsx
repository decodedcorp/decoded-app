'use client';

import React, { useState } from 'react';
import { RiPushpin2Line, RiUnpinLine } from 'react-icons/ri';
import { useTogglePin, useIsContentPinned } from '../../hooks/useChannelPins';
import { canPinContent } from '@/lib/utils/channelPermissions';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { cn } from '@/lib/utils/cn';
import PinNoteModal from './PinNoteModal';

interface PinButtonProps {
  contentId: string;
  channelId: string;
  channel?: ChannelResponse | null;
  contentTitle?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onPinChange?: (isPinned: boolean) => void;
}

export const PinButton: React.FC<PinButtonProps> = ({
  contentId,
  channelId,
  channel,
  contentTitle,
  className,
  size = 'md',
  showLabel = false,
  onPinChange,
}) => {
  const { user } = useUser();
  const { isPinned } = useIsContentPinned(channelId, contentId);
  const { togglePin, isLoading } = useTogglePin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 권한 체크 - user 타입 변환
  const userProfile = user ? {
    id: user.doc_id || user.email || '',
    email: user.email,
    username: user.nickname,
    full_name: user.nickname,
    avatar_url: '',
    registration_date: user.createdAt || new Date().toISOString(),
  } : null;
  
  const canPin = canPinContent(userProfile, channel);
  
  // 권한이 없으면 버튼을 표시하지 않음
  if (!canPin) {
    return null;
  }
  
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 방지
    
    if (isLoading) return;
    
    if (isPinned) {
      // Unpin: 바로 실행
      try {
        await togglePin(contentId, channelId, true);
        onPinChange?.(false);
      } catch (error) {
        console.error('Failed to unpin content:', error);
      }
    } else {
      // Pin: 모달 열기
      setIsModalOpen(true);
    }
  };

  const handlePin = async (note?: string) => {
    try {
      await togglePin(contentId, channelId, false, { note });
      onPinChange?.(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to pin content:', error);
      // 모달은 에러 발생 시에도 닫지 않음 (사용자가 다시 시도할 수 있도록)
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-11 h-11 text-lg',
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'group relative flex items-center justify-center',
          'rounded-lg transition-all duration-200',
          'hover:scale-105 active:scale-95',
          isPinned
            ? 'bg-[#eafd66]/20 text-[#eafd66] hover:bg-[#eafd66]/30 border border-[#eafd66]/50'
            : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-300 border border-zinc-700/50',
          isLoading && 'opacity-50 cursor-not-allowed',
          showLabel ? 'px-3 py-2 gap-2' : sizeClasses[size],
          className
        )}
        title={isPinned ? 'Unpin content' : 'Pin content'}
        aria-label={isPinned ? 'Unpin content' : 'Pin content'}
        aria-pressed={isPinned}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Icon */}
        <div className={cn(
          'transition-all duration-200',
          isLoading && 'invisible',
          isPinned ? 'rotate-45' : 'rotate-0'
        )}>
          {isPinned ? (
            <RiUnpinLine className={iconSizeClasses[size]} />
          ) : (
            <RiPushpin2Line className={iconSizeClasses[size]} />
          )}
        </div>
        
        {/* Label */}
        {showLabel && !isLoading && (
          <span className="font-medium whitespace-nowrap">
            {isPinned ? 'Unpin' : 'Pin'}
          </span>
        )}
        
        {/* Tooltip */}
        <div className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
          'px-2 py-1 rounded bg-zinc-900 text-white text-xs',
          'opacity-0 group-hover:opacity-100 pointer-events-none',
          'transition-opacity duration-200',
          'whitespace-nowrap z-50',
          showLabel && 'hidden'
        )}>
          {isPinned ? 'Unpin from top' : 'Pin to top'}
        </div>
      </button>

      {/* Pin Note Modal */}
      <PinNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPin={handlePin}
        isLoading={isLoading}
        contentTitle={contentTitle}
      />
    </>
  );
};

/**
 * Compact pin indicator for use in cards
 */
export const PinIndicator: React.FC<{
  isPinned: boolean;
  className?: string;
}> = ({ isPinned, className }) => {
  if (!isPinned) return null;
  
  return (
    <div className={cn(
      'flex items-center gap-1.5',
      'px-2 py-1 rounded-md',
      'bg-[#eafd66]/20 text-[#eafd66]',
      'border border-[#eafd66]/30',
      className
    )}>
      <RiPushpin2Line className="w-3.5 h-3.5 rotate-45" />
      <span className="text-xs font-medium">Pinned</span>
    </div>
  );
};