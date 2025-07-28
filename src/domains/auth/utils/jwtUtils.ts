import { jwtDecode, JwtPayload } from 'jwt-decode';
import { jwtToAddress } from '@mysten/zklogin';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { sha256 } from 'js-sha256';

// Google OAuth JWT 타입
export interface GoogleJWT {
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  email: string;
  given_name: string;
}

const GOOGLE_ISSUER = 'https://accounts.google.com';
const BACKEND_ISSUER = 'decoded';

/**
 * 문자열을 SHA256으로 해시
 */
export const hash = (str: string): string => {
  return sha256(str).toString();
};

/**
 * Google ID 토큰 검증 (서명 포함)
 */
export async function verifyGoogleToken(token: string): Promise<boolean> {
  try {
    const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: GOOGLE_ISSUER,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    if (typeof payload.exp !== 'number') {
      console.error('Invalid token: `exp` field is not a number.');
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const ALLOWED_TIME_DRIFT = 5;

    if (payload.exp + ALLOWED_TIME_DRIFT < now) {
      console.debug(`Token expired. Exp: ${payload.exp}, Now: ${now}`);
      return false;
    }

    if (!payload.sub) {
      console.error('Invalid or missing sub field in token');
      return false;
    }

    return true;
  } catch (err: any) {
    console.error('Google token verification failed:', err.message);
    return false;
  }
}

/**
 * 백엔드 JWT 토큰 검증
 */
export function verifyJWT(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number; iss: string }>(token);

    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      console.error('Backend token expired');
      return false;
    }

    if (decoded.iss !== BACKEND_ISSUER) {
      console.error('Invalid token issuer');
      return false;
    }

    return true;
  } catch (err: any) {
    console.error('JWT verification failed:', err.message);
    return false;
  }
}

/**
 * Google JWT 토큰에서 사용자 정보 추출
 */
export function extractGoogleUserInfo(idToken: string): GoogleJWT {
  const decodedGoogle = jwtDecode<GoogleJWT>(idToken);
  const { sub, iss, aud, email, given_name } = decodedGoogle;

  if (!sub || !iss || !aud) {
    throw new Error('Missing required fields in decoded token');
  }

  return decodedGoogle;
}

/**
 * Google JWT 토큰을 해시하여 백엔드에 전송할 토큰 생성
 */
export function createHashedToken(idToken: string): string {
  const { sub, iss, aud } = extractGoogleUserInfo(idToken);
  const hashInput = `${sub}${iss}${aud}`;
  return hash(hashInput);
}

/**
 * Google JWT 토큰과 salt를 사용하여 Sui 주소 생성
 */
export function generateSuiAddress(idToken: string, salt: string): string {
  return jwtToAddress(idToken, salt);
}
