import React, { useState, useEffect } from 'react';

interface Step1Data {
  name: string;
  description: string;
}

interface Step1BasicInfoProps {
  data: Step1Data;
  onDataChange?: (data: Step1Data) => void;
}

export function Step1BasicInfo({ data, onDataChange }: Step1BasicInfoProps) {
  const [formData, setFormData] = useState<Step1Data>(data);

  // Update form data when data prop changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: keyof Step1Data, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Update parent component if callback is provided
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  return (
    <div className="flex gap-6 max-w-full mx-auto">
      {/* Left side - Form */}
      <div className="flex-1">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Tell us about your channel</h2>
          <p className="text-zinc-400">A name and description help people understand what your channel is all about.</p>
        </div>

        <div className="space-y-6">
        <div>
          <label htmlFor="channelName" className="block text-sm font-medium text-zinc-300 mb-2">
            Channel name <span className="text-red-400">*</span>
          </label>
          <input
            id="channelName"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:border-transparent"
            placeholder="Channel name"
            maxLength={50}
          />

          <p className="mt-1 text-xs text-zinc-500">{formData.name.length}/50</p>
        </div>

        <div>
          <label
            htmlFor="channelDescription"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="channelDescription"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:border-transparent resize-none"
            placeholder="Description"
            maxLength={200}
          />

          <p className="mt-1 text-xs text-zinc-500">{formData.description.length}/200</p>
        </div>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="flex-1">
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">
              {formData.name || 'Channel Name'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-4">
              <span>New channel</span>
              <span>•</span>
              <span>0 subscribers</span>
            </div>
            <div className="text-zinc-300 text-sm">
              {formData.description || 'Your channel description will appear here'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
