import { ContentTab } from './contentHelpers';

export type ValidationErrors = {
  title?: string;
  description?: string;
  file?: string;
  url?: string;
};

export const validateForm = (
  contentTabs: ContentTab[],
  description?: string,
  t?: any,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Check if at least one content tab exists
  if (contentTabs.length === 0) {
    errors.url = '최소 하나의 콘텐츠를 추가해주세요.';
  }

  // Validate description length if exists
  if (description && description.length > 500) {
    errors.description =
      t?.globalContentUpload?.contentUpload?.validation?.descriptionTooLong?.() ||
      'Description is too long';
  }

  return errors;
};
