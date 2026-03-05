"use client";

export function StudioLoader() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
      {/* Neon progress bar */}
      <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#eafd67] rounded-full animate-pulse"
          style={{
            animation: "loader-slide 1.5s ease-in-out infinite",
          }}
        />
      </div>
      <p className="text-white/40 text-xs tracking-wider">
        Loading your studio...
      </p>

      <style jsx>{`
        @keyframes loader-slide {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 60%;
            margin-left: 20%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
