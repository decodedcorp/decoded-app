import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Google OAuth 토큰 교환
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code for tokens' },
        { status: 400 },
      );
    }

    const tokenData = await tokenResponse.json();

    // 사용자 정보 가져오기
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user information' }, { status: 400 });
    }

    const userInfo = await userInfoResponse.json();

    // TODO: 백엔드 API에 사용자 정보 전송하여 로그인 처리
    // const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     token: tokenData.access_token,
    //     email: userInfo.email,
    //   }),
    // });

    // 임시 응답 (백엔드 API가 준비되면 위의 TODO 부분으로 교체)
    const response = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        role: 'user',
        status: 'active',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json({ error: 'Failed to process authentication' }, { status: 500 });
  }
}
