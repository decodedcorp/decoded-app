export const mypage = {
  title: "마이페이지",
  tabs: {
    home: "홈",
    request: "요청",
    provide: "제공",
    like: "좋아요",
    notification: "알림",
  },
  home: {
    logout: "로그인 후 활동 내역을 확인할 수 있습니다.",
    empty: "아직 활동 내역이 없습니다",
    settings: "프로필 설정",
    activity: {
      points: "포인트",
      activityCounts: "활동권",
    },
    metricSections: {
      total: "전체",
      requests: "요청",
      provides: "제공",
      pending: "진행중",
      completed: "완료",
    },
    points: {
      title: "포인트",
      earned: "획득한 포인트",
      used: "사용한 포인트",
      history: "포인트 내역",
    },
    contributions: {
      title: "기여도",
      requests: "요청",
      offers: "제공",
      accuracy: "정확도",
    },
  },
  request: {
    empty: "아직 요청한 아이템이 없습니다",
    status: {
      pending: "대기중",
      inProgress: "진행중",
      completed: "완료",
      rejected: "거절됨",
    },
    filter: {
      all: "전체",
      pending: "대기중",
      inProgress: "진행중",
      completed: "완료됨",
    },
  },
  provide: {
    empty: "아직 제공한 링크가 없습니다",
    status: {
      active: "활성",
      inactive: "비활성",
      expired: "만료됨",
    },
  },
  like: {
    empty: "아직 좋아요한 아이템이 없습니다",
    categories: {
      all: "전체",
      items: "아이템",
      images: "이미지",
    },
  },
  notification: {
    messages: {
      item_provided: "아이템 제공",
      point_received: "포인트 획득",
      system_notice: "시스템 알림",
      request_approved: "요청 승인",
    },
    profile: {
      title: "프로필 설정",
      name: "이름",
      bio: "소개",
      image: "프로필 이미지",
    },
    account: {
      title: "계정 설정",
      email: "이메일",
      password: "비밀번호",
      delete: "계정 삭제",
    },
    notification: {
      title: "알림 설정",
      request: "요청 알림",
      offer: "제공 알림",
      marketing: "마케팅 알림",
    },
  },
} as const;
