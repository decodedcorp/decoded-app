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
    // API URL 설정을 콘솔에 출력하여 디버깅
    console.log('Current NODE_ENV:', process.env.NODE_ENV);
    
    const API_URL = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_DB_ENDPOINT      // https://api.decoded.style
      : process.env.NEXT_PUBLIC_LOCAL_DB_ENDPOINT; // https://dev.decoded.style
    
    console.log('Selected API_URL:', API_URL);

    const authClientId = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;
    const redirectUri = process.env.NODE_ENV === 'production'
      ? 'https://decoded.style'
      : process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (!API_URL) {
      throw new Error('Missing API_URL configuration');
    }

    this.config = {
      service: API_URL,
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
    retries = 3,
    accessToken?: string
  ): Promise<T> {
    let attempt = 0;
  
    while (attempt < retries) {
      try {
        const convertedData = convertKeysToSnakeCase(data);
        const url = `${this.config.service}/${path}`;
  
        const storedToken = accessToken || window.sessionStorage.getItem('ACCESS_TOKEN');
        
        const headers = {
          'Content-Type': 'application/json',
          ...(storedToken && { Authorization: `Bearer ${storedToken}` }),
        };

        const res = await axios.request<T>({
          url,
          method,
          data: convertedData,
          headers,
          maxRedirects: 0,
          validateStatus: (status) => true,
          timeout: 10000,
        });
  
        if (res.status === 401 && storedToken) {
          window.sessionStorage.clear();
          window.location.href = '/';
          throw new Error('Token expired');
        }
  
        if (!res.data) {
          throw new Error('응답 데이터가 비어있습니다');
        }
  
        return res.data;
      } catch (e) {
        attempt++;
  
        if (axios.isAxiosError(e)) {
          if (e.code === 'ERR_NETWORK') {
            throw new Error('서버 접근이 차단되었습니다. 관리자에게 문의하세요.');
          }

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

  /**
   * @method getTempToken
   * @description 임시 토큰을 가져오는 메서드
   * @returns {Promise<string>} 임시 토큰
   */
  public async getTempToken(): Promise<string> {
    try {
      const response = await this.request<{
        status_code: number;
        data?: {
          access_token: string;
        };
      }>('temp-token', 'GET', null, 3);

      if (response.status_code !== 200 || !response.data?.access_token) {
        throw new Error('Failed to get temporary token');
      }

      return response.data.access_token;
    } catch (error) {
      console.error('[Temp Token Error]', error);
      throw new Error('임시 토큰 발급에 실패했습니다');
    }
  }
}

export const networkManager = NetworkManager.getInstance();
