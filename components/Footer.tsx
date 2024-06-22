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
        </div>
      </div>
    </footer>
  );
}

export default Footer;
