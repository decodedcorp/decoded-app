import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Google OAuth 토큰 교환
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

    // 간단한 토큰 검증 (실제로는 Google의 공개키로 검증해야 함)
    const tokenParts = id_token.split('.');
    if (tokenParts.length !== 3) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    // 토큰 페이로드 디코딩
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    const { email } = payload;

    if (!email) {
      return NextResponse.json({ error: 'No email in token' }, { status: 400 });
    }

    // Google OAuth 사용자를 위한 sui_address 생성
    const suiAddress = `google_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // 백엔드 API 호출
    const backendRequestBody = {
      jwt_token: id_token, // Google ID 토큰을 그대로 전달
      sui_address: suiAddress,
      email: email,
      marketing: false,
    };

    const backendRequestHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: backendRequestHeaders,
      body: JSON.stringify(backendRequestBody),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text();
      console.error('Backend login API error:', errorData);
      return NextResponse.json(
        { error: 'Backend login failed' },
        { status: backendResponse.status },
      );
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
