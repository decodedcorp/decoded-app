"use client";
import { useState } from "react";
import { main_font, secondary_font } from "./helpers/util";

function Footer() {
  const [isType, setIsType] = useState<boolean>(false);

  return (
    <footer className="bg-[#ffffff]">
      <div className="grid grid-cols-1 justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-10">
            <h1
              className={`font-bold ${main_font.className} text-4xl md:text-6xl dark:text-[#000000] text-[#FF204E]`}
            >
              "Delivery Service"
            </h1>
            <h2
              className={`${secondary_font.className} text-lg md:text-2xl opacity-50 text-[#000000] dark:text-[#ffffff]`}
            >
              "Unsubscribe any time"
            </h2>
          </div>
          <form className="flex flex-col items-center w-full">
            <div className="flex items-center w-[50%] mb-10">
              <input
                type="email"
                placeholder="*@*.com"
                className="w-full border-b-2 border-[#FF204E] dark:bg-[#ffffff] focus:outline-none text-black dark:text-white"
                onChange={(e) => {
                  if (e.target.value.length > 0) {
                    setIsType(true);
                  } else {
                    setIsType(false);
                  }
                }}
              />
              {isType ? (
                <button
                  type="submit"
                  className="p-1 bg-[#FF204E] text-white rounded-md mx-2"
                >
                  →
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
