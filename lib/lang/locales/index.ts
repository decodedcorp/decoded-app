import { home as koHome } from "./ko/home";
import { home as enHome } from "./en/home";
import { header as koHeader } from "./ko/header";
import { header as enHeader } from "./en/header";
import { footer as koFooter } from "./ko/footer";
import { footer as enFooter } from "./en/footer";
import { common as koCommon } from "./ko/common";
import { common as enCommon } from "./en/common";
import { request as koRequest } from "./ko/request";
import { request as enRequest } from "./en/request";
import { provide as koProvide } from "./ko/provide";
import { provide as enProvide } from "./en/provide";
import { mypage as koMypage } from "./ko/mypage";
import { mypage as enMypage } from "./en/mypage";
import { privacyPolicy as koPrivacyPolicy } from "./ko/privacy-policy";
import { privacyPolicy as enPrivacyPolicy } from "./en/privacy-policy";
import { termsOfService as koTermsOfService } from "./ko/terms-of-service";
import { termsOfService as enTermsOfService } from "./en/terms-of-service";

export const langMap = {
  ko: {
    home: koHome,
    header: koHeader,
    footer: koFooter,
    common: koCommon,
    request: koRequest,
    provide: koProvide,
    mypage: koMypage,
    privacyPolicy: koPrivacyPolicy,
    termsOfService: koTermsOfService,
  },
  en: {
    home: enHome,
    header: enHeader,
    footer: enFooter,
    common: enCommon,
    request: enRequest,
    provide: enProvide,
    mypage: enMypage,
    privacyPolicy: enPrivacyPolicy,
    termsOfService: enTermsOfService,
  },
} as const;

export type Locale = keyof typeof langMap;
