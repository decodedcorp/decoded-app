import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { StatusType } from './types';

interface StatusStyleConfig {
  icon: typeof CheckCircle | typeof XCircle | typeof AlertCircle | typeof Loader2;
  className: string;
  bgClassName: string;
}

export const statusConfig: Record<StatusType, StatusStyleConfig> = {
  success: {
    icon: CheckCircle,
    className: 'text-[#EAFD66]',
    bgClassName: 'bg-[#1f210e]',
  },
  error: {
    icon: XCircle,
    className: 'text-red-500',
    bgClassName: 'bg-red-500/10',
  },
  warning: {
    icon: AlertCircle,
    className: 'text-yellow-500',
    bgClassName: 'bg-yellow-500/10',
  },
  loading: {
    icon: Loader2,
    className: 'text-gray-500',
    bgClassName: 'bg-gray-500/10',
  },
} as const;

export const ANIMATION_DURATION = 300;

export const buttonStyles = {
  base: 'rounded-lg px-3 py-1.5 text-xs font-medium transform transition-colors duration-200',
  success: 'bg-[#EAFD66] text-black hover:bg-[#d9ec55]',
  error: 'bg-red-500/20 text-red-500 hover:bg-red-500/30',
  warning: 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30',
  loading: 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30',
} as const; 