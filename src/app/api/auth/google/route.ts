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

    // 개발 환경에서 토큰 페이로드 전체 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('[Google OAuth] Full token payload:', payload);
      console.log('[Google OAuth] Available fields:', Object.keys(payload));
    }

    const { email, name, given_name, family_name } = payload;

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
      name: name || given_name || family_name || email.split('@')[0], // ✅ name이 없으면 given_name, family_name, 또는 이메일 앞부분 사용
      marketing: false,
    };

    // 개발 환경에서 백엔드 요청 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('[Google OAuth] Backend request body:', backendRequestBody);
    }

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

    // 개발 환경에서 백엔드 응답 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('[Google OAuth] Backend response:', backendData);
    }

    // ✅ 백엔드 응답에 user 객체가 없는 경우 생성
    if (!backendData.user) {
      const extractedName = name || given_name || family_name || email.split('@')[0];

      backendData.user = {
        doc_id: backendData.access_token?.user_doc_id || null,
        email: email,
        nickname: extractedName,
        role: 'user', // 기본 역할
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('[Google OAuth] Created user object from token:', backendData.user);
      }
    } else {
      // ✅ 백엔드 응답에 name이 없는 경우 Google ID 토큰에서 추출한 name 사용
      if (!backendData.user.nickname && !backendData.user.name) {
        const extractedName = name || given_name || family_name || email.split('@')[0];
        backendData.user.nickname = extractedName;

        if (process.env.NODE_ENV === 'development') {
          console.log('[Google OAuth] Setting nickname from token:', extractedName);
        }
      }
    }

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
