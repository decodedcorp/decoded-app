import { sha256 } from 'js-sha256';

export const hash = (str: string): string => {
  return sha256(str).toString();
};
