import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { UserProfileResponse } from '@/api/generated/models/UserProfileResponse';

/**
 * 사용자가 채널의 소유자인지 확인
 */
export const isChannelOwner = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  return channel.owner_id === user.id || channel.is_owner === true;
};

/**
 * 사용자가 채널의 관리자인지 확인
 */
export const isChannelManager = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  
  // is_manager 플래그 확인
  if (channel.is_manager === true) return true;
  
  // manager_ids 배열 확인
  if (channel.manager_ids?.includes(user.id)) return true;
  
  // managers 배열 확인
  if (channel.managers?.some(manager => manager.id === user.id)) return true;
  
  return false;
};

/**
 * 사용자가 컨텐츠를 pin할 수 있는지 확인
 * - 채널 소유자 또는 관리자만 가능
 */
export const canPinContent = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  return isChannelOwner(user, channel) || isChannelManager(user, channel);
};

/**
 * 사용자가 컨텐츠를 unpin할 수 있는지 확인
 * - 채널 소유자 또는 관리자만 가능
 */
export const canUnpinContent = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  return canPinContent(user, channel);
};

/**
 * 사용자가 pin 순서를 변경할 수 있는지 확인
 * - 채널 소유자 또는 관리자만 가능
 */
export const canReorderPins = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  return canPinContent(user, channel);
};

/**
 * 사용자가 채널을 편집할 수 있는지 확인
 * - 채널 소유자 또는 관리자만 가능
 */
export const canEditChannel = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  return isChannelOwner(user, channel) || isChannelManager(user, channel);
};

/**
 * 사용자가 채널을 삭제할 수 있는지 확인
 * - 채널 소유자만 가능
 */
export const canDeleteChannel = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  return isChannelOwner(user, channel);
};

/**
 * 사용자가 채널 관리자를 추가/제거할 수 있는지 확인
 * - 채널 소유자만 가능
 */
export const canManageChannelManagers = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  return isChannelOwner(user, channel);
};

/**
 * 사용자가 컨텐츠를 업로드할 수 있는지 확인
 * - 채널 소유자 또는 관리자만 가능
 */
export const canUploadContent = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  return isChannelOwner(user, channel) || isChannelManager(user, channel);
};

/**
 * 사용자가 컨텐츠를 삭제할 수 있는지 확인
 * - 채널 소유자 또는 관리자만 가능
 */
export const canDeleteContent = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  if (!user || !channel) return false;
  return isChannelOwner(user, channel) || isChannelManager(user, channel);
};

/**
 * 채널 권한 레벨 가져오기
 */
export type ChannelPermissionLevel = 'owner' | 'manager' | 'subscriber' | 'viewer';

export const getChannelPermissionLevel = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): ChannelPermissionLevel => {
  if (!user || !channel) return 'viewer';
  
  if (isChannelOwner(user, channel)) return 'owner';
  if (isChannelManager(user, channel)) return 'manager';
  if (channel.is_subscribed) return 'subscriber';
  
  return 'viewer';
};

/**
 * 권한에 따른 UI 표시 여부 결정
 */
export const shouldShowPinButton = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  return canPinContent(user, channel);
};

export const shouldShowEditButton = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  return canEditChannel(user, channel);
};

export const shouldShowDeleteButton = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  return canDeleteChannel(user, channel);
};

export const shouldShowUploadButton = (
  user: UserProfileResponse | null | undefined,
  channel: ChannelResponse | null | undefined
): boolean => {
  return canUploadContent(user, channel);
};