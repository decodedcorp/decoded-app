'use client';

import React, { useEffect } from 'react';
import { useAuthLifecycle } from '../hooks/useAuthLifecycle';
import { configureApi } from '../../../api/config';

export function AuthInitializer() {
  // Initialize API configuration (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      configureApi();
    }
  }, []);

  // Initialize authentication lifecycle (init, sync, token monitoring)
  useAuthLifecycle();

  return null; // This component doesn't render anything
}
