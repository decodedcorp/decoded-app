"use client";
import Image from "next/image";
import { useState, ChangeEvent, useEffect } from "react";
import {
  TaggedItem,
  HoverItem,
  ItemInfo,
  ImageInfo,
  BrandInfo,
} from "@/types/model";
import { FirebaseHelper } from "@/common/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  QuerySnapshot,
} from "firebase/firestore";
import {
  main_font,
  getByteSize,
  create_doc_id,
} from "@/components/helpers/util";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { ConvertImageAndCompress } from "@/components/helpers/util";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AdminLogin from "../admin/page";
import { sha256 } from "js-sha256";

function AdminDashboard() {
  const [isLogin, setIsLogin] = useState(false);
  const [_adminEmail, setAdminEmail] = useState("");
  const [_adminPassword, setAdminPassword] = useState("");
  const [brands, setBrands] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      if (!isLogin) return;
      const db = FirebaseHelper.db();
      console.log("Fetching brands...");
      const querySnapshot = await getDocs(collection(db, "brands"));
      const fetchedBrands: string[] = [];
      querySnapshot.forEach((doc) => {
        const brand = doc.data() as BrandInfo;
        fetchedBrands.push(brand.name);
      });
      setBrands(fetchedBrands);
    };
    fetchBrands();
  }, [isLogin]);

  return !isLogin ? (
    <AdminLogin
      setAdminEmail={setAdminEmail}
      setAdminPassword={setAdminPassword}
      setIsLogin={setIsLogin}
    />
  ) : (
    <div>
      <UploadImageSection brands={brands} setBrands={setBrands} />
      <RequestListSection />
    </div>
  );
}

function UploadImageSection({
  brands,
  setBrands,
}: {
  brands: string[] | null;
  setBrands: (brands: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoverItems, setHoverItems] = useState<HoverItem[]>([]);
  const [currency, setCurrency] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [artistName, setArtistName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [hoverItemFiles, setHoverItemFiles] = useState<{
    [key: number]: File | null;
  }>({});

  const upload = async () => {
    if (!fileName || !imageName || !file || !artistName || !description) {
      alert("Required fields are empty!");
      return;
    }
    setIsUploading(true);
    let taggedItems = await handleUploadHoverItem();
    if (taggedItems instanceof Error) {
      console.error("Error saving hover item:", taggedItems);
      alert("Error saving hover item!");
      return;
    }
    let res = await handleUploadImage(taggedItems);
    const image_doc_id = sha256(await file.arrayBuffer());
    const item_doc_ids = taggedItems.map((item) => {
      return item.id;
    });
    const artist_doc_id = create_doc_id(artistName);
  };

  const reset = () => {
    setSelectedImage(null);
    setFile(null);
    setFileName("");
    setImageName(null);
    setHoverItems([]);
    setSelectedPointIndex(null);
    setArtistName(null);
    setDescription(null);
    setExpandedSections({});
    setHoverItemFiles({});
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const removePoint = (index: number) => {
    const updatedHoverItems = hoverItems.filter(
      (_, itemIndex) => itemIndex !== index
    );
    setHoverItems(updatedHoverItems);
    setSelectedPointIndex(null);
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setSelectedImage(fileURL);
      setFile(file);
      setHoverItems([]);
    }
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const topPercent = `${((y / rect.height) * 100).toFixed(2)}%`;
    const leftPercent = `${((x / rect.width) * 100).toFixed(2)}%`;

    console.log(topPercent, leftPercent);
    setHoverItems([
      ...hoverItems,
      {
        pos: { top: topPercent, left: leftPercent },
        info: {
          name: "",
          price: ["", ""],
          hyped: 0,
          affiliateUrl: "",
          imageUrl: "",
          category: "",
          tags: {},
          description: "",
        },
      },
    ]);
  };

  const handleMetadataChange = (
    index: number,
    field: keyof ItemInfo,
    value: number | string | string[]
  ) => {
    const updatedHoverItems = [...hoverItems];
    if (field === "tags") {
      return;
    } else if (field === "hyped") {
      updatedHoverItems[index].info[field] = value as number;
    } else if (field === "price") {
      updatedHoverItems[index].info[field] = [value as string, currency];
    } else {
      updatedHoverItems[index].info[field] = value as string;
    }
    console.log(hoverItems[index]);
    setHoverItems(updatedHoverItems);
  };

  const handleHoverItemImageChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setHoverItemFiles((prev) => ({ ...prev, [index]: file }));
    } else {
      console.log("No file selected");
    }
  };

  const handleUploadImage = async (taggedItems: TaggedItem[]) => {
    const imageInfo: ImageInfo = {
      title: imageName!,
      description: description!,
      hyped: 0,
      taggedItem: taggedItems,
      updateAt: new Date(),
      tags: {},
    };
    try {
      const image = await ConvertImageAndCompress(file!, 1, 1280);
      const storageRef = FirebaseHelper.storageRef("images/" + fileName);
      const snapshot = await uploadBytes(storageRef, image);
      if (snapshot.metadata.md5Hash) {
        await setDoc(
          doc(FirebaseHelper.db(), "images", snapshot.metadata.md5Hash),
          imageInfo
        );
      } else {
        alert("Error saving image detail!");
        return;
      }
      console.log("Original File Size (KB):", (file!.size / 1024).toFixed(2));
      console.log("Compressed File Size (KB):", (image.size / 1024).toFixed(2));
      reset();
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error saving image detail:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadHoverItem = async (): Promise<TaggedItem[] | Error> => {
    var taggedItems: TaggedItem[] = [];
    for (let index = 0; index < hoverItems.length; index++) {
      const hoverFile = hoverItemFiles[index];
      let hoverItem = hoverItems[index];
      const storage_file_name = hoverItem.info.name
        .replace(/\s+/g, "_")
        .toLowerCase();
      let downloadUrl = "";
      if (
        hoverFile &&
        (hoverFile.type.includes("jpeg") ||
          hoverFile.type.includes("png") ||
          hoverFile.type.includes("webp") ||
          hoverFile.type.includes("avif"))
      ) {
        try {
          console.log("Trying to convert to webp...");
          const itemImage = await ConvertImageAndCompress(hoverFile, 1, 1280);
          console.log("Convert & Compress done!");
          console.log("Creating storage ref items/", storage_file_name);
          // TODO: Duplicate check
          const hoverItemRef = FirebaseHelper.storageRef(
            "items/" + storage_file_name
          );
          const snapshot = await uploadBytes(hoverItemRef, itemImage);
          downloadUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Error saving item image:", error, hoverItem);
          alert("Error saving item image!");
          return new Error("Error saving item image!");
        }
      } else {
        alert(
          "Image file format is not valid! Should be either jpeg, png, webp, avif"
        );
        setIsUploading(false);
        return new Error("Image file format is not valid!");
      }
      hoverItem.info.imageUrl = downloadUrl;
      const doc_id = create_doc_id(storage_file_name);
      console.log("Set document for ", doc_id);
      await setDoc(doc(FirebaseHelper.db(), "items", doc_id), hoverItem.info);
      console.log("Done!");
      taggedItems.push({ id: doc_id, pos: hoverItem.pos });
    }
    return taggedItems;
  };

  const addBrandToFirebase = async () => {
    if (!newBrand) {
      alert("브랜드 이름을 입력해주세요.");
      return;
    }
    const db = FirebaseHelper.db();
    const brandRef = collection(db, "brands");
    const newBrandInfo: BrandInfo = {
      name: newBrand,
      websiteUrl: "",
      logoImageUrl: "",
      sns: {},
      tags: {},
    };
    await setDoc(
      doc(FirebaseHelper.db(), "brands", sha256(newBrand)),
      newBrandInfo
    );
    setBrands([...(brands || []), newBrand]); // 브랜드 목록 업데이트
    setNewBrand(""); // 입력 필드 초기화
    alert("브랜드가 추가되었습니다.");
  };

  const filteredBrands = brands?.filter((brand) =>
    brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto p-3 border-l-2 border-r-2 border-b-2 border-black rounded-md">
      <h1 className={`text-2xl font-bold mb-5 ${main_font.className}`}>
        Upload
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <input type="file" onChange={handleImageChange} className="mb-4" />
        {/* Image Section */}
        <div className="flex-1">
          {selectedImage && (
            <div
              className="rounded-lg shadow-lg overflow-hidden mt-10"
              style={{
                width: "100%",
                maxWidth: "400px",
                aspectRatio: "3/4",
                position: "relative",
              }}
            >
              <Image
                src={selectedImage}
                alt="Featured fashion"
                layout="fill"
                objectFit="cover"
                onClick={handleImageClick}
              />
              {hoverItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute w-3 h-3 bg-blue-500 rounded-full ${
                    index === selectedPointIndex
                      ? "opacity-100 point-animation"
                      : "opacity-50"
                  }`}
                  style={{
                    top: item.pos.top,
                    left: item.pos.left,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => setSelectedPointIndex(index)}
                ></div>
              ))}
            </div>
          )}
        </div>
        {/* HoverItem Section */}
        <div className="flex-1 space-y-4 align-top justify-between">
          {hoverItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col p-4 border-b border-gray-200 items-center "
            >
              <div className="flex flex-1 w-full justify-between">
                <h3 className="mb-2 text-lg font-semibold">
                  Point {index + 1}
                </h3>
                <div>
                  <button
                    onClick={() => toggleSection(index)}
                    className="btn btn-info btn-sm"
                  >
                    {expandedSections[index] ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => removePoint(index)}
                    className="btn btn-error btn-xs ml-5"
                  >
                    X
                  </button>
                </div>
              </div>
              <div
                className="flex flex-1 justify-between"
                onClick={() => setSelectedPointIndex(index)}
              >
                {expandedSections[index] && (
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={item.info.name}
                      onChange={(e) => {
                        handleMetadataChange(index, "name", e.target.value);
                      }}
                      className="input input-bordered w-full mb-2 dark:bg-white"
                    />
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Price"
                        value={item.info.price?.[0] || ""}
                        onChange={(e) => {
                          handleMetadataChange(index, "price", e.target.value);
                        }}
                        className="input input-bordered w-full mb-2 dark:bg-white"
                      />
                      <select
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                        }}
                        className="input w-20 mb-2 dark:bg-white"
                      >
                        {Object.values(Currency).map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="URL"
                      value={item.info.affiliateUrl}
                      onChange={(e) => {
                        handleMetadataChange(
                          index,
                          "affiliateUrl",
                          e.target.value
                        );
                      }}
                      className="input input-bordered w-full mb-2 dark:bg-white"
                    />
                    <div className="flex">
                      <select
                        value={item.info.category}
                        onChange={(e) => {
                          handleMetadataChange(
                            index,
                            "category",
                            e.target.value
                          );
                        }}
                        className="input input-bordered w-full mb-2 dark:bg-white"
                      >
                        <option value={ItemCategory.Clothing}>Clothing</option>
                        <option value={ItemCategory.Accessory}>
                          Accessory
                        </option>
                        <option value={ItemCategory.Shoes}>Shoes</option>
                        <option value={ItemCategory.Bag}>Bag</option>
                        <option value={ItemCategory.Paint}>Paint</option>
                        <option value={ItemCategory.Furniture}>
                          Furniture
                        </option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="브랜드 검색..."
                        className="input input-bordered w-full mb-2 dark:bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // 검색어 상태 업데이트
                      />
                      <select className="input input-bordered w-full mb-2 dark:bg-white">
                        {filteredBrands?.map((brand, index) => (
                          <option key={index} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                      {filteredBrands?.length == 0 && (
                        <>
                          {" "}
                          <input
                            type="text"
                            placeholder="새 브랜드 추가"
                            className="input input-bordered w-full mb-2 dark:bg-white"
                            value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)}
                          />
                          <button
                            onClick={addBrandToFirebase}
                            className="btn btn-primary w-full"
                          >
                            브랜드 추가
                          </button>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleHoverItemImageChange(index, e)}
                      className="input w-full dark:bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div className="p-4 border-t border-gray-200">
          <input
            type="text"
            placeholder="File Name (e.g rose_in_nyc)"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="input input-bordered w-full mb-2 dark:bg-white"
          />
          <input
            type="text"
            placeholder="Image Title (e.g Rose in NYC)"
            value={imageName || ""}
            onChange={(e) => setImageName(e.target.value)}
            className="input input-bordered w-full mb-2 dark:bg-white"
          />
          <input
            type="text"
            placeholder="Artist Name(e.g rose)"
            value={artistName || ""}
            onChange={(e) => setArtistName(e.target.value)}
            className="input input-bordered w-full mb-2 dark:bg-white"
          />
          {/* TODO: Replace with generated by LLM */}
          <input
            type="text"
            placeholder="Description"
            value={description || ""}
            onChange={(e) => {
              const inputText = e.target.value;
              if (getByteSize(inputText) <= 500) {
                setDescription(inputText);
              }
            }}
            className="input input-bordered w-full mb-2 dark:bg-white"
          />
          <button
            onClick={upload}
            className="btn btn-primary mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600"
          >
            {isUploading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function RequestListSection() {
  // Mock 데이터
  const requests = [
    {
      request_id: 1,
      description: "새로운 아이템 추가 요청",
      name: "아이템1",
      status: "대기중",
    },
    {
      request_id: 2,
      description: "가격 업데이트 요청",
      name: "아이템2",
      status: "완료",
    },
    {
      request_id: 3,
      description: "제품 정보 수정",
      name: "아이템3",
      status: "진행중",
    },
  ];

  return (
    <div
      className={`p-4 text-2xl font-bold ${main_font.className} border-l-2 border-r-2 border-b-2 border-black rounded-md`}
    >
      <h2>Requests</h2>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Request ID</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.request_id}>
              <td className="border px-4 py-2">{request.request_id}</td>
              <td className="border px-4 py-2">{request.description}</td>
              <td className="border px-4 py-2">{request.name}</td>
              <td className="border px-4 py-2">{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

enum Platform {
  X = "X",
  TikTok = "TikTok",
  Instagram = "Instagram",
  LinkedIn = "LinkedIn",
  YouTube = "YouTube",
}

enum ItemCategory {
  Clothing = "clothing",
  Paint = "paint",
  Furniture = "furniture",
  Accessory = "accessory",
  Shoes = "shoes",
  Bag = "bag",
}

enum Currency {
  USD = "USD",
  KRW = "KRW",
  EUR = "EUR",
  JPY = "JPY",
  GBP = "GBP",
}

export default AdminDashboard;
