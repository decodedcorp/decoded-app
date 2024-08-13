"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { bold_font, regular_font } from "@/components/helpers/util";
import { LoginModal } from "./ui/modal";
import white_logo from "@/assets/white_logo.png";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const headers = ["home", "news", "login", "search"];

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [koreanTime, setKoreanTime] = useState("");
  const [usTime, setUsTime] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          />
        </div>
      </header>
      <SearchLayer
        isOpen={isSearchOpen}
        setIsOpen={setIsSearchOpen}
        headerHeight={isScrolled ? 0 : 80}
      />
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
}: {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  isSearchOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const cleanedPath = pathname.replace(/^\//, "");
  const [currentPath, setCurrentPath] = useState(cleanedPath);

  return (
    <nav className="w-full justify-end hidden md:block text-white relative">
      <ul className="flex flex-row gap-3 justify-end pr-1 items-center">
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
    </nav>
  );
}

function SearchLayer({
  isOpen,
  setIsOpen,
  headerHeight,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  headerHeight: number;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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
      className={`search_layer ${isOpen ? "open" : ""}`}
      style={{
        display: isOpen ? "block" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: `${headerHeight * 2.5}px`,
        backgroundColor: "rgba(0, 0, 0, 1)",
        zIndex: 999,
        overflow: "auto",
      }}
    >
      <div
        className="cont_inner"
        style={{
          padding: "40px 20px",
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <div className="search_box">
          <form
            id="headerSearchForm"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div
              className="inputbox search"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="search"
                className="inp"
                id="headerSearch"
                name="name"
                placeholder="검색어를 입력해주세요."
                title="검색어 입력"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "20px",
                  fontSize: "24px",
                  border: "none",
                  borderBottom: "2px solid black",
                  background: "transparent",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn_ico del"
                  onClick={() => setSearchQuery("")}
                  style={{ marginLeft: "20px", cursor: "pointer" }}
                >
                  <CloseIcon style={{ fontSize: "30px" }} />
                </button>
              )}
              <button
                type="submit"
                className="btn_ico search"
                style={{ marginLeft: "20px", cursor: "pointer" }}
              >
                <SearchIcon style={{ fontSize: "30px" }} />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="sl_bg"
        onClick={() => setIsOpen(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      ></div>
    </div>
  );
}

export default Header;
