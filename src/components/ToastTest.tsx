'use client';

import React from 'react';
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
  toastWithMessages,
} from '@/lib/utils/toastUtils';
import { useSimpleToastMutation } from '@/lib/hooks/useToastMutation';

// 테스트용 API 함수
const testApi = {
  success: () => new Promise((resolve) => setTimeout(() => resolve('Success!'), 2000)),
  error: () => new Promise((_, reject) => setTimeout(() => reject(new Error('Test error')), 2000)),
  slow: () => new Promise((resolve) => setTimeout(() => resolve('Slow success!'), 3000)),
};

export const ToastTest: React.FC = () => {
  // 테스트용 mutation
  const testMutation = useSimpleToastMutation(testApi.success, {
    actionName: 'Test Action',
    toastId: 'test-mutation',
  });

  const handleBasicToasts = () => {
    showSuccessToast('Success!');
    setTimeout(() => showErrorToast('Error occurred!'), 1000);
  };

  const handleLoadingToast = () => {
    const loadingId = showLoadingToast('Loading...');
    setTimeout(() => {
      dismissToast(loadingId);
      showSuccessToast('Loading complete!');
    }, 2000);
  };

  const handlePromiseToast = async () => {
    await toastWithMessages(
      testApi.slow(),
      {
        loading: 'Processing promise...',
        success: 'Promise succeeded!',
        error: (err) => `Promise failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      },
      'promise-test',
    );
  };

  const handleMutationToast = () => {
    testMutation.mutate({});
  };

  const handleErrorPromise = async () => {
    try {
      await toastWithMessages(
        testApi.error(),
        {
          loading: 'Testing error...',
          success: 'This message should not appear',
          error: (err) => `Error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
        },
        'error-test',
      );
    } catch (error) {
      // Error is handled by toast
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Toast System Test</h2>
      <div className="space-y-4">
        <button
          onClick={handleBasicToasts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Basic Toast Test
        </button>
        <button
          onClick={handleLoadingToast}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
        >
          Loading Toast Test
        </button>
        <button
          onClick={handlePromiseToast}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ml-4"
        >
          Promise Toast Test
        </button>
        <button
          onClick={handleMutationToast}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ml-4"
        >
          Mutation Toast Test
        </button>
        <button
          onClick={handleErrorPromise}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-4"
        >
          Error Toast Test
        </button>
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Usage:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Basic Toast: Show success/error messages directly</li>
          <li>Loading Toast: Manually manage loading state</li>
          <li>Promise Toast: Automatically manage state with a promise</li>
          <li>Mutation Toast: Integrated with React Query mutation</li>
          <li>Error Toast: Handle toast in error situations</li>
        </ul>
      </div>
    </div>
  );
};
