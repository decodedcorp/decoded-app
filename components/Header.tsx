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
import PersonIcon from "@mui/icons-material/Person";

const headers = ["home", "artist", "brand", "explore"];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
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
        className={`fixed w-full bg-[#242424] p-4 transition-all duration-500 ${
          isScrolled ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="grid grid-cols-3 items-center w-full p-2">
          <Logo isScrolled={isScrolled} />
          <MenuSection
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="flex w-full justify-end">
            {!isSearchOpen ? (
              <SearchIcon
                className="cursor-pointer"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                }}
              />
            ) : (
              <CloseIcon onClick={() => setIsSearchOpen(!isSearchOpen)} />
            )}
            <PersonIcon className="ml-4 cursor-pointer" />
          </div>
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
      className={`flex w-full transition-all duration-300 ${
        isScrolled ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-[150px] h-[30px]">
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
      <nav className="flex justify-center w-full text-white">
        <ul className="hidden md:flex flex-row gap-5 justify-end pr-1 items-center">
          {headers.map((header, index) => {
            return (
              <li
                key={index}
                className={`list-none transition-all duration-100 ease-in-out hover:scale-100 ${
                  header === "home"
                    ? pathname === "/"
                      ? "text-white"
                      : "text-white/50"
                    : currentPath === header
                      ? "text-white"
                      : "text-white/50"
                }`}
              >
                <Link
                  href={header === "home" ? "/" : `/${header}`}
                  prefetch={false}
                  className={`${semi_bold_font.className} text-lg`}
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
  const [keywords, setKeywords] = useState<String[] | null>(null);
  const router = useRouter();
  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
  };

  useEffect(() => {
    // TODO: Replace mock
    setKeywords([
      "제니가 착용했던 아이템들",
      "로제",
      "다니엘",
      "민지",
      "리사가 착용했던 루이비통",
      "민지가 착용했던 스투시",
      "래퍼들이 착용한 시계 아이템들",
    ]);
  }, []);

  return (
    <div
      className={`fixed w-full justify-center bg-[#242424] z-50 mt-10 ${
        semi_bold_font.className
      } border-b border-gray-400/50 transition-all duration-300 ease-in-out h-96 ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-2 p-10 w-full h-full flex flex-col justify-center items-center">
        {/* Search Bar */}
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
                placeholder="아티스트, 브랜드로 검색해보세요"
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
        {/* Keywords */}
        <div
          className={`${semi_bold_font.className} flex flex-wrap w-full md:w-[70%] justify-center mt-5`}
        >
          {keywords?.map((keyword, index) => {
            return (
              <div
                key={index}
                className="w-fit rounded-2xl border-2 border-white/50 m-2 p-2"
              >
                {keyword}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Header;
