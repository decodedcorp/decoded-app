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
    retries = 3,
    accessToken?: string
  ): Promise<T> {
    let attempt = 0;
  
    while (attempt < retries) {
      try {
        const convertedData = convertKeysToSnakeCase(data);
        const url = `${this.config.service}/${path}`;
  
        const res = await axios.request<T>({
          url,
          method,
          data: convertedData,
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          maxRedirects: 0,
          validateStatus: (status) => true,
          timeout: 10000,
        });
  
        if (res.status === 401 && accessToken) {
          console.warn('[401 Unauthorized] Access token expired');
          if (attempt < retries) {
            await this.refreshAccessToken();
            const newAccessToken = localStorage.getItem('access_token');
            if (newAccessToken) {
              return this.request(path, method, data, retries - attempt, newAccessToken);
            }
          }
        }
  
        if (!res.data) {
          throw new Error('응답 데이터가 비어있습니다');
        }
  
        return res.data;
      } catch (e) {
        attempt++;
  
        if (axios.isAxiosError(e)) {
          // CORS 에러 체크
          if (e.code === 'ERR_NETWORK') {
            console.error('[CORS Error] 서버 접근이 차단되었습니다', {
              status: e.response?.status,
              message: e.message,
              attempt,
            });
            throw new Error('서버 접근이 차단되었습니다. 관리자에게 문의하세요.');
          }

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
  
  /**
   * @method refreshAccessToken
   * @description 리프레시 토큰을 사용해 새로운 엑세스 토큰을 요청
   */
  private async refreshAccessToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다');
      }
  
      const url = `${this.config.service}/auth/refresh`;
      const res = await axios.post(url, { refresh_token: refreshToken });
  
      if (res.status === 200 && res.data.access_token) {
        localStorage.setItem('access_token', res.data.access_token);
        console.log('엑세스 토큰 갱신 성공');
      } else {
        throw new Error('엑세스 토큰 갱신 실패');
      }
    } catch (err) {
      console.error('[Token Refresh Error]', err);
      // 로그아웃 처리 또는 사용자에게 재로그인 요청
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    }
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
