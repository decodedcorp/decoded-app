"use client";
import Image from "next/image";
import { useState, ChangeEvent } from "react";
import {
  TaggedItem,
  HoverItem,
  ItemMetadata,
  ImageDetail,
} from "@/types/model";
import { FirebaseHelper } from "@/common/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { main_font } from "@/components/helpers/util";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

function AdminDashboard() {
  return (
    <div>
      <UploadImageSection />
      <RequestListSection />
    </div>
  );
}

function UploadImageSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoverItems, setHoverItems] = useState<HoverItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageTags, setImageTags] = useState<string[]>([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [hoverItemFiles, setHoverItemFiles] = useState<{
    [key: number]: File | null;
  }>({});

  const reset = () => {
    setSelectedImage(null);
    setFile(null);
    setFileName("");
    setImageName(null);
    setImageTags([]);
    setHoverItems([]);
    setSelectedPointIndex(null);
    setExpandedSections({});
    setHoverItemFiles({});
  };

  const upload = async () => {
    if (!fileName || !imageName || !file || imageTags.length === 0) {
      alert("Required fields are empty!");
      return;
    }
    const taggedItems: TaggedItem[] = [];
    for (let index = 0; index < hoverItems.length; index++) {
      // hoverItemFiles에서 해당 인덱스의 파일 업로드
      const hoverFile = hoverItemFiles[index];
      let hoverItem = hoverItems[index];
      let downloadUrl = "";
      if (
        hoverFile &&
        (hoverFile.type.includes("jpeg") || hoverFile.type.includes("png"))
      ) {
        try {
          const hoverFileOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          };
          const compressedHoverFile = await imageCompression(
            hoverFile,
            hoverFileOptions
          );
          const hoverItemRef = FirebaseHelper.storageRef(
            "items/" + hoverItem.metadata.name
          );
          const snapshot = await uploadBytes(hoverItemRef, compressedHoverFile);
          downloadUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Error saving hover item image:", error, hoverItem);
          continue;
        }
      } else {
        alert("Image file is not valid!");
        return;
      }
      hoverItem.metadata.imageUrl = downloadUrl;
      const docRef = await addDoc(
        collection(FirebaseHelper.db(), "items"),
        hoverItem.metadata
      );
      taggedItems.push({ id: docRef.id, position: hoverItem.position });
    }
    const imageDetail: ImageDetail = {
      name: imageName,
      taggedItem: taggedItems,
      updateAt: new Date(),
      tags: imageTags,
    };
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const storageRef = FirebaseHelper.storageRef("images/" + fileName);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      if (snapshot.metadata.md5Hash) {
        await setDoc(
          doc(FirebaseHelper.db(), "images", snapshot.metadata.md5Hash),
          imageDetail
        );
      } else {
        alert("Error saving image detail!");
        return;
      }
      console.log("Original File Size (KB):", (file.size / 1024).toFixed(2));
      console.log(
        "Compressed File Size (KB):",
        (compressedFile.size / 1024).toFixed(2)
      );
      reset();
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error saving image detail:", error);
    }
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
        position: { top: topPercent, left: leftPercent },
        metadata: { name: "", price: "", url: "", tags: [] },
      },
    ]);
  };

  const handleMetadataChange = (
    index: number,
    field: keyof ItemMetadata,
    value: string | string[]
  ) => {
    const updatedHoverItems = [...hoverItems];
    if (field === "tags") {
      if (typeof value === "string") {
        updatedHoverItems[index].metadata[field] = value
          .split(",")
          .map((tag) => tag.trim());
      } else {
        updatedHoverItems[index].metadata[field] = value.map((tag) =>
          tag.trim()
        );
      }
    } else {
      updatedHoverItems[index].metadata[field] = value as string;
    }
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

  return (
    <div className="mx-auto p-3 border-l-2 border-r-2 border-b-2 border-black rounded-md">
      <h1 className={`text-2xl font-bold mb-5 ${main_font.className}`}>
        Upload
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <input type="file" onChange={handleImageChange} className="mb-4" />
        {/* Image Section */}
        <div className="flex-1 relative">
          {selectedImage && (
            <div
              className="rounded-lg shadow-lg overflow-hidden mt-10"
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "auto",
                aspectRatio: "3/4",
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
                    top: item.position.top,
                    left: item.position.left,
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
                      value={item.metadata.name}
                      onChange={(e) => {
                        handleMetadataChange(index, "name", e.target.value);
                      }}
                      className="input input-bordered w-full mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={item.metadata.price}
                      onChange={(e) => {
                        handleMetadataChange(index, "price", e.target.value);
                      }}
                      className="input input-bordered w-full mb-2"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={item.metadata.url}
                      onChange={(e) => {
                        handleMetadataChange(index, "url", e.target.value);
                      }}
                      className="input input-bordered w-full mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={item.metadata.tags?.join(",")}
                      onChange={(e) => {
                        handleMetadataChange(
                          index,
                          "tags",
                          e.target.value.split(",").map((tag) => tag.trim())
                        );
                      }}
                      className="input input-bordered w-full mb-2"
                    />
                    <input
                      type="file"
                      onChange={(e) => handleHoverItemImageChange(index, e)}
                      className="input w-full"
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
            placeholder="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            placeholder="Image Name"
            value={imageName || ""}
            onChange={(e) => setImageName(e.target.value)}
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={imageTags.join(",")}
            onChange={(e) =>
              setImageTags(e.target.value.split(",").map((tag) => tag.trim()))
            }
            className="input input-bordered w-full mb-2"
          />
          <button
            onClick={upload}
            className="btn btn-primary mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Upload
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

export default AdminDashboard;
