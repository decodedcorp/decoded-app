"use client";

import { useEffect, useState } from "react";
import { networkManager } from "@/lib/network/network";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { jwtToAddress } from "@mysten/zklogin";
import { usePathname } from "next/navigation";
import { hash } from "@/lib/utils/string/string";
import { jwtVerify, createRemoteJWKSet } from "jose";

// Google OAuth JWT 타입
interface GoogleJWT {
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  email: string;
  given_name: string;
}

const GOOGLE_ISSUER = "https://accounts.google.com";
const BACKEND_ISSUER = "decoded";

// Google ID 토큰 검증 (서명 포함)
async function verifyGoogleToken(token: string): Promise<boolean> {
  try {
    const JWKS = createRemoteJWKSet(
      new URL("https://www.googleapis.com/oauth2/v3/certs")
    );

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: GOOGLE_ISSUER,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    if (typeof payload.exp !== "number") {
      console.error("Invalid token: `exp` field is not a number.");
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const ALLOWED_TIME_DRIFT = 5;

    if (payload.exp + ALLOWED_TIME_DRIFT < now) {
      console.warn(`Token expired. Exp: ${payload.exp}, Now: ${now}`);
      return false;
    }

    if (!payload.sub) {
      console.error("Invalid or missing sub field in token");
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("Google token verification failed:", err.message);
    return false;
  }
}

function verifyJWT(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number; iss: string }>(token);

    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      console.error("Backend token expired");
      return false;
    }

    if (decoded.iss !== BACKEND_ISSUER) {
      console.error("Invalid token issuer");
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("JWT verification failed:", err.message);
    return false;
  }
}

export function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialized(true);
      return;
    }

    const userDocId = window.sessionStorage.getItem("USER_DOC_ID");
    const suiAccount = window.sessionStorage.getItem("SUI_ACCOUNT");
    const accessToken = window.sessionStorage.getItem("ACCESS_TOKEN");

    setIsLogin(!!(userDocId && suiAccount && accessToken));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    const hashTag = window.location.hash;
    if (!hashTag) return;

    const params = new URLSearchParams(hashTag.replace(/^#/, ""));
    const token = params.get("id_token");
    if (!token) return;

    const login = async (token: string) => {
      setIsLoading(true);
      try {
        console.log("[Login] Verifying Google token...");
        const isGoogleTokenValid = await verifyGoogleToken(token);
        if (!isGoogleTokenValid)
          throw new Error("[Login] Invalid Google token");

        // JWT 디코딩
        const decodedGoogle = jwtDecode<GoogleJWT>(token);
        console.log("[Login] Decoded Google token:", decodedGoogle);

        // 필요한 값 추출
        const { sub, iss, aud, email, given_name } = decodedGoogle;
        if (!sub || !iss || !aud) {
          throw new Error("[Login] Missing required fields in decoded token");
        }

        // 해싱
        const hashInput = `${sub}${iss}${aud}`;
        const hashedToken = hash(hashInput);
        console.log("[Hash Input]", hashInput);
        console.log("[Hashed Token]", hashedToken);

        // 백엔드 요청
        console.log("[Login] Requesting backend login...");
        const loginRes = await networkManager.request<{
          status_code: number;
          data: {
            salt: string;
            doc_id: string;
            access_token: string;
          };
        }>("user/login", "POST", {
          token: hashedToken,
          email,
          aka: given_name,
          agreement: {
            marketing: false,
            notification: false,
            tracking: false,
          },
        });

        console.log("[Login] Backend response:", loginRes);

        if (loginRes.status_code !== 200 || !loginRes.data) {
          throw new Error("[Login] Backend login failed");
        }

        // 백엔드 응답 데이터 저장
        const { salt, doc_id, access_token } = loginRes.data;
        const sui_acc = jwtToAddress(token, salt);

        window.sessionStorage.setItem("ACCESS_TOKEN", access_token);
        window.sessionStorage.setItem("USER_DOC_ID", doc_id);
        window.sessionStorage.setItem("SUI_ACCOUNT", sui_acc);

        window.sessionStorage.setItem("USER_EMAIL", email);

        console.log("[Login] Login successful, user session updated.");
        setIsLogin(true);
        window.history.replaceState(null, "", window.location.pathname);
      } catch (err: any) {
        console.error("[Login] Login failed:", err.message);
        window.sessionStorage.clear();
        setIsLogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    login(token);
  }, [pathName, isInitialized]);

  const handleGoogleLogin = async () => {
    if (!isInitialized || typeof window === "undefined") return;

    try {
      console.log("Fetching Google OpenID Connect URL...");
      const { sk, randomness, exp, url } =
        await networkManager.openIdConnectUrl();
      window.sessionStorage.setItem("EPK_SECRET", sk);
      window.sessionStorage.setItem("RANDOMNESS", randomness);
      window.sessionStorage.setItem("EXPIRED_AT", exp.toString());
      window.location.replace(url);
    } catch (error: any) {
      console.error("Google login error:", error.message);
    }
  };

  const handleDisconnect = () => {
    if (!isInitialized || typeof window === "undefined") return;

    console.log("Logging out...");
    window.sessionStorage.clear();
    setIsLogin(false);
    window.location.href = "/";
  };

  return {
    isLogin,
    isInitialized,
    isLoading,
    handleGoogleLogin,
    handleDisconnect,
  };
}
