export type StatusType = "success" | "error" | "warning" | "loading";

export type StatusMessageKey =
  | "request"
  | "provide"
  | "save"
  | "default"
  | "unsavedChanges"
  | "delete"
  | "login"
  | "duplicate"
  | "empty_links"
  | "submitting"
  | "link_added"
  | "link_error"
  | "style.marker.incomplete";

export interface StatusConfig {
  type: StatusType;
  messageKey?: StatusMessageKey;
  title?: string;
  message?: string;
  isLoading?: boolean;
  isOpen?: boolean;
  onLoginRequired?: () => void;
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
