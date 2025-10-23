'use client';

import React from 'react';
import { ContentUploadForm } from '@/domains/channels/components/modal/content-upload/ContentUploadForm';
import { useContentUploadStore } from '@/store/contentUploadStore';

export default function TestLinkPromptPage() {
  const { openModal, isOpen, closeModal } = useContentUploadStore();

  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    alert(`Form submitted!\n\nData: ${JSON.stringify(data, null, 2)}`);
  };

  const handleOpenModal = () => {
    openModal('test-channel-id');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Link Content Prompting UI Test</h1>

        <div className="space-y-6">
          <div className="bg-zinc-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
            <ul className="space-y-2 text-zinc-300">
              <li>• Click "Open Link Upload Modal" to test the form</li>
              <li>• Test the new AI Prompt field functionality</li>
              <li>• Check Korean/English translations</li>
              <li>• Test mobile responsiveness</li>
              <li>• Verify form validation and disabled states</li>
            </ul>
          </div>

          <div className="bg-zinc-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-green-400">Basic Test</h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Enter URL only</li>
                  <li>• Leave prompt empty</li>
                  <li>• Submit form</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-blue-400">Prompt Test</h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Enter URL + description</li>
                  <li>• Add AI prompt</li>
                  <li>• Test textarea resize</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-400">Validation Test</h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Test empty URL validation</li>
                  <li>• Test long description</li>
                  <li>• Test disabled state</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-yellow-400">UI Test</h3>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Check mobile layout</li>
                  <li>• Test translations</li>
                  <li>• Verify styling</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleOpenModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Open Link Upload Modal
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Reset Page
            </button>
          </div>

          {isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Test Link Upload Form</h2>
                    <button
                      onClick={closeModal}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <ContentUploadForm onSubmit={handleSubmit} isLoading={false} error={null} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
