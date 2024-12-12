import { pretendardBold } from "@/lib/constants/fonts";

export function LoadingView() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <h1
        className={`${pretendardBold.className} text-7xl md:text-5xl loading-text p-5 mt-20`}
      ></h1>
    </div>
  );
}
