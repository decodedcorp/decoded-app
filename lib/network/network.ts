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
    const isDevMode = process.env.NODE_ENV === 'development';
    let retry = 0;

    while (retry <= retries) {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // Add token authentication if accessToken is provided
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        // Construct the full URL - 경로가 /로 시작하는지 확인하고 정규화
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const url = `${this.config.service}${normalizedPath}`;
        
        if (isDevMode && retry === 0) {
          const sensitiveDataPlaceholder = data ? "(data)" : "no data";
          console.log(`[NetworkManager] ${method} request to ${url} with ${sensitiveDataPlaceholder}`);
        }

        // Make the request
        const response = await axios({
          method,
          url,
          data: data ? JSON.stringify(data) : undefined,
          headers,
          timeout: 10000, // 10 seconds timeout
        });

        return response.data;
      } catch (error: any) {
        retry++;

        if (retry > retries) {
          // 명시적인 409 응답
          if (error.response?.status === 409) {
            return undefined;
          }

          if (axios.isAxiosError(error)) {
            // Handle specific HTTP errors
            if (error.response) {
              // Request was made and server responded with a status code outside of 2xx range
              if (isDevMode) {
                console.error(
                  `[NetworkManager] Server returned ${error.response.status}: ${
                    error.response.statusText
                  } from ${path}`,
                  error.response.data
                );
              }
            } else if (error.request) {
              // Request was made but no response was received
              if (isDevMode) {
                console.error("[NetworkManager] No response received", error.message);
              }
            } else {
              // Something happened in setting up the request
              if (isDevMode) {
                console.error("[NetworkManager] Request setup error", error.message);
              }
            }
          } else {
            // Non-Axios error
            if (isDevMode) {
              console.error("[NetworkManager] Network error", error);
            }
          }

          // CORS 또는 네트워크 에러인 경우 409 확인
          if (error.message === 'Network Error' && 
              (path.includes('/request/add') || path.includes('/provide/item/'))) {
            console.log('[NetworkManager] Possible conflict detected from network error');
            return undefined;
          }

          throw {
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message || "Request failed"
          };
        }
      }
    }
  }

  public async openIdConnectUrl(): Promise<{
    sk: string;
    randomness: string;
    exp: number;
    url: string;
  }> {
    try {
      const isDevMode = process.env.NODE_ENV === 'development';
      if (isDevMode) {
        console.log("[NetworkManager] Generating OpenID Connect URL...");
      }
      
      // Check if we have a cached URL that's still valid
      const cachedUrl = sessionStorage.getItem('CACHED_OAUTH_URL');
      const cachedExpiry = sessionStorage.getItem('CACHED_OAUTH_EXPIRY');
      
      if (cachedUrl && cachedExpiry) {
        const expiryTime = parseInt(cachedExpiry, 10);
        // If we have a cached URL that's less than 5 minutes old, use it
        if (Date.now() < expiryTime) {
          if (isDevMode) {
            console.log("[NetworkManager] Using cached OpenID Connect URL");
          }
          
          return JSON.parse(cachedUrl);
        }
      }
      
      const epk = Ed25519Keypair.generate();
      const randomness = generateRandomness();
      
      // Get the Sui client and fetch system state - this can be slow
      const rpcUrl = getFullnodeUrl("devnet");
      const suiClient = new SuiClient({ url: rpcUrl });
      
      // Use cached epoch value if available to speed things up
      let maxEpoch;
      const cachedEpoch = sessionStorage.getItem('CACHED_SUI_EPOCH');
      
      if (cachedEpoch && !isNaN(parseInt(cachedEpoch, 10))) {
        // Use cached epoch value but increment it to ensure it's valid
        maxEpoch = parseInt(cachedEpoch, 10) + 1;
        if (isDevMode) {
          console.log("[NetworkManager] Using cached epoch value:", maxEpoch);
        }
      } else {
        // Need to fetch the latest epoch - this can be slow
        const suiSysState = await suiClient.getLatestSuiSystemState();
        const currentEpoch = suiSysState.epoch;
        maxEpoch = parseInt(currentEpoch) + 10;
        
        // Cache the calculated maxEpoch for future use
        sessionStorage.setItem('CACHED_SUI_EPOCH', maxEpoch.toString());
      }

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
      
      if (isDevMode) {
        console.log("[NetworkManager] Generated OpenID Connect URL:", url);
      }

      const result = {
        sk: epk.getSecretKey(),
        randomness,
        exp: maxEpoch,
        url,
      };
      
      // Cache the result for 5 minutes
      sessionStorage.setItem('CACHED_OAUTH_URL', JSON.stringify(result));
      sessionStorage.setItem('CACHED_OAUTH_EXPIRY', (Date.now() + 5 * 60 * 1000).toString());
      
      return result;
    } catch (error) {
      console.error(
        "[NetworkManager] Error generating OpenID Connect URL:",
        error
      );
      throw error;
    }
  }

  public async getTempToken(): Promise<string> {
    const isDevMode = process.env.NODE_ENV === 'development';
    
    try {
      // 임시 토큰 생성 시도
      let tempToken = "";
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!tempToken && retryCount < maxRetries) {
        try {
          // 임시 토큰 가져오기 시도
          if (isDevMode) {
            console.log(`[NetworkManager] Getting temporary token (attempt ${retryCount + 1}/${maxRetries})...`);
          }
          
          // 토큰 가져오기 요청
          const response = await this.request<{ token: string }>(
            "/api/auth/temp-token",
            "GET",
            null
          );
          
          if (response?.token) {
            tempToken = response.token;
            if (isDevMode) {
              console.log("[NetworkManager] Temporary token acquired successfully");
            }
          } else {
            if (isDevMode) {
              console.warn("[NetworkManager] Failed to get temporary token - empty response");
            }
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          if (isDevMode) {
            console.error("[NetworkManager] Error getting temporary token:", error);
          }
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!tempToken) {
        throw new Error("Failed to get temporary token after retries");
      }
      
      return tempToken;
    } catch (error) {
      console.error("[NetworkManager] Error getting temporary token:", error);
      throw error;
    }
  }
}

export const networkManager = NetworkManager.getInstance();
