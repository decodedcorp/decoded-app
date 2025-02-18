export type StatusType = 'success' | 'error' | 'warning' | 'loading';

export type StatusMessageKey = 
  | 'request'
  | 'provide'
  | 'save'
  | 'default'
  | 'unsavedChanges'
  | 'delete'
  | 'login'
  | 'duplicate';

export interface StatusConfig {
  type: StatusType;
  messageKey?: StatusMessageKey;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export interface StatusStore {
  isOpen: boolean;
  type: StatusType;
  messageKey?: StatusMessageKey;
  title?: string;
  message?: string;
  isLoading?: boolean;
  setStatus: (config: StatusConfig) => void;
  closeStatus: () => void;
} 