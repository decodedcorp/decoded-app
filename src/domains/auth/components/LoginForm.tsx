'use client';

import React, { useState } from 'react';
import { LoginFormData, LoginFormErrors } from '../types/auth';
import { validateLoginForm, isFormValid } from '../utils/validation';
import { AUTH_CONSTANTS } from '../constants/authConstants';
import { FormField } from './ui/FormField';
import { PasswordField } from './ui/PasswordField';
import { SubmitButton } from './ui/SubmitButton';
import { useLogin } from '../hooks/useAuthMutations';

interface LoginFormProps {
  onSuccess?: (formData: LoginFormData) => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
      onSuccess?.(formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      onError?.(errorMessage);
    }
  };

  const isFormLoading = loginMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Sign In</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      {/* Email Field */}
      <FormField
        id="email"
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        placeholder="Enter your email"
        disabled={isFormLoading}
        required
      />

      {/* Password Field */}
      <PasswordField
        id="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        placeholder="Enter your password"
        disabled={isFormLoading}
        required
      />

      {/* Error Message */}
      {loginMutation.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{loginMutation.error.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <SubmitButton isLoading={isFormLoading} loadingText={AUTH_CONSTANTS.LOADING.LOGIN}>
        Sign In
      </SubmitButton>

      {/* Additional Links */}
      <div className="text-center space-y-2">
        <a
          href="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Forgot your password?
        </a>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Sign up
          </a>
        </div>
      </div>
    </form>
  );
};
