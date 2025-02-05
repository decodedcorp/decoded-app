import { API_CONSTANTS } from '../config/constants';
import { ApiError } from '../types';

export const handleApiError = (error: ApiError) => {
  if (error.status === API_CONSTANTS.HTTP_STATUS.UNAUTHORIZED) {
    window.sessionStorage.removeItem('ACCESS_TOKEN');
  }

  const errorMessage = error.status in API_CONSTANTS.ERROR_MESSAGES 
    ? API_CONSTANTS.ERROR_MESSAGES[error.status as keyof typeof API_CONSTANTS.ERROR_MESSAGES]
    : API_CONSTANTS.ERROR_MESSAGES.DEFAULT;

  console.error(errorMessage);
  throw error;
};
