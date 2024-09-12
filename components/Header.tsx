"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { regular_font, semi_bold_font } from "@/components/helpers/util";
import white_logo from "@/assets/white_logo.png";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

const headers = ["home", "search"];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [koreanTime, setKoreanTime] = useState("");
  const [usTime, setUsTime] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSearchOpen || isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen, isSidebarOpen]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // 한국 시간 포맷팅
      const koreanFormatter = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setKoreanTime(koreanFormatter.format(now));

      // 미국 (뉴욕) 시간 포맷팅
      const usFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setUsTime(usFormatter.format(now));
    };

    updateTime(); // 초기 시간 설정
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const isScrollingDown = scrollPosition > lastScrollTop;

      if (isScrollingDown) {
        setIsScrolled(true);
      } else if (!isScrollingDown) {
        setIsScrolled(false);
      }
      setLastScrollTop(scrollPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <>
      <header
        className={`fixed w-full p-4 transition-all duration-500 ${
          isScrolled ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="grid grid-cols-3 items-center">
          <div
            className={`flex flex-col text-sm md:text-lg ${regular_font.className} text-white`}
          >
            <div className="hidden md:block">SEL {koreanTime}</div>
            <div className="hidden md:block">NY {usTime}</div>
          </div>
          <Logo isScrolled={isScrolled} />
          <MenuSection
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </header>
      <SearchBar isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}

function Logo({ isScrolled }: { isScrolled: boolean }) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={`flex w-full justify-center transition-all duration-300 ${
        isScrolled ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-[200px] h-[50px]">
        <Image
          src={white_logo}
          alt="logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </Link>
  );
}

function MenuSection({
  isSearchOpen,
  setIsSearchOpen,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSearchOpen: boolean;
  isSidebarOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const cleanedPath = pathname.replace(/^\//, "");
  const [currentPath, setCurrentPath] = useState(cleanedPath);

  return (
    <>
      <nav className="w-full justify-end text-white relative">
        <ul className="hidden md:flex flex-row gap-3 justify-end pr-1 items-center text-white">
          {headers.map((header, index) => {
            if (header === "search") {
              return (
                <div
                  key={index}
                  className={`text-md cursor-pointer ${regular_font.className}`}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  SEARCH
                </div>
              );
            }
            return (
              <li
                key={index}
                className={`list-none transition-all duration-100 ease-in-out hover:scale-100 ${
                  header === "home"
                    ? pathname === "/"
                      ? "border-b-2 border-[#ffffff]"
                      : ""
                    : currentPath === header
                    ? "border-b-2 border-[#ffffff]"
                    : ""
                }`}
              >
                <Link
                  href={header === "home" ? "/" : `/${header}`}
                  prefetch={false}
                  className={`${regular_font.className} text-md`}
                  onClick={() => setCurrentPath(header)}
                >
                  {header.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* 모바일 메뉴 */}
        <div className="flex md:hidden justify-end items-center gap-4 text-white">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <SearchIcon className="text-2xl" />
          </button>
        </div>
      </nav>
    </>
  );
}

function SearchBar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    // 검색어를 인코딩하여 search 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed w-full justify-center bg-black z-50 ${
        semi_bold_font.className
      } border-b border-gray-400/50 transition-all duration-300 ease-in-out h-60 ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-2 p-10 w-full h-full flex flex-col justify-end items-center">
        <div className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex justify-center"
          >
            <div className="flex w-full md:w-[50%] border-b-2 border-white/50 mb-5">
              <input
                type="text"
                className="w-full py-2 text-xl bg-transparent focus:outline-none text-white "
                name="name"
                placeholder="검색어를 입력해주세요"
                title="검색어 입력"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn_ico del ml-5 cursor-pointer text-white"
                  onClick={() => setSearchQuery("")}
                >
                  <CloseIcon className="text-xl md:text-2xl" />
                </button>
              )}
              <button type="submit" className="ml-5 cursor-pointer text-white">
                <SearchIcon className="text-xl md:text-2xl" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Header;
