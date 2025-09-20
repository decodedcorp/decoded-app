import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { PostButton } from '@/components/PostButton';

interface ContentUploadFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  canSubmit: boolean;
}

export function ContentUploadFooter({
  onCancel,
  onSubmit,
  isLoading,
  canSubmit,
}: ContentUploadFooterProps) {
  const t = useCommonTranslation();

  return (
    <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-zinc-700/50">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
      >
        {t.globalContentUpload.contentUpload.footer.cancel()}
      </button>

      <PostButton
        onClick={() => {
          console.log('=== Footer submit button clicked ===');
          console.log('onSubmit function:', typeof onSubmit);
          onSubmit();
        }}
        disabled={!canSubmit}
        isLoading={isLoading}
        variant="primary"
        size="md"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="mr-2">
          <path
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t.globalContentUpload.contentUpload.footer.addLink()}
      </PostButton>
    </div>
  );
}
