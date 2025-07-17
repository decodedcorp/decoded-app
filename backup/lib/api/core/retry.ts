import { API_CONSTANTS } from '../config/constants';
import { ApiError } from '../types';

export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = API_CONSTANTS.RETRY.MAX_ATTEMPTS
): Promise<T> => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      if (!(error instanceof ApiError) || 
          [401, 403, 404].includes(error.status) || 
          attempt >= retries) {
        throw error;
      }

      const delay = Math.min(API_CONSTANTS.RETRY.BASE_DELAY * Math.pow(2, attempt), API_CONSTANTS.RETRY.MAX_DELAY);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(API_CONSTANTS.ERROR_MESSAGES.RETRY_FAILED);
};
