import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthApi } from '@/domains/auth/api/googleAuthApi';
import { GoogleAuthLogger } from '@/domains/auth/utils/googleAuthLogger';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // 1. Google OAuth 토큰 교환
    const tokenData = await GoogleAuthApi.exchangeCodeForToken(code);
    const { id_token } = tokenData;

    if (!id_token) {
      return NextResponse.json({ error: 'No ID token received from Google' }, { status: 400 });
    }

    // 2. JWT 토큰 검증 및 디코딩
    const payload = GoogleAuthApi.decodeAndValidateToken(id_token);
    GoogleAuthLogger.logTokenPayload(payload);

    const { email, sub, iss, aud } = payload;

    // 3. 해시된 토큰 생성 및 임시 sui_address 생성 (백엔드 요구사항)
    const hashedToken = GoogleAuthApi.generateHashedToken(sub, iss, aud);
    const tempSuiAddress = GoogleAuthApi.generateSuiAddress(sub); // 임시 생성

    GoogleAuthLogger.logSuiAddressGeneration(sub, tempSuiAddress);

    // 4. 백엔드 API 요청 준비 (백엔드 요구사항으로 sui_address 포함)
    const backendRequestBody = {
      jwt_token: hashedToken,
      sui_address: tempSuiAddress, // 백엔드에서 필수로 요구
      email: email,
      marketing: false,
    };

    const hashInput = `${sub}${iss}${aud}`;
    GoogleAuthLogger.logBackendRequest(backendRequestBody, hashInput, hashedToken);

    // 5. 백엔드 로그인 API 호출 (sui_address 업데이트 포함)
    const backendData = await GoogleAuthApi.callBackendLoginWithSuiAddressUpdate(
      backendRequestBody,
    );
    GoogleAuthLogger.logBackendResponse(backendData);

    // 6. 사용자 객체 생성 또는 보완
    const user = GoogleAuthApi.createOrEnhanceUser(backendData, payload);
    GoogleAuthLogger.logUserCreation(user);

    // 7. 성공 응답
    return NextResponse.json({
      access_token: backendData.access_token,
      refresh_token: backendData.refresh_token,
      user: user,
      token_type: 'oauth',
    });
  } catch (error) {
    console.error('Google OAuth API error:', error);

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
