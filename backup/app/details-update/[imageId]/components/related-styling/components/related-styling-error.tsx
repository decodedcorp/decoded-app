export function RelatedStylingError({ error }: { error: any }) {
  return (
    <div className="w-full py-8 text-center">
      <div className="text-zinc-400 mb-2">
        {error instanceof Error
          ? error.message
          : '이미지를 불러오는 중 오류가 발생했습니다.'}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 mt-2 bg-zinc-800 rounded-md text-zinc-200 hover:bg-zinc-700 transition-colors"
      >
        새로고침
      </button>
    </div>
  );
} 