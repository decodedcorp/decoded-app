"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Dispatch, SetStateAction } from "react";
import AddIcon from "@mui/icons-material/Add";
import { bold_font, regular_font } from "@/components/helpers/util";
import { LoginModal } from "./ui/modal";
import SearchBar from "./ui/search";

const headers = ["home", "news", "login", "search"];

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header>
      <div className="grid grid-cols-3 items-center border-t border-b border-black p-2">
        <div></div>
        <Logo />
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
      <SearchBar setSearch={setSearch} />
    </header>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      prefetch={false}
      className={`${bold_font.className} text-4xl text-center`}
    >
      DECODED
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
    <nav className="w-full justify-end hidden lg:block">
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
          }
          return (
            <li
              key={index}
              className={`list-none transition-all duration-100 ease-in-out hover:scale-100 ${
                header === "home"
                  ? pathname === "/"
                    ? "border-b-2 border-[#000000]"
                    : ""
                  : currentPath === header
                  ? "border-b-2 border-[#000000]"
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
