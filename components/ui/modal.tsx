"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { FirebaseHelper } from "@/common/firebase";
import { NetworkManager } from "@/common/network";
import { setDoc, doc } from "firebase/firestore";
import { sha256 } from "js-sha256";
import { BrandInfo, ArtistInfo } from "@/types/model";
import { ConvertImageAndCompress } from "@/components/helpers/util";
import { getDownloadURL } from "firebase/storage";
import { HoverItemInfo } from "@/types/model";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  generateRandomness,
  generateNonce,
  jwtToAddress,
} from "@mysten/zklogin";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export const LoginModal = ({
  setIsLogin,
}: {
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathName = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    const login = async (token: string) => {
      const decoded_jwt = jwtDecode(token);
      const sub = decoded_jwt.sub;
      const iss = decoded_jwt.iss;
      const aud = decoded_jwt.aud;
      if (sub && iss && aud) {
        let docId = sha256(sub + iss + aud);
        try {
          const res = await NetworkManager.login(docId);
          const address = jwtToAddress(token, res.data.salt);
          setIsLogin(true);
          window.sessionStorage.setItem("USER_DOC_ID", docId);
          window.sessionStorage.setItem("SUI_ADDRESS", address);
        } catch (error) {
          setIsLogin(false);
        } finally {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("id_token");
      if (token) {
        login(token);
      }
    }
  }, [pathName]);

  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-2xl">Login</h3>
        <div className="modal-action items-center">
          <Button
            style={{
              backgroundColor: "#4285f4",
            }}
            variant="contained"
            onClick={async () => {
              const epk = Ed25519Keypair.generate();
              window.sessionStorage.setItem("EPK_SECRET", epk.getSecretKey());
              const randomness = generateRandomness();
              window.sessionStorage.setItem("RANDOMNESS", randomness);
              const rpcUrl = getFullnodeUrl("devnet");
              const suiClient = new SuiClient({
                url: rpcUrl,
              });
              const suiSysState = await suiClient.getLatestSuiSystemState();
              const currentEpoch = suiSysState.epoch;
              let maxEpoch: number = parseInt(currentEpoch) + 10;
              const nonce = generateNonce(
                epk.getPublicKey(),
                maxEpoch,
                randomness
              );
              console.log(nonce);
              const params = new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID!,
                redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
                response_type: "id_token",
                scope: "openid",
                nonce: nonce,
              });
              const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
              window.location.replace(loginURL);
            }}
          >
            Sign In With Google
          </Button>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export const ItemModal = (hoverItemInfo: { hoverItemInfo: HoverItemInfo }) => {
  return (
    <dialog
      id="my_modal_3"
      className="modal flex flex-col w-[500px] h-[800px] bg-white rounded-xl p-2 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <h1 className="text-xl font-bold p-2 border-b border-black-opacity-20 w-full mb-2 text-center">
        Add New Item
      </h1>
      <input
        type="text"
        placeholder="* Name"
        value={""}
        onChange={(e) => {}}
        className="input input-bordered w-full mb-2 dark:bg-white"
      />
      <div className="flex">
        <input
          type="text"
          placeholder="* Price"
          value={""}
          onChange={(e) => {}}
          className="input input-bordered w-full mb-2 dark:bg-white"
        />
      </div>
      <input
        type="text"
        placeholder="URL(Optional)"
        value={""}
        onChange={(e) => {}}
        className="input input-bordered w-full mb-2 dark:bg-white"
      />
      <input
        type="text"
        placeholder="Designer(Optinal)"
        value={""}
        onChange={(e) => {}}
        className="input input-bordered w-full mb-2 dark:bg-white"
      />
    </dialog>
  );
};

export const BrandModal = ({
  setIsDataAdded,
}: {
  setIsDataAdded: (isDataAdded: boolean) => void;
}) => {
  const [brandName, setBrandName] = useState<string>("");
  const [creativeDirector, setCreativeDirector] = useState<string[]>([]);
  const [brandCategory, setBrandCategory] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [logoImage, setLogoImage] = useState<File>();
  const [sns, setSns] = useState<Record<string, string>>({});

  const handleSnsUrlChange =
    (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSns({ ...sns, [type]: e.target.value });
    };

  const addBrandToFirebase = async () => {
    if (!brandName) {
      alert("브랜드 이름을 입력해주세요.");
      return;
    }

    if (
      !brandCategory ||
      !creativeDirector ||
      !websiteUrl ||
      !logoImage ||
      !sns
    ) {
      alert("Brand category or creative director is not set!");
      return;
    }

    const imageFile = await ConvertImageAndCompress(logoImage, 1, 1280);

    const imageName = brandName + "_logo";
    const path = "logos/" + imageName;
    // Upload image to storage
    const res = await FirebaseHelper.uploadDataToStorage(path, imageFile);
    const url = await getDownloadURL(res.ref);
    const newBrandInfo: BrandInfo = {
      name: brandName,
      creativeDirector: creativeDirector,
      category: brandCategory,
      websiteUrl: websiteUrl,
      logoImageUrl: url,
      sns: sns,
      tags: {},
    };
    await setDoc(
      doc(FirebaseHelper.db(), "brands", sha256(brandName)),
      newBrandInfo
    );
    setIsDataAdded(true);
    setBrandName(""); // 입력 필드 초기화
    setCreativeDirector([]);
    setBrandCategory("");
    setWebsiteUrl("");
    setLogoImage(undefined);
    setSns({});
    alert("Brand is added!");
  };

  return (
    <dialog
      id="my_modal_2"
      className="modal flex flex-col w-[500px] h-[800px] bg-white rounded-xl p-2 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
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
        <div>
          <p className="text-md font-bold mb-2">Website</p>
          <input
            type="text"
            placeholder="Website URL"
            className="input input-bordered w-full mb-2 dark:bg-white"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>

        <div>
          <p className="text-md font-bold mb-2">Logo</p>
          <input
            type="file"
            accept="image/*"
            className="input w-full mb-2 dark:bg-white"
            onChange={(e) => e.target.files && setLogoImage(e.target.files[0])}
          />
        </div>

        <div>
          <p className="text-md font-bold mb-2">SNS</p>
          {Object.values(SnsType).map((snsType) => (
            <div key={snsType}>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                {snsType.toUpperCase()} URL
              </label>
              <input
                type="text"
                placeholder={`Enter ${snsType} URL`}
                className="input input-bordered w-full mb-4 dark:bg-white"
                value={sns[snsType] || ""}
                onChange={handleSnsUrlChange(snsType)}
              />
            </div>
          ))}
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

export const ArtistModal = ({
  setIsDataAdded,
}: {
  setIsDataAdded: (isDataAdded: boolean) => void;
}) => {
  const [artistName, setArtistName] = useState<string>("");
  const [artistCategories, setArtistCategories] = useState<string[]>([]);
  const [aka, setAka] = useState<string[]>([]);
  const [group, setGroup] = useState<string>("");
  const [snsUrls, setSnsUrls] = useState<Record<string, string>>({});

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setArtistCategories(selectedOptions);
  };

  const handleSnsUrlChange =
    (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSnsUrls({ ...snsUrls, [type]: e.target.value });
    };

  const handleAkaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const akaArray = e.target.value.split(",").map((item) => item.trim()); // 쉼표로 분리하고 공백 제거
    setAka(akaArray);
  };

  const addArtistToFirebase = async () => {
    if (!artistName || artistCategories.length === 0) {
      alert("필수 입력 항목을 입력해주세요.");
      return;
    }
    const newArtistInfo: ArtistInfo = {
      name: artistName,
      category: artistCategories,
      also_known_as: aka,
      group: group,
      sns: snsUrls,
      tags: {},
    };
    await FirebaseHelper.setDoc("artists", sha256(artistName), newArtistInfo);
    // set to null
    setArtistName("");
    setArtistCategories([]);
    setAka([]);
    setGroup("");
    setSnsUrls({});
    setIsDataAdded(true);
    alert("Artist is added!");
  };

  return (
    <dialog
      id="my_modal_1"
      className="modal flex flex-col w-[500px] h-[700px] bg-white rounded-xl p-2 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <h1 className="text-xl font-bold p-2 border-b border-black-opacity-20 w-full mb-2 text-center">
        Add Artist
      </h1>
      <div className="flex flex-col p-2 w-full">
        <div>
          <p className="text-md font-bold mb-2">Artist Detail</p>
          <input
            type="text"
            placeholder="아티스트 이름"
            className="input input-bordered w-full mb-2 dark:bg-white"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
          <div>
            <input
              type="text"
              placeholder="a.k.a (comma separated)"
              className="input input-bordered w-full mb-2 dark:bg-white"
              value={aka.join(", ")} // 배열을 쉼표로 조합하여 문자열로 변환
              onChange={handleAkaChange}
            />
          </div>
          <input
            type="text"
            placeholder="그룹"
            className="input input-bordered w-full mb-2 dark:bg-white"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <div>
            <p className=" text-md font-bold mb-2">SNS</p>
            {Object.values(SnsType).map((snsType) => (
              <div key={snsType}>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  {snsType.toUpperCase()} URL
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${snsType} URL`}
                  className="input input-bordered w-full mb-4 dark:bg-white"
                  value={snsUrls[snsType] || ""}
                  onChange={handleSnsUrlChange(snsType)}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-md font-bold mb-2">Category</p>
          <select
            multiple={true}
            className="dark:bg-white w-full"
            value={artistCategories}
            onChange={handleCategoryChange}
          >
            {Object.values(ArtistCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="btn btn-primary mt-10 w-full"
        onClick={addArtistToFirebase}
      >
        추가
      </button>
    </dialog>
  );
};

enum SnsType {
  Instagram = "instagram",
  Youtube = "youtube",
}

enum ArtistCategory {
  Photographer = "photographer",
  Videographer = "videographer",
  Designer = "designer",
  Model = "model",
  Musician = "musician",
  Actor = "actor",
  Artist = "artist",
  KPop = "kpop",
  Rapper = "rapper",
  Producer = "producer",
}

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
