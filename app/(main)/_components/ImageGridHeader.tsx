import React from "react";

export function ImageGridHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="text-2xl font-bold text-yellow-300 tracking-tight">
          decoded
        </div>

        {/* Center: Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1/3 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-yellow-400 rounded-md leading-5 bg-black/30 text-white placeholder-neutral-400 focus:outline-none focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
              placeholder="Search"
              type="search"
            />
          </div>
        </div>

        {/* Right: Menu Button */}
        <div>
          <button
            type="button"
            className="p-2 rounded-md text-neutral-300 hover:text-white hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

// 명명된 export와 기본 export를 함께 사용할 수 있습니다.
// 여기서는 기본 export가 더 일반적이므로 사용합니다.
export default ImageGridHeader; 