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
    // TODO: DELETE ME
    accessToken?: string
  ): Promise<T> {
    let attempt = 0;

    while (attempt < retries) {
      try {
        const url = `${this.config.service}/${path}`;
        const storedToken =
          accessToken || window.sessionStorage.getItem("ACCESS_TOKEN");

        const headers: Record<string, string> = {
          ...(storedToken && { Authorization: `Bearer ${storedToken}` }),
        };

        // FormData인 경우 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
        if (!(data instanceof FormData)) {
          headers["Content-Type"] = "application/json";
          data = convertKeysToSnakeCase(data);
        }

        console.log(`[NetworkManager] Sending request to: ${url}`);
        console.log("[NetworkManager] Request method:", method);
        console.log("[NetworkManager] Request data:", data);
        console.log("[NetworkManager] Request headers:", headers);

        const response = await axios.request<T>({
          url,
          method,
          data,
          headers,
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 300,
          timeout: 10000,
        });

        console.log("[NetworkManager] Response received:", response.data);

        return response.data;
      } catch (error) {
        attempt++;

        if (axios.isAxiosError(error)) {
          console.error("[NetworkManager] Axios error:", error.message);
          console.error("[NetworkManager] Axios error details:", {
            url: `${this.config.service}/${path}`,
            method,
            data,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${window.sessionStorage.getItem(
                "ACCESS_TOKEN"
              )}`,
            },
          });

          if (error.code === "ERR_NETWORK") {
            throw new Error(
              "[NetworkManager] Network error. Check your connection."
            );
          }

          if (
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT" ||
            !error.response
          ) {
            if (attempt < retries) {
              const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
              console.warn(`[NetworkManager] Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
          }
        }

        console.error(
          `[NetworkManager] Request failed after ${attempt} attempts`,
          error
        );
        throw error;
      }
    }

    throw new Error("[NetworkManager] All retry attempts failed.");
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
        redirect_uri: this.config.redirect_uri,
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
