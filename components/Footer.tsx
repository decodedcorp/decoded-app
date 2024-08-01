"use client";
import { useState } from "react";
import Image from "next/image";
import { bold_font, semi_bold_font } from "./helpers/util";
import white_logo from "@/assets/white_logo.png";
import { regular_font } from "./helpers/util";

function Footer() {
  const [isType, setIsType] = useState<boolean>(false);

  return (
    <footer className="footer p-20 mt-20 border-t-2 border-gray-500/50">
      <div className="flex w-full">
        <Image src={white_logo} alt="logo" width={200} height={200} />
        <div className={`flex flex-col ${regular_font.className} mx-32`}>
          <h2 className="text-lg">디코디드(주)</h2>
          <div className="flex flex-col mt-4">
            <h3 className="text-sm">
              서울시 강남구 도산대로 156(논현동) | 대표자 : 정소윤, 곽동호
            </h3>
            <h3 className="text-sm mt-2">
              사업자등록번호 : 123-45-67890 | 통신판매업신고번호 :
              2024-서울강남-0000
            </h3>
            <h3 className="text-sm mt-2">
              이메일 : decoded.eth | 전화번호 : 02-1234-5678
            </h3>
            <h3 className="text-sm mt-2">
              Copyright 2024. Decoded. All rights reserved.
            </h3>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
