'use client';

import { useEffect } from 'react';

import { useAuthLifecycle } from '../hooks/useAuthLifecycle';
import { configureApi } from '../../../api/config';

export function AuthInitializer() {
  // Always call hooks (required by React)
  useAuthLifecycle();

  // Ensure client-side initialization
  useEffect(() => {
    configureApi();
  }, []);

  return null; // This component doesn't render anything
}
