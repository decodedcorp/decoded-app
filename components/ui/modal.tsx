"use client";

import { useState } from "react";
import { FirebaseHelper } from "@/common/firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { sha256 } from "js-sha256";
import { BrandInfo } from "@/types/model";

export const Modal = () => {
  const [brandName, setBrandName] = useState<string>("");
  const [creativeDirector, setCreativeDirector] = useState<string[]>([]);
  const [brandCategory, setBrandCategory] = useState<string>("");

  const addBrandToFirebase = async () => {
    if (!brandName) {
      alert("브랜드 이름을 입력해주세요.");
      return;
    }

    if (!brandCategory || !creativeDirector) {
      alert("Brand category or creative director is not set!");
      return;
    }
    const newBrandInfo: BrandInfo = {
      name: brandName,
      creativeDirector: creativeDirector,
      category: brandCategory,
      websiteUrl: "",
      logoImageUrl: "",
      sns: {},
      tags: {},
    };
    await setDoc(
      doc(FirebaseHelper.db(), "brands", sha256(brandName)),
      newBrandInfo
    );
    setBrandName(""); // 입력 필드 초기화
    alert("Brand is added!");
  };

  return (
    <dialog
      id="my_modal_2"
      className="modal flex flex-col w-[500px] h-[400px] bg-white rounded-xl p-2 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <h1 className="text-xl font-bold p-2 border-b border-black-opacity-20 w-full mb-2 text-center">
        Add New Brand
      </h1>
      <div className="flex flex-col p-2 w-full">
        <div>
          <p className="text-md font-bold mb-2">Brand Detail</p>
          <input
            type="text"
            placeholder="새 브랜드 추가"
            className="input input-bordered w-full mb-2 dark:bg-white"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Creative Director"
            className="input input-bordered w-full mb-2 dark:bg-white"
            value={creativeDirector.join(", ")}
            onChange={(e) => {
              setCreativeDirector(
                e.target.value.split(",").map((cd) => cd.trim())
              );
            }}
          />
        </div>
        <div>
          <p className="text-md font-bold mb-2">Category</p>
          <select
            className="dark:bg-white w-full"
            value={brandCategory}
            onChange={(e) => setBrandCategory(e.target.value)}
          >
            {Object.values(BrandCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="btn btn-primary mt-10 w-full"
        onClick={addBrandToFirebase}
      >
        추가
      </button>
    </dialog>
  );
};

enum BrandCategory {
  Lux = "lux",
  Street = "street",
  Clothes = "clothes",
  Sports = "sports",
  Jewelry = "jewelry",
  Watch = "watch",
  Furniture = "furniture",
  Magazine = "magzine",
  Glasses = "glasses",
  Accessory = "acccesory",
  Shoes = "shoes",
  Bag = "bag",
  Paint = "paint",
  Design = "design",
  Art = "art",
  Music = "music",
  Beauty = "beauty",
  Food = "food",
  Games = "games",
  Travel = "travel",
  Entertainment = "entertainment",
  Edit = "edit",
}
