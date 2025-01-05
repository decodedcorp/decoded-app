'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface HeaderSectionProps {
  onClose: () => void;
}

export default function HeaderSection({ onClose }: HeaderSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const itemId = searchParams.get('itemId');

  const handleBack = () => {
    if (imageId) {
      router.push(`/details?imageId=${imageId}`);
    }
    onClose();
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={handleBack}
        className="text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    </div>
  );
}
