export type StatusType = 'success' | 'error' | 'warning';

export type StatusMessageKey = 
  | 'request'
  | 'provide'
  | 'save'
  | 'default'
  | 'unsavedChanges'
  | 'delete'
  | 'login';

export interface StatusConfig {
  type: StatusType;
  messageKey?: StatusMessageKey;
  title?: string;
  message?: string;
}

export interface StatusStore {
  isOpen: boolean;
  type: StatusType;
  messageKey?: StatusMessageKey;
  title?: string;
  message?: string;
  setStatus: (config: StatusConfig) => void;
  closeStatus: () => void;
} 