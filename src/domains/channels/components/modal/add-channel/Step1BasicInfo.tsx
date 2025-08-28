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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Channel Basic Information</h2>
        <p className="text-zinc-400">Enter the channel name and description.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="channelName" className="block text-sm font-medium text-zinc-300 mb-2">
            Channel Name <span className="text-red-400">*</span>
          </label>
          <input
            id="channelName"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:border-transparent"
            placeholder="Enter channel name (2-50 characters)"
            maxLength={50}
          />

          <p className="mt-1 text-xs text-zinc-500">{formData.name.length}/50</p>
        </div>

        <div>
          <label
            htmlFor="channelDescription"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            Channel Description
          </label>
          <textarea
            id="channelDescription"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:border-transparent resize-none"
            placeholder="Enter channel description (optional)"
            maxLength={200}
          />

          <p className="mt-1 text-xs text-zinc-500">{formData.description.length}/200</p>
        </div>
      </div>
    </div>
  );
}
