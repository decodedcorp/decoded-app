import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyGoogleToken, 
  extractGoogleUserInfo, 
  createHashedToken,
  generateSuiAddress 
} from '../../../../domains/auth/utils/jwtUtils';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Google OAuth 토큰 교환 - body와 headers 분리
    const tokenRequestBody = new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });

    const tokenRequestHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: tokenRequestHeaders,
      body: tokenRequestBody,
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange error:', errorData);
      return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const { access_token, id_token } = tokenData;

    if (!id_token) {
      return NextResponse.json({ error: 'No ID token received from Google' }, { status: 400 });
    }

    // Google JWT 토큰 검증
    const isValidToken = await verifyGoogleToken(id_token);
    if (!isValidToken) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 400 });
    }

    // Google 사용자 정보 추출
    const googleUserInfo = extractGoogleUserInfo(id_token);
    const { email } = googleUserInfo;

    // Google JWT 토큰을 해시하여 백엔드에 전송할 토큰 생성
    const hashedToken = createHashedToken(id_token);

    // Google OAuth 사용자를 위한 sui_address 생성 (이메일 기반)
    const suiAddress = `google_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // 백엔드 API 호출 - 백엔드 스펙에 맞춘 구조
    const backendRequestBody = {
      jwt_token: hashedToken, // 해시된 Google 토큰
      sui_address: suiAddress, // Google OAuth 사용자를 위한 고유 식별자
      email: email,
      marketing: false,
    };

    const backendRequestHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: backendRequestHeaders,
      body: JSON.stringify(backendRequestBody),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text();
      console.error('Backend login API error:', errorData);
      return NextResponse.json({ error: 'Backend login failed' }, { status: backendResponse.status });
    }

    const backendData = await backendResponse.json();

    // 성공 응답
    return NextResponse.json({
      access_token: backendData.access_token,
      refresh_token: backendData.refresh_token,
      user: backendData.user,
      token_type: 'oauth',
    });

  } catch (error) {
    console.error('Google OAuth API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
