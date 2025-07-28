import { AUTH_CONSTANTS } from '../constants/authConstants';
import { LoginFormData, LoginFormErrors } from '../types/auth';

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return AUTH_CONSTANTS.VALIDATION.EMAIL.REQUIRED;
  }

  if (!AUTH_CONSTANTS.VALIDATION.EMAIL.PATTERN.test(email)) {
    return AUTH_CONSTANTS.VALIDATION.EMAIL.INVALID;
  }

  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password.trim()) {
    return AUTH_CONSTANTS.VALIDATION.PASSWORD.REQUIRED;
  }

  if (password.length < AUTH_CONSTANTS.VALIDATION.PASSWORD.MIN_LENGTH_VALUE) {
    return AUTH_CONSTANTS.VALIDATION.PASSWORD.MIN_LENGTH;
  }

  return undefined;
};

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

export const isFormValid = (errors: LoginFormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
