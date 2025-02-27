import { apiClient } from '../client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateRandomness, generateNonce } from '@mysten/zklogin';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

interface OpenIdConnectResponse {
  sk: string;
  randomness: string;
  exp: number;
  url: string;
}

interface TempTokenResponse {
  status_code: number;
  data?: {
    access_token: string;
  };
}

export const authService = {
  async getOpenIdConnectUrl(): Promise<OpenIdConnectResponse> {
    const authClientId = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;
    const redirectUri =
      process.env.NODE_ENV === 'production'
        ? 'https://decoded.style'
        : process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (!authClientId || !redirectUri) {
      throw new Error('Missing auth configuration');
    }

    const epk = Ed25519Keypair.generate();
    const randomness = generateRandomness();
    const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = parseInt(epoch) + 10;

    const nonce = generateNonce(epk.getPublicKey(), maxEpoch, randomness);
    const params = new URLSearchParams({
      client_id: authClientId,
      redirect_uri: redirectUri,
      response_type: 'id_token',
      scope: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      nonce,
    });

    return {
      sk: epk.getSecretKey(),
      randomness,
      exp: maxEpoch,
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
    };
  },

  async getTempToken(): Promise<string> {
    const response = await apiClient.post<TempTokenResponse>('temp-token');
    
    if (!response) {
      throw new Error('No response from server');
    }

    if (response.status_code !== 200 || !response.data?.access_token) {
      throw new Error('Failed to fetch temporary token');
    }

    return response.data.access_token;
  },
};
