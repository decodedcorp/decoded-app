import React from "react";
import { main_font, secondary_font } from "./helpers/util";

function Footer() {
  return (
    <footer className="bg-[#000000]">
      <div
        className={`${main_font.className} text-center text-3xl font-bold border-2 border-black p-5 rounded-md`}
      >
        TAGGED
      </div>
      <div className="grid grid-cols-4 rounded-md border-r-2 border-l-2 border-black p-2">
        <div className={`${secondary_font.className}`}>
          <h3 className="font-bold mb-3">MENU</h3>
          {/* <ul>
            <li>News</li>
            <li>About</li>
            <li>Magazine</li>
            <li>Shop</li>
          </ul> */}
        </div>
        <div className={`${secondary_font.className}`}>
          <h3 className="font-bold mb-3">INFORMATION</h3>
          {/* <ul>
            <li>Terms & Conditions</li>
            <li>Archive</li>
            <li>Future Academy 2.0</li>
            <li>Careers</li>
          </ul> */}
        </div>
        <div className={`${secondary_font.className}`}>
          <h3 className="font-bold mb-3">NEWS</h3>
          {/* <ul>
            <li>Style</li>
            <li>Music</li>
            <li>Culture</li>
            <li>Beauty</li>
            <li>Society</li>
            <li>Life</li>
          </ul> */}
        </div>
        <div>
          <h3 className={`font-bold mb-3 ${secondary_font.className}`}>
            SUBSCRIBE
          </h3>
          <form>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="p-2 border border-gray-300 rounded-xl"
              />
              <button
                type="submit"
                className="p-2 bg-red-700 text-white rounded-xl mx-2"
              >
                →
              </button>
            </div>
            <div className="mt-2">
              <input
                type="checkbox"
                id="dataProcessing"
                name="dataProcessing"
              />
              <label htmlFor="dataProcessing" className="text-xs ml-2">
                I agree to the processing of personal data
              </label>
            </div>
          </form>
        </div>
      </div>
      <div className="text-center border-2 font-bold border-black rounded-md p-4">
        © 2023 TAGGED PLATFORM
      </div>
    </footer>
  );
}

export default Footer;
