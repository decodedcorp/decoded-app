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
    redirecting: () => string;
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
  toast: {
    profile: {
      updated: () => string;
      updateFailed: () => string;
      processing: () => string;
    };
    bookmarks: {
      added: () => string;
      removed: () => string;
      addFailed: () => string;
      removeFailed: () => string;
    };
    subscription: {
      subscribed: () => string;
      unsubscribed: () => string;
      subscribeFailed: () => string;
      unsubscribeFailed: () => string;
    };
    comments: {
      added: () => string;
      updated: () => string;
      deleted: () => string;
      addFailed: () => string;
      updateFailed: () => string;
      deleteFailed: () => string;
    };
    pins: {
      orderUpdated: () => string;
      orderUpdateFailed: () => string;
    };
    banner: {
      updated: () => string;
      updateFailed: () => string;
    };
    general: {
      success: () => string;
      error: () => string;
      tryAgain: () => string;
    };
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
    followers: () => string;
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
    active: () => string;
    all: () => string;
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
    onlyManagersCanAddContent: () => string;
    generatedContent: () => string;
    aiGeneratedContent: () => string;
    generatedAt: () => string;
    regenerate: () => string;
    addToChannel: () => string;
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
  login: {
    title: () => string;
    subtitle: () => string;
    termsOfService: () => string;
    privacyPolicy: () => string;
    continueWithGoogle: () => string;
    signingIn: () => string;
    popupBlocked: () => string;
    loginCancelled: () => string;
    loginFailed: () => string;
    authError: () => string;
    networkError: () => string;
    clientIdMissing: () => string;
    error: () => string;
    agreementText: () => string;
  };
  feed: {
    section: {
      header: () => string;
      sub: () => string;
      headerHot: () => string;
      subHot: () => string;
      headerNew: () => string;
      subNew: () => string;
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
    infiniteScroll: {
      loadingMore: () => string;
      retry: () => string;
      serverError: () => string;
      loadFailed: () => string;
      serverIssueDetected: () => string;
      viewMoreContent: () => string;
    };
  };
  globalContentUpload: {
    title: () => string;
    subtitle: () => string;
    channelSelection: {
      title: () => string;
      subtitle: () => string;
      createNewChannel: () => string;
      selectExistingChannel: () => string;
    };
    channelCreation: {
      title: () => string;
      subtitle: () => string;
    };
    header: {
      selectChannel: () => string;
      addContentToChannel: (channelName: string) => string;
      chooseWhereToUpload: () => string;
      uploadToSelectedChannel: () => string;
      stepChannel: () => string;
      stepContent: () => string;
    };
    search: {
      placeholder: () => string;
      searchingChannels: () => string;
      failedToSearch: () => string;
      noChannelsFound: () => string;
      createNewChannel: () => string;
    };
    recentChannels: {
      title: () => string;
    };
    myChannels: {
      title: () => string;
      noChannels: () => string;
      noChannelsDescription: () => string;
    };
    contentUpload: {
      contentType: () => string;
      image: () => string;
      link: () => string;
      imageUpload: () => string;
      selectImage: () => string;
      linkUrl: () => string;
      description: () => string;
      optional: () => string;
      addDescription: () => string;
      fileFormats: () => string;
      footer: {
        cancel: () => string;
        addLink: () => string;
        adding: () => string;
      };
      validation: {
        descriptionTooLong: () => string;
        imageRequired: () => string;
        urlRequired: () => string;
        invalidUrl: () => string;
        imageProcessingError: () => string;
      };
    };
    addChannel: {
      title: () => string;
      steps: {
        basicInfo: () => string;
        style: () => string;
        topics: () => string;
      };
      step1: {
        title: () => string;
        subtitle: () => string;
        channelName: () => string;
        description: () => string;
        required: () => string;
        channelNamePlaceholder: () => string;
        descriptionPlaceholder: () => string;
        preview: {
          channelName: () => string;
          newChannel: () => string;
          subscribers: () => string;
          descriptionPlaceholder: () => string;
        };
      };
      step2: {
        title: () => string;
        subtitle: () => string;
        banner: () => string;
        icon: () => string;
        addBanner: () => string;
        addIcon: () => string;
        clickOrDrag: () => string;
        removeBanner: () => string;
        removeIcon: () => string;
        preview: {
          member: () => string;
          online: () => string;
        };
      };
      step3: {
        title: () => string;
        subtitle: () => string;
        chooseCategory: () => string;
        subcategories: () => string;
        loadingCategories: () => string;
        failedToLoad: () => string;
        errorLoading: () => string;
        noCategorySelected: () => string;
        category: () => string;
        preview: {
          channelName: () => string;
          newChannel: () => string;
          subscribers: () => string;
          descriptionPlaceholder: () => string;
        };
      };
      navigation: {
        back: () => string;
        cancel: () => string;
        next: () => string;
        nextStep: () => string;
        createChannel: () => string;
        creating: () => string;
      };
      errors: {
        channelCreationFailed: () => string;
        internalServerError: () => string;
        imageProcessingFailed: () => string;
        pleaseDropImage: () => string;
      };
    };
    bookmarks: {
      title: () => string;
      subtitle: () => string;
      signInRequired: () => string;
      signInRequiredDescription: () => string;
      goToHome: () => string;
      failedToLoad: () => string;
      failedToLoadDescription: () => string;
      retry: () => string;
      loading: () => string;
      loadMore: () => string;
      bookmarked: () => string;
      from: () => string;
      noBookmarks: () => string;
      noBookmarksDescription: () => string;
      exploreChannels: () => string;
      bookmarksCount: () => string;
    };
    toast: {
      actions: {
        createChannel: () => string;
        updateChannel: () => string;
        deleteChannel: () => string;
        updateThumbnail: () => string;
        createContent: () => string;
        updateContent: () => string;
        deleteContent: () => string;
        createLinkContent: () => string;
        createImageContent: () => string;
        createVideoContent: () => string;
        updateLinkContent: () => string;
        updateImageContent: () => string;
        updateVideoContent: () => string;
        deleteLinkContent: () => string;
        deleteImageContent: () => string;
        deleteVideoContent: () => string;
      };
      states: {
        loading: () => string;
        completed: () => string;
        failed: () => string;
      };
      messages: {
        creatingChannel: () => string;
        channelCreated: () => string;
        channelCreateFailed: () => string;
        updatingChannel: () => string;
        channelUpdated: () => string;
        channelUpdateFailed: () => string;
        deletingChannel: () => string;
        channelDeleted: () => string;
        channelDeleteFailed: () => string;
        updatingThumbnail: () => string;
        thumbnailUpdated: () => string;
        thumbnailUpdateFailed: () => string;
        creatingContent: () => string;
        contentCreated: () => string;
        contentCreateFailed: () => string;
        updatingContent: () => string;
        contentUpdated: () => string;
        contentUpdateFailed: () => string;
        deletingContent: () => string;
        contentDeleted: () => string;
        contentDeleteFailed: () => string;
        sendingInvitation: () => string;
        invitationSent: () => string;
        invitationSendFailed: () => string;
        acceptingInvitation: () => string;
        invitationAccepted: () => string;
        invitationAcceptFailed: () => string;
        rejectingInvitation: () => string;
        invitationRejected: () => string;
        invitationRejectFailed: () => string;
        cancelingInvitation: () => string;
        invitationCanceled: () => string;
        invitationCancelFailed: () => string;
        markingNotificationRead: () => string;
        notificationMarkedRead: () => string;
        notificationMarkReadFailed: () => string;
        markingAllNotificationsRead: () => string;
        allNotificationsMarkedRead: () => string;
        allNotificationsMarkReadFailed: () => string;
      };
    };
    errors: {
      channelCreationFailed: () => string;
      internalServerError: () => string;
      networkError: () => string;
    };
    sidebar: {
      recommendedChannels: () => string;
      noRecommendedChannels: () => string;
      sponsored: () => string;
      advertisementPlaceholder: () => string;
      members: () => string;
      upvotes: () => string;
      about: () => string;
      help: () => string;
      privacyPolicy: () => string;
      termsOfService: () => string;
      copyright: () => string;
      careers: () => string;
      press: () => string;
      loadChannelsFailed: () => string;
      brandSlogan: () => string;
    };
  };
  invitations: {
    inviteManager: () => string;
    searchUser: () => string;
    personalMessage: () => string;
    expiresIn: () => string;
    sending: () => string;
    sendInvitation: () => string;
  };
  channelSettings: {
    title: () => string;
    loadingSettings: () => string;
    channelNotFound: () => string;
    channelNotFoundDescription: () => string;
    accessDenied: () => string;
    accessDeniedDescription: () => string;
    backToChannels: () => string;
    backToChannel: () => string;
    characters: () => string;
    tabs: {
      basicInfo: () => string;
      images: () => string;
      managers: () => string;
      dangerZone: () => string;
    };
    images: {
      title: () => string;
      subtitle: () => string;
      thumbnail: {
        title: () => string;
        profilePicture: () => string;
        description: () => string;
        requirements: {
          maxFileSize: () => string;
          supportedFormats: () => string;
          squareImages: () => string;
        };
      };
      banner: {
        title: () => string;
        bannerImage: () => string;
        description: () => string;
        requirements: {
          maxFileSize: () => string;
          supportedFormats: () => string;
          aspectRatio: () => string;
        };
      };
      preview: {
        title: () => string;
        description: () => string;
        bannerPreview: () => string;
        thumbnailPreview: () => string;
      };
    };
    managers: {
      title: () => string;
      subtitle: () => string;
      currentManagers: () => string;
      inviteManager: () => string;
      permissions: {
        title: () => string;
        uploadContent: () => string;
        pinContent: () => string;
        moderateComments: () => string;
        editDescription: () => string;
        cannotDelete: () => string;
      };
      invitations: () => string;
      bestPractices: {
        title: () => string;
        inviteTrusted: () => string;
        setExpectations: () => string;
        reviewActivity: () => string;
        trialPeriods: () => string;
        communicateGoals: () => string;
      };
      statistics: {
        title: () => string;
        totalManagers: () => string;
        channelContent: () => string;
      };
    };
    dangerZone: {
      title: () => string;
      subtitle: () => string;
      deleteChannel: {
        title: () => string;
        description: () => string;
        willDelete: () => string;
        allContent: () => string;
        allSubscribers: () => string;
        allComments: () => string;
        allAnalytics: () => string;
        allManagers: () => string;
        confirmText: (channelName: string) => string;
        confirmPlaceholder: (channelName: string) => string;
        deleteForever: () => string;
        deleting: () => string;
        currentlyDisabled: () => string;
      };
      beforeDeleting: {
        title: () => string;
        transferOwnership: () => string;
        downloadContent: () => string;
        notifySubscribers: () => string;
        removeLinks: () => string;
      };
    };
  };
  accessibility: {
    goBack: () => string;
  };
  inviteCode: {
    title: () => string;
    subtitle: () => string;
    placeholder: () => string;
    button: () => string;
    buttonLoading: () => string;
    helpText: () => string;
    contactAdmin: () => string;
    devLink: () => string;
    error: () => string;
    errors: {
      required: () => string;
      invalid: () => string;
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
      redirecting: () => t('status.redirecting'),
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
    toast: {
      profile: {
        updated: () => t('toast.profile.updated'),
        updateFailed: () => t('toast.profile.updateFailed'),
        processing: () => t('toast.profile.processing'),
      },
      bookmarks: {
        added: () => t('toast.bookmarks.added'),
        removed: () => t('toast.bookmarks.removed'),
        addFailed: () => t('toast.bookmarks.addFailed'),
        removeFailed: () => t('toast.bookmarks.removeFailed'),
      },
      subscription: {
        subscribed: () => t('toast.subscription.subscribed'),
        unsubscribed: () => t('toast.subscription.unsubscribed'),
        subscribeFailed: () => t('toast.subscription.subscribeFailed'),
        unsubscribeFailed: () => t('toast.subscription.unsubscribeFailed'),
      },
      comments: {
        added: () => t('toast.comments.added'),
        updated: () => t('toast.comments.updated'),
        deleted: () => t('toast.comments.deleted'),
        addFailed: () => t('toast.comments.addFailed'),
        updateFailed: () => t('toast.comments.updateFailed'),
        deleteFailed: () => t('toast.comments.deleteFailed'),
      },
      pins: {
        orderUpdated: () => t('toast.pins.orderUpdated'),
        orderUpdateFailed: () => t('toast.pins.orderUpdateFailed'),
      },
      banner: {
        updated: () => t('toast.banner.updated'),
        updateFailed: () => t('toast.banner.updateFailed'),
      },
      general: {
        success: () => t('toast.general.success'),
        error: () => t('toast.general.error'),
        tryAgain: () => t('toast.general.tryAgain'),
      },
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
      followers: () => t('ui.followers'),
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
      active: () => t('ui.active'),
      all: () => t('ui.all'),
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
      onlyManagersCanAddContent: () => t('create.onlyManagersCanAddContent'),
      generatedContent: () => t('create.generatedContent'),
      aiGeneratedContent: () => t('create.aiGeneratedContent'),
      generatedAt: () => t('create.generatedAt'),
      regenerate: () => t('create.regenerate'),
      addToChannel: () => t('create.addToChannel'),
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
    login: {
      title: () => t('login.title'),
      subtitle: () => t('login.subtitle'),
      termsOfService: () => t('login.termsOfService'),
      privacyPolicy: () => t('login.privacyPolicy'),
      continueWithGoogle: () => t('login.continueWithGoogle'),
      signingIn: () => t('login.signingIn'),
      popupBlocked: () => t('login.popupBlocked'),
      loginCancelled: () => t('login.loginCancelled'),
      loginFailed: () => t('login.loginFailed'),
      authError: () => t('login.authError'),
      networkError: () => t('login.networkError'),
      clientIdMissing: () => t('login.clientIdMissing'),
      error: () => t('login.error'),
      agreementText: () => t('login.agreementText'),
    },
    feed: {
      section: {
        header: () => t('feed.section.header'),
        sub: () => t('feed.section.sub'),
        headerHot: () => t('feed.section.headerHot'),
        subHot: () => t('feed.section.subHot'),
        headerNew: () => t('feed.section.headerNew'),
        subNew: () => t('feed.section.subNew'),
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
      infiniteScroll: {
        loadingMore: () => t('feed.infiniteScroll.loadingMore'),
        retry: () => t('feed.infiniteScroll.retry'),
        serverError: () => t('feed.infiniteScroll.serverError'),
        loadFailed: () => t('feed.infiniteScroll.loadFailed'),
        serverIssueDetected: () => t('feed.infiniteScroll.serverIssueDetected'),
        viewMoreContent: () => t('feed.infiniteScroll.viewMoreContent'),
      },
    },
    globalContentUpload: {
      title: () => t('globalContentUpload.title'),
      subtitle: () => t('globalContentUpload.subtitle'),
      channelSelection: {
        title: () => t('globalContentUpload.channelSelection.title'),
        subtitle: () => t('globalContentUpload.channelSelection.subtitle'),
        createNewChannel: () => t('globalContentUpload.channelSelection.createNewChannel'),
        selectExistingChannel: () =>
          t('globalContentUpload.channelSelection.selectExistingChannel'),
      },
      channelCreation: {
        title: () => t('globalContentUpload.channelCreation.title'),
        subtitle: () => t('globalContentUpload.channelCreation.subtitle'),
      },
      header: {
        selectChannel: () => t('globalContentUpload.header.selectChannel'),
        addContentToChannel: (channelName: string) =>
          t('globalContentUpload.header.addContentToChannel', { channelName }),
        chooseWhereToUpload: () => t('globalContentUpload.header.chooseWhereToUpload'),
        uploadToSelectedChannel: () => t('globalContentUpload.header.uploadToSelectedChannel'),
        stepChannel: () => t('globalContentUpload.header.stepChannel'),
        stepContent: () => t('globalContentUpload.header.stepContent'),
      },
      search: {
        placeholder: () => t('globalContentUpload.search.placeholder'),
        searchingChannels: () => t('globalContentUpload.search.searchingChannels'),
        failedToSearch: () => t('globalContentUpload.search.failedToSearch'),
        noChannelsFound: () => t('globalContentUpload.search.noChannelsFound'),
        createNewChannel: () => t('globalContentUpload.search.createNewChannel'),
      },
      recentChannels: {
        title: () => t('globalContentUpload.recentChannels.title'),
      },
      myChannels: {
        title: () => t('globalContentUpload.myChannels.title'),
        noChannels: () => t('globalContentUpload.myChannels.noChannels'),
        noChannelsDescription: () => t('globalContentUpload.myChannels.noChannelsDescription'),
      },
      contentUpload: {
        contentType: () => t('globalContentUpload.contentUpload.contentType'),
        image: () => t('globalContentUpload.contentUpload.image'),
        link: () => t('globalContentUpload.contentUpload.link'),
        imageUpload: () => t('globalContentUpload.contentUpload.imageUpload'),
        selectImage: () => t('globalContentUpload.contentUpload.selectImage'),
        linkUrl: () => t('globalContentUpload.contentUpload.linkUrl'),
        description: () => t('globalContentUpload.contentUpload.description'),
        optional: () => t('globalContentUpload.contentUpload.optional'),
        addDescription: () => t('globalContentUpload.contentUpload.addDescription'),
        fileFormats: () => t('globalContentUpload.contentUpload.fileFormats'),
        footer: {
          cancel: () => t('globalContentUpload.contentUpload.footer.cancel'),
          addLink: () => t('globalContentUpload.contentUpload.footer.addLink'),
          adding: () => t('globalContentUpload.contentUpload.footer.adding'),
        },
        validation: {
          descriptionTooLong: () =>
            t('globalContentUpload.contentUpload.validation.descriptionTooLong'),
          imageRequired: () => t('globalContentUpload.contentUpload.validation.imageRequired'),
          urlRequired: () => t('globalContentUpload.contentUpload.validation.urlRequired'),
          invalidUrl: () => t('globalContentUpload.contentUpload.validation.invalidUrl'),
          imageProcessingError: () =>
            t('globalContentUpload.contentUpload.validation.imageProcessingError'),
        },
      },
      addChannel: {
        title: () => t('globalContentUpload.addChannel.title'),
        steps: {
          basicInfo: () => t('globalContentUpload.addChannel.steps.basicInfo'),
          style: () => t('globalContentUpload.addChannel.steps.style'),
          topics: () => t('globalContentUpload.addChannel.steps.topics'),
        },
        step1: {
          title: () => t('globalContentUpload.addChannel.step1.title'),
          subtitle: () => t('globalContentUpload.addChannel.step1.subtitle'),
          channelName: () => t('globalContentUpload.addChannel.step1.channelName'),
          description: () => t('globalContentUpload.addChannel.step1.description'),
          required: () => t('globalContentUpload.addChannel.step1.required'),
          channelNamePlaceholder: () =>
            t('globalContentUpload.addChannel.step1.channelNamePlaceholder'),
          descriptionPlaceholder: () =>
            t('globalContentUpload.addChannel.step1.descriptionPlaceholder'),
          preview: {
            channelName: () => t('globalContentUpload.addChannel.step1.preview.channelName'),
            newChannel: () => t('globalContentUpload.addChannel.step1.preview.newChannel'),
            subscribers: () => t('globalContentUpload.addChannel.step1.preview.subscribers'),
            descriptionPlaceholder: () =>
              t('globalContentUpload.addChannel.step1.preview.descriptionPlaceholder'),
          },
        },
        step2: {
          title: () => t('globalContentUpload.addChannel.step2.title'),
          subtitle: () => t('globalContentUpload.addChannel.step2.subtitle'),
          banner: () => t('globalContentUpload.addChannel.step2.banner'),
          icon: () => t('globalContentUpload.addChannel.step2.icon'),
          addBanner: () => t('globalContentUpload.addChannel.step2.addBanner'),
          addIcon: () => t('globalContentUpload.addChannel.step2.addIcon'),
          clickOrDrag: () => t('globalContentUpload.addChannel.step2.clickOrDrag'),
          removeBanner: () => t('globalContentUpload.addChannel.step2.removeBanner'),
          removeIcon: () => t('globalContentUpload.addChannel.step2.removeIcon'),
          preview: {
            member: () => t('globalContentUpload.addChannel.step2.preview.member'),
            online: () => t('globalContentUpload.addChannel.step2.preview.online'),
          },
        },
        step3: {
          title: () => t('globalContentUpload.addChannel.step3.title'),
          subtitle: () => t('globalContentUpload.addChannel.step3.subtitle'),
          chooseCategory: () => t('globalContentUpload.addChannel.step3.chooseCategory'),
          subcategories: () => t('globalContentUpload.addChannel.step3.subcategories'),
          loadingCategories: () => t('globalContentUpload.addChannel.step3.loadingCategories'),
          failedToLoad: () => t('globalContentUpload.addChannel.step3.failedToLoad'),
          errorLoading: () => t('globalContentUpload.addChannel.step3.errorLoading'),
          noCategorySelected: () => t('globalContentUpload.addChannel.step3.noCategorySelected'),
          category: () => t('globalContentUpload.addChannel.step3.category'),
          preview: {
            channelName: () => t('globalContentUpload.addChannel.step3.preview.channelName'),
            newChannel: () => t('globalContentUpload.addChannel.step3.preview.newChannel'),
            subscribers: () => t('globalContentUpload.addChannel.step3.preview.subscribers'),
            descriptionPlaceholder: () =>
              t('globalContentUpload.addChannel.step3.preview.descriptionPlaceholder'),
          },
        },
        navigation: {
          back: () => t('globalContentUpload.addChannel.navigation.back'),
          cancel: () => t('globalContentUpload.addChannel.navigation.cancel'),
          next: () => t('globalContentUpload.addChannel.navigation.next'),
          nextStep: () => t('globalContentUpload.addChannel.navigation.nextStep'),
          createChannel: () => t('globalContentUpload.addChannel.navigation.createChannel'),
          creating: () => t('globalContentUpload.addChannel.navigation.creating'),
        },
        errors: {
          channelCreationFailed: () =>
            t('globalContentUpload.addChannel.errors.channelCreationFailed'),
          internalServerError: () => t('globalContentUpload.addChannel.errors.internalServerError'),
          imageProcessingFailed: () =>
            t('globalContentUpload.addChannel.errors.imageProcessingFailed'),
          pleaseDropImage: () => t('globalContentUpload.addChannel.errors.pleaseDropImage'),
        },
      },
      bookmarks: {
        title: () => t('globalContentUpload.bookmarks.title'),
        subtitle: () => t('globalContentUpload.bookmarks.subtitle'),
        signInRequired: () => t('globalContentUpload.bookmarks.signInRequired'),
        signInRequiredDescription: () =>
          t('globalContentUpload.bookmarks.signInRequiredDescription'),
        goToHome: () => t('globalContentUpload.bookmarks.goToHome'),
        failedToLoad: () => t('globalContentUpload.bookmarks.failedToLoad'),
        failedToLoadDescription: () => t('globalContentUpload.bookmarks.failedToLoadDescription'),
        retry: () => t('globalContentUpload.bookmarks.retry'),
        loading: () => t('globalContentUpload.bookmarks.loading'),
        loadMore: () => t('globalContentUpload.bookmarks.loadMore'),
        bookmarked: () => t('globalContentUpload.bookmarks.bookmarked'),
        from: () => t('globalContentUpload.bookmarks.from'),
        noBookmarks: () => t('globalContentUpload.bookmarks.noBookmarks'),
        noBookmarksDescription: () => t('globalContentUpload.bookmarks.noBookmarksDescription'),
        exploreChannels: () => t('globalContentUpload.bookmarks.exploreChannels'),
        bookmarksCount: () => t('globalContentUpload.bookmarks.bookmarksCount'),
      },
      toast: {
        actions: {
          createChannel: () => t('globalContentUpload.toast.actions.createChannel'),
          updateChannel: () => t('globalContentUpload.toast.actions.updateChannel'),
          deleteChannel: () => t('globalContentUpload.toast.actions.deleteChannel'),
          updateThumbnail: () => t('globalContentUpload.toast.actions.updateThumbnail'),
          createContent: () => t('globalContentUpload.toast.actions.createContent'),
          updateContent: () => t('globalContentUpload.toast.actions.updateContent'),
          deleteContent: () => t('globalContentUpload.toast.actions.deleteContent'),
          createLinkContent: () => t('globalContentUpload.toast.actions.createLinkContent'),
          createImageContent: () => t('globalContentUpload.toast.actions.createImageContent'),
          createVideoContent: () => t('globalContentUpload.toast.actions.createVideoContent'),
          updateLinkContent: () => t('globalContentUpload.toast.actions.updateLinkContent'),
          updateImageContent: () => t('globalContentUpload.toast.actions.updateImageContent'),
          updateVideoContent: () => t('globalContentUpload.toast.actions.updateVideoContent'),
          deleteLinkContent: () => t('globalContentUpload.toast.actions.deleteLinkContent'),
          deleteImageContent: () => t('globalContentUpload.toast.actions.deleteImageContent'),
          deleteVideoContent: () => t('globalContentUpload.toast.actions.deleteVideoContent'),
        },
        states: {
          loading: () => t('globalContentUpload.toast.states.loading'),
          completed: () => t('globalContentUpload.toast.states.completed'),
          failed: () => t('globalContentUpload.toast.states.failed'),
        },
        messages: {
          creatingChannel: () => t('globalContentUpload.toast.messages.creatingChannel'),
          channelCreated: () => t('globalContentUpload.toast.messages.channelCreated'),
          channelCreateFailed: () => t('globalContentUpload.toast.messages.channelCreateFailed'),
          updatingChannel: () => t('globalContentUpload.toast.messages.updatingChannel'),
          channelUpdated: () => t('globalContentUpload.toast.messages.channelUpdated'),
          channelUpdateFailed: () => t('globalContentUpload.toast.messages.channelUpdateFailed'),
          deletingChannel: () => t('globalContentUpload.toast.messages.deletingChannel'),
          channelDeleted: () => t('globalContentUpload.toast.messages.channelDeleted'),
          channelDeleteFailed: () => t('globalContentUpload.toast.messages.channelDeleteFailed'),
          updatingThumbnail: () => t('globalContentUpload.toast.messages.updatingThumbnail'),
          thumbnailUpdated: () => t('globalContentUpload.toast.messages.thumbnailUpdated'),
          thumbnailUpdateFailed: () =>
            t('globalContentUpload.toast.messages.thumbnailUpdateFailed'),
          creatingContent: () => t('globalContentUpload.toast.messages.creatingContent'),
          contentCreated: () => t('globalContentUpload.toast.messages.contentCreated'),
          contentCreateFailed: () => t('globalContentUpload.toast.messages.contentCreateFailed'),
          updatingContent: () => t('globalContentUpload.toast.messages.updatingContent'),
          contentUpdated: () => t('globalContentUpload.toast.messages.contentUpdated'),
          contentUpdateFailed: () => t('globalContentUpload.toast.messages.contentUpdateFailed'),
          deletingContent: () => t('globalContentUpload.toast.messages.deletingContent'),
          contentDeleted: () => t('globalContentUpload.toast.messages.contentDeleted'),
          contentDeleteFailed: () => t('globalContentUpload.toast.messages.contentDeleteFailed'),
          sendingInvitation: () => t('globalContentUpload.toast.messages.sendingInvitation'),
          invitationSent: () => t('globalContentUpload.toast.messages.invitationSent'),
          invitationSendFailed: () => t('globalContentUpload.toast.messages.invitationSendFailed'),
          acceptingInvitation: () => t('globalContentUpload.toast.messages.acceptingInvitation'),
          invitationAccepted: () => t('globalContentUpload.toast.messages.invitationAccepted'),
          invitationAcceptFailed: () =>
            t('globalContentUpload.toast.messages.invitationAcceptFailed'),
          rejectingInvitation: () => t('globalContentUpload.toast.messages.rejectingInvitation'),
          invitationRejected: () => t('globalContentUpload.toast.messages.invitationRejected'),
          invitationRejectFailed: () =>
            t('globalContentUpload.toast.messages.invitationRejectFailed'),
          cancelingInvitation: () => t('globalContentUpload.toast.messages.cancelingInvitation'),
          invitationCanceled: () => t('globalContentUpload.toast.messages.invitationCanceled'),
          invitationCancelFailed: () =>
            t('globalContentUpload.toast.messages.invitationCancelFailed'),
          markingNotificationRead: () =>
            t('globalContentUpload.toast.messages.markingNotificationRead'),
          notificationMarkedRead: () =>
            t('globalContentUpload.toast.messages.notificationMarkedRead'),
          notificationMarkReadFailed: () =>
            t('globalContentUpload.toast.messages.notificationMarkReadFailed'),
          markingAllNotificationsRead: () =>
            t('globalContentUpload.toast.messages.markingAllNotificationsRead'),
          allNotificationsMarkedRead: () =>
            t('globalContentUpload.toast.messages.allNotificationsMarkedRead'),
          allNotificationsMarkReadFailed: () =>
            t('globalContentUpload.toast.messages.allNotificationsMarkReadFailed'),
        },
      },
      errors: {
        channelCreationFailed: () => t('globalContentUpload.errors.channelCreationFailed'),
        internalServerError: () => t('globalContentUpload.errors.internalServerError'),
        networkError: () => t('globalContentUpload.errors.networkError'),
      },
      sidebar: {
        recommendedChannels: () => t('globalContentUpload.sidebar.recommendedChannels'),
        noRecommendedChannels: () => t('globalContentUpload.sidebar.noRecommendedChannels'),
        sponsored: () => t('globalContentUpload.sidebar.sponsored'),
        advertisementPlaceholder: () => t('globalContentUpload.sidebar.advertisementPlaceholder'),
        members: () => t('globalContentUpload.sidebar.members'),
        upvotes: () => t('globalContentUpload.sidebar.upvotes'),
        about: () => t('globalContentUpload.sidebar.about'),
        help: () => t('globalContentUpload.sidebar.help'),
        privacyPolicy: () => t('globalContentUpload.sidebar.privacyPolicy'),
        termsOfService: () => t('globalContentUpload.sidebar.termsOfService'),
        copyright: () => t('globalContentUpload.sidebar.copyright'),
        careers: () => t('globalContentUpload.sidebar.careers'),
        press: () => t('globalContentUpload.sidebar.press'),
        loadChannelsFailed: () => t('globalContentUpload.sidebar.loadChannelsFailed'),
        brandSlogan: () => t('globalContentUpload.sidebar.brandSlogan'),
      },
    },
    invitations: {
      inviteManager: () => t('invitations.inviteManager'),
      searchUser: () => t('invitations.searchUser'),
      personalMessage: () => t('invitations.personalMessage'),
      expiresIn: () => t('invitations.expiresIn'),
      sending: () => t('invitations.sending'),
      sendInvitation: () => t('invitations.sendInvitation'),
    },
    channelSettings: {
      title: () => t('channelSettings.title'),
      loadingSettings: () => t('channelSettings.loadingSettings'),
      channelNotFound: () => t('channelSettings.channelNotFound'),
      channelNotFoundDescription: () => t('channelSettings.channelNotFoundDescription'),
      accessDenied: () => t('channelSettings.accessDenied'),
      accessDeniedDescription: () => t('channelSettings.accessDeniedDescription'),
      backToChannels: () => t('channelSettings.backToChannels'),
      backToChannel: () => t('channelSettings.backToChannel'),
      characters: () => t('channelSettings.characters'),
      tabs: {
        basicInfo: () => t('channelSettings.tabs.basicInfo'),
        images: () => t('channelSettings.tabs.images'),
        managers: () => t('channelSettings.tabs.managers'),
        dangerZone: () => t('channelSettings.tabs.dangerZone'),
      },
      images: {
        title: () => t('channelSettings.images.title'),
        subtitle: () => t('channelSettings.images.subtitle'),
        thumbnail: {
          title: () => t('channelSettings.images.thumbnail.title'),
          profilePicture: () => t('channelSettings.images.thumbnail.profilePicture'),
          description: () => t('channelSettings.images.thumbnail.description'),
          requirements: {
            maxFileSize: () => t('channelSettings.images.thumbnail.requirements.maxFileSize'),
            supportedFormats: () =>
              t('channelSettings.images.thumbnail.requirements.supportedFormats'),
            squareImages: () => t('channelSettings.images.thumbnail.requirements.squareImages'),
          },
        },
        banner: {
          title: () => t('channelSettings.images.banner.title'),
          bannerImage: () => t('channelSettings.images.banner.bannerImage'),
          description: () => t('channelSettings.images.banner.description'),
          requirements: {
            maxFileSize: () => t('channelSettings.images.banner.requirements.maxFileSize'),
            supportedFormats: () =>
              t('channelSettings.images.banner.requirements.supportedFormats'),
            aspectRatio: () => t('channelSettings.images.banner.requirements.aspectRatio'),
          },
        },
        preview: {
          title: () => t('channelSettings.images.preview.title'),
          description: () => t('channelSettings.images.preview.description'),
          bannerPreview: () => t('channelSettings.images.preview.bannerPreview'),
          thumbnailPreview: () => t('channelSettings.images.preview.thumbnailPreview'),
        },
      },
      managers: {
        title: () => t('channelSettings.managers.title'),
        subtitle: () => t('channelSettings.managers.subtitle'),
        currentManagers: () => t('channelSettings.managers.currentManagers'),
        inviteManager: () => t('channelSettings.managers.inviteManager'),
        permissions: {
          title: () => t('channelSettings.managers.permissions.title'),
          uploadContent: () => t('channelSettings.managers.permissions.uploadContent'),
          pinContent: () => t('channelSettings.managers.permissions.pinContent'),
          moderateComments: () => t('channelSettings.managers.permissions.moderateComments'),
          editDescription: () => t('channelSettings.managers.permissions.editDescription'),
          cannotDelete: () => t('channelSettings.managers.permissions.cannotDelete'),
        },
        invitations: () => t('channelSettings.managers.invitations'),
        bestPractices: {
          title: () => t('channelSettings.managers.bestPractices.title'),
          inviteTrusted: () => t('channelSettings.managers.bestPractices.inviteTrusted'),
          setExpectations: () => t('channelSettings.managers.bestPractices.setExpectations'),
          reviewActivity: () => t('channelSettings.managers.bestPractices.reviewActivity'),
          trialPeriods: () => t('channelSettings.managers.bestPractices.trialPeriods'),
          communicateGoals: () => t('channelSettings.managers.bestPractices.communicateGoals'),
        },
        statistics: {
          title: () => t('channelSettings.managers.statistics.title'),
          totalManagers: () => t('channelSettings.managers.statistics.totalManagers'),
          channelContent: () => t('channelSettings.managers.statistics.channelContent'),
        },
      },
      dangerZone: {
        title: () => t('channelSettings.dangerZone.title'),
        subtitle: () => t('channelSettings.dangerZone.subtitle'),
        deleteChannel: {
          title: () => t('channelSettings.dangerZone.deleteChannel.title'),
          description: () => t('channelSettings.dangerZone.deleteChannel.description'),
          willDelete: () => t('channelSettings.dangerZone.deleteChannel.willDelete'),
          allContent: () => t('channelSettings.dangerZone.deleteChannel.allContent'),
          allSubscribers: () => t('channelSettings.dangerZone.deleteChannel.allSubscribers'),
          allComments: () => t('channelSettings.dangerZone.deleteChannel.allComments'),
          allAnalytics: () => t('channelSettings.dangerZone.deleteChannel.allAnalytics'),
          allManagers: () => t('channelSettings.dangerZone.deleteChannel.allManagers'),
          confirmText: (channelName: string) =>
            t('channelSettings.dangerZone.deleteChannel.confirmText', { channelName }),
          confirmPlaceholder: (channelName: string) =>
            t('channelSettings.dangerZone.deleteChannel.confirmPlaceholder', { channelName }),
          deleteForever: () => t('channelSettings.dangerZone.deleteChannel.deleteForever'),
          deleting: () => t('channelSettings.dangerZone.deleteChannel.deleting'),
          currentlyDisabled: () => t('channelSettings.dangerZone.deleteChannel.currentlyDisabled'),
        },
        beforeDeleting: {
          title: () => t('channelSettings.dangerZone.beforeDeleting.title'),
          transferOwnership: () => t('channelSettings.dangerZone.beforeDeleting.transferOwnership'),
          downloadContent: () => t('channelSettings.dangerZone.beforeDeleting.downloadContent'),
          notifySubscribers: () => t('channelSettings.dangerZone.beforeDeleting.notifySubscribers'),
          removeLinks: () => t('channelSettings.dangerZone.beforeDeleting.removeLinks'),
        },
      },
    },
    accessibility: {
      goBack: () => t('accessibility.goBack'),
    },
    inviteCode: {
      title: () => t('inviteCode.title'),
      subtitle: () => t('inviteCode.subtitle'),
      placeholder: () => t('inviteCode.placeholder'),
      button: () => t('inviteCode.button'),
      buttonLoading: () => t('inviteCode.buttonLoading'),
      helpText: () => t('inviteCode.helpText'),
      contactAdmin: () => t('inviteCode.contactAdmin'),
      devLink: () => t('inviteCode.devLink'),
      error: () => t('inviteCode.error'),
      errors: {
        required: () => t('inviteCode.errors.required'),
        invalid: () => t('inviteCode.errors.invalid'),
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
