import React, { useState, useRef } from 'react';
import { useMyProfile, useUpdateProfile, processProfileImage } from '../hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import { SimpleModal } from '@/lib/components/ui/modal/SimpleModal';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const user = useAuthStore((state) => state.user);
  const t = useProfileTranslation();
  const toastT = useTranslations('common.toast.profile');
  const { data: profileData, isLoading: profileLoading } = useMyProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState({
    aka: profileData?.aka || user?.nickname || '',
    sui_address: profileData?.sui_address || '',
    profile_image: null as File | null,
  });

  const [errors, setErrors] = useState({
    aka: '',
    sui_address: '',
    profile_image: '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    profileData?.profile_image_url || null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when profile data loads
  React.useEffect(() => {
    if (profileData) {
      setFormData({
        aka: profileData.aka || user?.nickname || '',
        sui_address: profileData.sui_address || '',
        profile_image: null,
      });
      setPreviewImage(profileData.profile_image_url || null);
    }
  }, [profileData, user]);

  const validateForm = () => {
    const newErrors = { aka: '', sui_address: '', profile_image: '' };
    let isValid = true;

    // Validate nickname
    if (!formData.aka.trim()) {
      newErrors.aka = t.editModal.validation.nicknameRequired();
      isValid = false;
    } else if (formData.aka.trim().length < 2) {
      newErrors.aka = t.editModal.validation.nicknameMinLength();
      isValid = false;
    } else if (formData.aka.trim().length > 50) {
      newErrors.aka = t.editModal.validation.nicknameMaxLength();
      isValid = false;
    }

    // Validate SUI address (optional)
    if (formData.sui_address.trim()) {
      const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/;
      if (!suiAddressRegex.test(formData.sui_address.trim())) {
        newErrors.sui_address = t.editModal.validation.suiAddressInvalid();
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageSelect = async (file: File) => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, profile_image: 'Please select an image file' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profile_image: 'Image must be less than 5MB' }));
        return;
      }

      // Clear error and create preview
      setErrors((prev) => ({ ...prev, profile_image: '' }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setFormData((prev) => ({ ...prev, profile_image: file }));
    } catch (error) {
      toast.error(toastT('updateFailed'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      let base64_profile_image: string | undefined;

      // Process image if selected
      if (formData.profile_image) {
        base64_profile_image = await processProfileImage(formData.profile_image);
      }

      // Prepare update data
      const updateData: any = {
        aka: formData.aka.trim() || null,
        sui_address: formData.sui_address.trim() || undefined,
      };

      if (base64_profile_image) {
        updateData.base64_profile_image = base64_profile_image;
      }

      updateProfile(updateData, {
        onSuccess: () => {
          onClose();
        },
      });
    } catch (error: any) {
      toast.error(error.message || toastT('updateFailed'));
    }
  };

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{t.editModal.title()}</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]"
      >
        {/* Profile Image */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-zinc-300">
                  {user?.nickname?.substring(0, 2).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#EAFD66] text-black rounded-full flex items-center justify-center hover:bg-[#d9ec55] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
            className="hidden"
          />
          {errors.profile_image ? (
            <p className="text-xs text-red-400 mt-2">{errors.profile_image}</p>
          ) : (
            <p className="text-xs text-zinc-500 mt-2">{t.editModal.imageHelper()}</p>
          )}
        </div>

        {/* Nickname */}
        <div>
          <label htmlFor="aka" className="block text-sm font-medium text-zinc-300 mb-2">
            {t.editModal.nicknameLabel()}
          </label>
          <input
            type="text"
            id="aka"
            value={formData.aka}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, aka: e.target.value }));
              if (errors.aka) {
                setErrors((prev) => ({ ...prev, aka: '' }));
              }
            }}
            className={`
                w-full px-4 py-3 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500
                focus:ring-1 transition-colors
                ${
                  errors.aka
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-zinc-700 focus:border-[#EAFD66] focus:ring-[#EAFD66]'
                }
              `}
            placeholder={t.editModal.nicknamePlaceholder()}
            maxLength={50}
            required
          />
          {errors.aka ? (
            <p className="text-xs text-red-400 mt-1">{errors.aka}</p>
          ) : (
            <p className="text-xs text-zinc-500 mt-1">{t.editModal.nicknameHelper()}</p>
          )}
        </div>

        {/* SUI Address */}
        <div>
          <label htmlFor="sui_address" className="block text-sm font-medium text-zinc-300 mb-2">
            {t.editModal.suiAddressLabel()}
          </label>
          <input
            type="text"
            id="sui_address"
            value={formData.sui_address}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, sui_address: e.target.value }));
              if (errors.sui_address) {
                setErrors((prev) => ({ ...prev, sui_address: '' }));
              }
            }}
            className={`
                w-full px-4 py-3 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500
                focus:ring-1 transition-colors font-mono
                ${
                  errors.sui_address
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-zinc-700 focus:border-[#EAFD66] focus:ring-[#EAFD66]'
                }
              `}
            placeholder={t.editModal.suiAddressPlaceholder()}
          />
          {errors.sui_address ? (
            <p className="text-xs text-red-400 mt-1">{errors.sui_address}</p>
          ) : (
            <p className="text-xs text-zinc-500 mt-1">{t.editModal.suiAddressHelper()}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {t.editModal.cancel()}
          </button>
          <button
            type="submit"
            disabled={isPending || profileLoading}
            className="flex-1 px-4 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black" />
                {t.editModal.saving()}
              </>
            ) : (
              t.editModal.saveChanges()
            )}
          </button>
        </div>
      </form>
    </SimpleModal>
  );
}
