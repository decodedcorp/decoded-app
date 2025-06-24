export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-7xl bg-[#1A1A1A] rounded-lg shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 