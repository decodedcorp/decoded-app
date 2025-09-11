// 중앙 집중식 i18n 훅 관리 시스템
// 모든 컴포넌트에서 통일된 방식으로 로케일 사용

import { useTranslation } from 'react-i18next';

// 공통으로 사용되는 번역 타입들
type CommonTranslations = {
  actions: {
    create: () => string;
    update: () => string;
    edit: () => string;
    delete: () => string;
    save: () => string;
    cancel: () => string;
    confirm: () => string;
    back: () => string;
    next: () => string;
    close: () => string;
    search: () => string;
    filter: () => string;
    refresh: () => string;
    reload: () => string;
    copy: () => string;
    share: () => string;
    download: () => string;
    upload: () => string;
    add: () => string;
    like: () => string;
    subscribe: () => string;
    unsubscribe: () => string;
    reset: () => string;
    saveChanges: () => string;
    clearAll: () => string;
  };
  status: {
    loading: () => string;
    saving: () => string;
    uploading: () => string;
    processing: () => string;
    success: () => string;
    error: () => string;
    ready: () => string;
    pending: () => string;
    completed: () => string;
    failed: () => string;
  };
  states: {
    subscribed: () => string;
    saving: () => string;
    subscribing: () => string;
    unsubscribing: () => string;
  };
  navigation: {
    home: () => string;
    channels: () => string;
    explore: () => string;
    library: () => string;
    bookmarks: () => string;
    settings: () => string;
    profile: () => string;
    help: () => string;
    about: () => string;
    contact: () => string;
  };
  time: {
    justNow: () => string;
    hoursAgo: (hours: number) => string;
    yesterday: () => string;
    daysAgo: (days: number) => string;
  };
  ui: {
    expand: () => string;
    collapse: () => string;
    fullscreen: () => string;
    openSidebar: () => string;
    closeSidebar: () => string;
    discoverChannels: () => string;
    loading: () => string;
    subscribers: () => string;
    posts: () => string;
    items: () => string;
    status: () => string;
    editors: () => string;
    created: () => string;
    updated: () => string;
    type: () => string;
    filters: () => string;
    hideFilters: () => string;
    byCardType: () => string;
    byCategory: () => string;
    addNewLink: () => string;
    basicInformation: () => string;
    updateChannelBasicInfo: () => string;
    channelName: () => string;
    enterChannelName: () => string;
    description: () => string;
    describeChannel: () => string;
    channelStatistics: () => string;
    contentItems: () => string;
  };
  header: {
    openMenu: () => string;
    openSearch: () => string;
    closeSearch: () => string;
  };
  search: {
    placeholder: () => string;
    channelPlaceholder: (channelName: string) => string;
    clearSearch: () => string;
    searchButton: () => string;
    searchingChannels: () => string;
    lookingForChannels: (query: string) => string;
    searchError: () => string;
    failedToSearch: () => string;
    channels: () => string;
    found: (count: number) => string;
    updatingResults: () => string;
    searching: () => string;
    searchErrorOccurred: () => string;
    noResultsFound: (query: string) => string;
    content: () => string;
    loadingMore: () => string;
    enterSearchTerm: () => string;
    searchForChannelsAndContent: () => string;
    searchTermTooShort: () => string;
    enterAtLeast2Characters: () => string;
    searchResultsFor: (query: string) => string;
    foundResultsInChannelsAndContent: () => string;
  };
  create: {
    create: () => string;
    createNewContent: () => string;
  };
  notifications: {
    notifications: () => string;
    marking: () => string;
    markAllAsRead: () => string;
    loadingNotifications: () => string;
    noNotifications: () => string;
    viewAllNotifications: () => string;
  };
  user: {
    userMenu: () => string;
    user: () => string;
    myPage: () => string;
    settings: () => string;
    logout: () => string;
  };
  feed: {
    section: {
      header: () => string;
      sub: () => string;
    };
    meta: {
      line: (params: { range: string; sort: string; count: number }) => string;
    };
    sort: {
      hot: () => string;
      new: () => string;
      top: () => string;
      hotTooltip: () => string;
      newTooltip: () => string;
      topTooltip: () => string;
    };
    filter: {
      by: () => string;
      today: () => string;
      thisWeek: () => string;
      allTime: () => string;
    };
    loadingContent: () => string;
    noPostsFound: () => string;
    tryDifferentFilter: () => string;
    exploreChannelsCta: () => string;
    failedToLoadPosts: () => string;
    tryAgain: () => string;
    showingPosts: (params: { count: number }) => string;
    of: (params: { total: number }) => string;
    badge: {
      justIn: () => string;
      trending: () => string;
    };
  };
};

// 통합된 Common 번역 훅 - TypeScript 타입 안전성 보장
export const useCommonTranslation = (): CommonTranslations => {
  const { t } = useTranslation('common');

  return {
    actions: {
      create: () => t('actions.create'),
      update: () => t('actions.update'),
      edit: () => t('actions.edit'),
      delete: () => t('actions.delete'),
      save: () => t('actions.save'),
      cancel: () => t('actions.cancel'),
      confirm: () => t('actions.confirm'),
      back: () => t('actions.back'),
      next: () => t('actions.next'),
      close: () => t('actions.close'),
      search: () => t('actions.search'),
      filter: () => t('actions.filter'),
      refresh: () => t('actions.refresh'),
      reload: () => t('actions.reload'),
      copy: () => t('actions.copy'),
      share: () => t('actions.share'),
      download: () => t('actions.download'),
      upload: () => t('actions.upload'),
      add: () => t('actions.add'),
      like: () => t('actions.like'),
      subscribe: () => t('actions.subscribe'),
      unsubscribe: () => t('actions.unsubscribe'),
      reset: () => t('actions.reset'),
      saveChanges: () => t('actions.saveChanges'),
      clearAll: () => t('actions.clearAll'),
    },
    status: {
      loading: () => t('status.loading'),
      saving: () => t('status.saving'),
      uploading: () => t('status.uploading'),
      processing: () => t('status.processing'),
      success: () => t('status.success'),
      error: () => t('status.error'),
      ready: () => t('status.ready'),
      pending: () => t('status.pending'),
      completed: () => t('status.completed'),
      failed: () => t('status.failed'),
    },
    states: {
      subscribed: () => t('states.subscribed'),
      saving: () => t('states.saving'),
      subscribing: () => t('states.subscribing'),
      unsubscribing: () => t('states.unsubscribing'),
    },
    navigation: {
      home: () => t('navigation.home'),
      channels: () => t('navigation.channels'),
      explore: () => t('navigation.explore'),
      library: () => t('navigation.library'),
      bookmarks: () => t('navigation.bookmarks'),
      settings: () => t('navigation.settings'),
      profile: () => t('navigation.profile'),
      help: () => t('navigation.help'),
      about: () => t('navigation.about'),
      contact: () => t('navigation.contact'),
    },
    time: {
      justNow: () => t('time.justNow'),
      hoursAgo: (hours: number) => t('time.hoursAgo', { hours }),
      yesterday: () => t('time.yesterday'),
      daysAgo: (days: number) => t('time.daysAgo', { days }),
    },
    ui: {
      expand: () => t('ui.expand'),
      collapse: () => t('ui.collapse'),
      fullscreen: () => t('ui.fullscreen'),
      openSidebar: () => t('ui.openSidebar'),
      closeSidebar: () => t('ui.closeSidebar'),
      discoverChannels: () => t('ui.discoverChannels'),
      loading: () => t('ui.loading'),
      subscribers: () => t('ui.subscribers'),
      posts: () => t('ui.posts'),
      items: () => t('ui.items'),
      status: () => t('ui.status'),
      editors: () => t('ui.editors'),
      created: () => t('ui.created'),
      updated: () => t('ui.updated'),
      type: () => t('ui.type'),
      filters: () => t('ui.filters'),
      hideFilters: () => t('ui.hideFilters'),
      byCardType: () => t('ui.byCardType'),
      byCategory: () => t('ui.byCategory'),
      addNewLink: () => t('ui.addNewLink'),
      basicInformation: () => t('ui.basicInformation'),
      updateChannelBasicInfo: () => t('ui.updateChannelBasicInfo'),
      channelName: () => t('ui.channelName'),
      enterChannelName: () => t('ui.enterChannelName'),
      description: () => t('ui.description'),
      describeChannel: () => t('ui.describeChannel'),
      channelStatistics: () => t('ui.channelStatistics'),
      contentItems: () => t('ui.contentItems'),
    },
    header: {
      openMenu: () => t('header.openMenu'),
      openSearch: () => t('header.openSearch'),
      closeSearch: () => t('header.closeSearch'),
    },
    search: {
      placeholder: () => t('search.placeholder'),
      channelPlaceholder: (channelName: string) => t('search.channelPlaceholder', { channelName }),
      clearSearch: () => t('search.clearSearch'),
      searchButton: () => t('search.searchButton'),
      searchingChannels: () => t('search.searchingChannels'),
      lookingForChannels: (query: string) => t('search.lookingForChannels', { query }),
      searchError: () => t('search.searchError'),
      failedToSearch: () => t('search.failedToSearch'),
      channels: () => t('search.channels'),
      found: (count: number) => t('search.found', { count }),
      updatingResults: () => t('search.updatingResults'),
      searching: () => t('search.searching'),
      searchErrorOccurred: () => t('search.searchErrorOccurred'),
      noResultsFound: (query: string) => t('search.noResultsFound', { query }),
      content: () => t('search.content'),
      loadingMore: () => t('search.loadingMore'),
      enterSearchTerm: () => t('search.enterSearchTerm'),
      searchForChannelsAndContent: () => t('search.searchForChannelsAndContent'),
      searchTermTooShort: () => t('search.searchTermTooShort'),
      enterAtLeast2Characters: () => t('search.enterAtLeast2Characters'),
      searchResultsFor: (query: string) => t('search.searchResultsFor', { query }),
      foundResultsInChannelsAndContent: () => t('search.foundResultsInChannelsAndContent'),
    },
    create: {
      create: () => t('create.create'),
      createNewContent: () => t('create.createNewContent'),
    },
    notifications: {
      notifications: () => t('notifications.notifications'),
      marking: () => t('notifications.marking'),
      markAllAsRead: () => t('notifications.markAllAsRead'),
      loadingNotifications: () => t('notifications.loadingNotifications'),
      noNotifications: () => t('notifications.noNotifications'),
      viewAllNotifications: () => t('notifications.viewAllNotifications'),
    },
    user: {
      userMenu: () => t('user.userMenu'),
      user: () => t('user.user'),
      myPage: () => t('user.myPage'),
      settings: () => t('user.settings'),
      logout: () => t('user.logout'),
    },
    feed: {
      section: {
        header: () => t('feed.section.header'),
        sub: () => t('feed.section.sub'),
      },
      meta: {
        line: (params: { range: string; sort: string; count: number }) => 
          t('feed.meta.line', params),
      },
      sort: {
        hot: () => t('feed.sort.hot'),
        new: () => t('feed.sort.new'),
        top: () => t('feed.sort.top'),
        hotTooltip: () => t('feed.sort.hotTooltip'),
        newTooltip: () => t('feed.sort.newTooltip'),
        topTooltip: () => t('feed.sort.topTooltip'),
      },
      filter: {
        by: () => t('feed.filter.by'),
        today: () => t('feed.filter.today'),
        thisWeek: () => t('feed.filter.thisWeek'),
        allTime: () => t('feed.filter.allTime'),
      },
      loadingContent: () => t('feed.loadingContent'),
      noPostsFound: () => t('feed.noPostsFound'),
      tryDifferentFilter: () => t('feed.tryDifferentFilter'),
      exploreChannelsCta: () => t('feed.exploreChannelsCta'),
      failedToLoadPosts: () => t('feed.failedToLoadPosts'),
      tryAgain: () => t('feed.tryAgain'),
      showingPosts: (params: { count: number }) => t('feed.showingPosts', params),
      of: (params: { total: number }) => t('feed.of', params),
      badge: {
        justIn: () => t('feed.badge.justIn'),
        trending: () => t('feed.badge.trending'),
      },
    },
  };
};

// 언어 변경 유틸리티 훅
export const useLanguageSwitch = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'ko' | 'en') => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language as 'ko' | 'en';

  return {
    changeLanguage,
    currentLanguage,
    isKorean: currentLanguage === 'ko',
    isEnglish: currentLanguage === 'en',
  };
};

// 로케일 상태 체크 훅
export const useLocaleStatus = () => {
  const { i18n } = useTranslation();

  return {
    isReady: i18n.isInitialized,
    language: i18n.language,
    languages: i18n.languages,
  };
};