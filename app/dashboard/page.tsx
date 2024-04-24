"use client";
import Image from "next/image";
import { useState, ChangeEvent } from "react";
import { TaggedItem, HoverItem, ItemMetadata } from "@/types/model";
import { FirebaseHelper } from "@/common/firebase";
import { addDoc, collection } from "firebase/firestore";

function AdminDashboard() {
  return (
    <div>
      <UploadImageSection />
      <RequestListSection />
    </div>
  );
}
// Firestore 사용을 위한 import가 필요합니다. 예: import { db } from '../your/firebase/config';
// Firestore에 데이터를 추가하는 함수를 import합니다. 예: import { addHoverItemToFirestore } from '../your/firebase/services';

function UploadImageSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoverItems, setHoverItems] = useState<HoverItem[]>([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});

  const saveAll = async () => {
    const taggedItems: TaggedItem[] = [];
    // 모든 포인트를 저장하는 로직
    // 예를 들어, Firestore에 모든 포인트를 저장하는 API 호출 등
    console.log("Saving all points:", hoverItems);
    // 모든 HoverItem에 대해 Firestore에 Item 데이터를 추가
    for (const hoverItem of hoverItems) {
      const docRef = await addDoc(
        collection(FirebaseHelper.db(), "items"),
        hoverItem.metadata
      );
    }
    alert("All points saved!");
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const removePoint = (index: number) => {
    // 특정 인덱스의 포인트를 제거합니다.
    const updatedHoverItems = hoverItems.filter(
      (_, itemIndex) => itemIndex !== index
    );
    setHoverItems(updatedHoverItems);

    // 선택된 포인트 인덱스를 초기화합니다.
    setSelectedPointIndex(null);
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setSelectedImage(fileURL);
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
        metadata: { id: "", name: "", price: "", url: "", tags: [] },
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
      // 'tags' 필드의 경우, value가 문자열일 때만 split을 사용합니다.
      if (typeof value === "string") {
        updatedHoverItems[index].metadata[field] = value
          .split(",")
          .map((tag) => tag.trim());
      } else {
        // value가 이미 string[] 타입인 경우, 직접 할당합니다.
        updatedHoverItems[index].metadata[field] = value.map((tag) =>
          tag.trim()
        );
      }
    } else {
      // 'tags'가 아닌 다른 필드의 경우, 문자열 값을 직접 할당합니다.
      updatedHoverItems[index].metadata[field] = value as string;
    }
    setHoverItems(updatedHoverItems);
  };

  const handleSubmit = async (index: number) => {
    const hoverItem = hoverItems[index];
    // Firestore에 hoverItem 저장 로직
    alert(`HoverItem ${index + 1} saved!`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <input type="file" onChange={handleImageChange} className="mb-4" />
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
                      placeholder="ID"
                      value={item.metadata.id}
                      onChange={(e) => {
                        handleMetadataChange(index, "id", e.target.value);
                      }}
                      className="input input-bordered w-full mb-2"
                    />
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
                      value={item.metadata.tags.join(",")}
                      onChange={(e) => {
                        handleMetadataChange(
                          index,
                          "tags",
                          e.target.value.split(",").map((tag) => tag.trim())
                        );
                      }}
                      className="input input-bordered w-full mb-2"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {hoverItems.length > 0 && (
            <button onClick={saveAll} className="btn btn-primary mt-4">
              Save All Points
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RequestListSection() {
  return <div>RequestList</div>;
}

export default AdminDashboard;
