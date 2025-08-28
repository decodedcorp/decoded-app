import type { InvitationResponse, InvitationCreateRequest, InvitationListResponse } from '@/api/generated';

// Re-export API types for convenience
export type {
  InvitationResponse,
  InvitationCreateRequest,
  InvitationListResponse,
};

// Additional UI types
export interface InvitationCardProps {
  invitation: InvitationResponse;
  type: 'sent' | 'received';
}

export interface InviteManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}

export interface InvitationListProps {
  channelId: string;
  currentUserId?: string;
  type?: 'sent' | 'received' | 'all';
  includeExpired?: boolean;
}

// Invitation status helpers
export const InvitationStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export type InvitationStatusType = typeof InvitationStatus[keyof typeof InvitationStatus];

// Helper functions
export const getInvitationStatus = (invitation: InvitationResponse): InvitationStatusType => {
  if (invitation.is_expired) {
    return InvitationStatus.EXPIRED;
  }
  
  // API에서 상태 필드를 제공하지 않으므로 기본적으로 pending으로 처리
  // 실제로는 API에서 상태를 명확히 제공해야 함
  return InvitationStatus.PENDING;
};

export const isInvitationActionable = (invitation: InvitationResponse): boolean => {
  return !invitation.is_expired;
};

export const getInvitationExpiryDate = (invitation: InvitationResponse): Date => {
  return new Date(invitation.expires_at);
};

export const isInvitationExpiringSoon = (invitation: InvitationResponse, days: number = 1): boolean => {
  if (invitation.is_expired) return false;
  
  const expiryDate = getInvitationExpiryDate(invitation);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  
  return diffDays <= days && diffDays > 0;
};