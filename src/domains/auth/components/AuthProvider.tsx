'use client';

import React from 'react';
import { useAuthInit } from '../hooks/useAuthInit';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication state management Provider component
 * Initializes and restores authentication state on app startup.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize authentication state
  useAuthInit();

  return <>{children}</>;
};
