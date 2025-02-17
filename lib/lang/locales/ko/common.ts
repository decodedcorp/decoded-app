export const common = {
  actions: {
    next: '다음',
    prev: '이전',
    submit: '제출',
    cancel: '취소',
    confirm: '확인',
    complete: '완료',
    more: '더보기',
    less: '접기',
    provide: '제공하기',
    request: '요청하기',
    provideLink: '링크 제공하기',
    addItem: '아이템 추가',
    addLink: '링크 추가',
    login: {
      google: 'Google로 계속하기',
      facebook: 'Facebook으로 계속하기',
      apple: 'Apple로 계속하기',
    },
    logout: '로그아웃',
  },
  placeHolder: {
    description: '설명을 입력해주세요',
    directInput: '직접 입력해주세요',
  },
  status: {
    loading: '로딩중',
    success: '성공',
    error: '오류',
    warning: '경고',
    info: '안내',
    trending: '인기',
    messages: {
      success: {
        request: {
          title: '요청 성공',
          message: '요청이 성공적으로 완료되었습니다.',
        },
        provide: {
          title: '제공 성공',
          message: '제공이 성공적으로 완료되었습니다.',
        },
        save: {
          title: '저장 성공',
          message: '성공적으로 저장되었습니다.',
        },
      },
      error: {
        default: {
          title: '오류 발생',
          message: '문제가 발생했습니다. 다시 시도해 주세요.',
        },
        request: {
          title: '요청 실패',
          message: '요청 중 문제가 발생했습니다. 다시 시도해 주세요.',
        },
        provide: {
          title: '제공 실패',
          message: '제공 중 문제가 발생했습니다. 다시 시도해 주세요.',
        },
      },
      warning: {
        unsavedChanges: {
          title: '저장되지 않은 변경사항',
          message: '작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?',
        },
        delete: {
          title: '삭제 확인',
          message: '정말 삭제하시겠습니까?',
        },
        login: {
          title: '로그인 필요',
          message: '로그인이 필요한 서비스입니다.',
        },
        duplicate: {
          title: '중복 요청',
          message: '이미 요청한 아이템입니다.',
        },
      },
    },
  },
  validation: {
    required: '필수 입력항목',
    invalid: '잘못된 입력입니다',
    minLength: '최소 {{count}}자 이상 입력해주세요',
    maxLength: '최대 {{count}}자까지 입력 가능합니다',
  },
  time: {
    now: '방금 전',
    minutesAgo: '{{count}}분 전',
    hoursAgo: '{{count}}시간 전',
    daysAgo: '{{count}}일 전',
  },
  errors: {
    noItems: '상품 정보를 찾을 수 없습니다',
    dataFetchFailed: '데이터를 불러오는데 실패했습니다.',
    brandNotFound: '브랜드 정보를 찾을 수 없습니다.',
    loginRequired: '로그인이 필요한 서비스입니다.',
    unknownError: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    invalidFileType: '지원하지 않는 파일 형식입니다.',
    fileSizeExceeded: '파일 크기는 {{count}}MB 이하여야 합니다.',
    contextOptionFetchFailed: '옵션을 불러오는데 실패했습니다.',
  },
  terminology: {
    trending: '인기',
    exposureRate: '노출률',
    viewCount: '조회수',
    request: '요청',
    provide: '제공',
  },
} as const;
