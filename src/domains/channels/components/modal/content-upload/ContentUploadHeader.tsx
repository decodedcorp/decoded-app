interface ContentUploadHeaderProps {
  onClose: () => void;
}

export function ContentUploadHeader({ onClose }: ContentUploadHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
      <div>
        <h2 className="text-xl font-semibold text-white">Upload Content</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Add new content to your channel
        </p>
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