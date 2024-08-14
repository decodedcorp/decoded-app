"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  bold_font,
  regular_font,
  semi_bold_font,
} from "@/components/helpers/util";
import { LoginModal } from "./ui/modal";
import white_logo from "@/assets/white_logo.png";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

const headers = ["home", "news", "search"];

function Header() {
  const [isLogin, setIsLogin] = useState(false);
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
            className={`flex flex-col text-lg md:text-2xl ${regular_font.className} text-white`}
          >
            <div className="text-lg md:text-xl">SEL {koreanTime}</div>
            <div className="text-lg md:text-xl">NY {usTime}</div>
          </div>
          <Logo isScrolled={isScrolled} />
          <MenuSection
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
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
      className={`flex w-full justify-center transition-all duration-300 ${
        isScrolled ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image src={white_logo} alt="logo" width={200} height={200} />
    </Link>
  );
}

function MenuSection({
  isLogin,
  setIsLogin,
  isSearchOpen,
  setIsSearchOpen,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
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
            if (header === "login") {
              return (
                <div
                  key={index}
                  className={`text-md cursor-pointer ${regular_font.className}`}
                  onClick={() =>
                    (
                      document.getElementById("my_modal_4") as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  {isLogin ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => setIsLogin(false)}
                    >
                      LOGOUT
                    </div>
                  ) : (
                    header.toUpperCase()
                  )}
                  <LoginModal setIsLogin={setIsLogin} />
                </div>
              );
            } else if (header === "search") {
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
          <button onClick={() => setIsSidebarOpen(true)}>
            <MenuIcon className="text-2xl" />
          </button>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <SearchIcon className="text-2xl" />
          </button>
        </div>
      </nav>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setCurrentPath={setCurrentPath}
      />
    </>
  );
}

function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  setCurrentPath,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentPath: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-[100vh] w-full bg-black/50 backdrop-blur-lg text-white transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="flex justify-end p-4">
        <button onClick={() => setIsSidebarOpen(false)}>
          <CloseIcon className="text-2xl" />
        </button>
      </div>
      <ul className="flex flex-col gap-4 p-4">
        {headers.map((header, index) => (
          <li
            key={index}
            className={`${regular_font.className} text-4xl border-b border-white`}
          >
            <Link
              href={header === "home" ? "/" : `/${header}`}
              onClick={() => {
                setCurrentPath(header);
                setIsSidebarOpen(false);
              }}
            >
              {header.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
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

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      const response = await fetch(
        `http://0.0.0.0:8080/search?name=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      console.log(data);
      console.log(data.status_code);
      if (data.status_code === 200) {
        // router.push(`/artists?name=${encodeURIComponent(data.data[0].name)}`);
        alert("Matching artist found");
        setIsOpen(false);
      } else {
        alert("No matching artist found");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("An error occurred while searching");
    }
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
            id="headerSearchForm"
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
                id="headerSearch"
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
