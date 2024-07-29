"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { bold_font, regular_font } from "@/components/helpers/util";
import { LoginModal } from "./ui/modal";
import SearchBar from "./ui/search";
import white_logo from "@/assets/white_logo.png";
import black_logo from "@/assets/black_logo.png";

const headers = ["home", "news", "login", "search"];

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const [koreanTime, setKoreanTime] = useState("");
  const [usTime, setUsTime] = useState("");

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
        {/* <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          alert("Coming Soon!");
        }}
      >
        {isLogin ? (
          <AddIcon className="w-10 h-10 bg-[#FF204E] rounded-xl" />
        ) : (
          <div></div>
        )}
      </div> */}
        <MenuSection isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </header>
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
}: {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const cleanedPath = pathname.replace(/^\//, "");
  const [currentPath, setCurrentPath] = useState(cleanedPath);

  return (
    <nav className="w-full justify-end hidden md:block text-white">
      <ul className="flex flex-row gap-3 justify-end pr-1">
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
              >
                {header.toUpperCase()}
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

export default Header;
