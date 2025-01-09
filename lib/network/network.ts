'use client';

import { convertKeysToSnakeCase } from '@/lib/utils/object/object';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateRandomness, generateNonce } from '@mysten/zklogin';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import axios from 'axios';

/**
 * @class NetworkManager
 * @description Singleton class for network management
 */
export class NetworkManager {
  private static instance: NetworkManager;
  private readonly config: {
    /**
     * @property {string} service - service endpoint root URL
     */
    service: string;
    /**
     * @property {string} auth_client_id - Google auth client ID
     */
    auth_client_id: string;
    /**
     * @property {string} redirect_uri - Google redirect URI
     */
    redirect_uri: string;
  };

  private constructor() {
    // 환경 변수 체크 로직 개선
    const serviceEndpoint = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;
    const authClientId = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    // 필수 환경 변수 누락 시 에러 메시지 상세화
    const missingVars = [];
    if (!serviceEndpoint) missingVars.push('NEXT_PUBLIC_SERVICE_ENDPOINT');
    if (!authClientId) missingVars.push('NEXT_PUBLIC_AUTH_CLIENT_ID');
    if (!redirectUri) missingVars.push('NEXT_PUBLIC_REDIRECT_URI');

    if (missingVars.length > 0) {
      console.error(`Missing environment variables: ${missingVars.join(', ')}`);
      // 개발 환경에서만 에러 throw
      if (process.env.NODE_ENV === 'development') {
        throw new Error(
          `Required environment variables are missing: ${missingVars.join(
            ', '
          )}`
        );
      }
    }

    this.config = {
      service: serviceEndpoint || '', // fallback 값 제공
      auth_client_id: authClientId || '',
      redirect_uri: redirectUri || '',
    };
  }

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public async request<T = any>(
    path: string,
    method: string,
    data: any = null,
    retries = 3
  ): Promise<T> {
    let attempt = 0;

    while (attempt < retries) {
      try {
        // 중요 요청 정보만 로깅
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Request] ${method} ${path}`);
        }

        const convertedData = convertKeysToSnakeCase(data);
        const url = `${this.config.service}/${path}`;
        const res = await axios.request<T>({
          url,
          method,
          data: convertedData,
          headers: {
            'Content-Type': 'application/json',
          },
          maxRedirects: 0,
          validateStatus: (status) => true,
          timeout: 10000,
        });

        if (!res.data) {
          throw new Error('응답 데이터가 비어있습니다');
        }

        return res.data;
      } catch (e) {
        attempt++;

        if (axios.isAxiosError(e)) {
          // 네트워크 에러 시 중요 정보만 로깅
          console.error('[Network Error]', {
            status: e.response?.status,
            message: e.message,
            attempt,
          });

          if (
            e.code === 'ECONNABORTED' ||
            e.code === 'ETIMEDOUT' ||
            !e.response
          ) {
            if (attempt < retries) {
              const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
          }
        } else {
          console.error('[Unexpected Error]', e);
        }

        if (attempt === retries) {
          throw e;
        }
      }
    }

    throw new Error('모든 재시도 실패');
  }

  public async openIdConnectUrl(): Promise<{
    sk: string;
    randomness: string;
    exp: number;
    url: string;
  }> {
    try {
      const epk = Ed25519Keypair.generate();
      const randomness = generateRandomness();
      const rpcUrl = getFullnodeUrl('devnet');
      const suiClient = new SuiClient({
        url: rpcUrl,
      });
      const suiSysState = await suiClient.getLatestSuiSystemState();
      const currentEpoch = suiSysState.epoch;
      let maxEpoch: number = parseInt(currentEpoch) + 10;
      const nonce = generateNonce(epk.getPublicKey(), maxEpoch, randomness);
      const params = new URLSearchParams({
        client_id: this.config.auth_client_id,
        redirect_uri: this.config.redirect_uri,
        response_type: 'id_token',
        scope: 'openid',
        nonce: nonce,
      });
      const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
      return {
        sk: epk.getSecretKey(),
        randomness: randomness,
        exp: maxEpoch,
        url: url,
      };
    } catch (err) {
      throw new Error('Error on fetching nonce => ' + err);
    }
  }
}

export const networkManager = NetworkManager.getInstance();
