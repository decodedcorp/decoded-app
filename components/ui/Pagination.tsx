export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2 mt-5">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`text-md md:text-lg px-3 py-1 rounded ${
            currentPage === page ? "text-white/80" : "text-gray-500"
          }`}
        >
          •
        </button>
      ))}
    </div>
  );
}
