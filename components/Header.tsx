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
import { color } from "@/components/helpers/color";

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
    const SCROLL_THRESHOLD = 200;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const isScrollingDown =
        scrollPosition > lastScrollTop && scrollPosition > SCROLL_THRESHOLD;

      if (isScrollingDown) {
        setIsScrolled(true);
      } else if (scrollPosition <= SCROLL_THRESHOLD) {
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
        className={`fixed w-full py-2 transition-all duration-300 bg-[${color.palette.gray900}]`}
        style={{ borderBottom: `1px solid ${color.palette.gray800}` }}
      >
        {/* Header top */}
        <div className={`${isScrolled ? "hidden" : ""}`}>
          <Logo isScrolled={isScrolled} />
        </div>
        {/* Header bottom */}
        <div className="flex justify-center items-center w-full p-2 md:p-4 grid grid-cols-3">
          {isScrolled && (
            <div className="flex">
              <Logo isScrolled={isScrolled} />
            </div>
          )}
          <div className={`${isScrolled ? "hidden" : ""}`}></div>
          <div className="flex w-full p-4 items-center">
            <MenuSection
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <div></div>
          </div>
          <SearchLoginMenu
            isScrolled={isScrolled}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
        </div>
      </header>
      <SearchBar
        isOpen={isSearchOpen}
        setIsOpen={setIsSearchOpen}
        isScrolled={isScrolled}
      />
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
        isScrolled ? "ml-4 justify-start " : "justify-center mt-4 md:p-8"
      }`}
    >
      <div
        className={`relative ${
          isScrolled
            ? "w-[100px] h-[30px] md:w-[200px] md:h-[50px]"
            : "w-[200px] h-[30px] md:w-[400px] md:h-[50px]"
        }`}
      >
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
      <nav className="flex justify-center w-full">
        <ul className="flex gap-5 justify-end pr-1 items-center">
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
                  className={`${semi_bold_font.className} text-sm md:text-lg`}
                  onClick={() => setCurrentPath(header)}
                >
                  {header.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function SearchLoginMenu({
  isScrolled,
  isSearchOpen,
  setIsSearchOpen,
}: {
  isScrolled: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex w-full p-4 justify-end">
      {!isSearchOpen ? (
        <SearchIcon
          className="cursor-pointer text-white mr-4"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        />
      ) : (
        <CloseIcon
          className="cursor-pointer text-white mr-4"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        />
      )}
      <PersonIcon
        className="cursor-pointer text-white mr-4"
        onClick={() => alert("Login not implemented yet")}
      />
      <MenuIcon className="cursor-pointer text-white" />
    </div>
  );
}

function SearchBar({
  isOpen,
  setIsOpen,
  isScrolled,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isScrolled: boolean;
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
      className={`fixed w-full justify-center bg-[${
        color.palette.gray900
      }] z-50 ${
        semi_bold_font.className
      } border-b border-gray-400/50 transition-all duration-300 ease-in-out ${
        isScrolled ? "h-[250px] mt-16 md:mt-24" : "h-[400px] mt-8 md:mt-32"
      } ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="flex flex-col h-full justify-center items-center">
        {/* Search Bar */}
        <div className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex justify-center"
          >
            <div
              className={`flex w-[80%] md:w-[50%] border-b-2 border-white/50 ${
                isScrolled ? "mt-10" : "mt-20"
              }`}
            >
              <input
                type="text"
                className="w-full py-2 text-base md:text-xl bg-transparent focus:outline-none text-white "
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
              <Link
                key={index}
                href={`/search?query=${keyword}`}
                prefetch={false}
                className="w-fit rounded-2xl border-2 border-white/50 m-2 p-2 text-sm md:text-base"
              >
                {keyword}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Header;
