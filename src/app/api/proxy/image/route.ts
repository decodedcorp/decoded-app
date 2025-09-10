import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// 품질 매핑 (품질 우선 모드)
const QUALITY_MAP = {
  low: 70,     // 기존 60 → 70으로 향상
  medium: 85,  // 기존 75 → 85로 향상  
  high: 95,    // 기존 85 → 95로 향상
  max: 100,    // 새로운 최고 품질 옵션
} as const;

// 사이즈 매핑 (품질 우선 모드)
const SIZE_MAP = {
  thumb: { width: 300, height: 300 },   // 기존 200 → 300으로 향상
  small: { width: 600, height: 600 },   // 기존 400 → 600으로 향상
  medium: { width: 1000, height: 1000 }, // 기존 800 → 1000으로 향상
  large: { width: 1600, height: 1600 },  // 기존 1200 → 1600으로 향상
  original: null, // 원본 크기 유지
} as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const size = searchParams.get('size') as keyof typeof SIZE_MAP | null;
    const quality = searchParams.get('quality') as keyof typeof QUALITY_MAP | null;
    const format = searchParams.get('format') || 'webp';
    const blur = searchParams.get('blur') === 'true';

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
    }

    // 허용된 도메인 체크 (보안)
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      'decoded-app.vercel.app',
      'decoded-app-git-main.vercel.app',
      'decoded-app-git-develop.vercel.app',
      // 테스트 도메인
      'test-image-server.com',
      // 한국 뉴스 사이트들
      'nateimg.co.kr',
      'thumbnews.nateimg.co.kr', 
      'news.nateimg.co.kr',
      'imgnews.naver.net',
      'imgnews.pstatic.net',
      'img.donga.com',
      'img.chosun.com',
      'img.hani.co.kr',
      'img.khan.co.kr',
      'img.kmib.co.kr',
      'img.mk.co.kr',
      'img.seoul.co.kr',
      'img.segye.com',
      'img.ytn.co.kr',
      // 소셜 미디어 및 일반적인 이미지 호스팅 서비스
      'i.ytimg.com',
      'img.youtube.com',
      'scontent.cdninstagram.com',
      'scontent-ssn1-1.cdninstagram.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'avatars.githubusercontent.com',
      'github.com',
      'raw.githubusercontent.com',
      // CDN 서비스들
      'cdn.pixabay.com',
      'images.pexels.com',
      'i.imgur.com',
      'imgur.com',
      'cloudinary.com',
      'amazonaws.com',
      's3.amazonaws.com',
      'googleusercontent.com',
      // 블로그 및 미디어 플랫폼
      'blog.naver.com',
      'blogfiles.naver.net',
      'postfiles.pstatic.net',
      'cafeptthumb-phinf.pstatic.net',
      'blogthumb-phinf.pstatic.net',
      'thumb.mt.co.kr',
      'thumb.mtstarnews.com',
      // 기타 이미지 서비스
      'image.dailyan.com',
      'img.etoday.co.kr',
      'img.hankyung.com',
      'img.etnews.com',
      'image.fnnews.com',
      'img.newsis.com',
      'photo.jtbc.joins.com',
      'img.sbs.co.kr',
      'img.kbs.co.kr',
      'img.mbc.co.kr',
      // 실패한 이미지들의 도메인 추가
      'biz.chosun.com',
      'image.ajunews.com',
      'cdn.nc.press',
      'talkimg.imbc.com',
      'newsimg.hankookilbo.com',
      'pickcon.co.kr',
      'image.msscdn.net',
      'blogthumb.pstatic.net',
      // 추가 문제 도메인
      'image.imnews.imbc.com',
      'cdn.kstarfashion.com',
      'scontent-ssn1-1.cdninstagram.com',
      // 더 많은 한국 뉴스 도메인
      'img.wowtv.co.kr',
      'img.tf.co.kr',
      'cdn.joongdo.co.kr',
      'img.insight.co.kr',
      'img.topstarnews.net',
      'img.asiae.co.kr',
    ];

    const url = new URL(imageUrl);
    const isAllowed = allowedDomains.some(
      (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`),
    );

    if (!isAllowed) {
      console.warn('Blocked image proxy request for:', imageUrl);
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    // 이미지 fetch (개선된 헤더와 에러 처리)
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        // Referer 추가 (많은 사이트에서 필요)
        'Referer': url.origin + '/',
      },
      // 타임아웃 추가
      signal: AbortSignal.timeout(15000), // 15초 타임아웃
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    
    // Sharp를 사용한 이미지 최적화
    let sharpInstance = sharp(Buffer.from(imageBuffer));
    
    // 메타데이터 확인
    const metadata = await sharpInstance.metadata();
    
    // 사이즈 조정 (품질 우선)
    if (size && size !== 'original' && SIZE_MAP[size]) {
      const targetSize = SIZE_MAP[size];
      if (targetSize) {
        // 원본 비율 유지하면서 리사이즈 (고품질 리샘플링)
        sharpInstance = sharpInstance.resize(targetSize.width, targetSize.height, {
          fit: 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3, // 최고 품질 리샘플링 알고리즘
        });
      }
    }
    
    // 블러 효과
    if (blur) {
      sharpInstance = sharpInstance.blur(8);
    }
    
    // 포맷 및 품질 설정 (품질 우선)
    const imageQuality = quality ? QUALITY_MAP[quality] : QUALITY_MAP.high;
    let outputBuffer: Buffer;
    let contentType: string;
    
    switch (format) {
      case 'jpeg':
        outputBuffer = await sharpInstance
          .jpeg({ 
            quality: imageQuality,
            progressive: true, // 점진적 로딩
            mozjpeg: true,     // 더 나은 압축
          })
          .toBuffer();
        contentType = 'image/jpeg';
        break;
      case 'png':
        outputBuffer = await sharpInstance
          .png({ 
            quality: imageQuality,
            progressive: true,
            compressionLevel: 6, // 품질과 압축의 균형
          })
          .toBuffer();
        contentType = 'image/png';
        break;
      case 'webp':
      default:
        outputBuffer = await sharpInstance
          .webp({ 
            quality: imageQuality,
            effort: 6,         // 최고 압축 효율
            smartSubsample: false, // 색상 정보 보존
            nearLossless: imageQuality >= 95, // 95 이상일 때 무손실에 가까운 압축
          })
          .toBuffer();
        contentType = 'image/webp';
        break;
    }

    // 응답 헤더 설정 (긴 캐시 시간으로 성능 최적화)
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Cache-Control', 'public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=31536000'); // 30일 브라우저, 1년 CDN
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', outputBuffer.byteLength.toString());
    headers.set('ETag', `"${outputBuffer.byteLength}-${imageQuality}-${size || 'original'}"`);
    
    // 품질 정보를 헤더에 추가 (디버깅용)
    headers.set('X-Image-Quality', imageQuality.toString());
    headers.set('X-Image-Size', size || 'original');
    headers.set('X-Original-Size', `${metadata.width}x${metadata.height}`);

    return new NextResponse(outputBuffer as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}