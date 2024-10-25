
import { sha256 } from "js-sha256";

export const isProd = process.env.NODE_ENV === "production";

export const hash = (str: string) => {
  return sha256(str);
};
