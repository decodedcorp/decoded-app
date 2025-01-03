"use client";

import { networkManager } from "@/common/network";
import { LoginModal } from "./modal/LoginModal";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { jwtToAddress } from "@mysten/zklogin";
import { usePathname } from "next/navigation";
import { hash } from "@/common/util";

export function LoginButton() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(window.sessionStorage.getItem("USER_DOC_ID") !== null);
  }, []);

  useEffect(() => {
    const hashTag = window.location.hash;
    const login = async (token: string) => {
      const decoded_jwt = jwtDecode(token);
      const sub = decoded_jwt.sub;
      const iss = decoded_jwt.iss;
      const aud = decoded_jwt.aud;
      if (sub && iss && aud) {
        try {
          const res = await networkManager.request(
            `user/${hash(sub + iss + aud)}/login`,
            "GET",
            {}
          );
          const sui_acc = jwtToAddress(token, res.data.salt);
          const user_doc_id = res.data.user;
          const _ = await networkManager.request(
            `user/${user_doc_id}?aka=${sui_acc}`,
            "POST"
          );
          window.sessionStorage.setItem("USER_DOC_ID", user_doc_id);
          window.sessionStorage.setItem("SUI_ACCOUNT", sui_acc);
        } catch (err) {
          alert(err);
        } finally {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };
    if (hashTag) {
      const params = new URLSearchParams(hashTag.substring(1));
      const token = params.get("id_token");
      if (token) {
        login(token);
      }
    }
  }, [pathName]);

  const handleGoogleLogin = async () => {
    const { sk, randomness, exp, url } =
      await networkManager.openIdConnectUrl();
    window.sessionStorage.setItem("EPK_SECRET", sk);
    window.sessionStorage.setItem("RANDOMNESS", randomness);
    window.sessionStorage.setItem("EXPIRED_AT", exp.toString());
    window.location.replace(url);
  };

  const handleDisconnect = () => {
    window.sessionStorage.removeItem("USER_DOC_ID");
    window.sessionStorage.removeItem("SUI_ACCOUNT");
  };

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        loginButtonRef.current &&
        !loginButtonRef.current.contains(event.target as Node)
      ) {
        setIsLoginModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={loginButtonRef} className="relative flex items-center gap-3">
      {isLogin && (
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className={cn(
            "rounded-xl px-6 h-10",
            "bg-[#EAFD66]/90",
            "border-2 border-[#EAFD66]/20",
            "text-black font-semibold",
            "hover:bg-[#EAFD66]",
            "hover:border-[#EAFD66]/40 hover:scale-105",
            "transition-all duration-200 ease-out",
            "shadow-lg shadow-[#EAFD66]/20",
            "text-sm tracking-wide"
          )}
        >
          MY PAGE
        </button>
      )}
      <button
        onClick={isLogin ? handleDisconnect : handleGoogleLogin}
        className={cn(
          "rounded-xl px-6 h-10",
          isLogin
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-[#EAFD66]/90 hover:bg-[#EAFD66] text-black",
          "border-2",
          isLogin
            ? "border-white/20 hover:border-white/40"
            : "border-[#EAFD66]/20 hover:border-[#EAFD66]/40",
          "font-semibold",
          "hover:scale-105",
          "transition-all duration-200 ease-out",
          "shadow-lg",
          isLogin ? "shadow-white/10" : "shadow-[#EAFD66]/20",
          "text-sm tracking-wide"
        )}
      >
        {isLogin ? "DISCONNECT" : "CONNECT"}
      </button>
      {isLogin && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}
