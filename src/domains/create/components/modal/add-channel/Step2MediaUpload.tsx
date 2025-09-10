import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit3, X } from 'lucide-react';
import { Button } from '@decoded/ui';
import { ImageCropEditor } from '@/components/ImageCropEditor';
import { validateImageFile, compressImage } from '@/lib/utils/imageUtils';

interface Step1Data {
  name: string;
  description: string;
}

interface Step2Data {
  thumbnail_base64: string | null;
  banner_base64: string | null;
}

interface Step2MediaUploadProps {
  step1Data: Step1Data;
  data: Step2Data;
  onDataChange?: (data: Step2Data) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export function Step2MediaUpload({
  step1Data,
  data,
  onDataChange,
  onBack,
  isLoading,
  error,
}: Step2MediaUploadProps) {
  const [formData, setFormData] = useState<Step2Data>(data);
  const [previewData, setPreviewData] = useState<{
    thumbnail: string | null;
    banner: string | null;
  }>({
    thumbnail: data.thumbnail_base64 ? `data:image/jpeg;base64,${data.thumbnail_base64}` : null,
    banner: data.banner_base64 ? `data:image/jpeg;base64,${data.banner_base64}` : null,
  });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(data);
    setPreviewData({
      thumbnail: data.thumbnail_base64 ? `data:image/jpeg;base64,${data.thumbnail_base64}` : null,
      banner: data.banner_base64 ? `data:image/jpeg;base64,${data.banner_base64}` : null,
    });
  }, [data]);

  const handleImageUpload = async (field: 'thumbnail' | 'banner', file: File) => {
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // Set compression options based on field type
      const compressionOptions =
        field === 'thumbnail'
          ? {
              maxSizeBytes: 500 * 1024, // 500KB
              maxWidth: 800,
              maxHeight: 800,
              quality: 0.8,
              format: 'jpeg' as const,
              includeDataPrefix: true,
            }
          : {
              maxSizeBytes: 800 * 1024, // 800KB for banner
              maxWidth: 1200,
              maxHeight: 400,
              quality: 0.85,
              format: 'jpeg' as const,
              includeDataPrefix: true,
            };

      // Compress image
      const compressedBase64 = await compressImage(file, compressionOptions);
      const base64 = compressedBase64.split(',')[1]; // Remove data:image/...;base64, prefix

      const newData = {
        ...formData,
        [`${field}_base64`]: base64,
      };

      setFormData(newData);

      setPreviewData((prev) => ({
        ...prev,
        [field]: compressedBase64,
      }));

      // Update parent component if callback is provided
      if (onDataChange) {
        onDataChange(newData);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to process image. Please try again.');
    }
  };

  const handleImageRemove = (field: 'thumbnail' | 'banner') => {
    const newData = {
      ...formData,
      [`${field}_base64`]: null,
    };

    setFormData(newData);

    setPreviewData((prev) => ({
      ...prev,
      [field]: null,
    }));

    // Update parent component if callback is provided
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleFileSelect = (field: 'thumbnail' | 'banner') => {
    const inputRef = field === 'thumbnail' ? thumbnailInputRef : bannerInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (
    field: 'thumbnail' | 'banner',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(field, file);
    }
  };

  const [editingImage, setEditingImage] = useState<{
    type: 'thumbnail' | 'banner';
    src: string;
  } | null>(null);

  const [dragOver, setDragOver] = useState<{
    thumbnail: boolean;
    banner: boolean;
  }>({
    thumbnail: false,
    banner: false,
  });

  const handleEditImage = useCallback(
    (type: 'thumbnail' | 'banner') => {
      console.log('🔧 Edit button clicked for:', type);
      // Get current preview data at the time of click
      setPreviewData((currentPreviewData) => {
        console.log('🔧 Current preview data:', currentPreviewData);
        const src = currentPreviewData[type];
        if (src) {
          console.log('🔧 Setting editing image:', { type, srcLength: src.length });
          const editingImageData = { type, src };
          console.log('🔧 Editing image object:', editingImageData);
          setEditingImage(editingImageData);
        } else {
          console.error('❌ No image data found for:', type);
        }
        return currentPreviewData; // Don't change preview data
      });
    },
    [], // Remove previewData dependency
  );

  const handleSaveEditedImage = useCallback(
    async (editedBase64: string) => {
      console.log('💾 Saving edited image:', {
        dataLength: editedBase64.length,
      });

      // Get current editing image state at the time of save
      setEditingImage((currentEditingImage) => {
        if (!currentEditingImage) {
          console.error('❌ No editing image found');
          return null;
        }

        console.log('💾 Processing image for type:', currentEditingImage.type);

        try {
          // Use the edited image directly without additional compression
          // The ImageCropEditor already handles quality optimization (0.95 quality)
          console.log('🔄 Using edited image directly (already optimized by crop editor)');

          // Extract base64 from the edited image (remove data: prefix)
          const finalBase64 = editedBase64.replace(/^data:image\/[a-z]+;base64,/, '');
          const fullDataUrl = editedBase64; // Keep the full data URL for preview

          console.log('✅ Processed image:', {
            originalLength: editedBase64.length,
            finalLength: finalBase64.length,
            hasDataPrefix: editedBase64.startsWith('data:'),
          });

          // Update form data
          setFormData((currentFormData) => {
            const newData = {
              ...currentFormData,
              [`${currentEditingImage.type}_base64`]: finalBase64,
            };

            // Update parent component if callback is provided
            if (onDataChange) {
              onDataChange(newData);
            }

            return newData;
          });

          // Update preview data
          setPreviewData((prev) => ({
            ...prev,
            [currentEditingImage.type]: fullDataUrl, // This is the full data URL for preview
          }));

          console.log('✅ Image saved successfully, closing editor');
        } catch (error) {
          console.error('❌ Failed to save edited image:', error);
          alert('Failed to save edited image. Please try again.');
        }

        return null; // Close editor
      });
    },
    [onDataChange],
  );

  const handleCancelEdit = useCallback(() => {
    console.log('🚫 Canceling image edit');
    setEditingImage(null);
  }, []);

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent, field: 'thumbnail' | 'banner') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, field: 'thumbnail' | 'banner') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(prev => ({ ...prev, [field]: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, field: 'thumbnail' | 'banner') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(prev => ({ ...prev, [field]: false }));

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(field, imageFile);
    }
  }, [handleImageUpload]);

  return (
    <div className="flex gap-6 max-w-full mx-auto">
      {/* Left side - Upload Options */}
      <div className="flex-1">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Style your channel</h2>
          <p className="text-zinc-400">
            Adding visual flair will catch new members attention and help establish your channel's
            culture! You can update this at any time.
          </p>
        </div>

        <div className="space-y-6">
          {/* Banner Upload */}
          <div>
            <label className="text-lg font-medium text-white mb-3 block">Banner</label>
            <div
              onDragOver={(e) => handleDragOver(e, 'banner')}
              onDragLeave={(e) => handleDragLeave(e, 'banner')}
              onDrop={(e) => handleDrop(e, 'banner')}
              className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                dragOver.banner
                  ? 'border-[#eafd66] bg-[#eafd66]/10'
                  : previewData.banner
                  ? 'border-zinc-500 bg-zinc-800/50'
                  : 'border-zinc-600 hover:border-[#eafd66] bg-zinc-800/30'
              }`}
              onClick={() => handleFileSelect('banner')}
            >
              {previewData.banner ? (
                <div className="relative w-full h-full group">
                  <img
                    src={
                      previewData.banner.startsWith('data:')
                        ? previewData.banner
                        : `data:image/jpeg;base64,${previewData.banner}`
                    }
                    alt="Banner preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs">Change Banner</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-zinc-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <div className="text-zinc-300 font-medium mb-1">Add Banner</div>
                  <div className="text-xs text-zinc-500">Click or drag & drop</div>
                </div>
              )}
            </div>
            {previewData.banner && (
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => handleEditImage('banner')}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  편집
                </Button>
                <button
                  onClick={() => handleImageRemove('banner')}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Remove banner
                </button>
              </div>
            )}
          </div>

          {/* Icon Upload */}
          <div>
            <label className="text-lg font-medium text-white mb-3 block">Icon</label>
            <div
              onDragOver={(e) => handleDragOver(e, 'thumbnail')}
              onDragLeave={(e) => handleDragLeave(e, 'thumbnail')}
              onDrop={(e) => handleDrop(e, 'thumbnail')}
              className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                dragOver.thumbnail
                  ? 'border-[#eafd66] bg-[#eafd66]/10'
                  : previewData.thumbnail
                  ? 'border-zinc-500 bg-zinc-800/50'
                  : 'border-zinc-600 hover:border-[#eafd66] bg-zinc-800/30'
              }`}
              onClick={() => handleFileSelect('thumbnail')}
            >
              {previewData.thumbnail ? (
                <div className="relative w-full h-full group">
                  <img
                    src={
                      previewData.thumbnail.startsWith('data:')
                        ? previewData.thumbnail
                        : `data:image/jpeg;base64,${previewData.thumbnail}`
                    }
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs">Change Icon</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-zinc-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <div className="text-zinc-300 font-medium mb-1">Add Icon</div>
                  <div className="text-xs text-zinc-500">Click or drag & drop</div>
                </div>
              )}
            </div>
            {previewData.thumbnail && (
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => handleEditImage('thumbnail')}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  편집
                </Button>
                <button
                  onClick={() => handleImageRemove('thumbnail')}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Remove icon
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="flex-1">
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 overflow-hidden">
          {/* Banner section */}
          <div className="h-32 bg-zinc-800 relative overflow-hidden">
            {previewData.banner ? (
              <img
                src={
                  previewData.banner.startsWith('data:')
                    ? previewData.banner
                    : `data:image/jpeg;base64,${previewData.banner}`
                }
                alt="Banner preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('❌ Banner preview error:', e);
                  console.error('❌ Banner src:', previewData.banner?.substring(0, 100));
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-zinc-700 to-zinc-600"></div>
            )}
          </div>

          {/* Channel info section */}
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full -mt-12 border-4 border-zinc-900 bg-zinc-700 flex items-center justify-center relative">
                {previewData.thumbnail ? (
                  <img
                    src={
                      previewData.thumbnail.startsWith('data:')
                        ? previewData.thumbnail
                        : `data:image/jpeg;base64,${previewData.thumbnail}`
                    }
                    alt="Channel icon"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      console.error('❌ Thumbnail preview error:', e);
                      console.error('❌ Thumbnail src:', previewData.thumbnail?.substring(0, 100));
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">r/</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  r/{step1Data.name || 'adfadadfadfd'}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                  <span>1 member</span>
                  <span>•</span>
                  <span>1 online</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange('banner', e)}
        className="hidden"
      />
      <input
        ref={thumbnailInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange('thumbnail', e)}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* 이미지 편집 모달 */}
      {editingImage && (
        <ImageCropEditor
          src={editingImage.src}
          type={editingImage.type}
          onSave={handleSaveEditedImage}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
