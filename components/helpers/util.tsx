import localFont from "next/font/local";

export const main_font = localFont({
  src: "../../fonts/Blinker-Bold.ttf",
});

export const secondary_font = localFont({
  src: "../../fonts/Blinker-SemiBold.ttf",
});

export const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};
