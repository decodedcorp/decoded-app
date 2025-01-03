import { Button } from '@/components/ui/Button';
import {
  pretendardBold,
  pretendardSemiBold,
  pretendardRegular,
} from '@/lib/constants/fonts';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <div className="flex flex-col items-center mb-[60px] gap-4">
      <h1 className="text-4xl font-bold">{title || 'Untitled'}</h1>
      {description && (
        <p className="text-lg text-gray-600">{description}</p>
      )}
    </div>
  );
}
