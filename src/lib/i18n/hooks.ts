import { useTranslation } from 'react-i18next';

// Re-export centralized hooks for consistency
export { 
  useCommonTranslation, 
  useLanguageSwitch, 
  useLocaleStatus 
} from './centralizedHooks';

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
