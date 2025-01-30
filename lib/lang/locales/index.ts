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

export const langMap = {
  ko: {
    home: koHome,
    header: koHeader,
    footer: koFooter,
    common: koCommon,
    request: koRequest,
    provide: koProvide,
    mypage: koMypage,
  },
  en: {
    home: enHome,
    header: enHeader,
    footer: enFooter,
    common: enCommon,
    request: enRequest,
    provide: enProvide,
    mypage: enMypage,
  },
} as const;

export type Locale = keyof typeof langMap;
