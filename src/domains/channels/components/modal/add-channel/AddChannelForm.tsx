'use client';

import React, { useRef, useState } from 'react';
import {
  useAddChannelStore,
  selectAddChannelFormData,
  selectAddChannelError,
} from '@/store/addChannelStore';

interface AddChannelFormProps {
  onSubmit: (data: { name: string; description: string | null; thumbnail_base64?: string }) => void;
  isLoading: boolean;
}

export function AddChannelForm({ onSubmit, isLoading }: AddChannelFormProps) {
  const formData = useAddChannelStore(selectAddChannelFormData);
  const error = useAddChannelStore(selectAddChannelError);
  const updateFormData = useAddChannelStore((state) => state.updateFormData);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    updateFormData({ [field]: value });

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      updateFormData({ thumbnail_base64: undefined });
      setValidationErrors((prev) => ({ ...prev, description: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      updateFormData({ thumbnail_base64: undefined });
      setValidationErrors((prev) => ({ ...prev, description: 'Image size must be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateFormData({ thumbnail_base64: result });
      setValidationErrors((prev) => ({ ...prev, description: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    updateFormData({ thumbnail_base64: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; description?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Channel name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Channel name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Channel name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      thumbnail_base64: formData.thumbnail_base64,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Channel Name */}
      <div>
        <label htmlFor="channel-name" className="block text-sm font-medium text-white mb-2">
          Channel Name *
        </label>
        <input
          id="channel-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors ${
            validationErrors.name ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder="Enter channel name"
          disabled={isLoading}
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
        )}
      </div>

      {/* Channel Description */}
      <div>
        <label htmlFor="channel-description" className="block text-sm font-medium text-white mb-2">
          Description
        </label>
        <textarea
          id="channel-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors resize-none ${
            validationErrors.description ? 'border-red-500' : 'border-zinc-700'
          }`}
          placeholder="Describe your channel (optional)"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-1">
          {validationErrors.description && (
            <p className="text-sm text-red-400">{validationErrors.description}</p>
          )}
          <p className="text-sm text-zinc-400 ml-auto">{formData.description.length}/500</p>
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Thumbnail Image</label>

        {formData.thumbnail_base64 ? (
          <div className="space-y-3">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-700">
              <img
                src={formData.thumbnail_base64}
                alt="Channel thumbnail preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                disabled={isLoading}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-zinc-400">Click the X button to remove the image</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-32 h-32 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center hover:border-zinc-600 transition-colors cursor-pointer">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center space-y-2 text-zinc-400 hover:text-zinc-300 transition-colors"
                disabled={isLoading}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs">Upload Image</span>
              </button>
            </div>
            <p className="text-sm text-zinc-400">JPG, PNG up to 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
      </div>

      {/* API Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </form>
  );
}
