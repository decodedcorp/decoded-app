import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthApi } from '@/domains/auth/api/googleAuthApi';
import { GoogleAuthLogger } from '@/domains/auth/utils/googleAuthLogger';

export async function POST(request: NextRequest) {
  try {
    console.log('[Google OAuth API] Received request at:', new Date().toISOString());
    console.log('[Google OAuth API] Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      API_BASE_URL: process.env.API_BASE_URL || 'MISSING',
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'MISSING',
      GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      VERCEL_URL: process.env.VERCEL_URL || 'NOT_SET',
      REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'USING_FALLBACK',
    });

    // 환경 변수 검증
    if (!process.env.API_BASE_URL) {
      console.error('[Google OAuth API] API_BASE_URL is missing in production');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error('[Google OAuth API] GOOGLE_CLIENT_ID is missing');
      return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
      console.error('[Google OAuth API] GOOGLE_CLIENT_SECRET is missing');
      return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
    }

    const { code } = await request.json();
    console.log('[Google OAuth API] Authorization code:', {
      hasCode: !!code,
      codeLength: code?.length,
      codePreview: code ? code.substring(0, 10) + '...' : 'none',
    });

    if (!code) {
      console.error('[Google OAuth API] No authorization code provided');
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // 1. Google OAuth 토큰 교환
    console.log('[Google OAuth API] Starting token exchange with Google...');
    const tokenData = await GoogleAuthApi.exchangeCodeForToken(code);
    console.log('[Google OAuth API] Token exchange result:', {
      hasAccessToken: !!tokenData.access_token,
      hasIdToken: !!tokenData.id_token,
    });

    const { id_token } = tokenData;

    if (!id_token) {
      console.error('[Google OAuth API] No ID token received from Google');
      return NextResponse.json({ error: 'No ID token received from Google' }, { status: 400 });
    }

    // 2. JWT 토큰 검증 및 디코딩
    const payload = GoogleAuthApi.decodeAndValidateToken(id_token);
    GoogleAuthLogger.logTokenPayload(payload);

    const { email, sub, iss, aud } = payload;

    // 3. JWT 토큰 검증 및 임시 sui_address 생성 (백엔드 요구사항)
    const tempSuiAddress = GoogleAuthApi.generateSuiAddress(sub); // 임시 생성

    GoogleAuthLogger.logSuiAddressGeneration(sub, tempSuiAddress);

    // JWT 형식 검증
    const isJwt = (s: string) => /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(s);
    if (!isJwt(id_token)) {
      throw new Error('[LOGIN] id_token must be a valid JWT format');
    }

    console.log('[Google OAuth API] JWT token validation:', {
      isJwtFormat: isJwt(id_token),
      tokenLength: id_token.length,
      tokenPreview: id_token.substring(0, 20) + '...' + id_token.substring(id_token.length - 20),
      hasDots: (id_token.match(/\./g) || []).length,
      dotCount: (id_token.match(/\./g) || []).length,
      firstDotIndex: id_token.indexOf('.'),
      secondDotIndex: id_token.indexOf('.', id_token.indexOf('.') + 1),
    });

    // 4. 백엔드 API 요청 준비 (백엔드 요구사항으로 sui_address 포함)
    const hashInput = `${sub}${iss}${aud}`;
    const hashedToken = GoogleAuthApi.generateHashedToken(sub, iss, aud);

    const backendRequestBody: any = {
      jwt_token: hashedToken, // ✅ 해시된 토큰 사용 (loginUser 함수와 일치)
      sui_address: tempSuiAddress, // 백엔드에서 필수로 요구
      email: email,
      sub: sub, // Google의 고유 ID 추가 (백엔드에서 unique key로 사용할 가능성)
      marketing: false,
    };

    GoogleAuthLogger.logBackendRequest(backendRequestBody, hashInput, hashedToken);

    // 디버깅을 위한 추가 로그
    console.log('[Google OAuth API] Backend request body validation:', {
      hasJwtToken: !!backendRequestBody.jwt_token,
      jwtTokenLength: backendRequestBody.jwt_token?.length,
      jwtTokenIsHash: !isJwt(backendRequestBody.jwt_token || ''), // 해시이므로 JWT 형식이 아님
      jwtTokenPreview:
        backendRequestBody.jwt_token?.substring(0, 12) +
        '...' +
        backendRequestBody.jwt_token?.substring(backendRequestBody.jwt_token.length - 12),
      originalIdTokenLength: id_token.length,
      hashInput: hashInput,
      hasSuiAddress: !!backendRequestBody.sui_address,
      suiAddressLength: backendRequestBody.sui_address?.length,
      suiAddressFormat: backendRequestBody.sui_address?.startsWith('0x'),
      hasEmail: !!backendRequestBody.email,
      hasSub: !!backendRequestBody.sub,
      marketing: backendRequestBody.marketing,
    });

    // 5. 백엔드 로그인 API 호출 (sui_address 업데이트 포함)
    console.log('[Google OAuth API] Calling backend login API...');
    const backendData = await GoogleAuthApi.callBackendLoginWithSuiAddressUpdate(
      backendRequestBody,
    );
    console.log('[Google OAuth API] Backend login response:', {
      hasAccessToken: !!backendData.access_token,
      hasUser: !!backendData.user,
      hasRefreshToken: !!backendData.refresh_token,
    });
    GoogleAuthLogger.logBackendResponse(backendData);

    // 6. 사용자 객체 생성 또는 보완
    const user = GoogleAuthApi.createOrEnhanceUser(backendData, payload);
    console.log('[Google OAuth API] User created/enhanced:', {
      email: user.email,
      nickname: user.nickname,
      docId: user.doc_id,
    });
    GoogleAuthLogger.logUserCreation(user);

    // 7. 성공 응답
    const finalResponse = {
      access_token: backendData.access_token,
      refresh_token: backendData.refresh_token,
      user: user,
      token_type: 'oauth',
    };
    console.log('[Google OAuth API] Sending final response:', {
      hasAccessToken: !!finalResponse.access_token,
      hasUser: !!finalResponse.user,
      tokenType: finalResponse.token_type,
    });

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error('[Google OAuth API] Complete error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    });

    // 추가 상세 로깅
    if (error instanceof Error) {
      console.error('[Google OAuth API] Error name:', error.name);
      console.error('[Google OAuth API] Error cause:', error.cause);
    }

    // 에러 타입에 따른 적절한 응답
    if (error instanceof Error) {
      if (error.message.includes('Failed to exchange authorization code')) {
        return NextResponse.json(
          { error: 'Failed to exchange authorization code' },
          { status: 400 },
        );
      }
      if (error.message.includes('Invalid token format')) {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
      }
      if (error.message.includes('No email in token')) {
        return NextResponse.json({ error: 'No email in token' }, { status: 400 });
      }
      if (error.message.includes('Backend login failed')) {
        return NextResponse.json({ error: 'Backend login failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
