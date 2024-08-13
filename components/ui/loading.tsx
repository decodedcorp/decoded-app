import { bold_font } from "../helpers/util";

export function LoadingView() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <h1
        className={`${bold_font.className} text-7xl md:text-5xl loading-text p-5 mt-20`}
      ></h1>
    </div>
  );
}
