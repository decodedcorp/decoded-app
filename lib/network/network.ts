"use client";

import { convertKeysToSnakeCase } from "@/lib/utils/object/object";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { generateRandomness, generateNonce } from "@mysten/zklogin";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import axios from "axios";

/**
 * @class NetworkManager
 * @description Singleton class for network management
 */
export class NetworkManager {
  private static instance: NetworkManager;
  private readonly config: {
    service: string; // API endpoint URL
    auth_client_id: string; // Google Auth Client ID
    redirect_uri: string; // Google Redirect URI
  };

  private constructor() {
    // 환경 변수 디버깅을 위한 로그 추가
    console.log("[NetworkManager] Environment variables:", { 
      NODE_ENV: process.env.NODE_ENV,
      LOCAL_SERVICE_ENDPOINT: process.env.NEXT_PUBLIC_LOCAL_SERVICE_ENDPOINT,
      SERVICE_ENDPOINT: process.env.NEXT_PUBLIC_SERVICE_ENDPOINT
    });

    // 개발 환경에서는 LOCAL 엔드포인트, 다른 환경에서는 프로덕션 엔드포인트 사용
    const SERVICE_ENDPOINT = process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_LOCAL_SERVICE_ENDPOINT
      : process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;
    
    const authClientId = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || "";
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? "https://decoded.style"
        : process.env.NEXT_PUBLIC_REDIRECT_URI || "";

    if (!SERVICE_ENDPOINT) {
      throw new Error(
        "[NetworkManager] Missing `SERVICE_ENDPOINT` configuration"
      );
    }

    if (!authClientId) {
      throw new Error("[NetworkManager] Missing AUTH_CLIENT_ID configuration");
    }

    if (!redirectUri) {
      throw new Error("[NetworkManager] Missing REDIRECT_URI configuration");
    }

    this.config = {
      service: SERVICE_ENDPOINT,
      auth_client_id: authClientId,
      redirect_uri: redirectUri,
    };

    console.log("[NetworkManager] Initialized with config:", this.config);
  }

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public async request<T = any>(
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data: any = null,
    retries = 3,
    accessToken?: string
  ): Promise<T | undefined> {
    try {
      // 경로에서 앞뒤 슬래시 처리
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      const url = `${this.config.service}/${cleanPath}`;
      
      console.log(`[NetworkManager] Making ${method} request to: ${url}`);
      
      // 브라우저 환경에서만 세션 스토리지 접근
      const storedToken = typeof window !== 'undefined' 
        ? (accessToken || window.sessionStorage.getItem("ACCESS_TOKEN"))
        : accessToken;

      console.log(`[NetworkManager] Using token: ${storedToken ? "YES" : "NO"}`);
      
      // CORS 헤더 추가
      const headers: Record<string, string> = {
        ...(storedToken && { Authorization: `Bearer ${storedToken}` }),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      if (!(data instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        data = convertKeysToSnakeCase(data);
      }

      try {
        const response = await axios.request<T>({
          url,
          method,
          data,
          headers,
          maxRedirects: 0,
          validateStatus: (status) => status < 500,
          timeout: 10000,
          // CORS 이슈 방지를 위한 설정 추가
          withCredentials: false
        });

        console.log(`[NetworkManager] Response status: ${response.status}`);

        // 409 Conflict 처리
        if (response.status === 409) {
          console.log('[NetworkManager] Conflict response:', { path, method });
          return undefined;
        }

        return response.data;
      } catch (error: any) {
        // 자세한 오류 로깅 추가
        console.error('[NetworkManager] Request failed:', { 
          url,
          method,
          errorMessage: error.message,
          errorCode: error.code,
          responseStatus: error.response?.status,
          responseData: error.response?.data
        });

        // CORS 또는 네트워크 에러인 경우 409 확인
        if (error.message === 'Network Error' && 
            (path.includes('/request/add') || path.includes('/provide/item/'))) {
          console.log('[NetworkManager] Possible conflict detected from network error');
          return undefined;
        }

        throw error;
      }
    } catch (error: any) {
      console.error('[NetworkManager] Request error:', { 
        path, 
        method,
        error: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      });

      // 명시적인 409 응답
      if (error.response?.status === 409) {
        return undefined;
      }

      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "Request failed"
      };
    }
  }

  public async openIdConnectUrl(): Promise<{
    sk: string;
    randomness: string;
    exp: number;
    url: string;
  }> {
    try {
      console.log("[NetworkManager] Generating OpenID Connect URL...");
      const epk = Ed25519Keypair.generate();
      const randomness = generateRandomness();
      const rpcUrl = getFullnodeUrl("devnet");
      const suiClient = new SuiClient({ url: rpcUrl });
      const suiSysState = await suiClient.getLatestSuiSystemState();
      const currentEpoch = suiSysState.epoch;
      const maxEpoch = parseInt(currentEpoch) + 10;

      const nonce = generateNonce(epk.getPublicKey(), maxEpoch, randomness);

      const params = new URLSearchParams({
        client_id: this.config.auth_client_id,
        redirect_uri: `${window.location.origin}/auth/callback`,
        response_type: "id_token",
        scope: [
          "openid",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" "),
        nonce,
        prompt: "select_account",
      });

      const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
      console.log("[NetworkManager] Generated OpenID Connect URL:", url);

      return {
        sk: epk.getSecretKey(),
        randomness,
        exp: maxEpoch,
        url,
      };
    } catch (error) {
      console.error(
        "[NetworkManager] Error generating OpenID Connect URL:",
        error
      );
      throw new Error("Failed to generate OpenID Connect URL");
    }
  }

  public async getTempToken(): Promise<string> {
    try {
      console.log("[NetworkManager] Requesting temporary token...");
      const response = await this.request<{
        status_code: number;
        data?: {
          access_token: string;
        };
      }>("temp-token", "POST", {});

      console.log("[NetworkManager] Temporary token response:", response);

      if (!response || response.status_code !== 200 || !response.data?.access_token) {
        throw new Error("[NetworkManager] Failed to fetch temporary token.");
      }

      return response.data.access_token;
    } catch (error) {
      console.error("[NetworkManager] Temporary token error:", error);
      throw error;
    }
  }
}

export const networkManager = NetworkManager.getInstance();
