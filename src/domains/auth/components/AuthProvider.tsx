'use client';

import React from 'react';
import { useAuthInit } from '../hooks/useAuthInit';
import { useTokenRefresh } from '../hooks/useTokenRefresh';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication state management Provider component
 * Initializes and restores authentication state on app startup.
 * Manages automatic token refresh.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize authentication state
  useAuthInit();

  // Automatic token refresh
  useTokenRefresh();

  return <>{children}</>;
};
