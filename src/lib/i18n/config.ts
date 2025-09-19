import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import Korean translations
import koCommon from '@/locales/ko/common.json';
import koAuth from '@/locales/ko/auth.json';
import koChannels from '@/locales/ko/channels.json';
import koContent from '@/locales/ko/content.json';
import koForms from '@/locales/ko/forms.json';
import koErrors from '@/locales/ko/errors.json';
import koImages from '@/locales/ko/images.json';
import koInvitations from '@/locales/ko/invitations.json';
import koComments from '@/locales/ko/comments.json';
import koProfile from '@/locales/ko/profile.json';

// Import English translations
import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enChannels from '@/locales/en/channels.json';
import enContent from '@/locales/en/content.json';
import enForms from '@/locales/en/forms.json';
import enErrors from '@/locales/en/errors.json';
import enImages from '@/locales/en/images.json';
import enInvitations from '@/locales/en/invitations.json';
import enComments from '@/locales/en/comments.json';
import enProfile from '@/locales/en/profile.json';

const resources = {
  ko: {
    common: koCommon,
    auth: koAuth,
    channels: koChannels,
    content: koContent,
    forms: koForms,
    errors: koErrors,
    images: koImages,
    invitations: koInvitations,
    comments: koComments,
    profile: koProfile,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    channels: enChannels,
    content: enContent,
    forms: enForms,
    errors: enErrors,
    images: enImages,
    invitations: enInvitations,
    comments: enComments,
    profile: enProfile,
  },
};

// Initialize i18next only if not already initialized
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'ko', // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Namespace settings
    defaultNS: 'common',
    fallbackNS: 'common',

    // Load settings
    load: 'languageOnly',
    cleanCode: true,

    // Cache settings
    cache: {
      enabled: true,
      prefix: 'decoded_i18n_',
      expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    },

    // Development-only missing key warning
    ...(process.env.NODE_ENV === 'development' && {
      missingKeyHandler: (
        lngs: readonly string[],
        ns: string,
        key: string,
        fallbackValue: string,
      ) => {
        console.warn(
          `[i18n] Missing translation key: "${key}" in namespace "${ns}" for languages "${lngs.join(
            ', ',
          )}"`,
        );
      },
    }),
  });
}

export default i18n;
