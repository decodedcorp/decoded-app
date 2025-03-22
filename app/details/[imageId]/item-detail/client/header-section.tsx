'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

interface HeaderSectionProps {
  onClose: () => void;
}

export default function HeaderSection({ onClose }: HeaderSectionProps) {
  const router = useRouter();
  const params = useParams();
  const imageId = params.imageId as string;

  const handleBack = () => {
    onClose();
    
    setTimeout(() => {
      if (imageId) {
        router.push(`/details/${imageId}`);
      }
    }, 300);
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
