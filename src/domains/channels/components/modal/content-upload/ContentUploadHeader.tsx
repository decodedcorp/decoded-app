import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ContentUploadHeaderProps {
  onClose: () => void;
}

export function ContentUploadHeader({ onClose }: ContentUploadHeaderProps) {
  const t = useCommonTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="p-4 border-b border-zinc-700/50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white">{t.actions.add()} Content</h2>
            <p className="text-sm text-zinc-400 mt-1">{t.ui.addNewLink()}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors flex items-center justify-center flex-shrink-0"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-700/50">
      <div>
        <h2 className="text-xl font-semibold text-white">{t.actions.add()} Content</h2>
        <p className="text-sm text-zinc-400 mt-1">{t.ui.addNewLink()}</p>
      </div>

      <button
        onClick={onClose}
        className="w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
