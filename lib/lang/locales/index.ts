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

export const langMap = {
  ko: {
    home: koHome,
    header: koHeader,
    footer: koFooter,
    common: koCommon,
    request: koRequest,
  },
  en: {
    home: enHome,
    header: enHeader,
    footer: enFooter,
    common: enCommon,
    request: enRequest,
  },
} as const;

export type Locale = keyof typeof langMap;
