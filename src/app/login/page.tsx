'use client';

import React from 'react';
import { LoginForm } from '@/domains/auth/components/LoginForm';
import { LoginFormData } from '@/domains/auth/types/auth';

export default function LoginPage() {
  const handleLogin = async (data: LoginFormData) => {
    // TODO: Implement actual login logic with AuthService
    console.log('Login attempt with:', data);

    // Placeholder implementation
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual AuthService.login() call
      // const response = await AuthService.login(data);

      console.log('Login successful');
      // TODO: Handle successful login (store tokens, redirect, etc.)
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
