import { useTranslation } from 'react-i18next';

// Re-export centralized hooks for consistency
export { useCommonTranslation, useLanguageSwitch, useLocaleStatus } from './centralizedHooks';

export const useAuthTranslation = () => {
  const { t } = useTranslation('auth');

  return {
    login: {
      title: () => t('login.title'),
      button: () => t('login.button'),
      success: () => t('login.success'),
      error: () => t('login.error'),
      failed: () => t('login.failed'),
      networkError: () => t('login.networkError'),
      popupBlocked: () => t('login.popupBlocked'),
      clientIdMissing: () => t('login.clientIdMissing'),
      authError: (message: string) => t('login.authError', { message }),
    },
    logout: {
      title: () => t('logout.title'),
      confirm: () => t('logout.confirm'),
      success: () => t('logout.success'),
      button: () => t('logout.button'),
    },
    user: {
      admin: () => t('user.admin'),
      regular: () => t('user.regular'),
    },
    status: {
      checking: () => t('status.checking'),
      signedIn: () => t('status.signedIn'),
      loginRequired: () => t('status.loginRequired'),
      error: (message: string) => t('status.error', { message }),
    },
    fields: {
      name: () => t('fields.name'),
      email: () => t('fields.email'),
      role: () => t('fields.role'),
    },
    permissions: {
      userPermission: () => t('permissions.userPermission'),
      adminRole: () => t('permissions.adminRole'),
      regularUser: () => t('permissions.regularUser'),
    },
  };
};

export const useChannelTranslation = () => {
  const { t } = useTranslation('channels');

  return {
    actions: {
      create: () => t('actions.create'),
      update: () => t('actions.update'),
      delete: () => t('actions.delete'),
      like: () => t('actions.like'),
      unlike: () => t('actions.unlike'),
    },
    placeholders: {
      name: () => t('placeholders.name'),
      description: () => t('placeholders.description'),
      search: () => t('placeholders.search'),
      channelId: () => t('placeholders.channelId'),
      newName: () => t('placeholders.newName'),
      newDescription: () => t('placeholders.newDescription'),
    },
    status: {
      creating: () => t('status.creating'),
      updating: () => t('status.updating'),
      loading: () => t('status.loading'),
      success: (action: string) => t('status.success', { action }),
      error: (action: string) => t('status.error', { action }),
      createSuccess: () => t('status.createSuccess'),
      updateSuccess: () => t('status.updateSuccess'),
      likeProcessing: () => t('status.likeProcessing'),
    },
    validation: {
      nameRequired: () => t('validation.nameRequired'),
      idRequired: () => t('validation.idRequired'),
      nameTooLong: (max: number) => t('validation.nameTooLong', { max }),
    },
    states: {
      empty: () => t('states.empty'),
      emptySubtitle: () => t('states.emptySubtitle'),
      notFound: () => t('states.notFound'),
      loadError: () => t('states.loadError'),
      loadErrorSubtitle: () => t('states.loadErrorSubtitle'),
      searching: () => t('states.searching'),
      description: (category: string) => t('states.description', { category }),
    },
    trending: {
      title: () => t('trending.title'),
      contentTitle: () => t('trending.contentTitle'),
      subtitle: () => t('trending.subtitle'),
      loading: () => t('trending.loading'),
      contentLoading: () => t('trending.contentLoading'),
      error: () => t('trending.error'),
      contentError: () => t('trending.contentError'),
      errorSubtitle: () => t('trending.errorSubtitle'),
      popular: () => t('trending.popular'),
      trendingNow: () => t('trending.trendingNow'),
      empty: () => t('trending.empty'),
      viewAll: () => t('trending.viewAll'),
    },
    images: {
      thumbnail: () => t('images.thumbnail'),
      banner: () => t('images.banner'),
      uploading: () => t('images.uploading'),
      uploadSuccess: () => t('images.uploadSuccess'),
      uploadError: () => t('images.uploadError'),
      uploadInstruction: () => t('images.uploadInstruction'),
      processError: () => t('images.processError'),
      invalidFile: () => t('images.invalidFile'),
    },
    labels: {
      name: () => t('labels.name'),
      description: () => t('labels.description'),
      category: () => t('labels.category'),
      tags: () => t('labels.tags'),
      thumbnail: () => t('labels.thumbnail'),
      banner: () => t('labels.banner'),
      owner: () => t('labels.owner'),
      subscribers: () => t('labels.subscribers'),
      content: () => t('labels.content'),
      created: () => t('labels.created'),
      updated: () => t('labels.updated'),
    },
    api: {
      info: () => t('api.info'),
      method: () => t('api.method'),
      endpoint: () => t('api.endpoint'),
      body: () => t('api.body'),
      auth: () => t('api.auth'),
      authRequired: () => t('api.authRequired'),
    },
    categories: {
      technology: () => t('categories.technology'),
      design: () => t('categories.design'),
      business: () => t('categories.business'),
      lifestyle: () => t('categories.lifestyle'),
      education: () => t('categories.education'),
      entertainment: () => t('categories.entertainment'),
      uncategorized: () => t('categories.uncategorized'),
    },
    curatorLevels: {
      master: () => t('curatorLevels.master'),
      verified: () => t('curatorLevels.verified'),
      newbie: () => t('curatorLevels.newbie'),
    },
    sidebar: {
      trendingChannels: () => t('sidebar.trendingChannels'),
      subscribedChannels: () => t('sidebar.subscribedChannels'),
      trendingEmpty: () => t('sidebar.trendingEmpty'),
      subscribedEmpty: () => t('sidebar.subscribedEmpty'),
      loadError: () => t('sidebar.loadError'),
      viewMoreChannels: () => t('sidebar.viewMoreChannels'),
    },
    test: {
      modalTitle: () => t('test.modalTitle'),
      openModal: () => t('test.openModal'),
      example: () => t('test.example'),
    },
  };
};

export const useContentTranslation = () => {
  const { t } = useTranslation('content');

  return {
    metadata: {
      noTitle: () => t('metadata.noTitle'),
      noDescription: () => t('metadata.noDescription'),
      noContent: () => t('metadata.noContent'),
      linkNoTitle: () => t('metadata.linkNoTitle'),
      linkNoDescription: () => t('metadata.linkNoDescription'),
    },
    states: {
      loading: () => t('states.loading'),
      cardLoading: () => t('states.cardLoading'),
      loadingFailed: () => t('states.loadingFailed'),
      empty: () => t('states.empty'),
      error: () => t('states.error'),
      errorSubtitle: () => t('states.errorSubtitle'),
    },
    interactions: {
      likeError: () => t('interactions.likeError'),
    },
    related: {
      empty: () => t('related.empty'),
      channelEmpty: () => t('related.channelEmpty'),
      channelContentEmpty: () => t('related.channelContentEmpty'),
    },
  };
};

export const useErrorTranslation = () => {
  const { t } = useTranslation('errors');

  return {
    general: {
      unknown: () => t('general.unknown'),
      network: () => t('general.network'),
      server: () => t('general.server'),
      unauthorized: () => t('general.unauthorized'),
      notFound: () => t('general.notFound'),
    },
    actions: {
      retry: () => t('actions.retry'),
      refresh: () => t('actions.refresh'),
      goBack: () => t('actions.goBack'),
      goHome: () => t('actions.goHome'),
    },
    specific: {
      loginFailed: () => t('specific.loginFailed'),
      uploadFailed: () => t('specific.uploadFailed'),
      loadFailed: () => t('specific.loadFailed'),
    },
  };
};

export const useImageTranslation = () => {
  const { t } = useTranslation('images');

  return {
    analysis: {
      categories: {
        smallOptimal: () => t('analysis.categories.smallOptimal'),
        mediumOptimal: () => t('analysis.categories.mediumOptimal'),
        largeWarning: () => t('analysis.categories.largeWarning'),
        veryLargeWarning: () => t('analysis.categories.veryLargeWarning'),
        tooLarge: () => t('analysis.categories.tooLarge'),
      },
      recommendations: {
        optimal: () => t('analysis.recommendations.optimal'),
        recommended: () => t('analysis.recommendations.recommended'),
        slowMobile: () => t('analysis.recommendations.slowMobile'),
        serverLimit: () => t('analysis.recommendations.serverLimit'),
        compressionNeeded: () => t('analysis.recommendations.compressionNeeded'),
        thumbnailLimit: () => t('analysis.recommendations.thumbnailLimit'),
        profileLimit: () => t('analysis.recommendations.profileLimit'),
      },
      warnings: {
        mobilePerformance: () => t('analysis.warnings.mobilePerformance'),
        serverLimitRisk: () => t('analysis.warnings.serverLimitRisk'),
        networkPerformance: () => t('analysis.warnings.networkPerformance'),
        serverOverLimit: () => t('analysis.warnings.serverOverLimit'),
        networkTimeout: () => t('analysis.warnings.networkTimeout'),
        userExperience: () => t('analysis.warnings.userExperience'),
      },
      logging: {
        sizeAnalysisTitle: (context: string) =>
          t('analysis.logging.sizeAnalysisTitle', { context }),
        sizeInfo: () => t('analysis.logging.sizeInfo'),
        base64Length: () => t('analysis.logging.base64Length'),
        estimatedSize: () => t('analysis.logging.estimatedSize'),
        category: () => t('analysis.logging.category'),
        warningsTitle: () => t('analysis.logging.warningsTitle'),
        recommendation: () => t('analysis.logging.recommendation'),
      },
    },
    validation: {
      reasons: {
        over1MB: () => t('validation.reasons.over1MB'),
        over2MB: () => t('validation.reasons.over2MB'),
        over4MB: () => t('validation.reasons.over4MB'),
      },
    },
  };
};

export const useFormsTranslation = () => {
  const { t } = useTranslation('forms');

  return {
    validation: {
      required: () => t('validation.required'),
      invalidFormat: () => t('validation.invalidFormat'),
      tooLong: () => t('validation.tooLong'),
      tooShort: () => t('validation.tooShort'),
      minimumLength: (min: number) => t('validation.minimumLength', { min }),
      maximumLength: (max: number) => t('validation.maximumLength', { max }),
    },
    placeholders: {
      name: () => t('placeholders.name'),
      email: () => t('placeholders.email'),
      title: () => t('placeholders.title'),
      description: () => t('placeholders.description'),
      search: () => t('placeholders.search'),
    },
    buttons: {
      submit: () => t('buttons.submit'),
      save: () => t('buttons.save'),
      cancel: () => t('buttons.cancel'),
      upload: () => t('buttons.upload'),
    },
    states: {
      submitting: () => t('states.submitting'),
      saving: () => t('states.saving'),
      loading: () => t('states.loading'),
      success: () => t('states.success'),
      error: () => t('states.error'),
    },
    file: {
      select: () => t('file.select'),
      dragDrop: () => t('file.dragDrop'),
      uploading: (progress: number) => t('file.uploading', { progress }),
      uploadSuccess: () => t('file.uploadSuccess'),
      uploadError: () => t('file.uploadError'),
    },
    media: {
      uploadBanner: () => t('media.uploadBanner'),
      uploadThumbnail: () => t('media.uploadThumbnail'),
      bannerPreview: () => t('media.bannerPreview'),
      thumbnailPreview: () => t('media.thumbnailPreview'),
    },
  };
};

export const useInvitationTranslation = () => {
  const { t } = useTranslation('invitations');

  return {
    title: () => t('title'),
    userSearch: {
      label: () => t('userSearch.label'),
      placeholder: () => t('userSearch.placeholder'),
    },
    personalMessage: {
      label: () => t('personalMessage.label'),
      placeholder: () => t('personalMessage.placeholder'),
    },
    actions: {
      send: () => t('actions.send'),
      cancel: () => t('actions.cancel'),
    },
    state: {
      sending: () => t('state.sending'),
      sent: () => t('state.sent'),
    },
    expiresIn: () => t('expiresIn'),
  };
};

export const useCommentTranslation = () => {
  const { t } = useTranslation('content');

  return {
    input: {
      placeholder: () => t('comments.input.placeholder'),
      signInPrompt: () => t('comments.input.signInPrompt'),
      signIn: () => t('comments.input.signIn'),
      posting: () => t('comments.input.posting'),
      reply: () => t('comments.input.reply'),
      comment: () => t('comments.input.comment'),
      save: () => t('comments.input.save'),
      cancel: () => t('comments.input.cancel'),
      charCount: (count: number) => t('comments.input.charCount', { count }),
      shortcut: () => t('comments.input.shortcut'),
      replyPlaceholder: () => t('comments.input.replyPlaceholder'),
    },
    item: {
      edit: () => t('comments.item.edit'),
      delete: () => t('comments.item.delete'),
      edited: () => t('comments.item.edited'),
      reply: () => t('comments.item.reply'),
      replies: (count: number) => t('comments.item.replies', { count }),
      deleteConfirm: () => t('comments.item.deleteConfirm'),
    },
    time: {
      now: () => t('comments.time.now'),
      minutesAgo: (minutes: number) => t('comments.time.minutesAgo', { minutes }),
      hoursAgo: (hours: number) => t('comments.time.hoursAgo', { hours }),
      daysAgo: (days: number) => t('comments.time.daysAgo', { days }),
    },
  };
};

export const usePostCardTranslation = () => {
  const { t } = useTranslation('common');

  return {
    actions: {
      pin: () => t('postCard.actions.pin'),
      comment: () => t('postCard.actions.comment'),
      share: () => t('postCard.actions.share'),
      save: () => t('postCard.actions.save'),
    },
    contentType: {
      image: () => t('postCard.contentType.image'),
      video: () => t('postCard.contentType.video'),
      link: () => t('postCard.contentType.link'),
      text: () => t('postCard.contentType.text'),
    },
    accessibility: {
      goToChannel: (channelName: string) =>
        t('postCard.accessibility.goToChannel', { channelName }),
      goToAuthor: (authorName: string) => t('postCard.accessibility.goToAuthor', { authorName }),
      openPost: () => t('postCard.accessibility.openPost'),
      pinPost: () => t('postCard.accessibility.pinPost'),
      commentOnPost: () => t('postCard.accessibility.commentOnPost'),
      sharePost: () => t('postCard.accessibility.sharePost'),
      savePost: () => t('postCard.accessibility.savePost'),
    },
  };
};

export const useAccessibilityTranslation = () => {
  const { t } = useTranslation('common');

  return {
    closeModal: () => t('accessibility.closeModal'),
    expandSidebar: () => t('accessibility.expandSidebar'),
    collapseSidebar: () => t('accessibility.collapseSidebar'),
    searchResults: () => t('accessibility.searchResults'),
    goBack: () => t('accessibility.goBack'),
    closeSidebar: () => t('accessibility.closeSidebar'),
    trendingTopics: () => t('accessibility.trendingTopics'),
    toggleDesignMode: () => t('accessibility.toggleDesignMode'),
    removeManager: () => t('accessibility.removeManager'),
    libraryNavigation: () => t('accessibility.libraryNavigation'),
    filtersNavigation: () => t('accessibility.filtersNavigation'),
    keyboardNavigation: () => t('accessibility.keyboardNavigation'),
    screenReaderInstructions: () => t('accessibility.screenReaderInstructions'),
    liveRegion: {
      contentLoaded: () => t('accessibility.liveRegion.contentLoaded'),
      pageChanged: () => t('accessibility.liveRegion.pageChanged'),
      searchCompleted: (count: number) => t('accessibility.liveRegion.searchCompleted', { count }),
      modalOpened: () => t('accessibility.liveRegion.modalOpened'),
      modalClosed: () => t('accessibility.liveRegion.modalClosed'),
      formSubmitted: () => t('accessibility.liveRegion.formSubmitted'),
      errorOccurred: (message: string) => t('accessibility.liveRegion.errorOccurred', { message }),
      successMessage: () => t('accessibility.liveRegion.successMessage'),
      dataUpdated: () => t('accessibility.liveRegion.dataUpdated'),
      navigationChanged: () => t('accessibility.liveRegion.navigationChanged'),
    },
    keyboard: {
      shortcuts: () => t('accessibility.keyboard.shortcuts'),
      enterToActivate: () => t('accessibility.keyboard.enterToActivate'),
      spaceToToggle: () => t('accessibility.keyboard.spaceToToggle'),
      escapeToClose: () => t('accessibility.keyboard.escapeToClose'),
      arrowKeysToNavigate: () => t('accessibility.keyboard.arrowKeysToNavigate'),
      tabToNavigate: () => t('accessibility.keyboard.tabToNavigate'),
      shiftTabToPrevious: () => t('accessibility.keyboard.shiftTabToPrevious'),
      homeToFirst: () => t('accessibility.keyboard.homeToFirst'),
      endToLast: () => t('accessibility.keyboard.endToLast'),
      pageUpDown: () => t('accessibility.keyboard.pageUpDown'),
      ctrlEnterToSubmit: () => t('accessibility.keyboard.ctrlEnterToSubmit'),
      altText: (key: string) => t('accessibility.keyboard.altText', { key }),
    },
  };
};

export const useProfileTranslation = () => {
  const { t } = useTranslation('profile');

  return {
    page: {
      title: () => t('page.title'),
      notFound: () => t('page.notFound'),
      notFoundDescription: () => t('page.notFoundDescription'),
      signInRequired: () => t('page.signInRequired'),
      signInRequiredDescription: () => t('page.signInRequiredDescription'),
      profileNotFound: () => t('page.profileNotFound'),
      profileNotFoundDescription: () => t('page.profileNotFoundDescription'),
      goToHome: () => t('page.goToHome'),
    },
    loading: {
      title: () => t('loading.title'),
      description: () => t('loading.description'),
    },
    error: {
      title: () => t('error.title'),
      description: () => t('error.description'),
      retry: () => t('error.retry'),
    },
    tabs: {
      myChannels: () => t('tabs.myChannels'),
      subscriptions: () => t('tabs.subscriptions'),
      bookmarks: () => t('tabs.bookmarks'),
      comments: () => t('tabs.comments'),
    },
    sidebar: {
      activityOverview: () => t('sidebar.activityOverview'),
      profileInfo: () => t('sidebar.profileInfo'),
      suiAddress: () => t('sidebar.suiAddress'),
      memberSince: () => t('sidebar.memberSince'),
      activeMember: () => t('sidebar.activeMember'),
      recentChannels: () => t('sidebar.recentChannels'),
      recentBookmarks: () => t('sidebar.recentBookmarks'),
      viewAll: () => t('sidebar.viewAll'),
      about: () => t('sidebar.about'),
      aboutDescription: () => t('sidebar.aboutDescription'),
      followUser: () => t('sidebar.followUser'),
    },
    stats: {
      myChannels: () => t('stats.myChannels'),
      subscriptions: () => t('stats.subscriptions'),
      bookmarks: () => t('stats.bookmarks'),
      comments: () => t('stats.comments'),
    },
    header: {
      edit: () => t('header.edit'),
      follow: () => t('header.follow'),
      activeMember: () => t('header.activeMember'),
    },
    editModal: {
      title: () => t('editModal.title'),
      profileImage: () => t('editModal.profileImage'),
      uploadImage: () => t('editModal.uploadImage'),
      changeImage: () => t('editModal.changeImage'),
      removeImage: () => t('editModal.removeImage'),
      imageHelper: () => t('editModal.imageHelper'),
      nickname: () => t('editModal.nickname'),
      nicknameLabel: () => t('editModal.nicknameLabel'),
      nicknamePlaceholder: () => t('editModal.nicknamePlaceholder'),
      nicknameHelper: () => t('editModal.nicknameHelper'),
      suiAddress: () => t('editModal.suiAddress'),
      suiAddressLabel: () => t('editModal.suiAddressLabel'),
      suiAddressPlaceholder: () => t('editModal.suiAddressPlaceholder'),
      suiAddressHelper: () => t('editModal.suiAddressHelper'),
      save: () => t('editModal.save'),
      saveChanges: () => t('editModal.saveChanges'),
      cancel: () => t('editModal.cancel'),
      saving: () => t('editModal.saving'),
      validation: {
        nicknameRequired: () => t('editModal.validation.nicknameRequired'),
        nicknameMinLength: () => t('editModal.validation.nicknameMinLength'),
        nicknameMaxLength: () => t('editModal.validation.nicknameMaxLength'),
        suiAddressInvalid: () => t('editModal.validation.suiAddressInvalid'),
        imageSize: () => t('editModal.validation.imageSize'),
        nicknameLength: () => t('editModal.validation.nicknameLength'),
      },
    },
    channels: {
      title: () => t('channels.title'),
      count: (count: number) => t('channels.count', { count }),
      createChannel: () => t('channels.createChannel'),
      createNew: () => t('channels.createNew'),
      noChannels: () => t('channels.noChannels'),
      noChannelsDescription: () => t('channels.noChannelsDescription'),
      failedToLoad: () => t('channels.failedToLoad'),
      failedToLoadDescription: () => t('channels.failedToLoadDescription'),
      viewChannel: () => t('channels.viewChannel'),
      inactive: () => t('channels.inactive'),
      subscribers: () => t('channels.subscribers'),
      contents: () => t('channels.contents'),
      created: () => t('channels.created'),
    },
    subscriptions: {
      title: () => t('subscriptions.title'),
      count: (count: number) => t('subscriptions.count', { count }),
      noSubscriptions: () => t('subscriptions.noSubscriptions'),
      noSubscriptionsDescription: () => t('subscriptions.noSubscriptionsDescription'),
      exploreChannels: () => t('subscriptions.exploreChannels'),
      failedToLoad: () => t('subscriptions.failedToLoad'),
      failedToLoadDescription: () => t('subscriptions.failedToLoadDescription'),
      subscribers: () => t('subscriptions.subscribers'),
      subscribed: () => t('subscriptions.subscribed'),
    },
    bookmarks: {
      title: () => t('bookmarks.title'),
      count: (count: number) => t('bookmarks.count', { count }),
      noBookmarks: () => t('bookmarks.noBookmarks'),
      noBookmarksDescription: () => t('bookmarks.noBookmarksDescription'),
      failedToLoad: () => t('bookmarks.failedToLoad'),
      failedToLoadDescription: () => t('bookmarks.failedToLoadDescription'),
      bookmarked: () => t('bookmarks.bookmarked'),
      from: () => t('bookmarks.from'),
      loadMore: () => t('bookmarks.loadMore'),
      loading: () => t('bookmarks.loading'),
      removeBookmark: () => t('bookmarks.removeBookmark'),
    },
    comments: {
      title: () => t('comments.title'),
      noComments: () => t('comments.noComments'),
      noCommentsDescription: () => t('comments.noCommentsDescription'),
      comingSoon: () => t('comments.comingSoon'),
      failedToLoad: () => t('comments.failedToLoad'),
      failedToLoadDescription: () => t('comments.failedToLoadDescription'),
    },
  };
};
