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
    const SERVICE_ENDPOINT = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;
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
  ): Promise<T> {
    try {
      const url = `${this.config.service}/${path}`;
      const storedToken =
        accessToken || window.sessionStorage.getItem("ACCESS_TOKEN");

      const headers: Record<string, string> = {
        ...(storedToken && { Authorization: `Bearer ${storedToken}` }),
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
          validateStatus: (status) => status >= 200 && status < 300,
          timeout: 10000,
        });

        return response.data;
      } catch (error: any) {
        // 에러 응답 문자열에서 409 확인
        const errorString = error.toString();
        
        // net::ERR_FAILED 409 (Conflict) 패턴 확인
        if (errorString.match(/ERR_FAILED.*409|409.*Conflict/i)) {
          throw {
            status: 409,
            message: '이미 요청한 아이템입니다.',
          };
        }

        // 일반적인 에러 처리
        throw {
          status: error.response?.status || 500,
          message: error.response?.data?.message || error.message
        };
      }
    } catch (error: any) {
      // 이미 409로 처리된 에러는 그대로 전달
      if (error.status === 409) {
        throw error;
      }

      throw {
        status: 500,
        message: error.message || "[NetworkManager] Request failed"
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

      if (response.status_code !== 200 || !response.data?.access_token) {
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
