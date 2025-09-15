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
  return (
    <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-zinc-700/50">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
      >
        Cancel
      </button>

      <button
        onClick={() => {
          console.log('=== Footer submit button clicked ===');
          console.log('onSubmit function:', typeof onSubmit);
          onSubmit();
        }}
        disabled={isLoading || !canSubmit}
        className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-zinc-700 hover:border-zinc-600"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
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
            <span>Add Link</span>
          </>
        )}
      </button>
    </div>
  );
}
