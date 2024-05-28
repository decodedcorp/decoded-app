"use client";
import { main_font, secondary_font } from "./helpers/util";

function Footer() {
  return (
    <footer className="bg-[#ffffff] border-2 border-black rounded-md">
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center mb-20">
          <div className="flex flex-col items-center mb-10">
            <h1
              className={`font-bold ${main_font.className} text-5xl p-5 dark:text-[#000000] text-[#FF204E]`}
            >
              "TAGGED Delivery Service"
            </h1>
            <h2
              className={`${secondary_font.className} text-xl opacity-50 dark:text-[#000000]`}
            >
              "Unsubscribe any time"
            </h2>
          </div>
          <form className="flex flex-col items-center">
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Write Your Email"
                className="p-2 border-b border-[#FF204E] w-[500px] dark:bg-[#ffffff] focus:outline-none text-black dark:text-white"
              />
              <button
                type="submit"
                className="p-1 bg-[#FF204E] text-white rounded-md mx-2"
                onClick={() => {
                  alert("WIP");
                }}
              >
                →
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={`${main_font.className} text-center font-bold rounded-md p-4 text-xl text-black`}
      >
        © 2023 TAGGED PLATFORM
      </div>
    </footer>
  );
}

export default Footer;
